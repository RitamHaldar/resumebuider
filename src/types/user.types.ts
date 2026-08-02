export interface Iuser {
    _id: string;
    name: string;
    password: string;
    email: string;
    mobile: string;
    updatedAt?: string;
    createdAt?: string
}
export interface RegisterBody {
    name: string;
    email: string;
    mobile: string;
    password: string;
}
export interface LoginBody {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: string;
    email?: string;
}