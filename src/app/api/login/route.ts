import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dbConnect from "@/libs/db";
import User from "../models/user";

interface LoginRequestBody {
  email: string;
  password: string;
}

const jwt_secret = process.env.NEXT_PUBLIC_JWT_SECRET || "";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const data = {
      user: {
        id: existingUser._id,
      },
    };
    const accessToken = jwt.sign(data, jwt_secret, { expiresIn: "1h" });

    return NextResponse.json(
      { message: "Login successfully", accessToken },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in POST /api/login:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
