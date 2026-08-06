import axios from "axios";
import { IResume } from "@/types/resume.types";

const API = axios.create({
    baseURL: "/api/resume",
    withCredentials: true
});

export async function createResume(payload?: Partial<IResume> | Record<string, any>) {
    try {
        const response = await API.post("/create", payload || {});
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getallResume() {
    try {
        const response = await API.get("/all");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteResume(resumeId: string) {
    try {
        const response = await API.delete(`/${resumeId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateResume(resumeId: string, payload: Partial<IResume> | Record<string, any>) {
    try {
        const response = await API.patch(`/${resumeId}`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getResume(resumeId: string) {
    try {
        const response = await API.get(`/${resumeId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

