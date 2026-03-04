import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const [, navigate] = useLocation();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password || !confirmPassword) return;

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
      await signup(email, username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
        <h1 className="text-[26px] font-sans font-semibold text-white mb-2" data-testid="signup-title">Create Account</h1>
        <p className="text-[14px] text-white/40 mb-8">Join AGE REVIVE</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]" data-testid="signup-error">
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
              data-testid="input-signup-email"
            />
          </div>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={inputClass}
              autoComplete="username"
              data-testid="input-signup-username"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 characters)"
              className={`${inputClass} pr-12`}
              autoComplete="new-password"
              data-testid="input-signup-password"
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
              placeholder="Confirm password"
              className={inputClass}
              autoComplete="new-password"
              data-testid="input-signup-confirm-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !username.trim() || !password || !confirmPassword}
            className="w-full py-3.5 bg-ar-teal text-[#131d2e] rounded-full text-[14px] font-sans font-semibold hover:bg-ar-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="button-signup"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-white/40">
          Already have an account?{' '}
          <Link href="/login" className="text-ar-teal hover:text-ar-teal/80 transition-colors font-medium" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
