const nodemailer = require('nodemailer');

class MailService {

  constructor(){
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    })
  }
  async sendActivationMail(to, linck){
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation for ${process.env.API_URL}`,
      text: '',
      html: `
        <div>
          <h1>To activate, follow the link</h1>
          <a href="${linck}">${linck}</a>
          <p>This registration is a test</p>
        </div>
      `
    })
  }
}

module.exports = new MailService();
