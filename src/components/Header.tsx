import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BriefcaseIcon } from './Icons';
import { useAppData } from '../hooks/useAppData.tsx';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { currentUser } = useAppData();
  const { user: authUser, login, logout, isInitialized } = useAuth();

  const activeLinkClass = 'text-primary-dark font-semibold border-b-2 border-primary-dark';
  const inactiveLinkClass = 'text-slate-600 hover:text-primary-dark transition-colors duration-200';

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? activeLinkClass : inactiveLinkClass;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-dark">
          Hanover Helpers
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={getNavLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/browse" className={getNavLinkClass}>
            Browse
          </NavLink>
          <NavLink to="/post-job" className={getNavLinkClass}>
            Post a Job
          </NavLink>
        </nav>
        <div className="flex items-center space-x-4">
          {!isInitialized ? (
            <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
          ) : authUser && currentUser ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-slate-600 hover:text-primary-dark transition-colors duration-200">
                <BriefcaseIcon className="w-6 h-6" />
                <span className="hidden sm:inline">My Jobs</span>
              </Link>
              <Link to={`/profile/${currentUser.id}`} className="flex items-center space-x-2 text-slate-600">
                <img src={currentUser.avatarUrl} alt="My Profile" className="w-9 h-9 rounded-full border-2 border-slate-200 hover:border-primary-light transition" />
              </Link>
              <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
            </>
          ) : (
            <Button onClick={login} variant="primary" size="sm">Login / Sign Up</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;