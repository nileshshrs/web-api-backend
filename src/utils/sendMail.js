import resend from '../config/resend.js';

export const sendMail = async({to, subject, text, html})=>await resend.emails.send({
    from: "no-reply@yourapp.com",
    to: "delivery@resend.dev",
    subject,
    text,
    html
})