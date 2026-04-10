// ─── Application Email Notifications ─────────────────────────────────────────
// Called by the application service. Decoupled from HTTP layer.
// ─────────────────────────────────────────────────────────────────────────────

import { resend, formatFrom } from "./resend";
import { absoluteUrl } from "@/lib/utils";
import type { ApplicationEmailParams } from "@/server/services/application.service";

export async function sendApplicationEmails(
  params: ApplicationEmailParams
): Promise<void> {
  const { application, mission, expert } = params;
  if (!application || !mission || !expert) return;

  const expertName = expert.user.name ?? "An expert";
  const expertEmail = expert.user.email;
  const missionTitle = mission.title;
  const recruiterEmail =
    (mission as { recruiter: { user: { email?: string | null } } }).recruiter
      ?.user?.email ?? null;

  const applicationUrl = absoluteUrl(
    `/recruiter/missions/${mission.id}/applications/${application.id}`
  );
  const expertProfileUrl = absoluteUrl(`/experts/${expert.slug ?? expert.id}`);

  // ─── Email to recruiter ────────────────────────────────────────────────────
  if (recruiterEmail) {
    await resend.emails.send({
      from: formatFrom(),
      to: recruiterEmail,
      subject: `New application for "${missionTitle}" — ${expertName}`,
      html: buildRecruiterNotificationHtml({
        expertName,
        expertTitle: expert.title ?? "Expert",
        missionTitle,
        applicationUrl,
        expertProfileUrl,
        cvUrl: expert.documents[0]?.url ?? null,
      }),
    });
  }

  // ─── Confirmation to expert ────────────────────────────────────────────────
  await resend.emails.send({
    from: formatFrom(),
    to: expertEmail,
    subject: `Your application to "${missionTitle}" has been submitted`,
    html: buildExpertConfirmationHtml({
      expertName,
      missionTitle,
      organizationName: mission.organization?.name ?? "the organization",
      applicationsUrl: absoluteUrl("/expert/applications"),
    }),
  });
}

// ─── HTML templates ───────────────────────────────────────────────────────────
// Minimal inline HTML for now; swap with @react-email/components in a later phase.

function buildRecruiterNotificationHtml(data: {
  expertName: string;
  expertTitle: string;
  missionTitle: string;
  applicationUrl: string;
  expertProfileUrl: string;
  cvUrl: string | null;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Application — DevTalent</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f4f6fb; margin:0; padding:40px 0;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #1a2340 0%, #0f1728 100%); padding:32px; text-align:center;">
      <span style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:-0.5px;">DevTalent</span>
    </div>
    <!-- Body -->
    <div style="padding:40px 36px;">
      <p style="color:#4a5568; font-size:15px; margin:0 0 8px;">New application received</p>
      <h1 style="color:#1a202c; font-size:24px; font-weight:700; margin:0 0 24px; line-height:1.3;">
        ${data.expertName} applied to<br><span style="color:#4f6ef7;">${data.missionTitle}</span>
      </h1>

      <!-- Expert card -->
      <div style="background:#f7f9fd; border:1px solid #e2e8f0; border-radius:10px; padding:20px 24px; margin-bottom:28px;">
        <p style="margin:0 0 4px; font-size:16px; font-weight:600; color:#1a202c;">${data.expertName}</p>
        <p style="margin:0; font-size:14px; color:#718096;">${data.expertTitle}</p>
      </div>

      <!-- CTAs -->
      <div style="display:flex; gap:12px; flex-direction:column;">
        <a href="${data.applicationUrl}" style="display:block; background:#4f6ef7; color:#ffffff; text-align:center; padding:14px 24px; border-radius:8px; font-size:15px; font-weight:600; text-decoration:none;">
          View Application
        </a>
        <a href="${data.expertProfileUrl}" style="display:block; background:#f7f9fd; border:1px solid #e2e8f0; color:#4f6ef7; text-align:center; padding:14px 24px; border-radius:8px; font-size:15px; font-weight:500; text-decoration:none;">
          View Expert Profile
        </a>
        ${
          data.cvUrl
            ? `<a href="${data.cvUrl}" style="display:block; background:#f7f9fd; border:1px solid #e2e8f0; color:#4a5568; text-align:center; padding:14px 24px; border-radius:8px; font-size:15px; font-weight:500; text-decoration:none;">Download CV</a>`
            : ""
        }
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:20px 36px; border-top:1px solid #edf2f7; text-align:center;">
      <p style="color:#a0aec0; font-size:12px; margin:0;">DevTalent · Premium Expert Recruitment for International Development</p>
    </div>
  </div>
</body>
</html>`;
}

function buildExpertConfirmationHtml(data: {
  expertName: string;
  missionTitle: string;
  organizationName: string;
  applicationsUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Application Submitted — DevTalent</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f4f6fb; margin:0; padding:40px 0;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg, #1a2340 0%, #0f1728 100%); padding:32px; text-align:center;">
      <span style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:-0.5px;">DevTalent</span>
    </div>
    <div style="padding:40px 36px;">
      <div style="text-align:center; margin-bottom:28px;">
        <div style="display:inline-block; background:#edf7ee; border-radius:50%; width:56px; height:56px; line-height:56px; font-size:24px; margin-bottom:16px;">✓</div>
        <h1 style="color:#1a202c; font-size:22px; font-weight:700; margin:0 0 8px;">Application submitted!</h1>
        <p style="color:#718096; font-size:15px; margin:0;">You've successfully applied for the following mission</p>
      </div>

      <div style="background:#f7f9fd; border:1px solid #e2e8f0; border-radius:10px; padding:20px 24px; margin-bottom:28px;">
        <p style="margin:0 0 4px; font-size:16px; font-weight:600; color:#1a202c;">${data.missionTitle}</p>
        <p style="margin:0; font-size:14px; color:#718096;">${data.organizationName}</p>
      </div>

      <p style="color:#4a5568; font-size:14px; line-height:1.6;">
        Hi ${data.expertName},<br><br>
        Your application has been received by the recruiter. You can track the status of all your applications from your dashboard.
      </p>

      <a href="${data.applicationsUrl}" style="display:block; background:#4f6ef7; color:#ffffff; text-align:center; padding:14px 24px; border-radius:8px; font-size:15px; font-weight:600; text-decoration:none; margin-top:24px;">
        View My Applications
      </a>
    </div>
    <div style="padding:20px 36px; border-top:1px solid #edf2f7; text-align:center;">
      <p style="color:#a0aec0; font-size:12px; margin:0;">DevTalent · Premium Expert Recruitment for International Development</p>
    </div>
  </div>
</body>
</html>`;
}
