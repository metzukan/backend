import * as nodemailer from 'nodemailer';
import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { User } from '../models';
import { UserPingInfo, UserSignInfo } from '.';

const { MAIL_SMTP_SERVER, MAIL_USER_NAME, MAIL_USER_KEY } = process.env;
if (!MAIL_SMTP_SERVER || !MAIL_USER_NAME || !MAIL_USER_KEY) {
  console.error('You must set the mail account credentials!');
  process.exit();
}
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: MAIL_SMTP_SERVER,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: MAIL_USER_NAME,
    pass: MAIL_USER_KEY
  }
});

export async function sendMail(to: string | string[], subject: string, htmlBody: string) {
  const mailOptions: SendMailOptions = {
    from: `"metzukan alerts" <${MAIL_USER_NAME}>`,
    to,
    replyTo: undefined,
    inReplyTo: undefined,
    subject,
    html: htmlBody
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNotRespondingMail(user: User) {
  const lastAck = new Date(user.nextAck);
  const html = `<p>Hi ${user.nickname}
         <br> We noticed that you didn't response to the metzukan app alerts since ${lastAck.toLocaleDateString()} ${lastAck.toLocaleTimeString()}.<br>
         please open your app and mark that you're OK<p>
         <br>
         <br>
         <br>
         <i> sent for user guid ${user.guid} </i>
         `;
  await sendMail(user.selfEmail, 'Metzukan', html);
}

export async function sendEmergencyMail(
  user: User,
  userPingInfo: UserPingInfo,
  userSignInfo: UserSignInfo
) {
  const lastAck = new Date(user.nextAck);

  const html = `<p>Hi ${userSignInfo.contacts.reduce(
    (p, c, i) => `${!p ? '' : ', '} ${c.name}`,
    ''
  )}
        <br> We sending you this mail since you're mentioned as ${userSignInfo.firstName} ${
    userSignInfo.lastName
  } contacts.
        <by> ${
          userSignInfo.firstName
        } is not responding to our alert since ${lastAck.toLocaleDateString()} ${lastAck.toLocaleTimeString()}.<br>
        <br>
        <br> The ${
          !userPingInfo.coordinates
            ? ''
            : `last known location of ${userSignInfo.firstName} was N:${
                userPingInfo.coordinates.N
              } E:${userPingInfo.coordinates.E} and the registered`
        }
          ${userSignInfo.firstName} address is ${userSignInfo.address}, the email is ${
    user.selfEmail
  }, 
          ${
            !userSignInfo.freeText
              ? ''
              : `and this is registered message from ${userSignInfo.firstName}
            <br>
            <b>${userSignInfo.freeText}`
          }</b>
        <br> Please make sure that everything is OK<p>
        <br>
        <i> sent for user guid ${user.guid} </i>
         `;
  await sendMail(userSignInfo.contacts.map(c => c.mail), 'Metzukan', html);
}
