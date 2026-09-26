import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Boxes,
  UserCheck,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { mockUsers } from "../../data/mockData";

export const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("sarah.jenkins@apex-ims.io");
  const [password, setPassword] = useState("••••••••••••");
  const [fullName, setFullName] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useInventory();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Log in with primary user or matched email
      const matched = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
      login(matched);
      navigate("/");
    }, 500);
  };

  const handleQuickLogin = (userIndex: number) => {
    login(mockUsers[userIndex]);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-bg-base flex text-gray-100 overflow-hidden relative">
      {/* Dynamic Mesh & Glow Layer */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />

      {/* Left Panel: Form */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col justify-between p-8 sm:p-12 z-10 bg-bg-base/60 backdrop-blur-2xl border-r border-white/5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              APEX <span className="text-gray-400 font-light">IMS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROTOTYPE v2.4
              </span>
            </h1>
          </div>
        </div>

        {/* Form Box */}
        <div className="my-auto py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? "Create your workspace" : "Welcome back"}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {isSignUp
                ? "Experience next-gen dark-mode enterprise inventory logistics"
                : "Sign in to manage global stock flows, operations & ledger"}
            </p>
          </div>

          {/* Quick Demo Login Personas */}
          <div className="mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-400" />
                Instant 1-Click Demo Profiles
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(0)}
                className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-white/5 text-left transition-all group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-emerald-300 truncate">
                  Sarah J.
                </div>
                <div className="text-[10px] text-gray-400">Admin / VP</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(1)}
                className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 border border-white/5 text-left transition-all group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-blue-300 truncate">
                  Alex C.
                </div>
                <div className="text-[10px] text-gray-400">Wh Manager</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(2)}
                className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/30 border border-white/5 text-left transition-all group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-purple-300 truncate">
                  David V.
                </div>
                <div className="text-[10px] text-gray-400">Logistics Lead</div>
              </button>
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-bg-base px-3 text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              Or standard credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Marcus Sterling"
                    required={isSignUp}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apex-ims.io"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-300">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(true)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                  >
                    Forgot password? (OTP)
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white py-3 text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <span>{isSignUp ? "Initialize Workspace" : "Authenticate Session"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Need access to a new facility?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Create account
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-gray-500 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            256-Bit TLS End-to-End Encrypted
          </span>
          <span>© 2026 Apex Systems Inc.</span>
        </div>
      </div>

      {/* Right Panel: High-Impact Visual Showcase & Metrics */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-[#0c121e] via-[#090b10] to-[#0d1612] p-12 flex-col justify-between overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-gray-300 font-mono">Live Global Sync: 5 Nodes Active</span>
          </div>
          <div className="text-xs text-gray-400 font-mono">LATENCY: 14ms (EDGE)</div>
        </div>

        {/* Middle Showcase Graphic: Glassmorphic Floating Dashboard Cards */}
        <div className="relative z-10 max-w-xl mx-auto space-y-4 my-auto">
          {/* Card 1: Stock Valuation */}
          <div className="p-6 rounded-2xl bg-bg-surface/80 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Global Inventory Value</h4>
                  <p className="text-[11px] text-gray-400">Aggregated across all 5 distribution centers</p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +14.8% MoM
              </span>
            </div>
            <div className="text-3xl font-black text-white font-mono tracking-tight">
              $4,892,140.00
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
              </div>
              <span className="font-mono text-gray-300">78% Optimal Buffer</span>
            </div>
          </div>

          {/* Card 2: Live Inbound & Outbound Pipeline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-bg-surface/70 border border-white/10 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-gray-300 font-medium">Inbound Receipts</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">1,480 Units</div>
              <span className="text-[10px] text-gray-500">4 Consignments on Dock</span>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface/70 border border-white/10 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-gray-300 font-medium">Outbound Dispatched</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">3,920 Units</div>
              <span className="text-[10px] text-gray-500">99.8% On-Time SLA</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Pill Row */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              Automated Cycle Audits
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Sub-second Barcode Dispatch
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-500">Dark Ops Architecture</span>
        </div>
      </div>

      {/* OTP Password Reset Modal */}
      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSuccess={() => {
          setIsResetOpen(false);
        }}
      />
    </div>
  );
};
