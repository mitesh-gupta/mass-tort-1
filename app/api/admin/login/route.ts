import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("password", body.password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return Response.json({ success: true });
  } else {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }
}
