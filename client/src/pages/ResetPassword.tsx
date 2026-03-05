import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import SiteNavbar from '../components/SiteNavbar';

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  }, []);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors";

  if (!token) {
    return (
      <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-[22px] font-semibold mb-3">Invalid Reset Link</h1>
          <p className="text-[14px] text-white/50 mb-6">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-ar-teal hover:text-ar-teal/80 transition-colors text-[14px] font-medium" data-testid="link-request-new-reset">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased">
      <SiteNavbar />

      <div className="max-w-sm mx-auto px-5 pt-24 pb-24">
        {success ? (
          <div data-testid="reset-password-success">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} className="text-ar-teal flex-shrink-0" />
              <h1 className="text-[22px] font-sans font-semibold text-white">Password Reset</h1>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed mb-6">
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors"
              data-testid="button-go-to-login"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-[26px] font-sans font-semibold text-white mb-2" data-testid="reset-password-title">Set New Password</h1>
            <p className="text-[14px] text-white/40 mb-8">Choose a new password for your account.</p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]" data-testid="reset-password-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={inputClass}
                  autoComplete="new-password"
                  data-testid="input-confirm-new-password"
                />
              </div>
              {password && password.length < 8 && (
                <p className="text-[12px] text-white/30">Must be at least 8 characters</p>
              )}
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-reset-password"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
