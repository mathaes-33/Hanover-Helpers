import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData.tsx';
import { StarIcon, LocationPinIcon, MessageIcon, SparklesIcon } from '../components/Icons';
import Button from '../components/ui/Button';
import NotFoundPage from './NotFoundPage';
import { badgeConfig } from '../config/badgeConfig';
import ReviewCard from '../components/ReviewCard';
import Badge from '../components/ui/Badge';
import { JobStatus } from '../types';
import DropdownMenu from '../components/ui/DropdownMenu';

type ProfileTab = 'about' | 'reviews';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById, jobs } = useAppData();
  const [activeTab, setActiveTab] = useState<ProfileTab>('about');

  const user = id ? getUserById(id) : undefined;
  
  const menuOptions = [{ label: 'Report User', onClick: () => alert('User reported. Thank you for your feedback.') }];

  if (!user) {
    return <NotFoundPage message="Sorry, we couldn't find that user." />;
  }

  // Memoize the completed jobs calculation to prevent re-filtering on every render.
  const completedJobs = useMemo(() => {
    return jobs.filter(j => j.assignedTo === user.id && j.status === JobStatus.COMPLETED);
  }, [jobs, user.id]);

  const getTabClass = (tab: ProfileTab) =>
    activeTab === tab
      ? 'border-primary text-primary'
      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300';

  return (
    <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-lg border overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center text-center border-r border-slate-200">
          <img className="h-32 w-32 rounded-full ring-4 ring-primary-light" src={user.avatarUrl} alt={user.name} />
          <h1 className="text-2xl font-bold text-slate-800 mt-4">{user.name}</h1>
          <div className="flex items-center space-x-1 mt-1 text-slate-500">
            <LocationPinIcon className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
         
          <div className="mt-4 space-y-2 w-full">
            {user.badges.map(badge => {
                const config = badgeConfig[badge];
                if (!config) return null;
                return (
                    <div key={badge} className="flex items-center space-x-2 p-2 rounded-lg bg-white border border-slate-200">
                        {config.icon}
                        <span className="font-semibold text-sm text-slate-700">{config.label}</span>
                    </div>
                );
            })}
          </div>

          <Button variant="secondary" className="mt-6 w-full flex items-center justify-center space-x-2">
            <MessageIcon className="w-5 h-5" />
            <span>Send Message</span>
          </Button>
        </div>
        <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-primary-dark">Community Standing</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                      <StarIcon className="w-6 h-6 text-amber-400" />
                      <span className="text-xl font-bold text-slate-700">{user.rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-500 pt-1">{`/ 5.0 (${user.reviewCount} reviews)`}</span>
                  </div>
                  <DropdownMenu options={menuOptions} />
                </div>
            </div>
            
            <div className="border-b border-slate-200 mt-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('about')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('about')}`}>
                        About
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('reviews')}`}>
                        Reviews ({user.reviewCount})
                    </button>
                </nav>
            </div>

           <div className="mt-6">
                {activeTab === 'about' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-slate-700">About {user.name.split(' ')[0]}</h3>
                            <p className="mt-1 text-slate-600">{user.bio}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-700">Skills</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {user.skills.map(skill => (
                                    <Badge key={skill}>{skill}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <h3 className="font-semibold text-slate-700">Community Stats</h3>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div className="bg-slate-100 p-3 rounded-lg">
                                      <p className="text-2xl font-bold text-primary-dark">{user.jobsCompleted}</p>
                                      <p className="text-sm text-slate-600">Jobs Completed</p>
                                  </div>
                                  <div className="bg-slate-100 p-3 rounded-lg">
                                      <p className="text-2xl font-bold text-primary-dark">{user.jobsPosted}</p>
                                      <p className="text-sm text-slate-600">Jobs Posted</p>
                                  </div>
                              </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-700">Recent Job History</h3>
                            <div className="mt-2 bg-slate-100 p-3 rounded-lg">
                                {completedJobs.length > 0 ? (
                                    <ul className="space-y-1 list-disc list-inside text-slate-600 text-sm">
                                        {completedJobs.slice(0, 3).map(job => (
                                            <li key={job.id}>Completed: {job.title}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500">No completed jobs yet.</p>
                                )}
                            </div>
                          </div>
                        </div>
                    </div>
                )}
                {activeTab === 'reviews' && (
                     <div className="space-y-4">
                        {user.reviews.length > 0 ? (
                            user.reviews.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <p className="text-slate-500">This helper has no reviews yet.</p>
                        )}
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;