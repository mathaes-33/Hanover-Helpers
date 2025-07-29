import React, { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Job, User, JobStatus, Review, UserWithStats, JobCategory, BadgeType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

interface AppDataContextType {
    jobs: Job[];
    helpers: UserWithStats[];
    currentUser: UserWithStats | null;
    isLoading: boolean;
    getUserById: (id: string) => UserWithStats | undefined;
    getJobById: (id: string) => Job | undefined;
    addJob: (jobData: Omit<Job, 'id' | 'postedBy' | 'status' | 'applicants'>) => Promise<Job>;
    addReview: (reviewData: Omit<Review, 'id' | 'date' | 'reviewerId'>) => Promise<void>;
    expressInterest: (jobId: string) => Promise<void>;
    awardJob: (jobId: string, helperId: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
    const { user: authUser, isInitialized: authIsInitialized } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [initialUsers, initialJobs] = await Promise.all([
                    api.getUsers(),
                    api.getJobs()
                ]);
                setUsers(initialUsers);
                setJobs(initialJobs);
            } catch (error) {
                console.error("Failed to load initial data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);
    
    useEffect(() => {
      // Create a new app user if a new auth user signs up
      const handleNewUser = async () => {
          if (authIsInitialized && authUser && !users.some(u => u.id === authUser.id)) {
              console.log("Creating new user profile for:", authUser.email);
              const newUser: User = {
                  id: authUser.id,
                  name: authUser.user_metadata?.full_name || authUser.email || 'New User',
                  avatarUrl: authUser.user_metadata?.avatar_url || `https://picsum.photos/seed/${authUser.id}/100/100`,
                  location: 'Hanover',
                  bio: 'New Hanover Helpers member!',
                  skills: [],
                  reviews: [],
                  isVerified: false,
                  memberSince: new Date().getFullYear().toString(),
                  badges: [],
              };
              const updatedUsers = [...users, newUser];
              setUsers(updatedUsers);
              await api.saveUsers(updatedUsers);
          }
      };
      handleNewUser();
    }, [authUser, authIsInitialized, users]);


    useEffect(() => {
        if (!isLoading) {
            api.saveJobs(jobs);
        }
    }, [jobs, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            api.saveUsers(users);
        }
    }, [users, isLoading]);

    const usersWithStats = useMemo(() => {
        const jobsPostedCount: Record<string, number> = {};
        const jobsCompletedCount: Record<string, number> = {};

        for (const job of jobs) {
            jobsPostedCount[job.postedBy] = (jobsPostedCount[job.postedBy] || 0) + 1;
            if (job.assignedTo && job.status === JobStatus.COMPLETED) {
                jobsCompletedCount[job.assignedTo] = (jobsCompletedCount[job.assignedTo] || 0) + 1;
            }
        }

        return users.map((user): UserWithStats => {
            const reviewCount = user.reviews.length;
            const totalRating = user.reviews.reduce((acc, review) => acc + review.rating, 0);
            const rating = reviewCount > 0 ? totalRating / reviewCount : 0;

            return {
                ...user,
                rating: parseFloat(rating.toFixed(1)),
                reviewCount,
                jobsPosted: jobsPostedCount[user.id] || 0,
                jobsCompleted: jobsCompletedCount[user.id] || 0,
            };
        });
    }, [users, jobs]);

    const currentUser = useMemo(() => {
        if (!authUser) return null;
        return usersWithStats.find(u => u.id === authUser.id) || null;
    }, [authUser, usersWithStats]);

    const getUserById = useCallback((id: string) => usersWithStats.find(u => u.id === id), [usersWithStats]);
    const getJobById = useCallback((id: string) => jobs.find(j => j.id === id), [jobs]);

    const addJob = useCallback(async (jobData: Omit<Job, 'id' | 'postedBy' | 'status' | 'applicants'>): Promise<Job> => {
        if (!currentUser) throw new Error("You must be logged in to post a job.");
        const newJob: Job = {
            ...jobData,
            id: uuidv4(),
            postedBy: currentUser.id,
            status: JobStatus.OPEN,
            applicants: [],
        };
        setJobs(prevJobs => [newJob, ...prevJobs]);
        return newJob;
    }, [currentUser]);

    const addReview = useCallback(async (reviewData: Omit<Review, 'id' | 'date' | 'reviewerId'>) => {
        if (!currentUser) throw new Error("You must be logged in to leave a review.");
        const job = getJobById(reviewData.jobId);
        if (!job || !job.assignedTo) throw new Error("Cannot find the helper for this job.");

        const newReview: Review = {
            ...reviewData,
            id: uuidv4(),
            reviewerId: currentUser.id,
            date: 'Just now',
        };

        setUsers(prevUsers => prevUsers.map(user =>
            user.id === job.assignedTo
                ? { ...user, reviews: [newReview, ...user.reviews] }
                : user
        ));
    }, [currentUser, getJobById]);

    const expressInterest = useCallback(async (jobId: string): Promise<void> => {
        if (!currentUser) throw new Error("You must be logged in to express interest.");
        await new Promise(res => setTimeout(res, 300)); // simulate network
        setJobs(prevJobs => prevJobs.map(job => {
            if (job.id === jobId && !job.applicants?.includes(currentUser.id)) {
                return { ...job, applicants: [...(job.applicants || []), currentUser.id] };
            }
            return job;
        }));
    }, [currentUser]);

    const awardJob = useCallback(async (jobId: string, helperId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 300)); // simulate network
        setJobs(prevJobs => prevJobs.map(job => {
            if (job.id === jobId) {
                return { ...job, assignedTo: helperId, status: JobStatus.IN_PROGRESS, applicants: [] };
            }
            return job;
        }));
    }, []);

    const value = useMemo(() => ({
        jobs,
        helpers: usersWithStats,
        currentUser,
        isLoading: isLoading || !authIsInitialized,
        getUserById,
        getJobById,
        addJob,
        addReview,
        expressInterest,
        awardJob,
    }), [jobs, usersWithStats, currentUser, isLoading, authIsInitialized, getUserById, getJobById, addJob, addReview, expressInterest, awardJob]);

    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = (): AppDataContextType => {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};