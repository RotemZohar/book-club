import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NOTIFICATIONS_EMAIL,
    pass: process.env.NOTIFICATIONS_PASSWORD,
  }
});

export const sendEmail = (mailOptions: {
  from: string;
  to: string;
  subject: string;
  text: string;
}) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Mail sent: ${mailOptions.subject} ${info.response}`);
    }
  });
};
