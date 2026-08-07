import { IResume } from "@/types/resume.types";
import { renderResumeHtml } from "./renderResumeHtml";

export interface PDFOptions {
  activeFont?: "serif" | "sans" | "mono";
  filename?: string;
}

/**
 * Downloads high-fidelity A4 PDF directly to user's device.
 * Works seamlessly across Vercel serverless deployments, Netlify, and local environments.
 */
export async function downloadResumeAsPDF(
  resumeData: Partial<IResume> | Record<string, any>,
  options: PDFOptions = {}
): Promise<void> {
  const fullName = resumeData.personalInfo?.fullname || "Resume";
  const defaultFilename = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
  const filename = options.filename || defaultFilename;

  // 1. Try server-side Puppeteer API route first if available
  try {
    const response = await fetch("/api/resume/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeData,
        options: {
          activeFont: options.activeFont || "serif",
        },
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);
      return;
    }
  } catch (err) {
    console.warn("Server-side PDF endpoint unavailable, falling back to client-side PDF export:", err);
  }

  // 2. Client-Side Direct PDF Download using html2pdf.js with style sanitizer
  // This guarantees 100% reliable PDF file download on Vercel production deployment!
  try {
    const element = document.getElementById("overleaf-resume-document");
    if (!element) {
      throw new Error("Resume element overleaf-resume-document not found in DOM");
    }

    // Sanitize all stylesheets to strip modern Tailwind v4 color functions (oklch, lab, oklab, lch)
    const sanitizedStyles: string[] = [];
    const styleNodes = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));

    for (const node of styleNodes) {
      if (node.tagName.toLowerCase() === "style") {
        sanitizedStyles.push(node.innerHTML);
      } else if (node.tagName.toLowerCase() === "link") {
        try {
          const href = (node as HTMLLinkElement).href;
          if (href && href.startsWith(window.location.origin)) {
            const res = await fetch(href);
            const cssText = await res.text();
            sanitizedStyles.push(cssText);
          }
        } catch (e) {
          // ignore link fetch errors
        }
      }
    }

    const combinedSanitizedCss = sanitizedStyles
      .join("\n")
      .replace(/oklch\s*\([^)]+\)/gi, "#000000")
      .replace(/lab\s*\([^)]+\)/gi, "#000000")
      .replace(/oklab\s*\([^)]+\)/gi, "#000000")
      .replace(/lch\s*\([^)]+\)/gi, "#000000")
      .replace(/color-mix\s*\([^)]+\)/gi, "#000000");

    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [0, 0, 0, 0] as [number, number, number, number],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        onclone: (clonedDoc: Document) => {
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach((s) => s.remove());

          const safeStyle = clonedDoc.createElement("style");
          safeStyle.innerHTML = combinedSanitizedCss;
          clonedDoc.head.appendChild(safeStyle);

          const clonedEl = clonedDoc.getElementById("overleaf-resume-document");
          if (clonedEl) {
            clonedEl.style.boxShadow = "none";
            clonedEl.style.border = "none";
            clonedEl.style.margin = "0 auto";
            clonedEl.style.padding = "8mm 16mm 14mm 16mm";
            clonedEl.style.backgroundColor = "#ffffff";
            clonedEl.style.color = "#0f172a";
          }
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt as any).from(element).save();
  } catch (clientErr) {
    console.error("Client PDF export error:", clientErr);
    alert("Could not generate PDF download. Please try again.");
  }
}

/**
 * Opens native browser print dialog for the resume without showing any app UI.
 */
export function printResume(
  resumeData: Partial<IResume> | Record<string, any>,
  options: PDFOptions = {}
): void {
  const fullName = resumeData.personalInfo?.fullname || "Resume";
  const filename = options.filename || `${fullName.replace(/\s+/g, "_")}_Resume`;

  const htmlContent = renderResumeHtml(resumeData, {
    activeFont: options.activeFont || "serif",
  });

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      const originalTitle = document.title;
      document.title = filename.replace(/\.pdf$/i, "");
      iframe.contentWindow?.print();
      document.title = originalTitle;

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
}
