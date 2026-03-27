import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const AGENT_EMAIL = "jdivinare@outlook.com";
const AGENT_NAME = "Janice Divina Liad";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SOURCE_CONFIG = {
  buyer_guide: {
    subject: "📋 Your Free Buyer's Guide — Janice Divina Liad",
    heading: "Your Buyer's Guide is Here!",
    message: "Thank you for requesting my free Buyer's Guide! Inside you'll find my complete 10-step buyer process, home search checklist, and first-time buyer program guide.",
    cta: null,
  },
  seller_guide: {
    subject: "🏠 Your Free Seller's Guide — Janice Divina Liad",
    heading: "Your Seller's Guide is Here!",
    message: "Thank you for requesting my free Seller's Guide! Inside you'll find my pre-listing checklist, staging tips, and strategies to get top dollar for your home.",
    cta: null,
  },
  home_worth: {
    subject: "📊 Your Home Value Report — Janice Divina Liad",
    heading: "Your Home Value Report is Coming!",
    message: "Thank you for requesting a home value analysis! I'm preparing your personalized report and will have it ready within 24 hours.",
    cta: { text: "Check Your Home Value Now →", url: "https://homequityreport.com/janicedivina" },
  },
  buyer_readiness: {
    subject: "🏡 Your Buyer Readiness Results — Janice Divina Liad",
    heading: "Great First Step!",
    message: "Thank you for completing the Home Buyer Readiness Assessment! I've received your results and I'd love to walk you through your personalized action plan.",
    cta: { text: "Review Your Assessment →", url: "https://janicedivinarealestate.com/buyer-readiness.html" },
  },
  consultation: {
    subject: "📅 Consultation Request Received — Janice Divina Liad",
    heading: "I Got Your Request!",
    message: "Thank you for booking a consultation! I'll confirm your appointment within 24 hours. I'm looking forward to learning about your real estate goals.",
    cta: null,
  },
  contact_form: {
    subject: "✉️ Thanks for Reaching Out — Janice Divina Liad",
    heading: "Message Received!",
    message: "Thank you for reaching out through my website! I'll get back to you personally within 24 hours.",
    cta: null,
  },
};

function buildLeadEmail(name, source, address) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.contact_form;
  const firstName = (name || "").split(" ")[0] || "there";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAF6EF;font-family:'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:20px">
  <div style="background:linear-gradient(135deg,#8B1C2A,#5a1018);border-radius:16px 16px 0 0;padding:24px;text-align:center">
    <h1 style="color:#fff;font-size:22px;margin:0 0 4px;font-family:Georgia,serif">${config.heading}</h1>
    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0">From Janice Divina Liad, REALTOR®</p>
  </div>
  <div style="background:#fff;padding:28px 24px;border-left:1px solid #eee;border-right:1px solid #eee">
    <p style="font-size:15px;color:#333;line-height:1.8;margin:0 0 16px">Hi ${firstName}! 👋</p>
    <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 16px">${config.message}</p>
    ${address ? `<p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 16px"><strong>Property:</strong> ${address}</p>` : ""}
    ${config.cta ? `<div style="text-align:center;margin:20px 0"><a href="${config.cta.url}" style="display:inline-block;background:#8B1C2A;color:#fff;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none">${config.cta.text}</a></div>` : ""}
    <p style="font-size:14px;color:#444;line-height:1.8;margin:16px 0 0">I'll personally follow up within 24 hours. No pressure, no obligation — just here to help you on your journey.</p>
  </div>
  <div style="background:#f9f6f0;padding:20px 24px;border-radius:0 0 16px 16px;border:1px solid #eee;border-top:none">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:16px;vertical-align:top">
        <img src="https://janicedivinarealestate.com/images/janice-headshot.jpg" alt="Janice" width="64" height="64" style="border-radius:50%;border:2px solid #8B1C2A;display:block">
      </td>
      <td style="vertical-align:top">
        <div style="font-weight:700;font-size:14px;color:#1a1a1a">Janice Divina Liad</div>
        <div style="font-size:12px;color:#666;margin-top:2px">REALTOR® · DRE #02099146</div>
        <div style="font-size:12px;color:#666">HomeSmart PV & Associates</div>
        <div style="font-size:12px;color:#666;margin-top:6px">📞 <a href="tel:2093059401" style="color:#8B1C2A;text-decoration:none">(209) 305-9401</a></div>
        <div style="font-size:12px;color:#666">✉️ <a href="mailto:jdivinare@outlook.com" style="color:#8B1C2A;text-decoration:none">jdivinare@outlook.com</a></div>
        <div style="font-size:12px;color:#666">🌐 <a href="https://janicedivinarealestate.com" style="color:#8B1C2A;text-decoration:none">janicedivinarealestate.com</a></div>
      </td>
    </tr></table>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e0d8c8;text-align:center">
      <span style="font-size:11px;color:#C9A84C;font-weight:600;letter-spacing:1px">Faith · Family · Forward</span>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#aaa;margin-top:16px">© 2026 Janice Divina Liad · Manteca, CA · DRE #02099146</p>
