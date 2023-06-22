import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({//creating transporter object used to send email 
  service: 'hotmail',
  auth: {
    user: 'sqdl.iitb@outlook.com', //auth credentials (REPLACE with DOTENV variables)
    pass: 'sqdliitb23'
  }
});



async function sendMail(name, email, token){ //async function to send mail containing token/token link 
  console.log(email)
    let mail = {
        from: 'sqdl.iitb@outlook.com',
        to: email,
        subject: 'Teacher account invitiation for ' + name,
        text: 'http://localhost:3000/teacher/accept/'+token,
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
