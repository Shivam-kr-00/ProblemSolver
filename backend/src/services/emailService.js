import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import dns from 'dns';

// Force IPv4 resolution to fix ENETUNREACH error on Render
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:env.emailUser,
        pass:env.emailAppPassword,
    }
})

//check connection of emailServer

transporter.verify((error,success)=>{
    if(error)
    {
        console.error("Error in connecting server"  ,error)
    }
    else{
        console.log("Server is ready to send emails")
    }
})

export const sendEmail = async(to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
            from:`"Your Name" <${env.emailUser}>`,// sender address
            to:to, //list of receivers
            subject:subject, //Subject line 
            text:text, //plain text body
            html:html //html body
        })

        console.log("Email sent successfully",info.messageId)
        console.log("Preview URL: %s",nodemailer.getTestMessageUrl(info))
        
    }
    catch(error)
    {
        console.error("Error in sending email",error)
    }
};










//create a function to send mail