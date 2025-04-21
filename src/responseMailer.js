require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send an email notification
const sendResponseEmail = async (userEmail,ngo,donar) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Food Donation Acceptance",
        text: `Dear ${donar.name},

${ngo.name} NGO has accepted your donation requested :

NGO's Details:
- Name: ${ngo.name}
- Contact: ${ngo.contact}

Please keep the food ready.

Best regards,
Food for Good`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendResponseEmail;
