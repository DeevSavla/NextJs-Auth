import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

interface Types {
    email:string,
    emailType:string,
    userId:string,
}

export const sendEmail = async ({ email, emailType, userId }:Types) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType === "VERIFY")
        {
            await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000})
        }

        else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000})
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 2525,
            auth: {
              user: process.env.EMAIL_AUTH_USER,
              pass: process.env.EMAIL_AUTH_PASS
            }
          });

        const mailOptions = {
            from: 'savla.deev@gmail.com',
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your email" : "Change your password", 
            html: "<b>Hello world?</b>",
        }

        const mainResponse = await transporter.sendMail(mailOptions)

        return mainResponse

    } catch (error:any) {
        throw new Error(error.message)
    }
}