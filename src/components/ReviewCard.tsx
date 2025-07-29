import React from 'react';
import { Review } from '../types';
import { useAppData } from '../hooks/useAppData.tsx';
import { StarIcon } from './Icons';
import Card from './ui/Card';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const { getUserById } = useAppData();
    const reviewer = getUserById(review.reviewerId);

    if (!reviewer) {
        return null;
    }
    
    return (
        <Card className="p-4 border">
            <div className="flex items-start space-x-4">
                <img src={reviewer.avatarUrl} alt={reviewer.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-800">{reviewer.name}</p>
                            <p className="text-xs text-slate-500">{review.date}</p>
                        </div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-slate-300'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="mt-2 text-slate-600">{review.comment}</p>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCard;