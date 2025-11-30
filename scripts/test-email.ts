// Script de teste para verificar conexão SMTP com Gmail
import nodemailer from "nodemailer"
import * as dotenv from "dotenv"
import { resolve } from "path"

// Carregar variáveis de ambiente
dotenv.config({ path: resolve(process.cwd(), ".env") })

async function testEmailConnection() {
  console.log("🔍 Testando conexão com Gmail SMTP...\n")

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Permite certificados auto-assinados (desenvolvimento)
    },
  })

  console.log("📧 Configurações:")
  console.log(`   Host: ${process.env.EMAIL_HOST}`)
  console.log(`   Port: ${process.env.EMAIL_PORT}`)
  console.log(`   User: ${process.env.EMAIL_USER}`)
  console.log(`   Pass: ${process.env.EMAIL_PASS ? "***" + process.env.EMAIL_PASS.slice(-4) : "NÃO CONFIGURADA"}`)
  console.log(`   From: ${process.env.EMAIL_FROM}\n`)

  try {
    console.log("⏳ Verificando conexão...")
    await transporter.verify()
    console.log("✅ Conexão SMTP estabelecida com sucesso!\n")

    console.log("📨 Enviando e-mail de teste...")
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Agenda Única <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Envia para o próprio e-mail
      subject: "Teste de Envio - Agenda Única",
      html: `
        <h1>✅ Teste de E-mail Bem-Sucedido!</h1>
        <p>Se você recebeu este e-mail, a configuração do Gmail SMTP está funcionando corretamente.</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString("pt-BR")}</p>
      `,
      text: `✅ Teste de E-mail Bem-Sucedido! Se você recebeu este e-mail, a configuração está funcionando corretamente. Data/Hora: ${new Date().toLocaleString("pt-BR")}`,
    })

    console.log("✅ E-mail enviado com sucesso!")
    console.log(`   Message ID: ${info.messageId}`)
    console.log(`\n🎉 Tudo funcionando! Verifique a caixa de entrada de: ${process.env.EMAIL_USER}`)
  } catch (error) {
    console.error("❌ Erro ao testar conexão:")
    console.error(error)
    console.log("\n🔧 Possíveis soluções:")
    console.log("   1. Verifique se a Senha de App está correta (16 caracteres, sem espaços)")
    console.log("   2. Confirme que a Verificação em Duas Etapas está ativa")
    console.log("   3. Gere uma nova Senha de App: https://myaccount.google.com/apppasswords")
    console.log("   4. Verifique se o e-mail está correto no .env")
  }
}

testEmailConnection()
