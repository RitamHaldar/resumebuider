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
  initialSkills = ["React", "Node.js", "TypeScript", "Tailwind CSS"],
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
        setTimeout(() => {
          const aiSuggested = [
            "Next.js",
            "TypeScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Docker",
            "Git & GitHub",
            "RESTful APIs",
            "Problem Solving",
            "Agile / Scrum",
          ];
          const merged = Array.from(new Set([...skills, ...aiSuggested]));
          setSkills(merged);
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
      onNext({ skills });
    }
  };

  const filteredSuggestions = POPULAR_SKILLS.filter(
    (skill) =>
      !skills.some((s) => s.toLowerCase() === skill.toLowerCase()) &&
      skill.toLowerCase().includes(searchQuery.toLowerCase())
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

      <main className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Showcase your core skills
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Select or type the technical and soft skills that define your expertise. Our AI will automatically map these to industry standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                Technical & Soft Skills
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {skills.length} skills added
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 min-h-[50px] p-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No skills added yet. Click "+ Add Skill" below to select or type skills.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50/90 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200/70 shadow-2xs hover:bg-indigo-100/80 transition group"
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-500" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-900 transition p-0.5 rounded-md hover:bg-indigo-200/60 cursor-pointer"
                        title={`Remove ${skill}`}
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
                    Add Skill
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
                      placeholder="Search or type a skill (e.g. Python, Docker, Problem Solving)..."
                      className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-indigo-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition shadow-2xs"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => handleAddSkill(searchQuery)}
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
                      {searchQuery ? "Matching Suggestions" : "Popular Suggestions"}
                    </div>

                    {filteredSuggestions.length === 0 ? (
                      <div className="flex items-center justify-between py-2 text-xs text-slate-500">
                        <span>No matching preset found. Press <strong>Enter</strong> to add "<strong>{searchQuery}</strong>".</span>
                        <button
                          type="button"
                          onClick={() => handleAddSkill(searchQuery)}
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
                            onClick={() => handleAddSkill(suggestion)}
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

          <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Skill Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Let AI analyze your target role and suggest optimal skills to pass ATS filters and stand out to recruiters.
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
                  Generating Skills...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Generate Skills with AI
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
            Previous Step
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
            Next: Professional Experience
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
