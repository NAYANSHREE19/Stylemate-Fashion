import { Resend } from 'resend';

const recipientEmail = 'royalanuragcoc2004@gmail.com';

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Resend API key is not configured on server'
      });
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: recipientEmail,
      replyTo: email,
      subject: `StyleMate Contact: ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send message'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};
