import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://resumebuider-dun.vercel.app";

const API = axios.create({
    baseURL: `${BASE_URL}/api/ai`,
    withCredentials: true
});
export async function atsScore(payload:{resumetext:string}) {
    try {
        const response=await API.post("/ats-score",payload);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function generateExperienceDescription(payload:{
    experienceLevel?:string, 
    yearsOfExperience?:number, 
    techStack?:string[], 
    jobRole:string
}){
    try{
        const response=await API.post("/generate-experience-description",payload);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}
export async function generateProjectDescription(payload:{
    experienceLevel:string, 
    jobTitle:string, 
    techStack:string[]
}){
    try{
        const response=await API.post("/generate-project-description",payload);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function generateSkills(payload:{
   experienceLevel:string, 
   jobTitle:string
}){
    try{
        const response=await API.post("/generate-skills",payload);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}
export async function generateSummary(payload:{
    experienceLevel:string, 
    skills:string[], 
    jobTitle:string
}){
    try{
        const response=await API.post("/generate-summary",payload);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}
export async function improveContents(payload:{
    resumetext:string
}){
    try{
        const response=await API.post("/improve-contents",payload);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}