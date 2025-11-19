import { PDFDocument, rgb } from "pdf-lib";

/**
 * Converts a file to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Converts a canvas signature to base64 image
 */
export function canvasToBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL("image/png");
  // Remove the data URL prefix
  return dataUrl.split(",")[1];
}

/**
 * Merges photo ID and signature into a single PDF document
 * @param photoIdFile - The uploaded photo ID file (can be image or PDF)
 * @param signatureCanvas - The canvas element containing the signature
 * @returns Base64 encoded PDF string
 */
export async function createMergedPDF(
  photoIdFile: File,
  signatureCanvas: HTMLCanvasElement
): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Process the photo ID
  const photoIdBytes = await photoIdFile.arrayBuffer();
  const photoIdType = photoIdFile.type;

  if (photoIdType === "application/pdf") {
    // If photo ID is already a PDF, embed its pages
    const photoIdPdf = await PDFDocument.load(photoIdBytes);
    const copiedPages = await pdfDoc.copyPages(
      photoIdPdf,
      photoIdPdf.getPageIndices()
    );
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  } else {
    // If photo ID is an image, embed it on a new page
    let image;
    if (photoIdType.includes("png")) {
      image = await pdfDoc.embedPng(photoIdBytes);
    } else if (photoIdType.includes("jpg") || photoIdType.includes("jpeg")) {
      image = await pdfDoc.embedJpg(photoIdBytes);
    } else {
      throw new Error("Unsupported image format. Please use PNG or JPG.");
    }

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Calculate dimensions to fit image on page while maintaining aspect ratio
    const imageAspectRatio = image.width / image.height;
    const pageAspectRatio = width / height;

    let imageWidth, imageHeight;
    if (imageAspectRatio > pageAspectRatio) {
      // Image is wider than page
      imageWidth = width - 100;
      imageHeight = imageWidth / imageAspectRatio;
    } else {
      // Image is taller than page
      imageHeight = height - 100;
      imageWidth = imageHeight * imageAspectRatio;
    }

    page.drawImage(image, {
      x: (width - imageWidth) / 2,
      y: (height - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight,
    });

    // Add label
    page.drawText("Photo ID", {
      x: 50,
      y: height - 50,
      size: 16,
      color: rgb(0, 0, 0),
    });
  }

  // Add signature page
  const signaturePage = pdfDoc.addPage();
  const { width, height } = signaturePage.getSize();

  // Add title
  signaturePage.drawText("Claimant Signature", {
    x: 50,
    y: height - 50,
    size: 16,
    color: rgb(0, 0, 0),
  });

  // Convert canvas to PNG and embed
  const signatureDataUrl = signatureCanvas.toDataURL("image/png");
  const signatureBase64 = signatureDataUrl.split(",")[1];
  const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) =>
    c.charCodeAt(0)
  );

  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  // Draw signature
  const signatureWidth = 500;
  const signatureHeight = 200;
  signaturePage.drawImage(signatureImage, {
    x: (width - signatureWidth) / 2,
    y: height - 300,
    width: signatureWidth,
    height: signatureHeight,
  });

  // Add timestamp
  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  signaturePage.drawText(`Signed on: ${timestamp}`, {
    x: 50,
    y: 100,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Save the PDF and return as base64
  const pdfBytes = await pdfDoc.save();
  const base64 = btoa(String.fromCharCode(...pdfBytes));

  return base64;
}

/**
 * Downloads a base64 PDF string as a file
 */
export function downloadPDF(
  base64: string,
  filename: string = "document.pdf"
): void {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
