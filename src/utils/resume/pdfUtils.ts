import { IResume } from "@/types/resume.types";
import { renderResumeHtml } from "./renderResumeHtml";

export interface PDFOptions {
  activeFont?: "serif" | "sans" | "mono";
  filename?: string;
}

/**
 * Downloads high-fidelity A4 vector PDF with real selectable text, active links,
 * and zero rasterization using Puppeteer server endpoint with clean browser print fallback.
 */
export async function downloadResumeAsPDF(
  resumeData: Partial<IResume> | Record<string, any>,
  options: PDFOptions = {}
): Promise<void> {
  const fullName = resumeData.personalInfo?.fullname || "Resume";
  const defaultFilename = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
  const filename = options.filename || defaultFilename;

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

    if (!response.ok) {
      throw new Error(`PDF API error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  } catch (err) {
    console.warn("Server PDF generation fallback triggered:", err);

    // Fallback: Client-side true print-to-PDF via invisible iframe
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
