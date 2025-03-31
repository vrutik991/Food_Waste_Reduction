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
const sendNotificationEmail = async (ngoEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ngoEmail,
        subject: "Food Donation Notification",
        text: `Dear NGO,

A person has registered food for donation. Here are the details:

Food Details:
- Type: Rice
- Quantity: 2 Kg
- Location: Gujarat

Donor's Details:
- Name: Vrutik
- Contact: 9234239402

Please arrange for pickup.

Best regards,
Food Waste Reduction App`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${ngoEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendNotificationEmail;
