"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layout,
  Cpu,
  ShieldCheck,
  Star,
  Award,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf8ff] text-slate-800 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#e1e0ff] rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-[20%] left-[-5%] w-80 h-80 bg-[#c4e7ff] rounded-full blur-3xl pointer-events-none opacity-60" />

      <header className="fixed top-0 left-0 right-0 w-full bg-[#fcf8ff]/90 backdrop-blur-md border-b border-[#e4e1ed] z-50 px-6 sm:px-12 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Resume<span className="text-indigo-600">Elite</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/resume"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Create Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-36 sm:pt-44 pb-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI-Powered Resume Builder 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Craft ATS-Optimized Resumes That Land{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600">
              3x More Interviews
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Build professional, recruiter-tested resumes in minutes. Powered by real-time AI bullet point generation and instant Overleaf live previews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/resume"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Create My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-7 py-4 rounded-2xl border border-[#e4e1ed] shadow-2xs transition"
            >
              Explore Features
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free AI Bullet Assistant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Overleaf Live Preview
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% ATS Compliant
            </span>
          </div>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono text-slate-400">resume-editor-workspace.overleaf.v2</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Syncing
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
                    STEP 5: PROJECTS & TECH STACK
                  </span>
                  <span className="text-xs text-slate-400 font-medium">63% Complete</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Project Name
                    </label>
                    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold shadow-2xs">
                      E-commerce Microservices Architecture
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                        Node.js
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                        Docker
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                        Kubernetes
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                        AWS
                      </span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="w-full bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-600 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Generate Description with AI
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/30 border border-amber-100/60 text-slate-900 rounded-2xl p-5 font-serif text-xs leading-relaxed space-y-3 shadow-2xs">
                <div className="flex justify-between items-center pb-2 border-b border-amber-900/10">
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    Jane Doe — Senior Software Engineer
                  </h4>
                  <span className="text-[10px] font-sans font-semibold bg-amber-100/80 px-2 py-0.5 rounded text-amber-900">
                    Overleaf Live Render
                  </span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 tracking-wide uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                    TECHNICAL PROJECTS
                  </h5>
                  <p className="font-serif font-bold text-xs text-slate-900">
                    E-commerce Microservices Architecture
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-800 font-sans mt-1">
                    <li>
                      Architected microservices with <strong>Node.js</strong> & <strong>Docker</strong>.
                    </li>
                    <li>
                      Orchestrated container deployment using <strong>Kubernetes on AWS</strong>, reducing latency by 40%.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#e4e1ed]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            ENGINEERED FOR SUCCESS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything You Need to Stand Out
          </h3>
          <p className="text-slate-500 text-sm">
            Designed specifically for tech professionals, developers, and ambitious job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Bullet Point Generator</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Instantly transform rough bullet points into impactful, metric-driven achievements optimized for ATS algorithms.
            </p>
          </div>

          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layout className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Overleaf Live Preview</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Watch your resume take shape in real time with beautiful, Overleaf-style paper typography and LaTeX rendering.
            </p>
          </div>

          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">8-Step Guided Builder</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Step-by-step progress tracking across Personal Info, Summary, Skills, Work, Projects, Education, and Certifications.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#e4e1ed]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            SIMPLE THREE-STEP PROCESS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Build Your Resume in Minutes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm relative">
            <span className="text-5xl font-black text-indigo-100 absolute top-6 right-6">
              01
            </span>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Enter Your Details</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Fill in your contact info, work history, tech stack skills, and academic background using our intuitive form.
            </p>
          </div>

          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm relative">
            <span className="text-5xl font-black text-indigo-100 absolute top-6 right-6">
              02
            </span>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Enhance With AI</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Click "Generate with AI" to polish summaries, project features, and work achievements with industry keywords.
            </p>
          </div>

          <div className="bg-white border border-[#e4e1ed] rounded-3xl p-8 shadow-sm relative">
            <span className="text-5xl font-black text-indigo-100 absolute top-6 right-6">
              03
            </span>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Export & Apply</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Review your live Overleaf document preview, download your ATS-ready resume, and apply to top companies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto text-center relative">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-10 sm:p-16 shadow-xl relative overflow-hidden text-white">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
              Join thousands of software engineers, product managers, and tech professionals building resumes with ResumeElite.
            </p>
            <div className="pt-4">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-700 font-bold text-sm px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Create Your Resume Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-[#e4e1ed] bg-[#fcf8ff] py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">ResumeElite</span>
          </div>
          <p>© 2026 ResumeElite. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-800 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-800 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-800 transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}