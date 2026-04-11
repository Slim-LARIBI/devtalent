type ApplicationNotificationEmailProps = {
  recruiterName?: string;
  expertName: string;
  expertEmail: string;
  missionTitle: string;
  missionCountry?: string;
  missionDonor?: string;
  coverLetter?: string | null;
  applicationUrl: string;
};

export function ApplicationNotificationEmail({
  recruiterName,
  expertName,
  expertEmail,
  missionTitle,
  missionCountry,
  missionDonor,
  coverLetter,
  applicationUrl,
}: ApplicationNotificationEmailProps) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New application received</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,sans-serif;color:#1f2a44;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #e7ebf3;border-radius:18px;overflow:hidden;">
          
          <div style="padding:24px 28px;background:linear-gradient(135deg,#4f6ef7 0%,#6d8cff 100%);color:#ffffff;">
            <div style="font-size:14px;opacity:0.9;margin-bottom:8px;">DevTalent</div>
            <h1 style="margin:0;font-size:28px;line-height:1.2;">New application received</h1>
            <p style="margin:10px 0 0 0;font-size:15px;line-height:1.6;opacity:0.95;">
              A new expert has applied to one of your missions.
            </p>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;">
              Hello${recruiterName ? ` ${recruiterName}` : ""},
            </p>

            <p style="margin:0 0 22px 0;font-size:15px;line-height:1.7;">
              <strong>${expertName}</strong> has just applied for
              <strong>${missionTitle}</strong>.
            </p>

            <div style="background:#f8faff;border:1px solid #e6ecff;border-radius:14px;padding:18px 18px 8px 18px;margin-bottom:22px;">
              <div style="margin-bottom:12px;">
                <div style="font-size:12px;color:#667085;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Expert</div>
                <div style="font-size:16px;font-weight:700;color:#1f2a44;">${expertName}</div>
                <div style="font-size:14px;color:#4f5d7a;margin-top:4px;">${expertEmail}</div>
              </div>

              <div style="margin-bottom:12px;">
                <div style="font-size:12px;color:#667085;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Mission</div>
                <div style="font-size:16px;font-weight:700;color:#1f2a44;">${missionTitle}</div>
              </div>

              ${
                missionCountry || missionDonor
                  ? `
                <div style="margin-bottom:12px;">
                  ${
                    missionCountry
                      ? `<span style="display:inline-block;background:#eef2ff;color:#3b4fcc;border-radius:999px;padding:6px 10px;font-size:12px;margin:0 8px 8px 0;">${missionCountry}</span>`
                      : ""
                  }
                  ${
                    missionDonor
                      ? `<span style="display:inline-block;background:#eefbf3;color:#137a48;border-radius:999px;padding:6px 10px;font-size:12px;margin:0 8px 8px 0;">${missionDonor}</span>`
                      : ""
                  }
                </div>
              `
                  : ""
              }

              ${
                coverLetter
                  ? `
                <div style="margin:10px 0 6px 0;">
                  <div style="font-size:12px;color:#667085;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px;">Cover note</div>
                  <div style="font-size:14px;line-height:1.7;color:#344054;background:#ffffff;border:1px solid #e7ebf3;border-radius:10px;padding:14px;">
                    ${coverLetter.replace(/\n/g, "<br/>")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>

            <div style="margin:28px 0;">
              <a
                href="${applicationUrl}"
                style="display:inline-block;background:#4f6ef7;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 22px;border-radius:12px;"
              >
                Review application
              </a>
            </div>

            <p style="margin:0;font-size:13px;line-height:1.7;color:#667085;">
              You are receiving this email because a new expert applied through DevTalent.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}
