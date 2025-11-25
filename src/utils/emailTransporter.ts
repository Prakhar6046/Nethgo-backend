import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT), 
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// } as SMTPTransport.Options); 
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.User_Email,      
    pass: process.env.User_Password  
  }
});
export default transporter;
