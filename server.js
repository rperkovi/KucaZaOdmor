import express from 'express'
import dotenv from 'dotenv'
import twilio from 'twilio'
import sendgrid from '@sendgrid/mail'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(express.json())

app.post('/api/sms', async (req, res) => {
  const { to, body } = req.body || {}

  if (!to || !body) {
    return res.status(400).json({
      success: false,
      error: 'Nedostaje broj primatelja ili poruka.'
    })
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({
      success: false,
      error: 'Twilio nije konfiguriran. Postavite TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN i TWILIO_PHONE_NUMBER u .env datoteci.'
    })
  }

  try {
    const client = twilio(accountSid, authToken)
    const message = await client.messages.create({
      body,
      from,
      to
    })

    return res.json({
      success: true,
      message: 'SMS je uspješno poslan.',
      sid: message.sid,
      status: message.status
    })
  } catch (error) {
    const message = error?.message || 'Nepoznata greška pri slanju SMS-a.'
    return res.status(500).json({
      success: false,
      error: message
    })
  }
})

const emailContacts = new Set([
  'roberto.perkovic01@gmail.com',
  'branislava.bertosa@gmail.com'
])

app.post('/api/email', async (req, res) => {
  const { to, body } = req.body || {}
  const recipient = typeof to === 'string' ? to.trim().toLowerCase() : ''

  if (!emailContacts.has(recipient) || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Neispravan primatelj ili sadržaj emaila.'
    })
  }

  const apiKey = process.env.SENDGRID_API_KEY
  const from = process.env.SENDGRID_FROM_EMAIL

  if (!apiKey || !from) {
    return res.status(500).json({
      success: false,
      error: 'SendGrid nije konfiguriran. Postavite SENDGRID_API_KEY i SENDGRID_FROM_EMAIL u .env datoteci.'
    })
  }

  try {
    sendgrid.setApiKey(apiKey)
    await sendgrid.send({
      to: recipient,
      from,
      subject: 'Upit za rezervaciju',
      text: body.trim()
    })

    return res.json({
      success: true,
      message: 'Email je uspješno poslan.'
    })
  } catch (error) {
    const status = error?.code === 401 || error?.code === 403 ? 502 : 500
    return res.status(status).json({
      success: false,
      error: 'SendGrid nije uspio poslati email. Provjerite API ključ i potvrđenu pošiljateljsku adresu u SendGridu.'
    })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(port, () => {
  console.log(`SMS API server running on http://localhost:${port}`)
})
