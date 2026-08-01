import { connecttoDb } from "@/libs/database";
import { NextRequest } from "next/server";

async function POST(req:NextRequest){
    await connecttoDb()
    
}