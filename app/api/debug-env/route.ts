import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV
  });
}

