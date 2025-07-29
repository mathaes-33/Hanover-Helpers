

import React from 'react';
import { UserWithStats } from '../types';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { StarIcon, LocationPinIcon, CheckCircleIcon } from './Icons';

interface HelperCardProps {
  helper: UserWithStats;
}

const HelperCard: React.FC<HelperCardProps> = ({ helper }) => {
  return (
    <Card className="text-center">
      <div className="p-6">
        <img className="w-24 h-24 mx-auto rounded-full ring-4 ring-primary-light" src={helper.avatarUrl} alt={helper.name} />
        <h3 className="mt-4 text-xl font-bold text-slate-800">{helper.name}</h3>
        <div className="flex items-center justify-center space-x-1 mt-1">
            <LocationPinIcon className="w-4 h-4 text-slate-400" />
            <p className="text-slate-500">{helper.location}</p>
        </div>
        
        <div className="flex justify-center items-center mt-2 space-x-1">
            <StarIcon className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-slate-600">{helper.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500">({helper.reviewCount} reviews)</span>
        </div>
        
        {helper.isVerified && (
          <div className="mt-2 flex items-center justify-center space-x-1 text-sm text-primary">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Verified Helper</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {helper.skills.slice(0, 3).map(skill => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>

        <p className="text-slate-600 mt-4 text-sm h-10">{helper.bio.substring(0, 70)}...</p>

        <Link to={`/profile/${helper.id}`} className="mt-4 inline-block w-full">
            <Button variant="secondary" className="w-full">View Profile</Button>
        </Link>
      </div>
    </Card>
  );
};

export default HelperCard;