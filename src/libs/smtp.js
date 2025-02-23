import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { petAidLogger } from './logger.js';
dotenv.config()


export const sendEmail = async (
    to,
    subject,
    text,
    html
  ) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 456,
      secure: true,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
  
    let methodOptions = {
      from: {
        name: "Pet Aid",
        address: process.env.APP_EMAIL,
      },
      to,
      subject,
      text,
      html,
    };
  
    return transporter
      .sendMail(methodOptions)
      .then((res) => {
       petAidLogger.info(res)
      })
      .catch((err) => {
        petAidLogger.error(err)
      });
  };