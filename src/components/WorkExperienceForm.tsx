"use client";

import React, { useState, ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";
import { IWorkExperience } from "@/types/resume.types";
import { generateExperienceDescription } from "@/apis/ai.api";

export interface WorkExperienceFormData {
  workExperience: IWorkExperience[];
}

interface WorkExperienceFormProps {
  initialWorkExperience?: IWorkExperience[];
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: WorkExperienceFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
  onGenerateAIDescription?: (experience: IWorkExperience) => Promise<string> | void;
}

const DEFAULT_EXPERIENCE: IWorkExperience = {
  company: "Acme Technologies Inc.",
  position: "Senior Full Stack Developer",
  startDate: "Jan 2022",
  endDate: "Present",
  description:
    "• Architected and deployed microservices handling 2M+ monthly active requests with 99.99% uptime.\n• Spearheaded frontend migration to Next.js & React 19, improving page load speeds by 42%.\n• Mentored 5 junior engineers and established automated CI/CD code review workflows.",
};

export default function WorkExperienceForm({
  initialWorkExperience = [DEFAULT_EXPERIENCE],
  currentStep = 4,
  totalSteps = 8,
  completionPercentage = 50,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
  onGenerateAIDescription,
}: WorkExperienceFormProps) {
  const [experiences, setExperiences] = useState<IWorkExperience[]>(
    initialWorkExperience.length > 0 ? initialWorkExperience : [DEFAULT_EXPERIENCE]
  );
  const [activeExpIndex, setActiveExpIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [collapsedExp, setCollapsedExp] = useState<{ [key: number]: boolean }>({});

  const handleExpChange = (
    index: number,
    field: keyof IWorkExperience,
    value: any
  ) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCurrentlyWorkingToggle = (index: number, checked: boolean) => {
    handleExpChange(index, "endDate", checked ? "Present" : "");
  };

  const handleAddExperience = () => {
    const newExp: IWorkExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    setCollapsedExp((prev) => {
      const updated = { ...prev };
      experiences.forEach((_, idx) => {
        updated[idx] = true;
      });
      return updated;
    });

    setExperiences((prev) => [...prev, newExp]);
    setActiveExpIndex(experiences.length);
  };

  const handleRemoveExperience = (index: number) => {
    if (experiences.length === 1) {
      setExperiences([
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ]);
      return;
    }
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    if (activeExpIndex >= experiences.length - 1) {
      setActiveExpIndex(Math.max(0, experiences.length - 2));
    }
  };

  const toggleCollapse = (index: number) => {
    setCollapsedExp((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAIGenerate = async (index: number) => {
    setIsGenerating(true);
    const exp = experiences[index];
    try {
      if (onGenerateAIDescription) {
        const res = await onGenerateAIDescription(exp);
        if (res) {
          handleExpChange(index, "description", res);
        }
      } else {
        const apiRes = await generateExperienceDescription({
          jobRole: exp.position || "Developer",
          yearsOfExperience: 3,
          experienceLevel: "Mid-Level",
        });
        const desc =
          apiRes?.body?.workExperienceDescription ||
          apiRes?.body?.description ||
          (typeof apiRes?.body === "string" ? apiRes.body : apiRes?.workExperienceDescription || apiRes?.description) ||
          `• Spearheaded engineering developments at ${exp.company || "company"} as ${exp.position || "developer"}.\n• Enhanced performance and team efficiency.`;
        handleExpChange(index, "description", desc);
      }
    } catch (err) {
      console.error("AI Experience description generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ workExperience: experiences });
    }
  };

  const activeExp = experiences[activeExpIndex] || experiences[0] || DEFAULT_EXPERIENCE;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-slate-50 text-slate-800 flex flex-col justify-between font-sans relative pt-16">
      <ResumeTopBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        completionPercentage={completionPercentage}
        onSaveAndExit={onSaveAndExit}
        onStepClick={onStepClick}
      />

      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Highlight your work experience
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Detail your employment history, key responsibilities, and major achievements for recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {experiences.map((exp, index) => {
              const isCollapsed = collapsedExp[index];
              const isCurrentlyWorking = exp.endDate?.toLowerCase() === "present";

              return (
                <div
                  key={index}
                  onClick={() => setActiveExpIndex(index)}
                  className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
                    activeExpIndex === index
                      ? "border-l-4 border-l-indigo-600 border-slate-200 shadow-md ring-1 ring-indigo-50"
                      : "border-slate-100/90 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {exp.position && exp.company
                          ? `${exp.position} at ${exp.company}`
                          : exp.position || exp.company || `Work Experience ${index + 1}`}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCollapse(index);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title={isCollapsed ? "Expand" : "Collapse"}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExperience(index);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`position-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Job Title / Role <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`position-${index}`}
                              value={exp.position}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleExpChange(index, "position", e.target.value)
                              }
                              placeholder="e.g. Senior Full Stack Developer"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`company-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Company / Organization <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`company-${index}`}
                              value={exp.company}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleExpChange(index, "company", e.target.value)
                              }
                              placeholder="e.g. Acme Technologies Inc."
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`startDate-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Start Date
                          </label>
                          <div className="relative flex items-center">
                            <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`startDate-${index}`}
                              value={exp.startDate}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleExpChange(index, "startDate", e.target.value)
                              }
                              placeholder="e.g. Jan 2022"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`endDate-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            End Date
                          </label>
                          <div className="relative flex items-center">
                            <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`endDate-${index}`}
                              value={exp.endDate}
                              disabled={isCurrentlyWorking}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleExpChange(index, "endDate", e.target.value)
                              }
                              placeholder="e.g. Present or Dec 2024"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-75 disabled:bg-slate-100"
                            />
                          </div>
                          <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCurrentlyWorking}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleCurrentlyWorkingToggle(index, e.target.checked)
                              }
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-600 font-medium">
                              I currently work in this role
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor={`description-${index}`}
                            className="block text-xs font-semibold text-slate-700"
                          >
                            Key Achievements & Responsibilities
                          </label>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {(exp.description || "").length} / 1000 characters
                          </span>
                        </div>

                        <textarea
                          id={`description-${index}`}
                          rows={5}
                          maxLength={1000}
                          value={exp.description}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            handleExpChange(index, "description", e.target.value)
                          }
                          placeholder="• Architected and deployed microservices handling 2M+ monthly active requests.&#10;• Improved site loading speed by 40% through code splitting and asset optimization."
                          className="w-full p-4 bg-slate-50/40 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y font-mono leading-relaxed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddExperience}
              className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-3xl p-6 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition">
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 stroke-[3]" />
              </div>
              Add Another Experience
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Work Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Let AI generate high-impact bullet points with quantifiable metrics tailored to your role.
              </p>

              <button
                type="button"
                onClick={() => handleAIGenerate(activeExpIndex)}
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
                    Generate Description with AI
                  </>
                )}
              </button>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  OVERLEAF LIVE PREVIEW
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-5 font-serif text-slate-900 text-xs leading-relaxed space-y-2">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-serif font-bold text-sm text-slate-900 tracking-wide">
                    {activeExp.position || "Job Position"}
                    {activeExp.company && <span className="font-normal text-slate-600"> — {activeExp.company}</span>}
                  </h4>
                </div>

                {(activeExp.startDate || activeExp.endDate) && (
                  <div className="font-serif italic text-[11px] text-slate-500">
                    {activeExp.startDate || "Start Date"} – {activeExp.endDate || "End Date"}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/60 mt-2">
                  {activeExp.description ? (
                    <div className="prose prose-xs max-w-none text-slate-800 font-serif text-xs leading-relaxed">
                      <ReactMarkdown>{activeExp.description}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Work experience details will render live here...
                    </p>
                  )}
                </div>
              </div>
            </div>
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
