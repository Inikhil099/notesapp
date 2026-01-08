import { connectDB } from "@/db/ConnectDb";
import { setUser } from "@/jwt/Auth";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await connectDB().then(() => {
    });

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ msg: "Incorrect password" }, { status: 401 });
    }
    const response = NextResponse.json(
      { user, msg: "Signup Successfull" },
      { status: 200 }
    );

    const token = setUser(user);
    response.cookies.set("uid", token, { httpOnly: true, maxAge });
    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" });
  }
}
