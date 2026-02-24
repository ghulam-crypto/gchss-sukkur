/**
 * ============================================================
 * Vercel Edge Function: /api/proxy
 * ============================================================
 * PURPOSE: This file acts as a secure middleman between the
 * browser and your Google Apps Script. The real Google Script
 * URL is stored as a Vercel Environment Variable (never in
 * frontend code), so it's never visible to users.
 *
 * SETUP IN VERCEL:
 *   1. Go to your Vercel project → Settings → Environment Variables
 *   2. Add: GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 *   3. Deploy
 * ============================================================
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Only allow POST
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server misconfiguration: Backend URL not set.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    );
  }

  let body;
  try {
    body = await req.text();
    // Basic size check (prevent large payload attacks)
    if (body.length > 500_000) {
      return new Response(
        JSON.stringify({ success: false, message: 'Payload too large.' }),
        { status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    );
  }

  try {
    const upstream = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const data = await upstream.text();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...corsHeaders(),
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: 'Gateway error: ' + err.message }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    );
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  'https://gchss-sukkur.vercel.app', // ← your domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
