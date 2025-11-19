import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const COOKIE_NAME = "admin_authenticated";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  return authCookie?.value === "true";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the application
    const application = await prisma.application.findUnique({
      where: { id },
      select: { documentPdfBase64: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pdfBase64: application.documentPdfBase64 });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}
