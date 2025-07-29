

import React, { useCallback } from 'react';
import { useAppData } from '../hooks/useAppData.tsx';
import Button from './ui/Button';
import { StarIcon, MessageIcon } from './Icons';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

interface ApplicantListProps {
    jobId: string;
    applicantIds: string[];
}

const ApplicantList: React.FC<ApplicantListProps> = ({ jobId, applicantIds }) => {
    const { getUserById, awardJob } = useAppData();
    const { showToast } = useToast();

    const handleAwardJob = useCallback((helperId: string, helperName: string) => {
        awardJob(jobId, helperId);
        showToast(`Job awarded to ${helperName}!`, 'success');
    }, [jobId, awardJob, showToast]);

    return (
        <div className="bg-slate-100 p-4 -mt-2 rounded-b-lg space-y-3">
            <h4 className="font-bold text-slate-700">Applicants ({applicantIds.length})</h4>
            {applicantIds.map(id => {
                const applicant = getUserById(id);
                if (!applicant) return null;

                return (
                    <div key={id} className="bg-white p-3 rounded-lg flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <img src={applicant.avatarUrl} alt={applicant.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <Link to={`/profile/${applicant.id}`} className="font-semibold text-slate-800 hover:text-primary">{applicant.name}</Link>
                                <div className="flex items-center text-sm text-slate-500">
                                    <StarIcon className="w-4 h-4 text-amber-400 mr-1" />
                                    <span>{applicant.rating.toFixed(1)} ({applicant.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Link to="/messages">
                                <Button variant="secondary" size="sm">
                                    <MessageIcon className="w-4 h-4" />
                                    <span className="sr-only">Message</span>
                                </Button>
                            </Link>
                            <Button size="sm" onClick={() => handleAwardJob(applicant.id, applicant.name)}>
                                Award Job
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ApplicantList;