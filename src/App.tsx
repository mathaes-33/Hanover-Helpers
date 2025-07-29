import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/ToastContainer';
import { SpinnerIcon } from './components/Icons';

// Lazy-loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BrowsePage = React.lazy(() => import('./pages/BrowsePage'));
const PostJobPage = React.lazy(() => import('./pages/PostJobPage'));
const PostJobSuccessPage = React.lazy(() => import('./pages/PostJobSuccessPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

const SuspenseFallback: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <SpinnerIcon className="w-12 h-12 text-primary" />
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mb-20 md:mb-0 fade-in">
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/post-job/success/:id" element={<PostJobSuccessPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}

export default App;