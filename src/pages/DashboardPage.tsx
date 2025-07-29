import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData.tsx';
import JobCard from '../components/JobCard';
import { ToggleSwitch } from '../components/ui/FormControls';
import Button from '../components/ui/Button';
import { Job, JobStatus } from '../types';
import LeaveReviewModal from '../components/LeaveReviewModal';
import ApplicantList from '../components/ApplicantList';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from '../components/Icons';

const DashboardPage: React.FC = () => {
  const { jobs, currentUser, isLoading, helpers } = useAppData();
  const { login } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [reviewModalJob, setReviewModalJob] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SpinnerIcon className="w-12 h-12 text-primary" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">My Dashboard</h1>
            <p className="text-slate-500 mb-6">Please log in to see your dashboard and manage your jobs.</p>
            <Button onClick={login} size="lg">Login</Button>
        </div>
      )
  }

  // Memoize filtered job lists to prevent re-calculation on every render.
  const myPostedJobs = useMemo(() => {
    return jobs
      .filter(job => job.postedBy === currentUser?.id)
      .sort((a, b) => b.id.localeCompare(a.id)); // Sort by most recent first
  }, [jobs, currentUser]);

  const myActiveJobs = useMemo(() => {
    return jobs.filter(job => job.assignedTo === currentUser?.id);
  }, [jobs, currentUser]);


  const getHelperForJob = useCallback((jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !job.assignedTo) return null;
    return helpers.find(h => h.id === job.assignedTo);
  }, [jobs, helpers]);

  // Helper function to render the footer for a posted job card.
  // This cleans up the main return statement and improves readability.
  const renderJobFooter = (job: Job) => {
    switch (job.status) {
      case JobStatus.OPEN:
        if (job.applicants && job.applicants.length > 0) {
          return <ApplicantList jobId={job.id} applicantIds={job.applicants} />;
        }
        return (
          <div className="bg-slate-100 p-3 -mt-2 rounded-b-lg text-sm text-slate-500">
            No applicants yet.
          </div>
        );
      case JobStatus.COMPLETED:
        if (job.assignedTo) {
          return (
            <div className="bg-slate-100 p-3 -mt-2 rounded-b-lg flex justify-end">
              <Button size="sm" onClick={() => setReviewModalJob(job.id)}>
                Leave Review
              </Button>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };


  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your jobs and applications.</p>
        </div>

        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <ToggleSwitch 
              label="Available for jobs right now"
              enabled={isAvailable}
              setEnabled={setIsAvailable}
          />
          <p className="text-sm text-slate-500 mt-2">
              Turn this on to get notified about urgent jobs near you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Jobs I've Posted</h2>
          {myPostedJobs.length > 0 ? (
            <div className="space-y-4">
              {myPostedJobs.map(job => (
                <div key={job.id}>
                  <JobCard job={job} />
                  {renderJobFooter(job)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">You haven't posted any jobs yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Jobs I'm Working On</h2>
          {myActiveJobs.length > 0 ? (
            <div className="space-y-4">
              {myActiveJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <p className="text-slate-500 bg-white p-6 rounded-lg text-center border">You aren't signed up for any jobs right now. <Link to="/browse" className="text-primary font-semibold">Find a job!</Link></p>
          )}
        </section>

        <section className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold">Want to stand out?</h3>
              <p className="mt-1">Upgrade to Helper Pro to see jobs 30 minutes earlier and get a Pro badge!</p>
              <Button variant="secondary" className="mt-4">Learn More</Button>
        </section>
      </div>

      {reviewModalJob && (
        <LeaveReviewModal 
          jobId={reviewModalJob}
          helper={getHelperForJob(reviewModalJob)}
          onClose={() => setReviewModalJob(null)}
        />
      )}
    </>
  );
};

export default DashboardPage;