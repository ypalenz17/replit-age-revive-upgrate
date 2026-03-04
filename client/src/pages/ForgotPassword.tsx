import { useState } from 'react';
import { Link } from 'wouter';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-white/[0.10] rounded-lg bg-white/[0.03] text-[14px] font-sans text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors";

  return (
    <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#131d2e]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
        </div>
      </nav>

      <div className="max-w-sm mx-auto px-5 pt-16 pb-24">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-ar-teal transition-colors mb-8" data-testid="link-back-login">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {sent ? (
          <div data-testid="forgot-password-success">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} className="text-ar-teal flex-shrink-0" />
              <h1 className="text-[22px] font-sans font-semibold text-white">Check Your Email</h1>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed mb-6">
              If an account exists for <span className="text-white/70">{email}</span>, we sent a password reset link. Check your inbox and spam folder.
            </p>
            <p className="text-[13px] text-white/30">
              The link will expire in 1 hour.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-[26px] font-sans font-semibold text-white mb-2" data-testid="forgot-password-title">Forgot Password</h1>
            <p className="text-[14px] text-white/40 mb-8">Enter your email and we will send you a reset link.</p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]" data-testid="forgot-password-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputClass}
                  autoComplete="email"
                  data-testid="input-forgot-email"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-send-reset"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
