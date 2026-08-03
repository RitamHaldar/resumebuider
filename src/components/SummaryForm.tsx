"use client";

import React, { useState, ChangeEvent } from "react";
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
        setTimeout(() => {
          const role = formData.targetRole || "Software Engineer";
          const level = formData.experienceLevel || "Mid-Level";
          const ind = formData.industry || "Technology";
          const generatedDemo = `Results-driven ${role} with proven experience in ${ind}. Track record of scaling solutions and driving cross-functional project success using modern methodologies. Adept at bridging technical implementation with strategic objectives to achieve high-impact business outcomes.`;
          setFormData((prev) => ({ ...prev, summary: generatedDemo }));
          setIsGenerating(false);
        }, 1200);
        return;
      }
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-slate-50 text-slate-800 flex flex-col justify-between font-sans relative pt-16">
      <ResumeTopBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        completionPercentage={completionPercentage}
        onSaveAndExit={onSaveAndExit}
        onStepClick={onStepClick}
      />

      <main className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tell your professional story
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Summarize your expertise and the unique value you bring to your target role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
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
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Target Role
                  </label>
                  <input
                    type="text"
                    id="targetRole"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="Product Manager"
                    className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Preferred Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Technology / SaaS"
                    className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="summary-textarea"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Professional Summary
                  </label>

                  <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100/70 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() => handleFormatText("bold")}
                      className="p-1 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("italic")}
                      className="p-1 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("bullet")}
                      className="p-1 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
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
                    rows={7}
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Results-driven Product Manager with 4+ years of experience leading cross-functional teams to deliver scalable SaaS solutions. Proven track record of increasing user engagement by 35% through data-driven product strategies and agile methodologies. Adept at bridging the gap between engineering, design, and business stakeholders to align product vision with overarching company goals."
                    className="w-full p-4 bg-slate-50/40 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y leading-relaxed"
                  />

                  <div className="text-right mt-1.5 text-xs text-slate-400 font-medium">
                    {formData.summary.length} / {maxChars} characters
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Enhance your summary instantly based on your target role and industry trends.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="w-full bg-white hover:bg-slate-50/80 border border-indigo-100 text-indigo-600 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer transition disabled:opacity-60 active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100/80 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <CloudCheck className="w-4 h-4 text-slate-400" />
            Auto-saved
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
