import { Iuser } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcryptjs from "bcryptjs"

interface documentuser extends Omit<Iuser, "_id">, Document {
    comparepass(pass: string): boolean;
}

const UserSchema = new mongoose.Schema<documentuser>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Name is required"],
        minlength: [6, "Min 6 characters required"],
    },
    mobile: {
        type: String,
        minlength: [10, "min 10 characters required"],
        maxlength: [10, "max 10 characters required"],
    }
}, { timestamps: true })


UserSchema.pre("save", function (): void {
    if (!this.isModified("password")) return
    this.password = bcryptjs.hashSync(this.password, 10)
})

UserSchema.methods.comparepass = function (pass: string): boolean {
    return bcryptjs.compareSync(pass, this.passsword)
}

export const userModel = mongoose.models.User || mongoose.model("User", UserSchema);