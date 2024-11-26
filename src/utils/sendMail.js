import resend from '../config/resend.js'; // Ensure the path is correct


export const sendMail = async({to, subject, text, html})=>await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "delivery@resend.dev",
    subject,
    text,
    html
})