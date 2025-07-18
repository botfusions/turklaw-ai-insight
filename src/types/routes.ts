import { ComponentType } from 'react';

export enum RouteProtectionLevel {
  PUBLIC = 'public',
  GUEST_ONLY = 'guest_only',
  AUTHENTICATED = 'authenticated',
  PLAN_RESTRICTED = 'plan_restricted',
  ADMIN_ONLY = 'admin_only'
}

export type PlanType = 'free' | 'basic' | 'premium';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  protection: RouteProtectionLevel;
  requiredPlan?: PlanType;
  requiresEmailVerification?: boolean;
  requiresSearchLimit?: boolean;
  fallbackRoute?: string;
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface RouteGuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

export interface SmartRedirectState {
  intendedRoute?: string;
  timestamp: number;
}