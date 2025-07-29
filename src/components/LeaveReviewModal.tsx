import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { UserWithStats } from '../types';
import Button from './ui/Button';
import { XMarkIcon, StarIcon } from './Icons';
import { useAppData } from '../hooks/useAppData.tsx';
import { useToast } from '../contexts/ToastContext';

interface LeaveReviewModalProps {
  isOpen?: boolean; // Can be controlled externally
  onClose: () => void;
  jobId: string;
  helper: UserWithStats | null;
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ isOpen = true, onClose, jobId, helper }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addReview } = useAppData();
  const { showToast } = useToast();

  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot || !isOpen || !helper) return null;

  const validate = (): boolean => {
    if (rating === 0) {
      setError('Please select a star rating to continue.');
      return false;
    }
    if (rating <= 3 && !comment.trim()) {
      setError('To ensure high-quality feedback, please provide a comment for ratings of 3 stars or less.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    try {
      await addReview({
        jobId,
        rating,
        comment,
      });
      showToast('Thank you for your review!', 'success');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit review.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Leave a Review for {helper.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="font-semibold text-slate-700 mb-2">Your Rating</p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setRating(starValue);
                      setError(null);
                    }}
                    aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                  >
                    <StarIcon className={`w-8 h-8 cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="font-semibold text-slate-700 mb-2 block">Your Comments {rating > 0 && rating <= 3 ? '(Required)' : '(Optional)'}</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError(null);
              }}
              placeholder={`How was your experience with ${helper.name.split(' ')[0]}?`}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50"
              aria-required={rating > 0 && rating <= 3}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg" role="alert">
              {error}
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <Button onClick={handleSubmit} loading={isLoading} disabled={rating === 0}>Submit Review</Button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default LeaveReviewModal;