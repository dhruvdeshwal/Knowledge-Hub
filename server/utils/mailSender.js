const https = require("https");

const mailSender = async (email, title, body) => {
    try {
        const data = JSON.stringify({
            from: "Knowledge Hub <onboarding@resend.dev>",
            to: [email],
            subject: title,
            html: body,
        });

        return new Promise((resolve, reject) => {
            const options = {
                hostname: "api.resend.com",
                path: "/emails",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.MAIL_PASS}`,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(data),
                },
            };

            const req = https.request(options, (res) => {
                let responseData = "";
                res.on("data", (chunk) => { responseData += chunk; });
                res.on("end", () => {
                    console.log("Email sent:", responseData);
                    resolve(JSON.parse(responseData));
                });
            });

            req.on("error", (error) => {
                console.log("Mail error:", error.message);
                resolve(null);
            });

            req.write(data);
            req.end();
        });
    } catch (error) {
        console.log("Mail error:", error.message);
        return null;
    }
};

module.exports = mailSender;