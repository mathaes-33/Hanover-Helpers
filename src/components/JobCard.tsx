import React, { useState } from 'react';
import { Job, BudgetType } from '../types';
import { useAppData } from '../hooks/useAppData.tsx';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { LocationPinIcon, CalendarIcon } from './Icons';
import Button from './ui/Button';
import JobDetailModal from './JobDetailModal';
import DropdownMenu from './ui/DropdownMenu';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { getUserById } = useAppData();
  const user = getUserById(job.postedBy);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuOptions = [{ label: 'Report Job', onClick: () => alert('Job reported. Thank you for your feedback.') }];

  return (
    <>
      <Card className="flex flex-col md:flex-row">
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <button onClick={() => setIsModalOpen(true)} className="text-left flex-grow pr-2">
                <h3 className="text-xl font-bold text-slate-800 hover:text-primary transition-colors">{job.title}</h3>
            </button>
            <div className="flex items-start space-x-2 flex-shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{`$${job.budget.amount}`}</p>
                  <p className="text-xs text-slate-500">{job.budget.type === BudgetType.FIXED ? 'Fixed' : '/hr'}</p>
                </div>
                <DropdownMenu options={menuOptions} />
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
              <div className="flex items-center space-x-1.5">
                  <LocationPinIcon className="w-4 h-4" />
                  <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{job.date}</span>
              </div>
          </div>
          <p className="text-slate-600 mt-3 text-sm">{job.description.substring(0, 120)}...</p>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Badge color="green">{job.category}</Badge>
            {job.isUrgent && <Badge color="red">Urgent</Badge>}
          </div>
        </div>
        <div className="bg-slate-50 p-4 md:w-56 flex-shrink-0 flex flex-col items-center justify-center text-center md:rounded-r-xl rounded-b-xl md:rounded-bl-none">
          {user && (
              <div className="flex flex-col items-center">
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mb-2" />
                  <p className="font-semibold text-slate-700">{user.name}</p>
                  <p className="text-xs text-slate-500">Posted</p>
              </div>
          )}
          <Button className="mt-4 w-full" onClick={() => setIsModalOpen(true)}>View Job</Button>
        </div>
      </Card>
      {user && <JobDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} job={job} user={user} />}
    </>
  );
};

export default JobCard;