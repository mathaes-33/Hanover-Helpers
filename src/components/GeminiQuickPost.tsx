import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { SparklesIcon } from './Icons';
import { parseJobWithGemini } from '../lib/gemini';
import { useToast } from '../contexts/ToastContext';
import GeminiConfirmationModal from './GeminiConfirmationModal';
import { Job } from '../types';

const GeminiQuickPost: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [parsedJob, setParsedJob] = useState<Partial<Job> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            showToast("Please describe the job you need help with.", 'error');
            return;
        }
        setIsLoading(true);

        try {
            const jobData = await parseJobWithGemini(prompt);
            setParsedJob(jobData);
            setIsModalOpen(true);
            setPrompt(''); // Clear prompt after successful parse
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-primary-dark">
                        What do you need help with?
                    </h2>
                </div>
                <p className="mt-2 text-slate-600">
                    Describe the job in plain English. Our AI will handle the rest.
                </p>
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., I need someone to mow my lawn this Saturday for about $50"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 text-lg"
                        disabled={isLoading}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <Button onClick={handleSubmit} size="lg" loading={isLoading}>
                        Create Job
                    </Button>
                </div>
            </div>
            {isModalOpen && parsedJob && (
                <GeminiConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    jobData={parsedJob}
                />
            )}
        </>
    );
};

export default GeminiQuickPost;