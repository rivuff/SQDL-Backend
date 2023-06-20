import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({//creating transporter object used to send email 
  service: 'hotmail',
  auth: {
    user: 'sqdl.iitb@outlook.com', //auth credentials (REPLACE with DOTENV variables)
    pass: 'sqdliitb23'
  }
});



async function sendMail(email, name, token){ //async function to send mail containing token/token link 
    let mail = {
        from: 'sqdl.iitb@outlook.com',
        to: email,
        subject: 'Teacher account invitiation for ' + name,
        text: token,
    }
    transporter.sendMail(mail, function (err, info){
        if (err){
            console.log(err)
            return err
        }
        return 'success'
    })
}


export default sendMail