</div>
</body></html>`;
}

function buildNotifyEmail(data) {
  const sourceLabels = {
    buyer_guide: "📋 Buyer's Guide", seller_guide: "📋 Seller's Guide",
    home_worth: "💰 Home Value Request", buyer_readiness: "📊 Buyer Readiness Tool",
    consultation: "📅 Book Consultation", contact_form: "✉️ Contact Form",
    ai_chatbot: "🤖 AI Chatbot", other: "🌐 Other",
  };
  return `<!DOCTYPE html>
<html><body style="font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5">
<div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
  <div style="background:#8B1C2A;padding:16px 20px;color:#fff">
    <h2 style="margin:0;font-size:16px">🔔 New Website Lead!</h2>
    <p style="margin:4px 0 0;font-size:12px;opacity:0.8">${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}</p>
  </div>
  <div style="padding:20px">
    <table style="width:100%;font-size:14px;color:#333" cellpadding="6">
      <tr><td style="font-weight:700;color:#888;width:100px">Name</td><td>${data.name || "—"}</td></tr>
      <tr><td style="font-weight:700;color:#888">Email</td><td><a href="mailto:${data.email}">${data.email || "—"}</a></td></tr>
      <tr><td style="font-weight:700;color:#888">Phone</td><td><a href="tel:${data.phone}">${data.phone || "—"}</a></td></tr>
      <tr><td style="font-weight:700;color:#888">Source</td><td>${sourceLabels[data.source] || data.source}</td></tr>
      ${data.address ? `<tr><td style="font-weight:700;color:#888">Address</td><td>${data.address}</td></tr>` : ""}
      ${data.consultation_type ? `<tr><td style="font-weight:700;color:#888">Type</td><td>${data.consultation_type}</td></tr>` : ""}
      ${data.notes ? `<tr><td style="font-weight:700;color:#888">Notes</td><td>${data.notes}</td></tr>` : ""}
    </table>
    <div style="margin-top:16px;text-align:center">
      <a href="https://os.janicedivinarealestate.com/lead-gen" style="display:inline-block;background:#8B1C2A;color:#fff;padding:10px 24px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none">Open Lead Gen OS →</a>
    </div>
    <p style="font-size:12px;color:#999;text-align:center;margin-top:12px">⚡ Respond within 5 minutes for best conversion!</p>
  </div>
</div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const promises = [];

    // 1. Email to the lead (if they provided an email)
    if (data.email) {
      const config = SOURCE_CONFIG[data.source] || SOURCE_CONFIG.contact_form;
      promises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
          body: JSON.stringify({
            from: `${AGENT_NAME} <onboarding@resend.dev>`,
            to: [data.email],
            subject: config.subject,
            html: buildLeadEmail(data.name, data.source, data.address),
          }),
        })
      );
    }

    // 2. Notification email to Janice
    promises.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: `Lead Gen OS <onboarding@resend.dev>`,
          to: [AGENT_EMAIL],
          subject: `🔔 New Lead: ${data.name || "Unknown"} — ${data.source || "website"}`,
          html: buildNotifyEmail(data),
        }),
      })
    );

    const results = await Promise.allSettled(promises);
    const statuses = results.map((r) => r.status);
    console.log("Email results:", statuses);

    return new Response(JSON.stringify({ success: true, results: statuses }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
