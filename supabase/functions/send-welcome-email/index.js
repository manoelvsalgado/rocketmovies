import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function response(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return response(405, { error: 'Method not allowed' });
  }

  const apiKey = Deno.env.get('MAILERSEND_API_KEY');
  const fromEmail = Deno.env.get('MAILERSEND_FROM_EMAIL');
  const fromName = Deno.env.get('MAILERSEND_FROM_NAME') || 'RocketMovies';

  if (!apiKey || !fromEmail) {
    return response(500, { error: 'MailerSend environment variables are missing' });
  }

  let body;

  try {
    body = await req.json();
  } catch {
    return response(400, { error: 'Invalid JSON body' });
  }

  const toEmail = body?.toEmail?.trim();
  const name = body?.name?.trim() || 'usuário';

  if (!toEmail) {
    return response(400, { error: 'toEmail is required' });
  }

  const payload = {
    from: {
      email: fromEmail,
      name: fromName,
    },
    to: [
      {
        email: toEmail,
        name,
      },
    ],
    subject: 'Bem-vindo ao RocketMovies',
    text: `Olá, ${name}! Sua conta no RocketMovies foi criada com sucesso.`,
    html: `<p>Olá, <strong>${name}</strong>!</p><p>Sua conta no RocketMovies foi criada com sucesso.</p>`,
  };

  const mailerResponse = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!mailerResponse.ok) {
    const errorText = await mailerResponse.text();
    return response(502, {
      error: 'MailerSend request failed',
      details: errorText,
    });
  }

  return response(200, { success: true });
});
