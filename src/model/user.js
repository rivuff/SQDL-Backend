import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Jwt_key } from "../config/serverConfig.js";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
    },
    enrollmentNumber: {
        type: String,
        unique: true
    },
    rollNumber:{
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'invited'],
        default: 'active'
    }
}, {timestamps: true})

userSchema.pre('save', function(next){
    const student = this;
    const SALT = bcrypt.genSaltSync(9);
    const encriptedPassword = bcrypt.hashSync(student.password, SALT);
    student.password = encriptedPassword;
    next();
})

userSchema.methods.comparePassword = function compare(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.genJWT = function generate(){
    return jwt.sign({id:this._id, email: this.email}, Jwt_key,{
        expiresIn: '1h'
    })
}

const User = mongoose.model('User', userSchema);

export default User