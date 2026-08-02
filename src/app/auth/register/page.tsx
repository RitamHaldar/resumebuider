"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    syncSize();

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;

      void main() {
        vec2 uv = v_texCoord;
        float noise1 = sin(uv.x * 2.0 + u_time * 0.2) * 0.5 + 0.5;
        float noise2 = cos(uv.y * 2.0 - u_time * 0.3) * 0.5 + 0.5;
        
        vec3 color = vec3(0.98, 0.98, 0.99); 
        vec3 indigo = vec3(0.388, 0.4, 0.945);
        vec3 violet = vec3(0.545, 0.361, 0.965);
        vec3 sky = vec3(0.22, 0.741, 0.973);

        float glow1 = smoothstep(0.8, 0.2, distance(uv, vec2(0.2 + 0.1 * sin(u_time * 0.1), 0.3 + 0.1 * cos(u_time * 0.15))));
        float glow2 = smoothstep(0.8, 0.2, distance(uv, vec2(0.8 + 0.1 * cos(u_time * 0.12), 0.7 + 0.1 * sin(u_time * 0.08))));
        float glow3 = smoothstep(0.7, 0.1, distance(uv, vec2(0.5 + 0.2 * sin(u_time * 0.05), 0.5)));

        color = mix(color, indigo, glow1 * 0.12);
        color = mix(color, violet, glow2 * 0.10);
        color = mix(color, sky, glow3 * 0.08);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vertShader = cs(gl.VERTEX_SHADER, vs);
    const fragShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");

    let animId: number;
    function render(t: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8ff] text-[#1b1b23] h-screen w-screen font-sans antialiased overflow-hidden selection:bg-[#e1e0ff] selection:text-[#07006c] relative flex flex-col">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 pointer-events-none">
        <div className="text-xl xl:text-2xl font-bold text-[#4648d4] pointer-events-auto">
          ResumeElite
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-full w-full">
        <section className="hidden md:flex md:w-[60%] h-full relative flex-col justify-between p-6 xl:p-8 bg-[#6063ee] text-[#fffbff] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-80">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#6063ee]/80 to-[#40c2fd]/80 mix-blend-multiply pointer-events-none" />

          <div className="relative z-10 flex-grow flex items-center justify-center my-2">
            <div className="w-full max-w-xl h-[240px] xl:h-[280px] relative rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center">
              <svg
                fill="none"
                viewBox="0 0 600 600"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.4">
                  <circle
                    cx="300"
                    cy="300"
                    r="250"
                    stroke="url(#paint0_linear)"
                    strokeDasharray="10 20"
                    strokeWidth="0.5"
                  />
                  <circle
                    cx="300"
                    cy="300"
                    r="200"
                    stroke="url(#paint1_linear)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M100 300 Q 300 100 500 300 T 100 300"
                    opacity="0.3"
                    stroke="url(#paint2_linear)"
                    strokeWidth="0.5"
                  />
                </g>

                <g className="animate-bounce" style={{ animationDuration: "6s" }}>
                  <rect
                    fill="white"
                    fillOpacity="0.8"
                    height="240"
                    rx="12"
                    width="180"
                    x="150"
                    y="150"
                    style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.08))" }}
                  />
                  <rect fill="#E2E8F0" height="12" rx="4" width="140" x="170" y="180" />
                  <rect fill="#F1F5F9" height="8" rx="3" width="100" x="170" y="205" />
                  <rect fill="#F8FAFC" height="6" rx="2" width="140" x="170" y="225" />
                  <rect fill="#F8FAFC" height="6" rx="2" width="120" x="170" y="240" />

                  <rect
                    fill="white"
                    height="260"
                    rx="16"
                    width="200"
                    x="250"
                    y="220"
                    style={{ filter: "drop-shadow(0 30px 60px rgba(99, 102, 241, 0.15))" }}
                  />
                  <rect fill="#6366F1" height="16" rx="6" width="140" x="280" y="255" />
                  <rect fill="#F1F5F9" height="8" rx="4" width="100" x="280" y="285" />
                  <rect fill="#F8FAFC" height="6" rx="3" width="140" x="280" y="305" />
                  <rect fill="#F8FAFC" height="6" rx="3" width="140" x="280" y="320" />
                  <rect fill="#F8FAFC" height="6" rx="3" width="80" x="280" y="335" />

                  <circle cx="430" cy="240" fill="#8B5CF6" r="12">
                    <animate
                      attributeName="opacity"
                      dur="3s"
                      repeatCount="indefinite"
                      values="0.4;1;0.4"
                    />
                  </circle>
                  <path
                    d="M424 240 L436 240 M430 234 L430 246"
                    stroke="white"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </g>

                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear"
                    x1="100"
                    x2="500"
                    y1="100"
                    y2="500"
                  >
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint1_linear"
                    x1="100"
                    x2="500"
                    y1="100"
                    y2="500"
                  >
                    <stop stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint2_linear"
                    x1="100"
                    x2="500"
                    y1="300"
                    y2="300"
                  >
                    <stop stopColor="#8B5CF6" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl xl:text-4xl font-bold text-[#fffbff] tracking-tight">
              Elevate Your Career
            </h1>
            <p className="text-xs xl:text-sm text-[#fffbff]/80 max-w-md leading-relaxed">
              AI-powered resume optimization for high-stakes professional growth.
              Build beautiful, ATS-friendly resumes that stand out.
            </p>
          </div>
        </section>

        <section className="w-full md:w-[40%] h-full relative flex flex-col justify-center items-center bg-[#fcf8ff] px-6 py-6 xl:px-10 z-20">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[#e1e0ff] rounded-full blur-3xl pointer-events-none opacity-60" />
          <div className="absolute bottom-[-5%] left-[-5%] w-60 h-60 bg-[#c4e7ff] rounded-full blur-3xl pointer-events-none opacity-60" />

          <div className="w-full max-w-[420px] bg-white rounded-[20px] p-6 xl:p-8 shadow-xl border border-[#e4e1ed] relative z-10 space-y-3 xl:space-y-4">
            <div className="text-center space-y-1">
              <div className="md:hidden text-2xl font-bold text-[#4648d4] mb-2">
                ResumeElite
              </div>
              <h2 className="text-2xl xl:text-3xl font-bold text-[#1b1b23] tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs xl:text-sm text-[#464554]">
                Start building beautiful, ATS-friendly resumes in minutes.
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5 xl:space-y-3">
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-[#1b1b23]"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-[40px] xl:h-[44px] px-3.5 rounded-[14px] bg-white border border-[#c7c4d7] text-[#1b1b23] placeholder-[#464554]/50 text-xs xl:text-sm focus:outline-none focus:border-[#4648d4] focus:ring-4 focus:ring-[#6063ee]/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-[#1b1b23]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-[40px] xl:h-[44px] px-3.5 rounded-[14px] bg-white border border-[#c7c4d7] text-[#1b1b23] placeholder-[#464554]/50 text-xs xl:text-sm focus:outline-none focus:border-[#4648d4] focus:ring-4 focus:ring-[#6063ee]/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#1b1b23]"
                >
                  Password
                </label>
                <div className="relative rounded-[14px]">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[40px] xl:h-[44px] pl-3.5 pr-10 rounded-[14px] bg-white border border-[#c7c4d7] text-[#1b1b23] placeholder-[#464554]/50 text-xs xl:text-sm focus:outline-none focus:border-[#4648d4] focus:ring-4 focus:ring-[#6063ee]/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#4648d4] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-[#1b1b23]"
                >
                  Confirm Password
                </label>
                <div className="relative rounded-[14px]">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[40px] xl:h-[44px] pl-3.5 pr-10 rounded-[14px] bg-white border border-[#c7c4d7] text-[#1b1b23] placeholder-[#464554]/50 text-xs xl:text-sm focus:outline-none focus:border-[#4648d4] focus:ring-4 focus:ring-[#6063ee]/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#767586] hover:text-[#4648d4] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] xl:h-[46px] mt-1 rounded-[14px] bg-gradient-to-r from-[#4648d4] to-[#6063ee] hover:shadow-lg hover:shadow-[#4648d4]/25 hover:-translate-y-0.5 active:translate-y-0 text-white font-medium text-xs xl:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-xs text-[#464554]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#4648d4] font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
