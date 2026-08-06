"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createResume } from "@/apis/resume.api";
import { getUser } from "@/apis/auth.api";
import { Loader2 } from "lucide-react";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import SummaryForm from "@/components/SummaryForm";
import SkillsForm from "@/components/SkillsForm";
import WorkExperienceForm from "@/components/WorkExperienceForm";
import ProjectsForm from "@/components/ProjectsForm";
import EducationForm from "@/components/EducationForm";
import CertificationsForm from "@/components/CertificationsForm";

export default function ResumePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [initLoading, setInitLoading] = useState<boolean>(true);

  useEffect(() => {
    const initNewResume = async () => {
      try {
        const userRes = await getUser();
        if (!userRes || !userRes.success || !userRes.body?.userId) {
          router.replace("/auth/login");
          return;
        }
        const res = await createResume({});
        if (res && res.success && res.body) {
          const id = res.body._id || res.body.id;
          if (id) {
            router.replace(`/resume/${id}`);
            return;
          }
        }
      } catch (err) {
        console.log("Could not auto-create resume:", err);
        router.replace("/auth/login");
      } finally {
        setInitLoading(false);
      }
    };
    initNewResume();
  }, [router]);

  if (initLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Initializing your new resume...</p>
      </div>
    );
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div>
      {currentStep === 1 && (
        <PersonalInfoForm
          currentStep={1}
          totalSteps={8}
          completionPercentage={12}
          onStepClick={handleStepClick}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <SummaryForm
          currentStep={2}
          totalSteps={8}
          completionPercentage={25}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <SkillsForm
          currentStep={3}
          totalSteps={8}
          completionPercentage={38}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <WorkExperienceForm
          currentStep={4}
          totalSteps={8}
          completionPercentage={50}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(3)}
          onNext={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 5 && (
        <ProjectsForm
          currentStep={5}
          totalSteps={8}
          completionPercentage={63}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(4)}
          onNext={() => setCurrentStep(6)}
        />
      )}

      {currentStep === 6 && (
        <EducationForm
          currentStep={6}
          totalSteps={8}
          completionPercentage={75}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(5)}
          onNext={() => setCurrentStep(7)}
        />
      )}

      {currentStep === 7 && (
        <CertificationsForm
          currentStep={7}
          totalSteps={8}
          completionPercentage={88}
          onStepClick={handleStepClick}
          onBack={() => setCurrentStep(6)}
          onNext={() => alert("All steps completed! Resume is ready for review.")}
        />
      )}
    </div>
  );
}
