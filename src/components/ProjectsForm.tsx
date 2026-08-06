"use client";

import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Plus,
  Trash2,
  X,
  FolderGit2,
  Globe,
  Code2,
  ArrowLeft,
  ArrowRight,
  CloudCheck,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ResumeTopBar from "./ResumeTopBar";
import { IProjects } from "@/types/resume.types";
import { generateProjectDescription } from "@/apis/ai.api";

export interface ProjectsFormData {
  projects: IProjects[];
}

interface ProjectsFormProps {
  initialProjects?: IProjects[];
  currentStep?: number;
  totalSteps?: number;
  completionPercentage?: number;
  onNext?: (data: ProjectsFormData) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  onStepClick?: (step: number) => void;
  onGenerateAIDescription?: (project: IProjects) => Promise<string> | void;
}

const DEFAULT_PROJECT: IProjects = {
  title: "E-commerce Microservices Architecture",
  description:
    "• Built a high-traffic e-commerce platform using Node.js and Docker.\n• Orchestrated container deployment using Kubernetes on AWS, reducing deployment time by 40%.\n• Integrated Redis caching to improve API response times by 35% under peak loads.",
  techStack: ["Node.js", "Docker", "Kubernetes", "AWS", "MongoDB"],
  githubUrl: "https://github.com/username/ecommerce-microservices",
  liveUrl: "https://ecommerce-demo.com",
};

