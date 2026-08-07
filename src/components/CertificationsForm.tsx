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
  initialCertifications = [],
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
    if (initialCertifications) {
      setCertifications(initialCertifications);
    }
  }, [initialCertifications]);

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
            Certifications & Credentials
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            List course certificates or industry credentials that validate your expertise.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100/80 mb-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Industry Certifications
            </h2>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {certifications.length} certificates added
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl">
              {certifications.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No certifications added yet. Click "+ Add Certification" below to add certificates.
                </p>
              ) : (
                certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/90 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200/70 shadow-2xs hover:bg-indigo-100/80 transition group"
                  >
                    <Award className="w-3 h-3 text-indigo-500" />
                    {cert}
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert)}
                      className="text-indigo-400 hover:text-indigo-900 transition p-0.5 rounded-md hover:bg-indigo-200/60 cursor-pointer"
                      title={`Remove ${cert}`}
                    >
                      <X className="w-3 h-3" />
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm shadow-indigo-200 hover:shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  Add Certification
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50/70 border border-indigo-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition shadow-2xs"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => handleAddCert(searchQuery)}
                      className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-2 py-0.5 rounded transition cursor-pointer"
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSearchActive(false)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 max-h-44 overflow-y-auto">
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    {searchQuery ? "Matching Certification Presets" : "Popular Presets"}
                  </div>

                  {filteredSuggestions.length === 0 ? (
                    <div className="flex items-center justify-between py-1 text-xs text-slate-500">
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
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddCert(suggestion)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium rounded-md transition cursor-pointer shadow-2xs"
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
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm shadow-emerald-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Finish & Review Resume
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
