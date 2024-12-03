import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dbConnect from "@/libs/db";
import User from "../models/user";

interface UserRequestBody {
  fullName: string;
  email: string;
  password: string;
}

const jwt_secret = process.env.NEXT_PUBLIC_JWT_SECRET || "";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body: UserRequestBody = await req.json();
    const { fullName, email, password } = body;

    await dbConnect();
    const existingUser: any = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User Already Exist" },
        { status: 500 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const data = {
      user: {
        id: user._id,
      },
    };

    const accessToken = jwt.sign(data, jwt_secret);

    return NextResponse.json(
      { message: "User SignUp successfully", user, accessToken },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
