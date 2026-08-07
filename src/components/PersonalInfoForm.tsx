"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Check,
  FileText,
  LogOut,
  User,
  Briefcase,
  Mail,
  Phone,
  Building2,
  Globe,
  Lightbulb,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { IPersonalInfo } from "@/types/resume.types";
import ResumeTopBar from "./ResumeTopBar";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
);

export interface PersonalInfoFormData extends IPersonalInfo {
  professionalTitle?: string;
  city?: string;
  country?: string;
}

interface PersonalInfoFormProps {
  initialData?: Partial<PersonalInfoFormData>;
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onSave?: (data: PersonalInfoFormData) => void;
  onNext?: (data: PersonalInfoFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
}

export default function PersonalInfoForm({
  initialData,
  currentStep = 1,
  totalSteps = 8,
  completionPercentage = 12,
  onSave,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
}: PersonalInfoFormProps) {
  const locationParts = (initialData?.location || "").split(", ");
  const initialCity = initialData?.city || locationParts[0] || "";
  const initialCountry = initialData?.country || locationParts[1] || "";

  const [formData, setFormData] = useState<PersonalInfoFormData>({
    fullname: initialData?.fullname || "",
    email: initialData?.email || "",
    mobile: initialData?.mobile || "",
    location: initialData?.location || "",
    github: initialData?.github || "",
    linkedIn: initialData?.linkedIn || "",
    portfolio: initialData?.portfolio || "",
    professionalTitle: initialData?.professionalTitle || "",
    city: initialCity,
    country: initialCountry,
  });

  useEffect(() => {
    if (initialData) {
      const locParts = (initialData.location || "").split(", ");
      const cCity = initialData.city || locParts[0] || "";
      const cCountry = initialData.country || locParts[1] || "";
      setFormData({
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        mobile: initialData.mobile || "",
        location: initialData.location || "",
        github: initialData.github || "",
        linkedIn: initialData.linkedIn || "",
        portfolio: initialData.portfolio || "",
        professionalTitle: initialData.professionalTitle || "",
        city: cCity,
        country: cCountry,
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cityVal = formData.city || "";
    let countryVal = formData.country || "";

    if (name === "city") cityVal = value;
    if (name === "country") countryVal = value;

    const locationStr = [cityVal, countryVal].filter(Boolean).join(", ");

    const updated: PersonalInfoFormData = {
      ...formData,
      [name]: value,
      ...(name === "city" || name === "country" ? { location: locationStr } : {}),
    };

    setFormData(updated);
    if (onSave) {
      onSave(updated);
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

      <main className="max-w-3xl w-full mx-auto px-4 py-4 flex-1">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-100/80 mb-4">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Let's get to know you
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Start by providing your basic contact details. This is the first thing recruiters will see.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="professionalTitle" className="block text-xs font-semibold text-slate-700 mb-1">
                Professional Title
              </label>
              <div className="relative flex items-center">
                <Briefcase className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="professionalTitle"
                  name="professionalTitle"
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-slate-700 mb-1">
                  Country
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  ONLINE PRESENCE
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="linkedIn" className="block text-xs font-semibold text-slate-700 mb-1">
                    LinkedIn URL
                  </label>
                  <div className="relative flex items-center">
                    <LinkedinIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="github" className="block text-xs font-semibold text-slate-700 mb-1">
                    GitHub Profile
                  </label>
                  <div className="relative flex items-center">
                    <GithubIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolio" className="block text-xs font-semibold text-slate-700 mb-1">
                    Portfolio / Website
                  </label>
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
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
