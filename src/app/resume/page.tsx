"use client";

import React, { useState } from "react";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import SummaryForm from "@/components/SummaryForm";
import SkillsForm from "@/components/SkillsForm";
import WorkExperienceForm from "@/components/WorkExperienceForm";
import ProjectsForm from "@/components/ProjectsForm";
import EducationForm from "@/components/EducationForm";
import CertificationsForm from "@/components/CertificationsForm";

export default function ResumePage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

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
