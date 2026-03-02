import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, organization, role, source } = body;

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
      return NextResponse.json(
        { error: 'Failed to register. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email using Resend
    try {
      // Get base URL from environment or use default
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nsatwk.com';
      const logoUrl = `${baseUrl}/logo.png`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: '🛰️ Welcome to NSATWK2026 - Registration Confirmed',
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>NSATWK2026 Registration Confirmation</title>
              <!--[if mso]>
              <style type="text/css">
                body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
              </style>
              <![endif]-->
            </head>
            <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <!-- Wrapper -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
                <tr>
                  <td style="padding: 40px 20px;">
                    <!-- Main Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(8, 146, 89, 0.3);">

                      <!-- Space Header with Stars -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 0; position: relative; height: 200px; text-align: center;">
                          <!-- Animated Stars Background -->
                          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
                            <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; top: 20%; left: 10%; opacity: 0.8;"></div>
                            <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; top: 40%; left: 20%; opacity: 0.6;"></div>
                            <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; top: 15%; left: 80%; opacity: 0.9;"></div>
                            <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; top: 60%; left: 70%; opacity: 0.7;"></div>
                            <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; top: 80%; left: 15%; opacity: 0.5;"></div>
                            <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; top: 30%; left: 90%; opacity: 0.8;"></div>
                            <div style="position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; top: 70%; left: 50%; opacity: 0.6;"></div>
                            <div style="position: absolute; width: 1px; height: 1px; background: white; border-radius: 50%; top: 50%; left: 30%; opacity: 0.9;"></div>
                            <div style="position: absolute; width: 2px; height: 2px; background: #089259; border-radius: 50%; top: 25%; left: 60%; opacity: 0.7; box-shadow: 0 0 4px #089259;"></div>
                            <div style="position: absolute; width: 1px; height: 1px; background: #089259; border-radius: 50%; top: 85%; left: 85%; opacity: 0.8; box-shadow: 0 0 3px #089259;"></div>
                          </div>

                          <!-- Satellite SVG -->
                          <div style="position: absolute; top: 20px; right: 30px; opacity: 0.6;">
                            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="20" y="24" width="24" height="16" fill="#089259" opacity="0.8"/>
                              <rect x="16" y="26" width="4" height="12" fill="#089259"/>
                              <rect x="44" y="26" width="4" height="12" fill="#089259"/>
                              <line x1="12" y1="32" x2="4" y2="32" stroke="#089259" stroke-width="2"/>
                              <line x1="52" y1="32" x2="60" y2="32" stroke="#089259" stroke-width="2"/>
                              <circle cx="32" cy="32" r="4" fill="#0ab36f"/>
                            </svg>
                          </div>

                          <!-- Logo and Title -->
                          <div style="position: relative; padding-top: 60px;">
                            <img src="${logoUrl}" alt="NSATWK2026" style="width: 80px; height: auto; margin-bottom: 10px;" />
                            <h1 style="color: white; margin: 10px 0 5px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">NSATWK2026</h1>
                            <p style="color: #089259; margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 2px;">NIGERIA SATELLITE WEEK</p>
                          </div>
                        </td>
                      </tr>

                      <!-- Success Badge -->
                      <tr>
                        <td style="padding: 0;">
                          <div style="background: linear-gradient(90deg, transparent, rgba(8, 146, 89, 0.2), transparent); padding: 20px; text-align: center; border-top: 1px solid rgba(8, 146, 89, 0.3); border-bottom: 1px solid rgba(8, 146, 89, 0.3);">
                            <div style="display: inline-block; background: rgba(8, 146, 89, 0.2); border: 2px solid #089259; border-radius: 50px; padding: 8px 24px;">
                              <span style="color: #0ab36f; font-size: 14px; font-weight: 600;">✓ REGISTRATION CONFIRMED</span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 40px 30px; color: #e0e0e0;">
                          <h2 style="color: #089259; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome, ${name}! 🚀</h2>

                          <p style="color: #e0e0e0; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                            You're officially registered for <strong style="color: white;">Nigeria's premier Satellite Week 2026</strong>. Get ready to explore the future of space technology and innovation!
                          </p>

                          <!-- Registration Details Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(8, 146, 89, 0.05); border-left: 4px solid #089259; border-radius: 8px; margin: 30px 0;">
                            <tr>
                              <td style="padding: 25px;">
                                <h3 style="color: #0ab36f; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your Registration Details</h3>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding: 6px 0; color: #999; font-size: 14px; width: 100px;">Name:</td>
                                    <td style="padding: 6px 0; color: white; font-size: 14px; font-weight: 500;">${name}</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 6px 0; color: #999; font-size: 14px;">Email:</td>
                                    <td style="padding: 6px 0; color: white; font-size: 14px; font-weight: 500;">${email}</td>
                                  </tr>
                                  ${organization ? `
                                  <tr>
                                    <td style="padding: 6px 0; color: #999; font-size: 14px;">Organization:</td>
                                    <td style="padding: 6px 0; color: white; font-size: 14px; font-weight: 500;">${organization}</td>
                                  </tr>
                                  ` : ''}
                                  <tr>
                                    <td style="padding: 6px 0; color: #999; font-size: 14px;">Role:</td>
                                    <td style="padding: 6px 0; color: #089259; font-size: 14px; font-weight: 600; text-transform: capitalize;">${role}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Event Details -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                            <tr>
                              <td style="padding: 20px; background: #1a1a1a; border-radius: 8px; border: 1px solid rgba(8, 146, 89, 0.2);">
                                <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📅 Event Information</h3>
                                <p style="color: #e0e0e0; margin: 8px 0; font-size: 15px; line-height: 1.5;">
                                  <strong style="color: #089259;">📍 Venue:</strong> Abuja Continental Hotel, Abuja<br>
                                  <strong style="color: #089259;">📅 Date:</strong> February 27-28, 2026<br>
                                  <strong style="color: #089259;">🕐 Time:</strong> 9:00 AM onwards
                                </p>
                              </td>
                            </tr>
                          </table>

                          <!-- What's Next Section -->
                          <div style="background: linear-gradient(135deg, rgba(8, 146, 89, 0.1), rgba(8, 146, 89, 0.05)); padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(8, 146, 89, 0.2);">
                            <h3 style="color: #0ab36f; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🎯 What's Next?</h3>
                            <ul style="color: #e0e0e0; line-height: 1.8; margin: 0; padding-left: 20px; font-size: 15px;">
                              <li>Check your email for event updates</li>
                              <li>Receive your event badge details soon</li>
                              <li>Download the event agenda when available</li>
                              <li>Connect with fellow attendees</li>
                            </ul>
                          </div>

                          <!-- CTA Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 35px 0;">
                            <tr>
                              <td align="center">
                                <a href="${baseUrl}" style="display: inline-block; background: #089259; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(8, 146, 89, 0.4);">
                                  Visit Event Website
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                            Questions? Contact us at <a href="mailto:info@nsatwk.com" style="color: #089259; text-decoration: none;">info@nsatwk.com</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid rgba(8, 146, 89, 0.2);">
                          <p style="color: #666; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5;">
                            © ${new Date().getFullYear()} Nigeria Satellite Week. All rights reserved.<br>
                            Harnessing AI & Space Technologies for Nigeria's Digital Economy
                          </p>
                          <div style="margin-top: 15px;">
                            <a href="${baseUrl}" style="color: #089259; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
                            <span style="color: #333;">|</span>
                            <a href="${baseUrl}/#about" style="color: #089259; text-decoration: none; font-size: 12px; margin: 0 10px;">About</a>
                            <span style="color: #333;">|</span>
                            <a href="${baseUrl}/#timeline" style="color: #089259; text-decoration: none; font-size: 12px; margin: 0 10px;">Agenda</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the registration if email fails
      // The user is still registered in the database
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
