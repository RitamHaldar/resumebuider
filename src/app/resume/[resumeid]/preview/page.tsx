"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResume } from "@/apis/resume.api";
import { IResume } from "@/types/resume.types";
import OverleafResumePreview from "@/components/OverleafResumePreview";
import { Loader2 } from "lucide-react";

export default function StandaloneResumePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.resumeid as string;

  const [resumeData, setResumeData] = useState<Partial<IResume> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) return;
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await getResume(resumeId);
        if (res && res.success && res.body) {
          setResumeData(res.body);
        } else {
          setError(res?.message || "Failed to load resume");
        }
      } catch (err) {
        console.error("Error loading resume preview:", err);
        setError("Could not load resume data.");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Overleaf Resume Preview...</p>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Resume Not Found</h3>
          <p className="text-xs text-slate-500 mb-6">{error || "Unable to fetch requested resume."}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <OverleafResumePreview
      resumeData={resumeData}
      currentStep={8}
      totalSteps={8}
      completionPercentage={100}
      onBackToEditor={() => router.push(`/resume/${resumeId}`)}
      onEditSection={() => router.push(`/resume/${resumeId}`)}
      onSaveAndExit={() => router.push("/")}
    />
  );
}
