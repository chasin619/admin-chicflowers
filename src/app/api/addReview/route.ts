import { NextResponse } from "next/server";
import dbConnect from "@/libs/db";

import Review from "../models/review";

interface ReviewRequestBody {
  image: string;
}

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body: ReviewRequestBody = await req.json();
    const { image } = body;

    await dbConnect();

    const review = await Review.create({ image });

    return NextResponse.json(
      { message: "Review added successfully", review },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
