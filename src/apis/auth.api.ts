import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://resumebuider-dun.vercel.app";

const API = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    withCredentials: true
});
export async function login(payload:{email:string,password:string}){
    try{
        const response=await API.post("/login",payload);
        return response.data;
    }catch(error: any){
        console.log(error);
        if (error?.response?.data) {
            return error.response.data;
        }
        throw error;
    }
}

export async function register(payload:{name:string, email:string, mobile:string, password:string}){
    try{
        const response=await API.post("/register",payload);
        return response.data;
    }catch(error: any){
        console.log(error);
        if (error?.response?.data) {
            return error.response.data;
        }
        throw error;
    }
}

export async function getUser(){
    try{
        const response=await API.get("/getuser");
        return response.data;
    }catch(error: any){
        console.log(error);
        return { success: false, message: "Unauthorized" };
    }
}


