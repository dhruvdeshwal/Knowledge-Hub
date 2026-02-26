const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: 587,
                secure: false,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
                connectionTimeout: 10000,
                greetingTimeout: 10000,
            })

            let info = await transporter.sendMail({
                from: 'Knowledge Hub <onboarding@resend.dev>',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log("Email sent: ", info.messageId);
            return info;
    }
    catch(error) {
        console.log("Mail error:", error.message);
        return null;
    }
}

module.exports = mailSender;