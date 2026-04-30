import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(40),
  email: z.string().email().optional().or(z.literal("")),
  zip: z.string().min(3).max(10),
  city: z.string().min(2).max(80).optional().or(z.literal("")),
  problem: z.string().min(8).max(2000),
  urgency: z.enum(["routine", "soon", "urgent"]),
  // honeypot
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof contactSchema>;
  try {
    body = contactSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Spam honeypot — silently accept and drop
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const dispatchEmail = process.env.LYONS_DISPATCH_EMAIL;

  // Always log so the demo "works" even without Resend configured
  console.log("[contact] new submission", {
    name: body.name,
    phone: body.phone,
    zip: body.zip,
    urgency: body.urgency,
  });

  if (!apiKey || !dispatchEmail) {
    return NextResponse.json({ ok: true, queued: false });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Lyons Website <noreply@lyonselectricalcontractorsinc.com>",
      to: dispatchEmail.split(",").map((s) => s.trim()),
      replyTo: body.email || undefined,
      subject: `[${body.urgency.toUpperCase()}] New website lead — ${body.name}`,
      text: [
        `Name: ${body.name}`,
        `Phone: ${body.phone}`,
        body.email ? `Email: ${body.email}` : null,
        `ZIP: ${body.zip}`,
        body.city ? `City: ${body.city}` : null,
        `Urgency: ${body.urgency}`,
        ``,
        `Problem:`,
        body.problem,
        ``,
        `--`,
        `Submitted via lyons-electrical website`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ ok: true, queued: true });
  } catch (err) {
    console.error("[contact] resend error", err);
    return NextResponse.json({ ok: true, queued: false });
  }
}
