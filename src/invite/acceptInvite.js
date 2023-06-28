import UserRepository from "../repository/user-repository.js";
import bcrypt from 'bcrypt';
const userRepo = new UserRepository();

const acceptInvite = async (req, res)=>{
    let email = req.body.email
    //checking if user with email exists
    console.log(req.body.email)
    try{
        const user = await userRepo.findBy(req.body.email);
        if (user == null) {
            console.log('User does not exist')
            return res.status(500).json({
                success: false,
                message: 'User does not exist',
                data: null,
                err: {}
            })
        }
        else {
            if (user.status == 'active'){
                return res.status(200).json({
                    success: false,
                    message: 'Account has already been activated',
                    data: user,
                    err: {}
                })
            }
            user.status = 'active'
            const password = req.body.password;
            const SALT = bcrypt.genSaltSync(9);
            const encriptedPassword = bcrypt.hashSync(password, SALT);

            user.password = encriptedPassword;
            const updateUser = await user.save();
            console.log('Account Activated')
            return res.status(200).json({
                success: true,
                message: 'Account activated successfully',
                data: updateUser,
                err: {}
            })
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            data: null,
            err: {}
        })
    }
}

export default acceptInvite