import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema<IResume>({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "userId is needed"],
        unique: [true, "userID should be unique"],
        ref: "User"
    },
    title: {
        type: String,
        default: "",
    },
    summary: {
        type: String,
        default: "",
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            mobile: String,
            location: String,
            github: String,
            linkedIn: String,
            portfolio: String,
        },
        default: {},
    },
    education: {
        type: [
            {
                institute: String,
                degree: String,
                startDate: String,
                endDate: String,
            },
        ],
        default: [],
    },
    workExperience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                description: String,
            },
        ],
        default: [],
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                techStack: [String],
                githubUrl: String,
                liveUrl: String,
            },
        ],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
},
    {
        timestamps: true,
    }
);

export const ResumeModel = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema)