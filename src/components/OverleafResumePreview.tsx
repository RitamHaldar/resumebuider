"use client";

import React, { useRef, useState } from "react";
import {
  Download,
  Printer,
  Edit3,
  Check,
  ArrowLeft,
  Sparkles,
  Share2,
  Palette,
  Loader2,
} from "lucide-react";
import { IResume } from "@/types/resume.types";
import ResumeTopBar from "./ResumeTopBar";

interface OverleafResumePreviewProps {
  resumeData: Partial<IResume> | any;
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onEditSection?: (stepIndex: number) => void;
  onBackToEditor?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
}

export default function OverleafResumePreview({
  resumeData,
  currentStep = 8,
  totalSteps = 8,
  completionPercentage = 100,
  onEditSection,
  onBackToEditor,
  onSaveAndExit,
  onStepClick,
}: OverleafResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [activeFont, setActiveFont] = useState<"serif" | "sans" | "mono">("serif");
  const [copied, setCopied] = useState(false);

  const personal = resumeData.personalInfo || {};
  const summary = resumeData.summary || "";
  const skills = resumeData.skills || [];
  const workExperience = resumeData.workExperience || [];
  const projects = resumeData.projects || [];
  const education = resumeData.education || [];
  const certifications = resumeData.certifications || [];

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      // @ts-ignore
      const html2pdf = (await import("html2pdf.js")).default;
      const element = resumeRef.current;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${(personal.fullname || "Resume").replace(/\s+/g, "_")}_Overleaf.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt as any).from(element).save();
    } catch (err) {
      console.error("PDF generation failed, falling back to print dialog:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontClass =
    activeFont === "serif"
      ? "font-serif text-slate-900"
      : activeFont === "sans"
      ? "font-sans text-slate-900"
      : "font-mono text-slate-900";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans relative pt-16 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar for Resume Builder */}
      <div className="print:hidden">
        <ResumeTopBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          completionPercentage={completionPercentage}
          onSaveAndExit={onSaveAndExit}
          onStepClick={onStepClick}
        />
      </div>

      {/* Main Preview Container */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Customization & Action Panel */}
        <div className="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Overleaf Academic Style</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Resume Ready</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your resume has been formatted into the clean, ATS-optimized Overleaf LaTeX layout.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  Share Link
                </>
              )}
            </button>
          </div>

          {/* Typography Customization */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Typography Style</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveFont("serif")}
                className={`py-2 px-3 rounded-lg text-xs font-serif border transition cursor-pointer ${
                  activeFont === "serif"
                    ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                LaTeX Serif
              </button>
              <button
                type="button"
                onClick={() => setActiveFont("sans")}
                className={`py-2 px-3 rounded-lg text-xs font-sans border transition cursor-pointer ${
                  activeFont === "sans"
                    ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                Modern Sans
              </button>
              <button
                type="button"
                onClick={() => setActiveFont("mono")}
                className={`py-2 px-3 rounded-lg text-xs font-mono border transition cursor-pointer ${
                  activeFont === "mono"
                    ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                Technical
              </button>
            </div>
          </div>

          {/* Quick Edit Sections */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Jump to Edit
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(1)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Personal
              </button>
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(2)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Summary
              </button>
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(3)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Skills
              </button>
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(4)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Experience
              </button>
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(5)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Projects
              </button>
              <button
                type="button"
                onClick={() => onEditSection && onEditSection(6)}
                className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-left transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-400" /> Education
              </button>
            </div>
          </div>

          {/* Back Button */}
          {onBackToEditor && (
            <button
              type="button"
              onClick={onBackToEditor}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Form Steps
            </button>
          )}
        </div>

        {/* Right Side: Authentic Overleaf LaTeX Resume Sheet */}
        <div className="flex-1 w-full flex justify-center overflow-x-auto pb-12">
          <div
            ref={resumeRef}
            id="overleaf-resume-document"
            className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[15mm] sm:p-[20mm] shadow-xl border border-slate-200 rounded-xs transition-all duration-200 print:shadow-none print:border-none print:w-full print:p-0 ${fontClass}`}
            style={{
              fontFamily:
                activeFont === "serif"
                  ? '"Computer Modern", "Latin Modern Math", "TeX Gyre Termes", "Times New Roman", Garamond, Georgia, serif'
                  : activeFont === "mono"
                  ? '"Courier New", Courier, monospace'
                  : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {/* Header Section */}
            <div className="text-center mb-5 pb-3 border-b-2 border-slate-900">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-950 mb-1">
                {personal.fullname || "JOHN DOE"}
              </h1>
              {personal.professionalTitle && (
                <p className="text-xs sm:text-sm italic font-medium text-slate-700 mb-2">
                  {personal.professionalTitle}
                </p>
              )}

              {/* Contact Information Row */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-slate-800">
                {personal.mobile && (
                  <span>{personal.mobile}</span>
                )}
                {personal.mobile && personal.email && <span>•</span>}
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="hover:underline">
                    {personal.email}
                  </a>
                )}
                {(personal.mobile || personal.email) && personal.location && <span>•</span>}
                {personal.location && <span>{personal.location}</span>}
                {(personal.email || personal.location) && personal.linkedIn && <span>•</span>}
                {personal.linkedIn && (
                  <a
                    href={
                      personal.linkedIn.startsWith("http")
                        ? personal.linkedIn
                        : `https://${personal.linkedIn}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                  >
                    LinkedIn
                  </a>
                )}
                {personal.github && <span>•</span>}
                {personal.github && (
                  <a
                    href={
                      personal.github.startsWith("http")
                        ? personal.github
                        : `https://${personal.github}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                  >
                    GitHub
                  </a>
                )}
                {personal.portfolio && <span>•</span>}
                {personal.portfolio && (
                  <a
                    href={
                      personal.portfolio.startsWith("http")
                        ? personal.portfolio
                        : `https://${personal.portfolio}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium text-slate-900"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* Professional Summary Section */}
            {summary && (
              <div className="mb-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-1.5">
                  SUMMARY
                </h2>
                <p className="text-[11px] leading-relaxed text-slate-800 text-justify">
                  {summary}
                </p>
              </div>
            )}

            {/* Technical Skills Section */}
            {skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-1.5">
                  TECHNICAL SKILLS
                </h2>
                <div className="text-[11px] leading-snug text-slate-800">
                  <span className="font-bold text-slate-950">Skills & Technologies: </span>
                  {skills.join(", ")}
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {workExperience.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2">
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-3">
                  {workExperience.map((exp: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-[11.5px]">
                        <span className="font-bold text-slate-950">
                          {exp.position || "Position Title"}
                        </span>
                        <span className="text-[10.5px] italic text-slate-700 font-medium">
                          {[exp.startDate, exp.endDate || (exp.isCurrent ? "Present" : "")]
                            .filter(Boolean)
                            .join(" – ")}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] italic text-slate-800 mb-1">
                        <span>{exp.company || "Company Name"}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      {exp.description && (
                        <div className="text-[11px] leading-relaxed text-slate-800 pl-3">
                          {exp.description.includes("\n") ? (
                            <ul className="list-disc space-y-0.5">
                              {exp.description
                                .split("\n")
                                .map((line: string) => line.replace(/^[-*•\s]+/, "").trim())
                                .filter(Boolean)
                                .map((bullet: string, i: number) => (
                                  <li key={i}>{bullet}</li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-justify">{exp.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2">
                  PROJECTS
                </h2>
                <div className="space-y-3">
                  {projects.map((proj: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-[11.5px]">
                        <span className="font-bold text-slate-950">
                          {proj.title || "Project Name"}
                          {proj.techStack && proj.techStack.length > 0 && (
                            <span className="font-normal italic text-[10.5px] text-slate-700 ml-1.5">
                              | {proj.techStack.join(", ")}
                            </span>
                          )}
                        </span>
                        <div className="text-[10.5px] text-slate-700 flex gap-2">
                          {proj.liveUrl && (
                            <a
                              href={
                                proj.liveUrl.startsWith("http")
                                  ? proj.liveUrl
                                  : `https://${proj.liveUrl}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline font-medium"
                            >
                              Live Demo
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={
                                proj.githubUrl.startsWith("http")
                                  ? proj.githubUrl
                                  : `https://${proj.githubUrl}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline font-medium"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                      {proj.description && (
                        <div className="text-[11px] leading-relaxed text-slate-800 pl-3">
                          {proj.description.includes("\n") ? (
                            <ul className="list-disc space-y-0.5">
                              {proj.description
                                .split("\n")
                                .map((line: string) => line.replace(/^[-*•\s]+/, "").trim())
                                .filter(Boolean)
                                .map((bullet: string, i: number) => (
                                  <li key={i}>{bullet}</li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-justify">{proj.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2">
                  EDUCATION
                </h2>
                <div className="space-y-2">
                  {education.map((edu: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-[11.5px]">
                        <span className="font-bold text-slate-950">
                          {edu.institution || edu.institute || "University Name"}
                        </span>
                        <span className="text-[10.5px] italic text-slate-700 font-medium">
                          {[edu.startDate, edu.endDate || (edu.isCurrent ? "Present" : "")]
                            .filter(Boolean)
                            .join(" – ")}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] italic text-slate-800">
                        <span>
                          {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                        </span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2">
                  CERTIFICATIONS
                </h2>
                <div className="space-y-1.5">
                  {certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-baseline text-[11px]">
                      <span className="font-bold text-slate-950">
                        {typeof cert === "string" ? cert : cert.title || "Certification Name"}
                        {typeof cert !== "string" && cert.issuer && (
                          <span className="font-normal italic text-slate-700 ml-1">
                            – {cert.issuer}
                          </span>
                        )}
                      </span>
                      {typeof cert !== "string" && cert.issueDate && (
                        <span className="text-[10.5px] italic text-slate-700">
                          {cert.issueDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
