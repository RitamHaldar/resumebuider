"use client";

import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  Award,
  Plus,
  X,
  Search,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  CheckCircle2,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";

const POPULAR_CERTIFICATIONS = [
  "AWS Certified Solutions Architect",
  "AWS Certified Developer - Associate",
  "Certified Kubernetes Administrator (CKA)",
  "Google Cloud Professional Cloud Architect",
  "Meta Frontend Developer Specialization",
  "Meta Backend Developer Specialization",
  "Certified ScrumMaster (CSM)",
  "Project Management Professional (PMP)",
  "Microsoft Certified: Azure Fundamentals",
  "Cisco Certified Network Associate (CCNA)",
  "CompTIA Security+",
  "MongoDB Certified Developer",
];

export interface CertificationsFormData {
  certifications: string[];
}

interface CertificationsFormProps {
  initialCertifications?: string[];
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: CertificationsFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
}

export default function CertificationsForm({
  initialCertifications = ["AWS Certified Solutions Architect", "Meta Frontend Developer Specialization"],
  currentStep = 7,
  totalSteps = 8,
  completionPercentage = 88,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
}: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<string[]>(initialCertifications);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleActivateSearch = () => {
    setIsSearchActive(true);
  };

  const handleAddCert = (certToAdd: string) => {
    const trimmed = certToAdd.trim();
    if (!trimmed) return;
    if (!certifications.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCertifications((prev) => [...prev, trimmed]);
    }
    setSearchQuery("");
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCertifications((prev) => prev.filter((c) => c !== certToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleAddCert(searchQuery);
      }
    } else if (e.key === "Escape") {
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ certifications });
    }
  };

  const filteredSuggestions = POPULAR_CERTIFICATIONS.filter(
    (cert) =>
      !certifications.some((c) => c.toLowerCase() === cert.toLowerCase()) &&
      cert.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Certifications & Credentials
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            List course certificates, professional accreditations, or industry credentials that validate your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Industry Certifications
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {certifications.length} certificates added
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 min-h-[50px] p-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl">
                {certifications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No certifications added yet. Click "+ Add Certification" below to add certificates.
                  </p>
                ) : (
                  certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50/90 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200/70 shadow-2xs hover:bg-indigo-100/80 transition group"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="text-indigo-400 hover:text-indigo-900 transition p-0.5 rounded-md hover:bg-indigo-200/60 cursor-pointer"
                        title={`Remove ${cert}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {!isSearchActive ? (
                <div>
                  <button
                    type="button"
                    onClick={handleActivateSearch}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Add Certification
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search or type a certification (e.g. AWS Certified Developer)..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-indigo-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition shadow-2xs"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => handleAddCert(searchQuery)}
                        className="absolute right-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsSearchActive(false)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 max-h-56 overflow-y-auto">
                    <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                      {searchQuery ? "Matching Certification Presets" : "Popular Presets"}
                    </div>

                    {filteredSuggestions.length === 0 ? (
                      <div className="flex items-center justify-between py-2 text-xs text-slate-500">
                        <span>Press <strong>Enter</strong> to add "<strong>{searchQuery}</strong>".</span>
                        <button
                          type="button"
                          onClick={() => handleAddCert(searchQuery)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          + Add Custom
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleAddCert(suggestion)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium rounded-lg transition cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                  Certifications Section
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  {certifications.length === 0 ? (
                    <p className="text-slate-400 italic text-[11px]">
                      Certifications will render live here...
                    </p>
                  ) : (
                    certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2 text-slate-800 text-xs font-serif">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))
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
            className="flex items-center gap-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            Finish & Review Resume
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
