"use client";

import React, { useState, ChangeEvent } from "react";
import {
  GraduationCap,
  Building2,
  Calendar,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";
import { IEducation } from "@/types/resume.types";

export interface EducationFormData {
  education: IEducation[];
}

interface EducationFormProps {
  initialEducation?: IEducation[];
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: EducationFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
}

const DEFAULT_EDUCATION: IEducation = {
  institute: "Stanford University",
  degree: "B.S. in Computer Science",
  startDate: "Sep 2018",
  endDate: "Jun 2022",
};

export default function EducationForm({
  initialEducation = [DEFAULT_EDUCATION],
  currentStep = 6,
  totalSteps = 8,
  completionPercentage = 75,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
}: EducationFormProps) {
  const [educationList, setEducationList] = useState<IEducation[]>(
    initialEducation.length > 0 ? initialEducation : [DEFAULT_EDUCATION]
  );
  const [activeEduIndex, setActiveEduIndex] = useState<number>(0);
  const [collapsedEdu, setCollapsedEdu] = useState<{ [key: number]: boolean }>({});

  const handleEduChange = (
    index: number,
    field: keyof IEducation,
    value: string
  ) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCurrentlyStudyingToggle = (index: number, checked: boolean) => {
    handleEduChange(index, "endDate", checked ? "Present" : "");
  };

  const handleAddEducation = () => {
    const newEdu: IEducation = {
      institute: "",
      degree: "",
      startDate: "",
      endDate: "",
    };

    setCollapsedEdu((prev) => {
      const updated = { ...prev };
      educationList.forEach((_, idx) => {
        updated[idx] = true;
      });
      return updated;
    });

    setEducationList((prev) => [...prev, newEdu]);
    setActiveEduIndex(educationList.length);
  };

  const handleRemoveEducation = (index: number) => {
    if (educationList.length === 1) {
      setEducationList([
        {
          institute: "",
          degree: "",
          startDate: "",
          endDate: "",
        },
      ]);
      return;
    }
    setEducationList((prev) => prev.filter((_, i) => i !== index));
    if (activeEduIndex >= educationList.length - 1) {
      setActiveEduIndex(Math.max(0, educationList.length - 2));
    }
  };

  const toggleCollapse = (index: number) => {
    setCollapsedEdu((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ education: educationList });
    }
  };

  const activeEdu = educationList[activeEduIndex] || educationList[0] || DEFAULT_EDUCATION;

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
            Add your educational background
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Detail your degrees, diplomas, or academic institutions attended to showcase your foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {educationList.map((edu, index) => {
              const isCollapsed = collapsedEdu[index];
              const isCurrentlyStudying = edu.endDate?.toLowerCase() === "present";

              return (
                <div
                  key={index}
                  onClick={() => setActiveEduIndex(index)}
                  className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
                    activeEduIndex === index
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
                        {edu.degree && edu.institute
                          ? `${edu.degree} - ${edu.institute}`
                          : edu.degree || edu.institute || `Education ${index + 1}`}
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
                          handleRemoveEducation(index);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Delete entry"
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
                            htmlFor={`degree-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Degree / Field of Study <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <GraduationCap className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`degree-${index}`}
                              value={edu.degree}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleEduChange(index, "degree", e.target.value)
                              }
                              placeholder="e.g. B.Tech in Computer Science"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`institute-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            School / College / University <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`institute-${index}`}
                              value={edu.institute}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleEduChange(index, "institute", e.target.value)
                              }
                              placeholder="e.g. Stanford University"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`edu-startDate-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Start Date
                          </label>
                          <div className="relative flex items-center">
                            <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`edu-startDate-${index}`}
                              value={edu.startDate}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleEduChange(index, "startDate", e.target.value)
                              }
                              placeholder="e.g. Sep 2018"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor={`edu-endDate-${index}`}
                            className="block text-xs font-semibold text-slate-700 mb-1.5"
                          >
                            Completion Date / End Date
                          </label>
                          <div className="relative flex items-center">
                            <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              id={`edu-endDate-${index}`}
                              value={edu.endDate}
                              disabled={isCurrentlyStudying}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleEduChange(index, "endDate", e.target.value)
                              }
                              placeholder="e.g. Jun 2022"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-75 disabled:bg-slate-100"
                            />
                          </div>
                          <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isCurrentlyStudying}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleCurrentlyStudyingToggle(index, e.target.checked)
                              }
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-600 font-medium">
                              I am currently studying here
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddEducation}
              className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-3xl p-6 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition">
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 stroke-[3]" />
              </div>
              Add Another Education
            </button>
          </div>

          <div>
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  OVERLEAF LIVE PREVIEW
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-5 font-serif text-slate-900 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Education Section
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-3">
                  {educationList.map((edu, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif font-bold text-xs text-slate-900">
                          {edu.degree || "Degree Title"}
                        </h4>
                        <span className="font-serif italic text-[11px] text-slate-500">
                          {edu.startDate || "Start"} - {edu.endDate || "End"}
                        </span>
                      </div>
                      <div className="font-serif text-[11px] text-slate-600">
                        {edu.institute || "University / College"}
                      </div>
                    </div>
                  ))}
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
