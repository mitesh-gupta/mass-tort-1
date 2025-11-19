import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_authenticated";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(COOKIE_NAME);

    if (authCookie?.value === "true") {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
