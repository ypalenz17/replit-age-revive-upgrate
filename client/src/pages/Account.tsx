import { Link, useLocation, Redirect } from 'wouter';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import brandLogo from '@assets/AR_brand_logo_1771613250600.png';
import { useAuth } from '../hooks/useAuth';

export default function Account() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#131d2e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-[#131d2e] text-white font-sans antialiased">
      <nav className="sticky top-0 z-50 bg-[#131d2e]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/">
            <img src={brandLogo} alt="AGE REVIVE" className="h-5 opacity-80" />
          </Link>
          <Link href="/shop" className="text-[13px] font-sans text-white/50 hover:text-white transition-colors" data-testid="link-shop">
            Shop
          </Link>
        </div>
      </nav>

      <div className="max-w-sm mx-auto px-5 pt-16 pb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-ar-teal/10 border border-ar-teal/20 flex items-center justify-center">
            <User size={24} className="text-ar-teal" />
          </div>
          <div>
            <h1 className="text-[22px] font-sans font-semibold text-white" data-testid="account-username">{user?.username}</h1>
            <p className="text-[13px] text-white/40" data-testid="account-email">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/shop"
            className="flex items-center gap-4 w-full px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            data-testid="link-browse-products"
          >
            <ShoppingBag size={20} className="text-white/40" />
            <div>
              <p className="text-[14px] font-sans font-medium text-white">Browse Products</p>
              <p className="text-[12px] text-white/35">View our supplement protocols</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-red-500/5 hover:border-red-500/10 transition-colors text-left"
            data-testid="button-logout"
          >
            <LogOut size={20} className="text-white/40" />
            <div>
              <p className="text-[14px] font-sans font-medium text-white">Sign Out</p>
              <p className="text-[12px] text-white/35">End your session</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
