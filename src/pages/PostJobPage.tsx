import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input, Select, Textarea } from '../components/ui/FormControls';
import Button from '../components/ui/Button';
import { JOB_CATEGORIES, LOCATIONS } from '../constants';
import { BudgetType, Job, JobCategory } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useAppData } from '../hooks/useAppData.tsx';
import { useAuth } from '../contexts/AuthContext';

type FormData = {
    title: string;
    description: string;
    category: JobCategory | '';
    location: string;
    budgetType: BudgetType;
    amount: string;
    date: string;
    isUrgent: boolean;
    isBoosted: boolean;
};

const PostJobPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { addJob, currentUser } = useAppData();
    const { login } = useAuth();
    
    const prefilledData = location.state?.jobData as Partial<Job> | null;

    const [formData, setFormData] = useState<FormData>({
        title: prefilledData?.title || '',
        description: prefilledData?.description || '',
        category: prefilledData?.category || '',
        location: 'Hanover',
        budgetType: prefilledData?.budget?.type || BudgetType.FIXED,
        amount: prefilledData?.budget?.amount?.toString() || '',
        date: prefilledData?.date || '',
        isUrgent: prefilledData?.isUrgent || false,
        isBoosted: false,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [id]: isCheckbox ? checked : value }));
    };
    
    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.title.trim()) newErrors.title = "Job title is required.";
        else if (formData.title.length > 50) newErrors.title = "Title must be 50 characters or less.";
        if (!formData.description.trim()) newErrors.description = "Job description is required.";
        if (!formData.category) newErrors.category = "Please select a job category.";
        const amountNum = Number(formData.amount);
        if (!formData.amount || isNaN(amountNum) || amountNum <= 0) newErrors.amount = "Please enter a valid, positive amount.";
        if (!formData.date.trim()) newErrors.date = "Date is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            showToast("Please log in to post a job.", "error");
            return;
        }
        if (validate()) {
            setIsLoading(true);
            try {
                const newJob = await addJob({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category as JobCategory,
                    location: formData.location,
                    budget: {
                        type: formData.budgetType,
                        amount: Number(formData.amount),
                    },
                    date: formData.date,
                    isUrgent: formData.isUrgent,
                });
                showToast('Job posted successfully!', 'success');
                navigate(`/post-job/success/${newJob.id}`);
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred.";
                showToast(message, 'error');
            } finally {
                setIsLoading(false);
            }
        }
    }
    
    if (!currentUser) {
      return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Post a Job</h1>
            <p className="text-slate-500 mb-6">You need to be logged in to post a new job opening.</p>
            <Button onClick={login} size="lg">Login to Post</Button>
        </div>
      )
    }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Post a New Job</h1>
      <p className="text-slate-500 mb-6">Fill out the details below to find the perfect helper.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Input label="Job Title" id="title" type="text" placeholder="e.g., Need help moving a couch" value={formData.title} onChange={handleChange} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
            <Textarea label="Job Description" id="description" rows={4} placeholder="Provide details about the task, any tools needed, etc." value={formData.description} onChange={handleChange} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <div>
            <Select label="Job Category" id="category" value={formData.category} onChange={handleChange}>
                <option value="" disabled>Select a category</option>
                {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
        <Select label="Location" id="location" value={formData.location} onChange={handleChange}>
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Budget Type" id="budgetType" value={formData.budgetType} onChange={handleChange}>
                <option value={BudgetType.FIXED}>Fixed Rate</option>
                <option value={BudgetType.HOURLY}>Hourly</option>
            </Select>
            <div>
              <Input label={formData.budgetType === BudgetType.FIXED ? "Total Amount ($)" : "Rate per Hour ($)"} id="amount" type="number" placeholder="e.g., 50" value={formData.amount} onChange={handleChange} />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
        </div>
        <div>
          <Input label="Date & Time" id="date" type="text" placeholder="e.g., This Saturday afternoon or Flexible" value={formData.date} onChange={handleChange} />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center">
                <input id="isUrgent" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" checked={formData.isUrgent} onChange={handleChange} />
                <label htmlFor="isUrgent" className="ml-2 block text-sm text-slate-900">This job is urgent</label>
            </div>
            <div className="flex items-center p-3 bg-primary-light/50 rounded-lg border border-primary-light">
                <input id="isBoosted" type="checkbox" className="h-4 w-4 text-accent focus:ring-accent border-slate-300 rounded" checked={formData.isBoosted} onChange={handleChange} />
                <label htmlFor="isBoosted" className="ml-2 block text-sm text-primary-dark font-medium">Boost this post for $3 to reach more helpers!</label>
            </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200">
            <Button type="submit" className="w-full text-lg" loading={isLoading}>Post Job</Button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;