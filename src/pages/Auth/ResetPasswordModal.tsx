import React, { useState, useEffect, useRef } from "react";
import { KeyRound, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Modal } from "../../components/ui/Modal";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<"email" | "otp" | "new_password" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

    const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid work email address");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      console.log("DEMO OTP (would be emailed):", code);
      setIsLoading(false);
      setStep("otp");
      setTimer(60);
    }, 700);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

    const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }
    if (code !== generatedOtp) {
      setError("Incorrect code. Check the browser console for your demo OTP.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("new_password");
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center pt-2 pb-1">
        {step === "email" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
              <KeyRound className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset Credentials</h3>
            <p className="mt-1 text-xs text-gray-400">
              Enter your corporate email address to receive an instant verification OTP.
            </p>

            <form onSubmit={handleSendOtp} className="mt-6 text-left space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apex-ims.io"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-blue py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === "otp" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Enter 6-Digit OTP</h3>
            <p className="mt-1 text-xs text-gray-400">
              We sent a 6-digit security token to <span className="text-gray-200 font-mono">{email}</span>.
            </p>

            <div className="mt-6 space-y-6">
              {/* 6 animated input boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-11 rounded-xl bg-white/[0.05] border border-white/15 text-center text-lg font-bold text-white focus:border-emerald-500 focus:bg-emerald-500/10 focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Resend in <strong className="text-white font-mono">{timer}s</strong>
                </span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={() => setTimer(60)}
                  className="text-emerald-400 hover:underline disabled:text-gray-600 disabled:no-underline"
                >
                  Resend code
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-emerald py-2.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "new_password" && (
          <div>
            <h3 className="text-lg font-bold text-white">Create New Password</h3>
            <p className="mt-1 text-xs text-gray-400">
              Ensure your new credentials conform with enterprise security guidelines.
            </p>

            <form onSubmit={handleResetPassword} className="mt-6 text-left space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-blue py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="py-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Password Updated</h3>
            <p className="mt-1 text-xs text-gray-400">
              Your credentials were saved securely. Redirecting to workspace...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
