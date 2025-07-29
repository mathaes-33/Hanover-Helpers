

import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData.tsx';
import JobCard from '../components/JobCard';
import WeatherWidget from '../components/WeatherWidget';
import { Select } from '../components/ui/FormControls';
import { JOB_CATEGORIES } from '../constants';
import GeminiQuickPost from '../components/GeminiQuickPost';
import { Job, JobStatus } from '../types';

const HomePage: React.FC = () => {
  const { jobs, isLoading, currentUser } = useAppData();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Memoize the separation of jobs into recommended and others to avoid re-calculating on every render.
  const { recommendedJobs, otherJobs } = useMemo(() => {
    if (isLoading || !currentUser) {
      // Return all jobs sorted if there's no user or still loading
      return { 
        recommendedJobs: [], 
        otherJobs: [...jobs].sort((a, b) => (b.isUrgent ? 1 : -1) - (a.isUrgent ? 1 : -1))
      };
    }

    const recJobs: Job[] = [];
    const othJobs: Job[] = [];
    
    // Efficiently partition jobs into two lists in a single pass
    jobs.forEach(job => {
      if (
        job.status === JobStatus.OPEN &&
        job.postedBy !== currentUser.id &&
        currentUser.skills.includes(job.category)
      ) {
        recJobs.push(job);
      } else {
        othJobs.push(job);
      }
    });
    
    const sortFn = (a: Job, b: Job) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
    recJobs.sort(sortFn);
    othJobs.sort(sortFn);

    return { recommendedJobs: recJobs, otherJobs: othJobs };
  }, [jobs, currentUser, isLoading]);

  // Memoize the final filtered lists based on the category filter
  const { filteredRecommended, filteredOthers } = useMemo(() => {
    if (categoryFilter === 'all') {
      return { filteredRecommended: recommendedJobs, filteredOthers: otherJobs };
    }
    return {
      filteredRecommended: recommendedJobs.filter(job => job.category === categoryFilter),
      filteredOthers: otherJobs.filter(job => job.category === categoryFilter),
    };
  }, [recommendedJobs, otherJobs, categoryFilter]);
  
  const noJobsFound = filteredRecommended.length === 0 && filteredOthers.length === 0;

  return (
    <div className="space-y-12">
      <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border">
        <GeminiQuickPost />
      </section>

      <section>
        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
                 {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="space-y-8">
                        {filteredRecommended.length > 0 && (
                             <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Recommended For You</h2>
                                <div className="space-y-4">
                                    {filteredRecommended.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                             </section>
                        )}
                        
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                {recommendedJobs.length > 0 ? 'More Jobs' : 'Recent Jobs'}
                            </h2>
                            {filteredOthers.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredOthers.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                            ) : (
                                !noJobsFound && <p className="text-slate-500">No more jobs to show.</p>
                            )}
                            {noJobsFound && <p className="text-slate-500">No jobs found for the selected category.</p>}
                        </section>
                    </div>
                )}
            </div>
            <aside className="space-y-6 md:sticky md:top-24">
                 <WeatherWidget />
                 <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <label htmlFor="category-filter" className="font-semibold text-slate-700 mb-2 block">Filter by Category</label>
                     <Select 
                        label=""
                        id="category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                </div>
            </aside>
        </div>
      </section>
    </div>
  );
};

export default HomePage;