import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchSanityData, queries } from '@/lib/sanity';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, role, source } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Insert registration into Supabase
    const { data, error } = await supabaseAdmin
      .from('registrations')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          organization: organization || null,
          role: role || 'attendee',
          source: source || 'direct',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        const { data: existing } = await supabaseAdmin
          .from('registrations')
          .select('id')
          .eq('email', email)
          .single();
        return NextResponse.json(
          { error: 'This email is already registered. See you at the event!', passId: existing?.id || null },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email via SMTP
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.nigeriansatelliteweek.ng';
      const passUrl = `${baseUrl}/pass/${data.id}`;
      const logoUrl = `${baseUrl}/logo.png`;

      const siteSettings = await fetchSanityData(queries.siteSettings).catch(() => null);
      const agendaPdfUrl = siteSettings?.agendaPdfUrl || null;

      // Fetch pass image for attachment
      let passImageBuffer = null;
      try {
        const imgRes = await fetch(`${baseUrl}/api/pass/${data.id}/image`);
        if (imgRes.ok) passImageBuffer = Buffer.from(await imgRes.arrayBuffer());
      } catch (_) {}

      await transporter.sendMail({
        from: `"Nigeria Satellite Week" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🛰️ Welcome to NSATWK2026 - Registration Confirmed',
        attachments: passImageBuffer ? [
          {
            filename: `nsatwk2026-pass-${name.replace(/\s+/g, '-').toLowerCase()}.png`,
            content: passImageBuffer,
            contentType: 'image/png',
          },
        ] : [],
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NSATWK 2026 — Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;">

          <!-- Header bar -->
          <tr>
            <td style="background:#089259;padding:32px 40px;">
              <img src="${logoUrl}" alt="NSATWK" width="52" height="52" style="display:block;margin-bottom:16px;" />
              <p style="margin:0;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Nigeria Satellite Week</p>
              <h1 style="margin:6px 0 0 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">Registration Confirmed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#333333;line-height:1.6;">Dear ${name},</p>
              <p style="margin:0 0 20px;font-size:15px;color:#333333;line-height:1.6;">
                Thank you for registering for <strong>Nigeria Satellite Week 2026</strong>. Your spot is confirmed and we look forward to welcoming you.
              </p>

              <!-- Details block -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f9f9f9;border-left:3px solid #089259;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#089259;">Your Details</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888888;width:110px;vertical-align:top;">Name</td>
                        <td style="padding:5px 0;font-size:13px;color:#111111;font-weight:600;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888888;vertical-align:top;">Email</td>
                        <td style="padding:5px 0;font-size:13px;color:#111111;">${email}</td>
                      </tr>
                      ${organization ? `
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888888;vertical-align:top;">Organisation</td>
                        <td style="padding:5px 0;font-size:13px;color:#111111;">${organization}</td>
                      </tr>` : ''}
                      ${phone ? `
                      <tr>
                        <td style="padding:5px 0;font-size:13px;color:#888888;vertical-align:top;">Phone</td>
                        <td style="padding:5px 0;font-size:13px;color:#111111;">${phone}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Event info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 28px;">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#333333;"><strong style="color:#089259;display:inline-block;width:64px;">Date</strong> 30 – 31 March 2026</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#333333;"><strong style="color:#089259;display:inline-block;width:64px;">Venue</strong> Abuja Continental Hotel, Abuja</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#333333;"><strong style="color:#089259;display:inline-block;width:64px;">Time</strong> 9:00 AM onwards</td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;">
                <tr>
                  <td style="border-radius:4px;background:#089259;">
                    <a href="${passUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:4px;">View Your Digital Pass</a>
                  </td>
                  ${agendaPdfUrl ? `
                  <td width="12"></td>
                  <td style="border-radius:4px;border:1px solid #089259;">
                    <a href="${agendaPdfUrl}" style="display:inline-block;padding:14px 32px;color:#089259;font-size:14px;font-weight:700;text-decoration:none;border-radius:4px;">Download Agenda</a>
                  </td>` : ''}
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:14px;color:#555555;line-height:1.6;">
                Your digital pass is attached to this email as a PNG file. You can also view and share it online using the button above.
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#555555;line-height:1.6;">
                If you have any questions, please reach us at <a href="mailto:satelliteweek@nigcomsat.gov.ng" style="color:#089259;text-decoration:none;">satelliteweek@nigcomsat.gov.ng</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                &copy; ${new Date().getFullYear()} NIGCOMSAT Limited &nbsp;&middot;&nbsp;
                <a href="${baseUrl}" style="color:#089259;text-decoration:none;">nigeriansatelliteweek.ng</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Check your email for confirmation.',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
