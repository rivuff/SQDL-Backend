
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
            user.status = 'active'
            return res.status(200).json({
                succsess: true,
                message: 'User verified successfully',
                data: user,
                err: {}
            })
        }
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            data: null,
            err: {}
        })
    }
}

export default acceptInvite