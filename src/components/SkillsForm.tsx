"use client";

import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  Sparkles,
  Plus,
  X,
  Search,
  Check,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  Code,
  Layers,
  Wrench,
  Brain,
  RefreshCw,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";
import { generateSkills } from "@/apis/ai.api";

const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "HTML5 / CSS3",
  "Vue.js",
  "Angular",
  "Redux",
  "Sass / SCSS",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "FastAPI",
  "Java",
  "Spring Boot",
  "C++",
  "C# / .NET",
  "Go (Golang)",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "GraphQL",
  "RESTful APIs",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git & GitHub",
  "CI / CD",
  "Linux",
  "Google Cloud Platform (GCP)",
  "Problem Solving",
  "Team Leadership",
  "Agile / Scrum",
  "System Architecture",
  "Communication",
  "Project Management",
];

export interface SkillsFormData {
  skills: string[];
}

interface SkillsFormProps {
  initialSkills?: string[];
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: SkillsFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
  onGenerateAISkills?: () => Promise<string[]> | void;
}

export default function SkillsForm({
  initialSkills = [],
  currentStep = 3,
  totalSteps = 8,
  completionPercentage = 38,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
  onGenerateAISkills,
}: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialSkills) {
      setSkills(initialSkills);
    }
  }, [initialSkills]);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleActivateSearch = () => {
    setIsSearchActive(true);
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSearchQuery("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleAddSkill(searchQuery);
      }
    } else if (e.key === "Escape") {
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      if (onGenerateAISkills) {
        const res = await onGenerateAISkills();
        if (res && res.length > 0) {
          const merged = Array.from(new Set([...skills, ...res]));
          setSkills(merged);
        }
      } else {
        const apiRes = await generateSkills({
          experienceLevel: "Mid-Level",
          jobTitle: "Software Engineer",
        });
        const suggested: string[] =
          apiRes?.body?.skills ||
          (Array.isArray(apiRes?.body) ? apiRes.body : apiRes?.skills) ||
          [];
        const merged = Array.from(new Set([...skills, ...suggested]));
        setSkills(merged);
      }
    } catch (err) {
      console.error("AI Skills generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ skills });
    }
  };

  const filteredSuggestions = POPULAR_SKILLS.filter(
    (skill) =>
      !skills.some((s) => s.toLowerCase() === skill.toLowerCase()) &&
      skill.toLowerCase().includes(searchQuery.toLowerCase())
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
            Showcase your core skills
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Select or type technical and soft skills that define your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-100/80">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                Technical & Soft Skills
              </h2>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {skills.length} skills added
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No skills added yet. Click "+ Add Skill" below to select or type skills.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/90 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200/70 shadow-2xs hover:bg-indigo-100/80 transition group"
                    >
                      <Code className="w-3 h-3 text-indigo-500" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-900 transition p-0.5 rounded-md hover:bg-indigo-200/60 cursor-pointer"
                        title={`Remove ${skill}`}
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
                    Add Skill
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
                        onClick={() => handleAddSkill(searchQuery)}
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
                      {searchQuery ? "Matching Suggestions" : "Popular Suggestions"}
                    </div>

                    {filteredSuggestions.length === 0 ? (
                      <div className="flex items-center justify-between py-1 text-xs text-slate-500">
                        <span>No preset match. Press <strong>Enter</strong> to add "<strong>{searchQuery}</strong>".</span>
                        <button
                          type="button"
                          onClick={() => handleAddSkill(searchQuery)}
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
                            onClick={() => handleAddSkill(suggestion)}
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

          <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Skill Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Let AI analyze your target role and suggest optimal skills to pass ATS filters.
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
                  Generate Skills
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
            Previous Step
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
