import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const emailTransport = (from, subject, htmlContent) => {
    const mailOptions = {
        to: process.env.EMAIL_USER,
        from,
        subject,
        html: htmlContent 
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info.response);
        });
    });
};

export default emailTransport;

