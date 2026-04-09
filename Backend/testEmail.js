import { Resend } from 'resend';

const resendApiKey = 're_g52HLkWt_NsdSQ3cRLURx2cwxSSvbcnSm';
const resend = new Resend(resendApiKey);

async function testEmail() {
  const { data, error } = await resend.emails.send({
    from: 'stylemate@resend.dev',
    to: 'royalanuragcoc2004@gmail.com',
    subject: 'Test subject',
    html: '<p>Test html</p>'
  });
  console.log('Result:', { data, error });
}

testEmail();
