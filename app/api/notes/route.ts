import { connectDB } from "@/db/ConnectDb";
import { getUser } from "@/jwt/Auth";
import { Notes } from "@/models/Note";
import mongoose from "mongoose";
import { NextRequest, NextResponse, NextResponse as res } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("uid")?.value;

    if (!token) {
      return NextResponse.json({ msg: "unauthorised" }, { status: 401 });
    }
    const user = getUser(token);
    if (!user) {
      return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
    }
    //@ts-ignore
    const notes = await Notes.find({ createdBy: user._id });

    const response = await res.json({ notes, msg: "success" }, { status: 200 });

    return response;
  } catch (error) {
    return res.json({ ok: false, msg: "Internal server Error" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    await connectDB();

    const token = req.cookies.get("uid")?.value;
    if (!token) {
      return NextResponse.json({ msg: "unauthorised" }, { status: 401 });
    }
    const user = getUser(token);
    //@ts-ignore
    const note = await Notes.create({ title, content, createdBy: user._id });

    const response = await res.json({ note, msg: "success" }, { status: 200 });

    return response;
  } catch (error) {
    return res.json({ ok: false, msg: "Internal server Error" });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { _id, title, content } = await req.json();
    const updateFields: any = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    await connectDB().then(() => {
    });
    const note = await Notes.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!note) {
      return NextResponse.json({ msg: "Note not found" }, { status: 400 });
    }

    const response = NextResponse.json(
      { note, msg: "Note updated Successfully" },
      { status: 200 }
    );
    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}

