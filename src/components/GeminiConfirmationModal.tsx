import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Job, JobCategory, BudgetType } from '../types';
import { useAppData } from '../hooks/useAppData.tsx';
import { useToast } from '../contexts/ToastContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { XMarkIcon, CalendarIcon, LocationPinIcon } from './Icons';

interface GeminiConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: Partial<Job>;
}

const GeminiConfirmationModal: React.FC<GeminiConfirmationModalProps> = ({ isOpen, onClose, jobData }) => {
  const [isPosting, setIsPosting] = useState(false);
  const { addJob } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handlePostJob = async () => {
    setIsPosting(true);
    try {
      const newJob = await addJob({
        title: jobData.title || 'Untitled Job',
        description: jobData.description || '',
        category: jobData.category || JobCategory.ERRANDS,
        location: jobData.location || 'Hanover',
        budget: jobData.budget || { type: BudgetType.FIXED, amount: 0 },
        date: jobData.date || 'Flexible',
        isUrgent: jobData.isUrgent || false,
      });
      showToast('Job posted successfully!', 'success');
      navigate(`/post-job/success/${newJob.id}`);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      showToast(message, 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditDetails = () => {
    navigate('/post-job', { state: { jobData } });
    onClose();
  };

  if (!isOpen) return null;

  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Confirm Your Job Post</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">{jobData.title}</h3>
          <div className="flex flex-wrap gap-2">
            {jobData.category && <Badge color="green">{jobData.category}</Badge>}
            {jobData.isUrgent && <Badge color="red">Urgent</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-500">Budget</p>
                <p className="text-lg font-bold text-primary">{`$${jobData.budget?.amount}`} <span className="text-xs font-normal text-slate-500">{jobData.budget?.type === BudgetType.HOURLY ? '/hr' : 'fixed'}</span></p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-500">When</p>
                <p className="text-lg font-bold text-slate-700">{jobData.date}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-700">Description</h4>
            <p className="mt-1 text-slate-600 bg-slate-50 p-3 rounded-lg border max-h-40 overflow-y-auto">{jobData.description}</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row-reverse gap-3">
          <Button onClick={handlePostJob} loading={isPosting} className="w-full sm:w-auto">
            Post Job
          </Button>
          <Button onClick={handleEditDetails} variant="secondary" className="w-full sm:w-auto">
            Edit Details
          </Button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default GeminiConfirmationModal;