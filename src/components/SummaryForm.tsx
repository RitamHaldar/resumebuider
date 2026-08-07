"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Sparkles,
  Bold,
  Italic,
  List,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  RefreshCw,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";
import { generateSummary } from "@/apis/ai.api";

interface SummaryFormProps {
  initialSummary?: string;
  initialTargetRole?: string;
  initialExperienceLevel?: string;
  initialIndustry?: string;
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: SummaryFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
  onGenerateAI?: (promptData: { targetRole: string; experienceLevel: string; industry: string }) => Promise<string> | void;
}

export interface SummaryFormData {
  summary: string;
  targetRole: string;
  experienceLevel: string;
  industry: string;
}

export default function SummaryForm({
  initialSummary = "",
  initialTargetRole = "",
  initialExperienceLevel = "Mid-Level (3-5 years)",
  initialIndustry = "",
  currentStep = 2,
  totalSteps = 8,
  completionPercentage = 25,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
  onGenerateAI,
}: SummaryFormProps) {
  const [formData, setFormData] = useState<SummaryFormData>({
    summary: initialSummary,
    targetRole: initialTargetRole,
    experienceLevel: initialExperienceLevel,
    industry: initialIndustry,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      summary: initialSummary || "",
      targetRole: initialTargetRole || "",
      ...(initialExperienceLevel ? { experienceLevel: initialExperienceLevel } : {}),
      ...(initialIndustry ? { industry: initialIndustry } : {}),
    }));
  }, [initialSummary, initialTargetRole, initialExperienceLevel, initialIndustry]);

  const [isGenerating, setIsGenerating] = useState(false);
  const maxChars = 600;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "summary" && value.length > maxChars) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatText = (format: "bold" | "italic" | "bullet") => {
    const textarea = document.getElementById("summary-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.summary.substring(start, end);

    let replacement = "";
    if (format === "bold") {
      replacement = `**${selectedText || "bold text"}**`;
    } else if (format === "italic") {
      replacement = `*${selectedText || "italic text"}*`;
    } else if (format === "bullet") {
      replacement = `\n• ${selectedText || "bullet point"}`;
    }

    const newSummary =
      formData.summary.substring(0, start) +
      replacement +
      formData.summary.substring(end);

    if (newSummary.length <= maxChars) {
      setFormData((prev) => ({ ...prev, summary: newSummary }));
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      if (onGenerateAI) {
        const result = await onGenerateAI({
          targetRole: formData.targetRole,
          experienceLevel: formData.experienceLevel,
          industry: formData.industry,
        });
        if (result) {
          setFormData((prev) => ({ ...prev, summary: result }));
        }
      } else {
        const res = await generateSummary({
          experienceLevel: formData.experienceLevel || "Mid-Level",
          skills: [],
          jobTitle: formData.targetRole || "Software Engineer",
        });
        const summaryText =
          res?.body?.summary ||
          (typeof res?.body === "string" ? res.body : res?.summary) ||
          `Results-driven ${formData.targetRole || "professional"} with expertise in driving technical and product outcomes.`;
        setFormData((prev) => ({ ...prev, summary: summaryText }));
      }
    } catch (err) {
      console.error("AI Summary generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-slate-50 text-slate-800 flex flex-col justify-between font-sans relative pt-12">
      <ResumeTopBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        completionPercentage={completionPercentage}
        onSaveAndExit={onSaveAndExit}
        onStepClick={onStepClick}
      />

      <main className="max-w-4xl w-full mx-auto px-4 py-4 flex-1">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tell your professional story
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Summarize your expertise and the unique value you bring to your target role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100/80">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                  >
                    <option value="Entry-Level (0-2 years)">Entry-Level (0-2 years)</option>
                    <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                    <option value="Senior-Level (5+ years)">Senior-Level (5+ years)</option>
                    <option value="Executive (10+ years)">Executive (10+ years)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="targetRole"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Target Role
                  </label>
                  <input
                    type="text"
                    id="targetRole"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Preferred Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="summary-textarea"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Professional Summary
                  </label>

                  <div className="flex items-center gap-1 text-slate-500 bg-slate-100/70 rounded-md px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleFormatText("bold")}
                      className="p-0.5 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("italic")}
                      className="p-0.5 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("bullet")}
                      className="p-0.5 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                      title="Bullet list"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="summary-textarea"
                    name="summary"
                    rows={4}
                    value={formData.summary}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50/40 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y leading-relaxed"
                  />

                  <div className="text-right mt-1 text-[11px] text-slate-400 font-medium">
                    {formData.summary.length} / {maxChars} characters
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Enhance your summary instantly based on your target role and industry trends.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="w-full bg-white hover:bg-slate-50/80 border border-indigo-100 text-indigo-600 rounded-lg py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer transition disabled:opacity-60 active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
