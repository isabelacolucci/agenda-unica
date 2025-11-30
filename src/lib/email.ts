import nodemailer from "nodemailer"

// Configuração do transporter do nodemailer para Gmail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Permite certificados auto-assinados (necessário em alguns ambientes)
  },
})

interface SendResetPasswordEmailParams {
  to: string
  name: string
  resetToken: string
}

export async function sendResetPasswordEmail({
  to,
  name,
  resetToken,
}: SendResetPasswordEmailParams) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || `Agenda Única <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperação de Senha - Agenda Única",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h1 style="color: #2563eb; margin-top: 0;">Recuperação de Senha</h1>
          <p>Olá, <strong>${name}</strong>!</p>
          <p>Você solicitou a recuperação de senha da sua conta no Agenda Única.</p>
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Redefinir Senha
            </a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="background-color: #fff; padding: 10px; border-radius: 3px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Importante:</strong> Este link é válido por 1 hora. Se você não solicitou a recuperação de senha, ignore este e-mail.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Agenda Única - Todos os direitos reservados
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
      Olá, ${name}!

      Você solicitou a recuperação de senha da sua conta no Agenda Única.

      Para redefinir sua senha, acesse o link abaixo:
      ${resetUrl}

      Este link é válido por 1 hora.

      Se você não solicitou a recuperação de senha, ignore este e-mail.

      © ${new Date().getFullYear()} Agenda Única - Todos os direitos reservados
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error)
    return { success: false, error }
  }
}
