//import TeacherRepository from "../repository/user-repository.js";
import UserRepository from "../repository/user-repository.js";

const userRepo = new UserRepository();

export const userSignup = async (req, res)=> {
    try {
        const response =await userRepo.create({
            email: req.body.email,
            name: req.body.name,
            enrollmentNumber: req.body.enrollmentNumber,
            rollNumber: req.body.rollNumber,          
            password: req.body.password,
            status: req.body.status
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