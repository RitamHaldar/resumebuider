import { IResume } from "@/types/resume.types";

export interface RenderResumeOptions {
  activeFont?: "serif" | "sans" | "mono";
  compactSpacing?: boolean;
}

export function renderResumeHtml(
  resumeData: Partial<IResume> | Record<string, any>,
  options: RenderResumeOptions = {}
): string {
  const personal = resumeData.personalInfo || {};
  const summary = resumeData.summary || "";
  const skills = resumeData.skills || [];
  const workExperience = resumeData.workExperience || [];
  const projects = resumeData.projects || [];
  const education = resumeData.education || [];
  const certifications = resumeData.certifications || [];
  const fontStyle = options.activeFont || "serif";

  const fontFamily =
    fontStyle === "serif"
      ? '"Latin Modern Roman", "Computer Modern", "Times New Roman", Garamond, Georgia, serif'
      : fontStyle === "mono"
      ? '"Roboto Mono", "Courier New", Courier, monospace'
      : '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Contact items array
  const contactParts: string[] = [];
  if (personal.mobile) contactParts.push(`<span>${escapeHtml(personal.mobile)}</span>`);
  if (personal.email)
    contactParts.push(
      `<a href="mailto:${escapeHtml(personal.email)}">${escapeHtml(personal.email)}</a>`
    );
  if (personal.location) contactParts.push(`<span>${escapeHtml(personal.location)}</span>`);
  if (personal.linkedIn) {
    const url = personal.linkedIn.startsWith("http")
      ? personal.linkedIn
      : `https://${personal.linkedIn}`;
    contactParts.push(`<a href="${escapeHtml(url)}" target="_blank">LinkedIn</a>`);
  }
  if (personal.github) {
    const url = personal.github.startsWith("http")
      ? personal.github
      : `https://${personal.github}`;
    contactParts.push(`<a href="${escapeHtml(url)}" target="_blank">GitHub</a>`);
  }
  if (personal.portfolio) {
    const url = personal.portfolio.startsWith("http")
      ? personal.portfolio
      : `https://${personal.portfolio}`;
    contactParts.push(`<a href="${escapeHtml(url)}" target="_blank">Portfolio</a>`);
  }

  const contactHtml = contactParts.join(` <span class="bullet-sep">•</span> `);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(personal.fullname || "Resume")}_Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Roboto+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: ${fontFamily};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 12px;
      line-height: 1.55;
    }

    .a4-page {
      width: 210mm;
      min-height: 297mm;
      max-width: 210mm;
      margin: 0 auto;
      padding: 8mm 16mm 14mm 16mm;
      background: #ffffff;
      overflow: hidden;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #020617;
    }

    .header h1 {
      font-size: 26px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 2px 0;
      color: #020617;
    }

    .header .title {
      font-size: 13px;
      font-style: italic;
      color: #334155;
      margin: 0 0 4px 0;
    }

    .header .contact {
      font-size: 11.5px;
      color: #1e293b;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 3px 8px;
    }

    .header .contact a {
      color: #0f172a;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .bullet-sep {
      color: #64748b;
      font-weight: bold;
    }

    /* Section Styling */
    .section {
      margin-bottom: 18px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 13.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #020617;
      border-bottom: 1.5px solid #020617;
      padding-bottom: 3px;
      margin: 0 0 10px 0;
    }

    .section-content {
      font-size: 12px;
      color: #1e293b;
    }

    /* Items */
    .item {
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .item:last-child {
      margin-bottom: 0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      font-size: 13px;
      color: #020617;
    }

    .item-subheader {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 12px;
      font-style: italic;
      color: #334155;
      margin-bottom: 3px;
    }

    .item-date {
      font-size: 11.5px;
      font-style: italic;
      font-weight: 500;
      color: #475569;
    }

    .item-links {
      font-size: 11.5px;
      font-weight: 500;
    }

    .item-links a {
      color: #0f172a;
      text-decoration: underline;
      margin-left: 8px;
    }

    /* Lists */
    ul.bullet-list {
      margin: 5px 0 0 0;
      padding-left: 18px;
      list-style-type: disc;
    }

    ul.bullet-list li {
      margin-bottom: 4px;
      font-size: 11.5px;
      line-height: 1.55;
      color: #1e293b;
      text-align: justify;
    }

    /* Skills */
    .skills-line {
      font-size: 12px;
      line-height: 1.6;
    }

    .skills-label {
      font-weight: 700;
      color: #020617;
    }

    p.summary-text {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      text-align: justify;
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="a4-page">
    <!-- Header -->
    <div class="header">
      <h1>${escapeHtml(personal.fullname || "YOUR NAME")}</h1>
      ${personal.professionalTitle ? `<div class="title">${escapeHtml(personal.professionalTitle)}</div>` : ""}
      ${contactHtml ? `<div class="contact">${contactHtml}</div>` : ""}
    </div>

    <!-- Summary -->
    ${
      summary
        ? `<div class="section">
            <div class="section-title">Summary</div>
            <p class="summary-text">${escapeHtml(summary)}</p>
          </div>`
        : ""
    }

    <!-- Technical Skills -->
    ${
      skills.length > 0
        ? `<div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-line">
              <span class="skills-label">Skills & Technologies: </span>
              ${escapeHtml(skills.join(", "))}
            </div>
          </div>`
        : ""
    }

    <!-- Work Experience -->
    ${
      workExperience.length > 0
        ? `<div class="section">
            <div class="section-title">Work Experience</div>
            ${workExperience
              .map((exp: any) => {
                const dates = [exp.startDate, exp.endDate || (exp.isCurrent ? "Present" : "")]
                  .filter(Boolean)
                  .join(" – ");
                const bullets = exp.description
                  ? exp.description
                      .split("\n")
                      .map((l: string) => l.replace(/^[-*•\s]+/, "").trim())
                      .filter(Boolean)
                  : [];

                return `
                <div class="item">
                  <div class="item-header">
                    <span>${escapeHtml(exp.position || "Position Title")}</span>
                    ${dates ? `<span class="item-date">${escapeHtml(dates)}</span>` : ""}
                  </div>
                  <div class="item-subheader">
                    <span>${escapeHtml(exp.company || "Company Name")}</span>
                    ${exp.location ? `<span>${escapeHtml(exp.location)}</span>` : ""}
                  </div>
                  ${
                    bullets.length > 0
                      ? `<ul class="bullet-list">
                          ${bullets.map((b: string) => `<li>${escapeHtml(b)}</li>`).join("")}
                        </ul>`
                      : exp.description
                      ? `<p class="summary-text">${escapeHtml(exp.description)}</p>`
                      : ""
                  }
                </div>`;
              })
              .join("")}
          </div>`
        : ""
    }

    <!-- Technical Projects -->
    ${
      projects.length > 0
        ? `<div class="section">
            <div class="section-title">Projects</div>
            ${projects
              .map((proj: any) => {
                const tech =
                  proj.techStack && proj.techStack.length > 0
                    ? ` | ${proj.techStack.join(", ")}`
                    : "";
                const bullets = proj.description
                  ? proj.description
                      .split("\n")
                      .map((l: string) => l.replace(/^[-*•\s]+/, "").trim())
                      .filter(Boolean)
                  : [];

                const links: string[] = [];
                if (proj.liveUrl) {
                  const url = proj.liveUrl.startsWith("http") ? proj.liveUrl : `https://${proj.liveUrl}`;
                  links.push(`<a href="${escapeHtml(url)}" target="_blank">Live Demo</a>`);
                }
                if (proj.githubUrl) {
                  const url = proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`;
                  links.push(`<a href="${escapeHtml(url)}" target="_blank">GitHub</a>`);
                }

                return `
                <div class="item">
                  <div class="item-header">
                    <span>
                      ${escapeHtml(proj.title || "Project Name")}
                      ${tech ? `<span style="font-weight: normal; font-style: italic; font-size: 11px;">${escapeHtml(tech)}</span>` : ""}
                    </span>
                    ${links.length > 0 ? `<span class="item-links">${links.join(" ")}</span>` : ""}
                  </div>
                  ${
                    bullets.length > 0
                      ? `<ul class="bullet-list">
                          ${bullets.map((b: string) => `<li>${escapeHtml(b)}</li>`).join("")}
                        </ul>`
                      : proj.description
                      ? `<p class="summary-text">${escapeHtml(proj.description)}</p>`
                      : ""
                  }
                </div>`;
              })
              .join("")}
          </div>`
        : ""
    }

    <!-- Education -->
    ${
      education.length > 0
        ? `<div class="section">
            <div class="section-title">Education</div>
            ${education
              .map((edu: any) => {
                const dates = [edu.startDate, edu.endDate || (edu.isCurrent ? "Present" : "")]
                  .filter(Boolean)
                  .join(" – ");
                const degreeField = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");

                return `
                <div class="item">
                  <div class="item-header">
                    <span>${escapeHtml(edu.institute || edu.institution || "University Name")}</span>
                    ${dates ? `<span class="item-date">${escapeHtml(dates)}</span>` : ""}
                  </div>
                  <div class="item-subheader">
                    <span>${escapeHtml(degreeField || "Degree")}</span>
                    ${edu.gpa ? `<span>GPA: ${escapeHtml(edu.gpa)}</span>` : ""}
                  </div>
                </div>`;
              })
              .join("")}
          </div>`
        : ""
    }

    <!-- Certifications -->
    ${
      certifications.length > 0
        ? `<div class="section">
            <div class="section-title">Certifications</div>
            ${certifications
              .map((cert: any) => {
                const name = typeof cert === "string" ? cert : cert.title || "Certification";
                const issuer = typeof cert !== "string" && cert.issuer ? ` – ${cert.issuer}` : "";
                const date = typeof cert !== "string" && cert.issueDate ? cert.issueDate : "";

                return `
                <div class="item" style="display: flex; justify-content: space-between; align-items: baseline;">
                  <div class="item-header" style="width: 100%;">
                    <span>
                      ${escapeHtml(name)}
                      ${issuer ? `<span style="font-weight: normal; font-style: italic; font-size: 11.5px;">${escapeHtml(issuer)}</span>` : ""}
                    </span>
                    ${date ? `<span class="item-date">${escapeHtml(date)}</span>` : ""}
                  </div>
                </div>`;
              })
              .join("")}
          </div>`
        : ""
    }
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
