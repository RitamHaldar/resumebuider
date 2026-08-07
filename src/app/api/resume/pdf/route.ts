import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderResumeHtml } from "@/utils/resume/renderResumeHtml";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData, options } = body || {};

    if (!resumeData) {
      return NextResponse.json({ success: false, message: "No resume data provided" }, { status: 400 });
    }

    const htmlContent = renderResumeHtml(resumeData, options || {});

    // Launch Puppeteer headless browser to generate true vector A4 PDF with selectable text
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=medium"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" as any });

    // Ensure fonts are loaded
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    await browser.close();

    const fullName = resumeData.personalInfo?.fullname || "Resume";
    const filename = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Puppeteer PDF generation error:", error);
    return NextResponse.json(
      { success: false, message: "PDF generation failed", error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
