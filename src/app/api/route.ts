import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    version: 1.0,
    name: "apptest",
  });
}

export function POST() {
  return NextResponse.json({
    version: 1.0,
    name: "apptest",
  });
}