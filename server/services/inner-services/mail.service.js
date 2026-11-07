import nodemailer from "nodemailer"

class MailService {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.mail_host,
            port: process.env.mail_port,
            secure: false,
            auth: {
                user: process.env.mail_user,
                pass: process.env.mail_pass
            }
        })
    }

    async sendMail(to, link) {
        await this.transport.sendMail({
            from: process.env.mail_user,
            to,
            subject: "ссылка на активацию аккаунта",
            text: '',
            html: `<a href=${link}>${link}</a>`
        })
    }

}

export default new MailService()