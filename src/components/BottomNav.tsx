

import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, SearchIcon, PlusCircleIcon, MessageIcon, BriefcaseIcon } from './Icons';

const BottomNav: React.FC = () => {
  const activeClass = 'text-primary';
  const inactiveClass = 'text-slate-500 hover:text-primary';

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? activeClass : inactiveClass} flex flex-col items-center justify-center transition-colors duration-200`;

  const navItems = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
    { to: '/browse', label: 'Browse', icon: <SearchIcon className="w-6 h-6" /> },
    { to: '/post-job', label: 'Post', icon: <PlusCircleIcon className="w-8 h-8" /> },
    { to: '/messages', label: 'Messages', icon: <MessageIcon className="w-6 h-6" /> },
    { to: '/dashboard', label: 'My Jobs', icon: <BriefcaseIcon className="w-6 h-6" /> },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-lg z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={getNavLinkClass} end={item.to === '/'}>
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;