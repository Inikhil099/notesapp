import { connectDB } from "@/db/ConnectDb";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { setUser } from "@/jwt/Auth";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    await connectDB().then(() => {
    });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ status: 400, msg: "User already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    const response = NextResponse.json({ user,msg:"Signup Successfull" },{status:200});
    const token = setUser(user);
    response.cookies.set("uid", token, { httpOnly: true, maxAge });
    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" },{status:500});
  }
}
