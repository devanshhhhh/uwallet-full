import { NextRequest, NextResponse } from "next/server";
import { getUserDetails } from "@/app/lib/actions/getUserDetails";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const userDetails = await getUserDetails();
    return new NextResponse(JSON.stringify(userDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
