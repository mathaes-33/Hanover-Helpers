import { Job, User } from '../types';
import { MOCK_JOBS, MOCK_USERS } from './mockData';

// Helper to simulate network latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const JOBS_STORAGE_KEY = 'hanover-jobs';
const USERS_STORAGE_KEY = 'hanover-users';


export const getJobs = async (): Promise<Job[]> => {
  await sleep(400); // Simulate network delay
  try {
    const storedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
    if (storedJobs) {
      return JSON.parse(storedJobs);
    }
    // If no jobs in storage, initialize with mock data
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(MOCK_JOBS));
    return MOCK_JOBS;
  } catch (error) {
    console.error("Error fetching jobs, returning mock data.", error);
    return MOCK_JOBS;
  }
};

export const saveJobs = async (jobs: Job[]): Promise<void> => {
  await sleep(100);
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
};

export const getUsers = async (): Promise<User[]> => {
  await sleep(400);
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (parsed.length > 0) return parsed;
    }
    // If no users in storage, initialize with mock data
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  } catch (error) {
    console.error("Error fetching users, returning mock data.", error);
    return MOCK_USERS;
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  await sleep(100);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};
