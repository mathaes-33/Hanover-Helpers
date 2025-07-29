import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Job, User, BudgetType } from '../types';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { LocationPinIcon, CalendarIcon, XMarkIcon, MessageIcon } from './Icons';
import { useAppData } from '../hooks/useAppData.tsx';
import { useToast } from '../contexts/ToastContext';

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  user: User;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ isOpen, onClose, job, user }) => {
  const { expressInterest, currentUser } = useAppData();
  const { showToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot) {
    return null;
  }
  
  const handleExpressInterest = async () => {
    setIsApplying(true);
    try {
        await expressInterest(job.id);
        showToast("Your interest has been sent!", 'success');
    } catch (error) {
        showToast("Failed to express interest. Please try again.", 'error');
    } finally {
        setIsApplying(false);
    }
  };

  const hasApplied = job.applicants?.includes(currentUser?.id ?? '');

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800">{job.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
            <XMarkIcon className="w-6 h-6" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge color="green">{job.category}</Badge>
                {job.isUrgent && <Badge color="red">Urgent</Badge>}
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500 mt-3">
                <div className="flex items-center space-x-1.5">
                  <LocationPinIcon className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{job.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-3xl font-bold text-primary">{`$${job.budget.amount}`}</p>
              <p className="text-sm text-slate-500">{job.budget.type === BudgetType.FIXED ? 'Fixed Rate' : 'Per Hour'}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-slate-700">Job Description</h3>
            <p className="mt-1 text-slate-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-slate-700 mb-2">Posted By</h3>
            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg">
                <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full" />
                <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">Member since {user.memberSince}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="primary"
              onClick={handleExpressInterest}
              disabled={hasApplied || isApplying}
              loading={isApplying}
            >
              {hasApplied ? 'Interest Expressed' : 'Express Interest'}
            </Button>
            <Button className="w-full sm:w-auto" variant="secondary">
                <MessageIcon className="w-5 h-5 mr-2" />
                Message {user.name.split(' ')[0]}
            </Button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default JobDetailModal;