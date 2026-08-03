"use client";

import React from "react";
import { FileText, LogOut, Check } from "lucide-react";

export interface ResumeTopBarProps {
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS: { [key: number]: string } = {
  1: "Personal Info",
  2: "Summary",
  3: "Skills",
  4: "Work Experience",
  5: "Projects",
  6: "Education",
  7: "Certifications",
  8: "Review & Finish",
};

export default function ResumeTopBar({
  currentStep = 1,
  totalSteps = 8,
  completionPercentage = 12,
  onSaveAndExit,
  onStepClick,
}: ResumeTopBarProps) {
  const stepsToShow = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <header className="fixed top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 sm:px-10 py-3.5 flex items-center justify-between z-50 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Resume<span className="text-indigo-600">Elite</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onSaveAndExit}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-lg hover:bg-slate-100/80 cursor-pointer"
        >
          Save & Exit
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </header>

      <div className="max-w-5xl w-full mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center flex-1 max-w-2xl mx-auto py-1">
            {stepsToShow.map((step, index) => {
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              const label = STEP_LABELS[step] || `Step ${step}`;

              return (
                <React.Fragment key={step}>
                  <button
                    type="button"
                    onClick={() => onStepClick?.(step)}
                    disabled={!onStepClick}
                    title={`${step}. ${label}`}
                    className={`group relative flex items-center justify-center shrink-0 ${
                      onStepClick ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 transition-all hover:scale-110">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 ring-4 ring-indigo-100 transition-all scale-105">
                        {step}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all hover:bg-slate-200/80 hover:text-slate-600">
                        {step}
                      </div>
                    )}

                    <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50">
                      <span className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
                        {label}
                      </span>
                      <span className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1" />
                    </div>
                  </button>

                  {index < stepsToShow.length - 1 && (
                    <div
                      className={`flex-1 min-w-[6px] max-w-[36px] h-1 rounded-full mx-1 transition-all ${
                        step < currentStep
                          ? "bg-indigo-600"
                          : step === currentStep
                          ? "bg-indigo-100"
                          : "bg-slate-200/80"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="text-right shrink-0">
            <div className="text-[11px] sm:text-xs font-bold tracking-wider text-indigo-600 uppercase">
              STEP {currentStep} OF {totalSteps}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {completionPercentage}% Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
