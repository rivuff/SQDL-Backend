//import TeacherRepository from "../repository/user-repository.js";
import { set } from "mongoose";
import UserRepository from "../repository/user-repository.js";

const userRepo = new UserRepository();


export const userSignup = async (req, res)=> {
    try {
        const response =await userRepo.create({
            email: req.body.email,
            name: req.body.name,
            enrollmentNumber: req.body.enrollment,
            rollNumber: req.body.rollNumber,          
            password: req.body.password,
            status: 'active',
            type: 'student' //all accounts are student if through signup page
        });
        return res.status(200).json({
            success: true,
            message:'Successfully created new user',
            data: response,
            err: {}
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong in controller",
            data: {},
            err: error
        })
    }
}

export const userLogin = async (req, res)=>{
    try {
        const user = await userRepo.findBy(req.body.email);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        else if(!user.comparePassword(req.body.password)){
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }

        const token = user.genJWT();
    
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: token,
            err: {}
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in auth layer',
            data: {},
            success: false,
            err: error
        })
    }
}




export const updateInfo = async(req, res) =>{
    try{
        //update user data

        const user = await userRepo.findBy(req.query.email);
        console.log(user);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        console.log(req.body);

        if(req.body.name!=null){
            user.name = req.body.name;
            console.log(user.name);
        }
        if(req.body.email!=null){
            user.email = req.body.emal;
            console.log(user.email);
        }
        if(req.body.enrollment!=null){
            user.enrollmentNumber = req.body.enrollment;
            console.log(user.enrollmentNumber);
        }
        if(req.body.rollno!=null){
            user.rollNumber = req.body.rollno;
            console.log(user.rollNumber);
        }

        const updateUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updateUser,
            err: {}
        })

    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
}

export const get = async(req, res)=>{
    try {
        const {email} = req.query;

        const user = await userRepo.findBy(email);

        return res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: user,
            err:{}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
}

export const getAlluser = async (req, res)=>{

    try {
        console.log(req.query);
        const {offset, limit} = req.query;
        console.log(offset, limit);
        
        const users =await userRepo.getAll(parseInt(offset), parseInt(limit));
        console.log(users);
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
            err: {}
          });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
   
}