export default function ProjectsForm({
  initialProjects = [DEFAULT_PROJECT],
  currentStep = 5,
  totalSteps = 8,
  completionPercentage = 63,
  onNext,
  onBack,
  onSaveAndExit,
  onStepClick,
  onGenerateAIDescription,
}: ProjectsFormProps) {
  const [projects, setProjects] = useState<IProjects[]>(
    initialProjects.length > 0 ? initialProjects : [DEFAULT_PROJECT]
  );
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [techInputs, setTechInputs] = useState<{ [key: number]: string }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [collapsedProjects, setCollapsedProjects] = useState<{ [key: number]: boolean }>({});

  const handleProjectChange = (
    index: number,
    field: keyof IProjects,
    value: any
  ) => {
    setProjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTech = (index: number, tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    const currentTech = projects[index].techStack || [];
    if (!currentTech.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      handleProjectChange(index, "techStack", [...currentTech, trimmed]);
    }
    setTechInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveTech = (projectIndex: number, techToRemove: string) => {
    const currentTech = projects[projectIndex].techStack || [];
    handleProjectChange(
      projectIndex,
      "techStack",
      currentTech.filter((t) => t !== techToRemove)
    );
  };

  const handleTechKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = techInputs[index] || "";
      if (val.trim()) {
        handleAddTech(index, val);
      }
    }
  };

  const handleAddProject = () => {
    const newProj: IProjects = {
      title: "",
      description: "",
      techStack: [],
      githubUrl: "",
      liveUrl: "",
    };

    setCollapsedProjects((prev) => {
      const updated = { ...prev };
      projects.forEach((_, idx) => {
        updated[idx] = true;
      });
      return updated;
    });

    setProjects((prev) => [...prev, newProj]);
    setActiveProjectIndex(projects.length);
  };

  const handleRemoveProject = (index: number) => {
    if (projects.length === 1) {
      setProjects([
        {
          title: "",
          description: "",
          techStack: [],
          githubUrl: "",
          liveUrl: "",
        },
      ]);
      return;
    }
    setProjects((prev) => prev.filter((_, i) => i !== index));
    if (activeProjectIndex >= projects.length - 1) {
      setActiveProjectIndex(Math.max(0, projects.length - 2));
    }
  };

  const toggleCollapse = (index: number) => {
    setCollapsedProjects((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAIGenerateDescription = async (index: number) => {
    setIsGenerating(true);
    const proj = projects[index];
    try {
      if (onGenerateAIDescription) {
        const res = await onGenerateAIDescription(proj);
        if (res) {
          handleProjectChange(index, "description", res);
        }
      } else {
        const apiRes = await generateProjectDescription({
          jobTitle: proj.title || "Software Project",
          techStack: proj.techStack || [],
          experienceLevel: "Mid-Level",
        });
        const desc =
          apiRes?.body?.projectDescription ||
          apiRes?.body?.description ||
          (typeof apiRes?.body === "string" ? apiRes.body : apiRes?.projectDescription || apiRes?.description) ||
          `• Architected and developed **${proj.title || "Project"}** using ${(proj.techStack || []).join(", ") || "modern tech stack"}.\n• Delivered end-to-end functionality with high quality standards.`;
        handleProjectChange(index, "description", desc);
      }
    } catch (err) {
      console.error("AI Project description generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext({ projects });
    }
  };

  const activeProject = projects[activeProjectIndex] || projects[0] || DEFAULT_PROJECT;

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
            Showcase your best work
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Projects are often the most important section for recruiters to evaluate your practical experience and problem-solving skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {projects.map((project, index) => {
              const isCollapsed = collapsedProjects[index];

              return (
                <div
                  key={index}
                  onClick={() => setActiveProjectIndex(index)}
                  className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
                    activeProjectIndex === index
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
                        {project.title || `Project ${index + 1}`}
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
                          handleRemoveProject(index);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor={`project-title-${index}`}
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                        >
                          Project Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          id={`project-title-${index}`}
                          value={project.title}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleProjectChange(index, "title", e.target.value)
                          }
                          placeholder="e.g. E-commerce Microservices Architecture"
                          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Technologies Used
                        </label>
                        <div className="p-3 bg-slate-50/40 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
                            {(project.techStack || []).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200/60"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTech(index, tech)}
                                  className="text-indigo-400 hover:text-indigo-900 transition"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="relative flex items-center">
                            <Code2 className="absolute left-3 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={techInputs[index] || ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setTechInputs((prev) => ({
                                  ...prev,
                                  [index]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => handleTechKeyDown(index, e)}
                              placeholder="Type technology & press Enter (e.g. Next.js, MongoDB)..."
                              className="w-full pl-9 pr-16 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                            />
                            {techInputs[index] && (
                              <button
                                type="button"
                                onClick={() => handleAddTech(index, techInputs[index])}
                                className="absolute right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-md"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor={`project-desc-${index}`}
                            className="block text-xs font-semibold text-slate-700"
                          >
                            Project Description
                          </label>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {(project.description || "").length} / 1000 characters
                          </span>
                        </div>

                        <textarea
                          id={`project-desc-${index}`}
                          rows={5}
                          maxLength={1000}
                          value={project.description}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            handleProjectChange(index, "description", e.target.value)
                          }
                          placeholder="• Built a high-traffic e-commerce platform using Node.js and Docker.&#10;• Orchestrated container deployment using Kubernetes on AWS, reducing deployment time by 40%."
                          className="w-full p-4 bg-slate-50/40 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-y font-mono leading-relaxed"
                        />
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Project Links
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              GitHub Repository URL
                            </label>
                            <div className="relative flex items-center">
                              <FolderGit2 className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                              <input
                                type="url"
                                value={project.githubUrl}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleProjectChange(index, "githubUrl", e.target.value)
                                }
                                placeholder="https://github.com/username/project"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Live Demo URL
                            </label>
                            <div className="relative flex items-center">
                              <Globe className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                              <input
                                type="url"
                                value={project.liveUrl}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleProjectChange(index, "liveUrl", e.target.value)
                                }
                                placeholder="https://project-demo.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddProject}
              className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-3xl p-6 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-all cursor-pointer shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition">
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 stroke-[3]" />
              </div>
              Add Another Project
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-100/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Project Assistant</h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Let AI elevate your project description to highlight impact and match industry standards.
              </p>

              <button
                type="button"
                onClick={() => handleAIGenerateDescription(activeProjectIndex)}
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
                    Generate Description
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
                <h4 className="font-serif font-bold text-sm text-slate-900 tracking-wide">
                  {activeProject.title || "Untitled Project"}
                </h4>

                {activeProject.techStack && activeProject.techStack.length > 0 && (
                  <div className="font-sans text-[11px] font-medium text-slate-500 flex flex-wrap gap-1.5 py-0.5">
                    <span className="text-slate-400 font-serif">Tech:</span>
                    {activeProject.techStack.map((tech, i) => (
                      <span key={tech} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {(activeProject.githubUrl || activeProject.liveUrl) && (
                  <div className="font-serif text-[11px] text-indigo-600 flex flex-wrap gap-3 italic">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <FolderGit2 className="w-3 h-3 text-slate-400" />
                        Code Repository
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3 text-slate-400" />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/60 mt-2">
                  {activeProject.description ? (
                    <div className="prose prose-xs max-w-none text-slate-800 font-serif text-xs leading-relaxed">
                      <ReactMarkdown>{activeProject.description}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Description markdown will render live here...
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
