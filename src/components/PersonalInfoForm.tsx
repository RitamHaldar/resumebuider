"use client";

import React, { useState, ChangeEvent } from "react";
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
  Camera,
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
  avatarUrl?: string;
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
    avatarUrl: initialData?.avatarUrl || "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatarUrl || null
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "city" || name === "country") {
        const cityVal = name === "city" ? value : prev.city || "";
        const countryVal = name === "country" ? value : prev.country || "";
        updated.location = [cityVal, countryVal].filter(Boolean).join(", ");
      }
      if (onSave) onSave(updated);
      return updated;
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
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

      <main className="max-w-4xl w-full mx-auto px-4 py-6 flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100/80 mb-8">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Let's get to know you
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Start by providing your basic contact details. This is the first thing recruiters will see.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="relative border-2 border-dashed border-indigo-200/80 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-indigo-600 border border-slate-200/60 shadow-xs group-hover:scale-105 transition-transform">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Upload Profile Photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drag and drop or click to browse (Max 5MB)
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="professionalTitle" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Professional Title
              </label>
              <div className="relative flex items-center">
                <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="professionalTitle"
                  name="professionalTitle"
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.doe@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Country
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  AI Tip
                </h5>
                <p className="text-xs text-sky-800 font-medium mt-0.5 leading-relaxed">
                  Ensure your contact info matches exactly what is on your LinkedIn profile for consistency.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  ONLINE PRESENCE
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="linkedIn" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    LinkedIn URL
                  </label>
                  <div className="relative flex items-center">
                    <LinkedinIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/janedoe"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="github" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    GitHub Profile URL
                  </label>
                  <div className="relative flex items-center">
                    <GithubIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="github.com/janedoe"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="portfolio" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Portfolio / Website
                  </label>
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="janedoe.design"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl hover:bg-slate-100/80 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all active:scale-[0.98]"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 bg-white/50 backdrop-blur-xs py-6 px-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 ResumeElite AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-600 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-600 transition">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
