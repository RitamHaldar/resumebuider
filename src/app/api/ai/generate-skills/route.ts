import { model } from "@/libs/ai";
import { GenerateSkillsBody, GenerateSummaryBody } from "@/types/ai.types";
import { Iresponse } from "@/types/response.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body: GenerateSkillsBody = await req.json();

        const { experienceLevel, jobTitle } = body;

        if (!experienceLevel || !jobTitle)
            return NextResponse.json<Iresponse>({
                success: false, message: "Missing fields"
            }, { status: 400 });

        const prompt = `
            You are an ATS optimization specialist.
            
            Generate technical skills for the following role.
            
            Job Title:
            ${jobTitle}
            
            Experience Level:
            ${experienceLevel}
            
            CRITICAL OUTPUT INSTRUCTIONS:
            
            - Return ONLY a valid JSON array.
            - Do NOT wrap the array in quotes.
            - Do NOT return an object.
            - Do NOT return markdown.
            - Do NOT use \`\`\`json code blocks.
            - Do NOT add explanations, notes, headings, or introductory text.
            - The response must start with "[" and end with "]".
            - Every item must be a string.
            - Include only technical skills.
            - Exclude all soft skills.
            - Generate 15-25 relevant technical skills.
            - Remove duplicates.
            
            Valid Example:
            
            [
              "JavaScript",
              "TypeScript",
              "React.js",
              "Node.js",
              "MongoDB"
            ]
            
            Invalid Example:
            
            {
              "skills": [
                "JavaScript",
                "React.js"
              ]
            }
            
            Invalid Example:
            
            "[
              \\"JavaScript\\",
              \\"React.js\\"
            ]"
            
            Output:
            Return ONLY the raw JSON array.
            `;

        const result = await model.invoke(prompt);

        let skills = result.content;

        if (typeof skills === "string") {
            try {
                skills = JSON.parse(skills);
            } catch (err) {
                console.error("Failed to parse skills:", err);
            }
        }

        return NextResponse.json<Iresponse>({
            success: true, message: "Skills created", body: {
                skills
            }
        }, {
            status: 201
        })

    } catch (error) {
        console.log("error in Skills generation api", error);
        return NextResponse.json<Iresponse>(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}