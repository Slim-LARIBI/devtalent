export function inviteExpertEmail({
  expertName,
  missionTitle,
  organizationName,
  missionLink,
}: {
  expertName: string;
  missionTitle: string;
  organizationName: string;
  missionLink: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 24px; background: #f9fafb;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 12px;">

      <h2 style="margin-bottom: 16px;">🚀 New opportunity on DevTalent</h2>

      <p>Hi ${expertName || "there"},</p>

      <p>
        A recruiter from <strong>${organizationName}</strong> invited you to apply to the following mission:
      </p>

      <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; margin: 16px 0;">
        <strong>${missionTitle}</strong>
      </div>

      <a href="${missionLink}" 
         style="display: inline-block; margin-top: 16px; padding: 12px 18px; background: #4f7ef7; color: white; text-decoration: none; border-radius: 8px;">
        View mission
      </a>

      <p style="margin-top: 24px; font-size: 12px; color: #64748b;">
        You are receiving this because you are registered on DevTalent.
      </p>

    </div>
  </div>
  `;
}