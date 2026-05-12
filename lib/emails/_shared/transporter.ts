import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER_SENDER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};
