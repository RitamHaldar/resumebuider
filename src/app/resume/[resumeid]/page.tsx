"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResume, updateResume } from "@/apis/resume.api";
import {
  generateSummary,
  generateSkills,
  generateExperienceDescription,
  generateProjectDescription,
} from "@/apis/ai.api";
import { IResume } from "@/types/resume.types";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import SummaryForm from "@/components/SummaryForm";
import SkillsForm from "@/components/SkillsForm";
import WorkExperienceForm from "@/components/WorkExperienceForm";
import ProjectsForm from "@/components/ProjectsForm";
import EducationForm from "@/components/EducationForm";
import CertificationsForm from "@/components/CertificationsForm";
import OverleafResumePreview from "@/components/OverleafResumePreview";
import { Loader2 } from "lucide-react";

export default function DynamicResumePage() {
  const params = useParams();
  const router = useRouter();
  const resumeid = params?.resumeid as string;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [resumeData, setResumeData] = useState<Partial<IResume>>({
    title: "",
    summary: "",
    personalInfo: {
      fullname: "",
      email: "",
      mobile: "",
      location: "",
      github: "",
      linkedIn: "",
      portfolio: "",
    },
    workExperience: [],
    projects: [],
    skills: [],
    education: [],
    certifications: [],
  });

  useEffect(() => {
    if (!resumeid) return;
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const res = await getResume(resumeid);
        if (res && res.success && res.body) {
          setResumeData(res.body);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, [resumeid]);

  const saveProgress = async (partialData: Partial<IResume>) => {
    if (!resumeid) return;
    try {
      setSaving(true);
      const updated = { ...resumeData, ...partialData };
      setResumeData(updated);
      await updateResume(resumeid, partialData);
    } catch (err) {
      console.error("Failed to update resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStepClick = async (step: number) => {
    await saveProgress(resumeData);
    setCurrentStep(step);
  };

  const handleSaveAndExit = async () => {
    await saveProgress(resumeData);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading your resume data...</p>
      </div>
    );
  }

  return (
    <div>
      {currentStep === 1 && (
        <PersonalInfoForm
          initialData={resumeData.personalInfo}
          currentStep={1}
          totalSteps={8}
          completionPercentage={12}
          onStepClick={handleStepClick}
          onSaveAndExit={handleSaveAndExit}
          onSave={(data) => {
            setResumeData((prev) => ({ ...prev, personalInfo: data }));
          }}
          onNext={(data) => {
            saveProgress({ personalInfo: data });
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <SummaryForm
          initialSummary={resumeData.summary || ""}
          initialTargetRole={resumeData.title || ""}
          currentStep={2}
          totalSteps={8}
          completionPercentage={25}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(1)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ summary: data.summary, title: data.targetRole });
            setCurrentStep(3);
          }}
          onGenerateAI={async (promptData) => {
            const res = await generateSummary({
              experienceLevel: promptData.experienceLevel || "Mid-Level",
              skills: resumeData.skills || [],
              jobTitle: promptData.targetRole || resumeData.title || "Software Engineer",
            });
            if (res && res.success && res.body) {
              return typeof res.body === "string" ? res.body : res.body.summary || JSON.stringify(res.body);
            } else if (res && res.summary) {
              return res.summary;
            }
          }}
        />
      )}

      {currentStep === 3 && (
        <SkillsForm
          initialSkills={resumeData.skills || []}
          currentStep={3}
          totalSteps={8}
          completionPercentage={38}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(2)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ skills: data.skills });
            setCurrentStep(4);
          }}
          onGenerateAISkills={async (): Promise<string[]> => {
            const res = await generateSkills({
              experienceLevel: "Mid-Level",
              jobTitle: resumeData.title || "Software Engineer",
            });
            const list = res?.body?.skills || (Array.isArray(res?.body) ? res.body : res?.skills);
            if (Array.isArray(list)) {
              return list;
            }
            return [];
          }}
        />
      )}

      {currentStep === 4 && (
        <WorkExperienceForm
          initialWorkExperience={resumeData.workExperience || []}
          currentStep={4}
          totalSteps={8}
          completionPercentage={50}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(3)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ workExperience: data.workExperience });
            setCurrentStep(5);
          }}
          onGenerateAIDescription={async (experience) => {
            const res = await generateExperienceDescription({
              jobRole: experience.position || "Software Engineer",
              techStack: resumeData.skills || [],
              yearsOfExperience: 3,
              experienceLevel: "Mid-Level",
            });
            if (res && res.success && res.body) {
              return typeof res.body === "string"
                ? res.body
                : res.body.workExperienceDescription || res.body.description || "";
            } else if (res && (res.workExperienceDescription || res.description)) {
              return res.workExperienceDescription || res.description;
            }
          }}
        />
      )}

      {currentStep === 5 && (
        <ProjectsForm
          initialProjects={resumeData.projects || []}
          currentStep={5}
          totalSteps={8}
          completionPercentage={63}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(4)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ projects: data.projects });
            setCurrentStep(6);
          }}
          onGenerateAIDescription={async (project) => {
            const res = await generateProjectDescription({
              jobTitle: project.title || "Project",
              techStack: project.techStack || [],
              experienceLevel: "Mid-Level",
            });
            if (res && res.success && res.body) {
              return typeof res.body === "string"
                ? res.body
                : res.body.projectDescription || res.body.description || "";
            } else if (res && (res.projectDescription || res.description)) {
              return res.projectDescription || res.description;
            }
          }}
        />
      )}

      {currentStep === 6 && (
        <EducationForm
          initialEducation={resumeData.education || []}
          currentStep={6}
          totalSteps={8}
          completionPercentage={75}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(5)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ education: data.education });
            setCurrentStep(7);
          }}
        />
      )}

      {currentStep === 7 && (
        <CertificationsForm
          initialCertifications={resumeData.certifications || []}
          currentStep={7}
          totalSteps={8}
          completionPercentage={88}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(6)}
          onSaveAndExit={handleSaveAndExit}
          onNext={(data) => {
            saveProgress({ certifications: data.certifications });
            setCurrentStep(8);
          }}
        />
      )}

      {currentStep === 8 && (
        <OverleafResumePreview
          resumeData={resumeData}
          currentStep={8}
          totalSteps={8}
          completionPercentage={100}
          onEditSection={(step) => setCurrentStep(step)}
          onBackToEditor={() => setCurrentStep(7)}
          onSaveAndExit={handleSaveAndExit}
          onStepClick={handleStepClick}
        />
      )}
    </div>
  );
}
