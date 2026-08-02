import { cookies } from "next/headers";
import { verifytoken } from "./jwtsecret";

export async function GetUser(): Promise<string> {
    const cookie = await cookies();
    const token = cookie.get("token")?.value
    if (!token) throw new Error("Unauthorized");
    const decoded = await verifytoken(token)
    if (!decoded) throw new Error("unauthorize");
    return decoded.userId;
}