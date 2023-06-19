import jwt from 'jsonwebtoken'


const acceptInvite = (req, res)=>{
    let token = req.params.token
    jwt.verify(token, 'emailVerification', function (err, decoded){
        if (err){
            res.send('Error authenticating email. Possible that your link expired. Please reach out to an administrator to invite you again')
        }
        else{
            let email = decoded//get decoded jwt token to get email address of pending user
            //change status of account to active
            //call updateInformation from user-controller to update status to 'active' from 'invited'
            res.send('Account made successfully')
        }
    })
    
}

export default acceptInvite