import { NextResponse } from "next/server";
import dbConnect from "@/libs/db";

import Blog from "../models/blog";

interface BlogRequestBody {
  title: string;
  content: string;
  image: string;
  author: string;
}

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body: BlogRequestBody = await req.json();
    const { title, content, image, author } = body;

    await dbConnect();

    const blog = await Blog.create({ title, content, image, author });

    return NextResponse.json(
      { message: "Blog added successfully", blog },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
