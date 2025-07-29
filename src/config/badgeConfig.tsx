import React from 'react';
import { BadgeType } from '../types';
import { ShieldCheckIcon, StarIcon, BoltIcon } from '../components/Icons';

export interface BadgeConfig {
  label: string;
  icon: React.ReactElement;
  color: 'blue' | 'amber' | 'purple';
}

export const badgeConfig: Record<BadgeType, BadgeConfig> = {
  [BadgeType.ID_VERIFIED]: {
    label: 'ID Verified',
    icon: <ShieldCheckIcon className="w-5 h-5 text-blue-600" />,
    color: 'blue',
  },
  [BadgeType.COMMUNITY_PRO]: {
    label: 'Community Pro',
    icon: <StarIcon className="w-5 h-5 text-amber-500" />,
    color: 'amber',
  },
  [BadgeType.FAST_RESPONDER]: {
    label: 'Fast Responder',
    icon: <BoltIcon className="w-5 h-5 text-purple-600" />,
    color: 'purple',
  },
};