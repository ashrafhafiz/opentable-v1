import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  console.log("I am middleware!");
  const tokenArray = req.headers.get("authorization")?.split(" ");
  if (!tokenArray || tokenArray.length !== 2)
    return new NextResponse(JSON.stringify({ error: "Unauthorized request!" }));
}

export const config = {
  matcher: ["/api/auth/me"],
};
