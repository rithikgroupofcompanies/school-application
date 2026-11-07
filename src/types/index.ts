export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  user_type: 'platform' | 'school';
}

export interface School {
  id: number;
  school_code: string;
  name: string;
  short_name: string;
  board: string;
  school_type: string;
  medium: string;
  city: string;
  state: string;
  official_email: string;
  phone: string;
  onboarding_status: 'draft' | 'submitted' | 'verifying' | 'corrections_required' | 'approved' | 'rejected';
  account_status: 'pending' | 'active' | 'suspended' | 'archived';
  status_reason?: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  scope: string;
}

export interface Membership {
  id: number;
  user_id: number;
  school_id: number;
  role_id: number;
  status: string;
  school?: School;
  role?: Role;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  mfa_required?: boolean;
  multiple_memberships?: boolean;
  memberships?: Membership[];
  active_membership?: Membership;
  message?: string;
}

export interface DashboardStats {
  metrics: {
    total_schools: number;
    active_schools: number;
    pending_approvals: number;
    total_platform_staff: number;
  };
  recent_schools: School[];
  recent_audit_logs: Array<{
    id: number;
    action: string;
    entity_type: string;
    reason?: string;
    created_at: string;
    actor?: {
      full_name: string;
      email: string;
    };
  }>;
}
