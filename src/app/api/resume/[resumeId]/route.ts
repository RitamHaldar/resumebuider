import { NextRequest, NextResponse } from "next/server";
import { ResumeModel } from "@/models/ResumeModel";
import { connecttoDb } from "@/libs/database";
import { GetUser } from "@/libs/Useridentifier";
import { Iresponse } from "@/types/response.types";
export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  try {
    await connecttoDb();
    const userid = await GetUser();
    const { resumeId } = await params;
    const resume = await ResumeModel.findOne({ userid, _id: resumeId });
    if(!resume){
      return NextResponse.json<Iresponse>({ success: false, message: "Resume not found"});
    }
    return NextResponse.json<Iresponse>({ success: true, message: "Resume fetched successfully", body: resume });
  } catch (error) {
    return NextResponse.json<Iresponse>({ success: false, message: "Failed to fetch resume", error: { error } });
  }
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  try {
    await connecttoDb();
    const userid = await GetUser();
    const { resumeId } = await params;
    const body = await req.json();
    if(!body){
      return NextResponse.json<Iresponse>({ success: false, message: "No data passed"});
    }
    const resume = await ResumeModel.updateOne({ userid, _id: resumeId }, { $set: body });
    return NextResponse.json<Iresponse>({ success: true, message: "Resume updated successfully", body: resume });
  } catch (error) {
    return NextResponse.json<Iresponse>({ success: false, message: "Failed to update resume", error: { error } });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  try {
    await connecttoDb();
    const userid = await GetUser();
    const { resumeId } = await params;
    const resume = await ResumeModel.deleteOne({ userid, _id: resumeId });
    return NextResponse.json<Iresponse>({ success: true, message: "Resume deleted successfully", body: resume });
  } catch (error) {
    return NextResponse.json<Iresponse>({ success: false, message: "Failed to delete resume", error: { error } });
  }
}
