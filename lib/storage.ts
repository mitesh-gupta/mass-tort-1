import { AwsClient } from "aws4fetch";

interface imageOptions {
  width?: number;
  height?: number;
}

class StorageClient {
  private client: AwsClient | null = null;

  private getClient() {
    if (!this.client) {
      if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
        throw new Error("Missing R2 credentials");
      }

      this.client = new AwsClient({
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        service: "s3",
        region: "auto",
      });
    }
    return this.client;
  }

  async upload(key: string, body: File | Buffer, opts?: imageOptions) {
    const url = `${process.env.R2_URL}/${key}`;

    const contentType = body instanceof File ? body.type : "application/pdf";
    const contentLength = body instanceof File ? body.size : body.length;
    const uploadBody =
      body instanceof File ? body : new Blob([new Uint8Array(body)]);

    const res = await this.getClient().fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Length": contentLength.toString(),
      },
      body: uploadBody,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload file: ${res.status} ${res.statusText}`);
    }

    return `${process.env.STORAGE_BASE_URL}/${key}`;
  }

  async delete(key: string) {
    const url = `${process.env.R2_URL}/${key}`;

    const res = await this.getClient().fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete file: ${res.status} ${res.statusText}`);
    }

    return true;
  }
}

export const storage = new StorageClient();
