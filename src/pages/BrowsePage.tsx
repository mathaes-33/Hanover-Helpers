


import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData.tsx';
import JobCard from '../components/JobCard';
import HelperCard from '../components/HelperCard';

type View = 'jobs' | 'helpers';

const BrowsePage: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('jobs');
  const { jobs, helpers, isLoading } = useAppData();

  const getTabClass = (view: View) => {
    return activeView === view
      ? 'bg-primary text-white'
      : 'bg-white text-slate-600 hover:bg-slate-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Browse</h1>
        <p className="text-slate-500 mt-1">Find local jobs or trusted helpers in your community.</p>
      </div>

      <div className="flex space-x-2 bg-slate-200 p-1 rounded-lg max-w-xs">
        <button 
          onClick={() => setActiveView('jobs')} 
          className={`w-full text-center px-4 py-2 rounded-md font-semibold transition-colors ${getTabClass('jobs')}`}
        >
          Jobs
        </button>
        <button 
          onClick={() => setActiveView('helpers')} 
          className={`w-full text-center px-4 py-2 rounded-md font-semibold transition-colors ${getTabClass('helpers')}`}
        >
          Helpers
        </button>
      </div>

      {isLoading && <p className="text-slate-500">Loading...</p>}

      {!isLoading && (
        <div>
          {activeView === 'jobs' && (
            <div className="space-y-4">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
          {activeView === 'helpers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {helpers.map(helper => <HelperCard key={helper.id} helper={helper} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;