const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 587 for TLS, 465 for SSL
  secure: true, // True for SSL
  auth: {
    user: 'kennedygreat36@gmail.com', // Load email from environment variables
    pass: '', // Use App Password
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
   const mailOptions = {
    from: 'kennedygreat36@gmail.com', // Your email
    to, // Replace with recipient email
    subject,
    text,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, response: info.response };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
