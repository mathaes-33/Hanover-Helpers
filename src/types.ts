export enum JobCategory {
  LAWN_CARE = 'Lawn Care',
  HANDYMAN = 'Handyman',
  MOVING = 'Moving Help',
  ERRANDS = 'Errands',
  BABYSITTING = 'Babysitting',
  CLEANING = 'Cleaning',
  PET_CARE = 'Pet Care',
  SNOW_REMOVAL = 'Snow Removal',
}

export enum BudgetType {
  FIXED = 'Fixed Rate',
  HOURLY = 'Hourly',
}

export enum BadgeType {
  ID_VERIFIED = 'ID Verified',
  COMMUNITY_PRO = 'Community Pro',
  FAST_RESPONDER = 'Fast Responder',
}

export enum JobStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
}

export interface Budget {
  type: BudgetType;
  amount: number;
}

export interface Review {
    id: string;
    jobId: string;
    reviewerId: string; // The user who wrote the review
    rating: number; // e.g., 1-5
    comment: string;
    date: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  budget: Budget;
  date: string; // Using string for simplicity, can be Date object
  isUrgent: boolean;
  postedBy: string; // User ID
  assignedTo?: string; // User ID of the helper
  status: JobStatus;
  applicants?: string[];
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  location:string;
  bio: string;
  skills: JobCategory[];
  reviews: Review[];
  isVerified: boolean;
  memberSince: string;
  badges: BadgeType[];
}

// Derived stats, can be calculated
export type UserWithStats = User & {
    rating: number;
    reviewCount: number;
    jobsPosted: number;
    jobsCompleted: number;
};


export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}