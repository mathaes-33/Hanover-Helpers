import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData.tsx';
import Button from '../components/ui/Button';
import { CheckCircleIcon } from '../components/Icons';
import JobCard from '../components/JobCard';
import NotFoundPage from './NotFoundPage';

const PostJobSuccessPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getJobById, isLoading } = useAppData();
    
    if (isLoading) {
        return <p>Loading...</p>
    }
    
    const job = id ? getJobById(id) : undefined;

    if (!job) {
        return <NotFoundPage message="Could not find the job you just posted." />
    }

    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <CheckCircleIcon className="w-20 h-20 text-primary mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-slate-800">Your Job is Live!</h1>
            <p className="mt-2 text-slate-500">
                You've successfully posted your job. Helpers in the community can now see it and express interest.
            </p>

            <div className="mt-8 text-left">
                <JobCard job={job} />
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <Link to="/browse">
                    <Button variant="secondary">Browse More Jobs</Button>
                </Link>
                <Link to="/dashboard">
                    <Button>Go to My Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};

export default PostJobSuccessPage;