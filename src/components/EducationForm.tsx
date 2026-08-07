import React, { useState, useEffect, ChangeEvent } from "react";
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

const EMPTY_EDUCATION: IEducation = {
  institute: "",
  degree: "",
  startDate: "",
  endDate: "",
};

export default function EducationForm({
  initialEducation = [],
  currentStep = 6,
  totalSteps = 8,
  completionPercentage = 75,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
}: EducationFormProps) {
  const [educationList, setEducationList] = useState<IEducation[]>(
    initialEducation.length > 0 ? initialEducation : [EMPTY_EDUCATION]
  );
  const [activeEduIndex, setActiveEduIndex] = useState<number>(0);
  const [collapsedEdu, setCollapsedEdu] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (initialEducation && initialEducation.length > 0) {
      setEducationList(initialEducation);
    } else if (!initialEducation || initialEducation.length === 0) {
      setEducationList([EMPTY_EDUCATION]);
    }
  }, [initialEducation]);

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
      setEducationList([EMPTY_EDUCATION]);
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

  const activeEdu = educationList[activeEduIndex] || educationList[0] || EMPTY_EDUCATION;

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
            Add your educational background
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Detail your degrees, diplomas, or academic institutions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100/80 mb-4 space-y-4">
          {educationList.map((edu, index) => {
            const isCollapsed = collapsedEdu[index];
            const isCurrentlyStudying = edu.endDate?.toLowerCase() === "present";

            return (
              <div
                key={index}
                onClick={() => setActiveEduIndex(index)}
                className={`bg-slate-50/40 rounded-xl p-4 border transition-all ${
                  activeEduIndex === index
                    ? "border-l-4 border-l-indigo-600 border-slate-200 shadow-2xs"
                    : "border-slate-100/90 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {edu.degree && edu.institute
                        ? `${edu.degree} - ${edu.institute}`
                        : edu.degree || edu.institute || `Education ${index + 1}`}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(index);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
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
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`degree-${index}`}
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Degree / Field of Study <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <GraduationCap className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            id={`degree-${index}`}
                            value={edu.degree}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleEduChange(index, "degree", e.target.value)
                            }
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`institute-${index}`}
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          School / College / University <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Building2 className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            id={`institute-${index}`}
                            value={edu.institute}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleEduChange(index, "institute", e.target.value)
                            }
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`edu-startDate-${index}`}
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Start Date
                        </label>
                        <div className="relative flex items-center">
                          <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            id={`edu-startDate-${index}`}
                            value={edu.startDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleEduChange(index, "startDate", e.target.value)
                            }
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`edu-endDate-${index}`}
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Completion Date / End Date
                        </label>
                        <div className="relative flex items-center">
                          <Calendar className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            id={`edu-endDate-${index}`}
                            value={edu.endDate}
                            disabled={isCurrentlyStudying}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleEduChange(index, "endDate", e.target.value)
                            }
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-75 disabled:bg-slate-100"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isCurrentlyStudying}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleCurrentlyStudyingToggle(index, e.target.checked)
                            }
                            className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
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
            className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-xl p-2.5 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-xs transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition">
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-indigo-600 stroke-[3]" />
            </div>
            Add Another Education
          </button>
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
