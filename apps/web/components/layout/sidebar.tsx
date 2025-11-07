'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign, CreditCard, Settings, Link as LinkIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const agentNavItems: NavItem[] = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: Home },
  { href: '/agent/users', label: 'Users', icon: Users },
  { href: '/agent/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/agent/withdrawals', label: 'Withdrawals', icon: CreditCard },
  { href: '/agent/settings', label: 'Settings', icon: Settings },
];

const affiliateNavItems: NavItem[] = [
  { href: '/affiliate/dashboard', label: 'Dashboard', icon: Home },
  { href: '/affiliate/links', label: 'Links', icon: LinkIcon },
  { href: '/affiliate/tracking', label: 'Tracking', icon: Users },
  { href: '/affiliate/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/affiliate/withdrawals', label: 'Withdrawals', icon: CreditCard },
  { href: '/affiliate/assets', label: 'Assets', icon: Settings },
];

export function Sidebar({ role }: { role: 'agent' | 'affiliate' }) {
  const pathname = usePathname();
  const navItems = role === 'agent' ? agentNavItems : affiliateNavItems;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">iGaming Platform</h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{role} Panel</p>
      </div>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

