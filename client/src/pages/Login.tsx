import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
        <h1 className="text-[26px] font-sans font-semibold text-white mb-2" data-testid="login-title">Sign In</h1>
        <p className="text-[14px] text-white/40 mb-8">Welcome back to AGE REVIVE</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]" data-testid="login-error">
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
              data-testid="input-login-email"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputClass} pr-12`}
              autoComplete="current-password"
              data-testid="input-login-password"
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
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password}
            className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="button-login"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-[13px] text-white/40 hover:text-ar-teal transition-colors" data-testid="link-forgot-password">
            Forgot your password?
          </Link>
        </div>

        <p className="mt-4 text-center text-[13px] text-white/40">
          Don't have an account?{' '}
          <Link href="/signup" className="text-ar-teal hover:text-ar-teal/80 transition-colors font-medium" data-testid="link-signup">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
