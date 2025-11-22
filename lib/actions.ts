"use server";

import { headers } from "next/headers";
import type { ApplicationFormData, SubmitApplicationResult } from "@/lib/types";
import { storage } from "@/lib/storage";

export interface UploadPdfResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload merged PDF to Cloudflare R2 storage
 */
export async function uploadPdfToR2(
  pdfFile: File,
  claimId: string
): Promise<UploadPdfResult> {
  try {
    // Generate unique key for R2 storage
    const timestamp = Date.now();
    const key = `applications/${claimId}/${timestamp}-merged-document.pdf`;

    // Upload to R2
    const url = await storage.upload(key, pdfFile);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error uploading PDF to R2:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to upload PDF: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Failed to upload PDF",
    };
  }
}

export async function submitApplication(
  data: ApplicationFormData
): Promise<SubmitApplicationResult> {
  try {
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(`${protocol}://${host}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to submit application",
      };
    }

    return {
      success: true,
      message: result.message || "Application submitted successfully",
      applicationId: result.applicationId,
    };
  } catch (error) {
    console.error("Error submitting application:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to submit application: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "Failed to submit application",
    };
  }
}
