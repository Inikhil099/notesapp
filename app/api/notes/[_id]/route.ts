import { connectDB } from "@/db/ConnectDb";
import { Notes } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    const { _id } = await params;
    await connectDB();
    const note = await Notes.findOneAndDelete({ _id });
    if (!note) {
      return NextResponse.json({ msg: "Note not found" }, { status: 400 });
    }
    const response = await NextResponse.json(
      { note, msg: "Note updated Successfully" },
      { status: 200 }
    );
    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
