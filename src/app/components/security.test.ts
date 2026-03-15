import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  getAccessTier,
  canAccessModule,
  canAccessRoute,
  validatePassword,
  ROLE_TIER_MAP,
} from './security';

describe('hasPermission', () => {
  it('grants learner basic permissions', () => {
    expect(hasPermission('cpi', 'modules:read')).toBe(true);
    expect(hasPermission('law_enforcement', 'certificates:generate')).toBe(true);
    expect(hasPermission('cpi', 'assessments:take')).toBe(true);
    expect(hasPermission('cpi', 'simulations:run')).toBe(true);
  });

  it('denies learner admin permissions', () => {
    expect(hasPermission('cpi', 'admin:dashboard')).toBe(false);
    expect(hasPermission('law_enforcement', 'admin:users')).toBe(false);
    expect(hasPermission('cpi', 'modules:write')).toBe(false);
  });

  it('grants admin all permissions', () => {
    expect(hasPermission('admin', 'admin:dashboard')).toBe(true);
    expect(hasPermission('admin', 'admin:users')).toBe(true);
    expect(hasPermission('admin', 'admin:export')).toBe(true);
    expect(hasPermission('admin', 'modules:write')).toBe(true);
    expect(hasPermission('admin', 'reports:view')).toBe(true);
  });

  it('grants supervisor reporting permissions', () => {
    expect(hasPermission('supervisor', 'reports:view')).toBe(true);
    expect(hasPermission('supervisor', 'certificates:verify')).toBe(true);
    expect(hasPermission('supervisor', 'assessments:review')).toBe(true);
  });

  it('denies supervisor admin write permissions', () => {
    expect(hasPermission('supervisor', 'admin:dashboard')).toBe(false);
    expect(hasPermission('supervisor', 'modules:write')).toBe(false);
  });

  it('returns false for unknown role', () => {
    expect(hasPermission('unknown_role', 'admin:dashboard')).toBe(false);
  });
});

describe('getAccessTier', () => {
  it('maps known roles to correct tiers', () => {
    expect(getAccessTier('admin')).toBe('admin');
    expect(getAccessTier('supervisor')).toBe('supervisor');
    expect(getAccessTier('cpi')).toBe('learner');
    expect(getAccessTier('law_enforcement')).toBe('learner');
    expect(getAccessTier('superadmin')).toBe('superadmin');
  });

  it('defaults unknown roles to learner', () => {
    expect(getAccessTier('unknown')).toBe('learner');
  });
});

describe('canAccessModule', () => {
  it('allows learner roles to access all modules', () => {
    for (let i = 1; i <= 7; i++) {
      expect(canAccessModule('cpi', i)).toBe(true);
      expect(canAccessModule('law_enforcement', i)).toBe(true);
    }
  });

  it('allows admin to access all modules', () => {
    for (let i = 1; i <= 7; i++) {
      expect(canAccessModule('admin', i)).toBe(true);
    }
  });
});

describe('canAccessRoute', () => {
  it('allows learners to access module routes', () => {
    expect(canAccessRoute('cpi', '/modules')).toBe(true);
    expect(canAccessRoute('cpi', '/dashboard')).toBe(true);
    expect(canAccessRoute('cpi', '/certificates')).toBe(true);
  });

  it('denies learners admin routes', () => {
    expect(canAccessRoute('cpi', '/admin')).toBe(false);
    expect(canAccessRoute('law_enforcement', '/admin/users')).toBe(false);
  });

  it('allows admin to access admin routes', () => {
    expect(canAccessRoute('admin', '/admin')).toBe(true);
    expect(canAccessRoute('admin', '/admin/users')).toBe(true);
  });

  it('denies learners access to licensing route (RequireSuperAdmin guarded)', () => {
    expect(canAccessRoute('cpi', '/licensing')).toBe(false);
    expect(canAccessRoute('admin', '/licensing')).toBe(false);
    expect(canAccessRoute('superadmin', '/licensing')).toBe(true);
  });
});

describe('validatePassword', () => {
  it('accepts a strong password', () => {
    const result = validatePassword('Secure#Pass99!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects passwords shorter than 8 characters', () => {
    const result = validatePassword('Sh0rt!');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('8'))).toBe(true);
  });

  it('rejects passwords without uppercase', () => {
    const result = validatePassword('nouppercase1!@#');
    expect(result.valid).toBe(false);
  });

  it('rejects passwords without lowercase', () => {
    const result = validatePassword('NOLOWERCASE1!@#');
    expect(result.valid).toBe(false);
  });

  it('rejects passwords without numbers', () => {
    const result = validatePassword('NoNumbers!@#abc');
    expect(result.valid).toBe(false);
  });

  it('rejects passwords without special characters', () => {
    const result = validatePassword('NoSpecialChar99');
    expect(result.valid).toBe(false);
  });

  it('reports strength as strong for 12+ char passwords', () => {
    const result = validatePassword('Secure#Pass99!Long');
    expect(result.strength).toBe('very_strong');
  });
});

describe('ROLE_TIER_MAP', () => {
  it('contains all expected CJA roles', () => {
    const expectedRoles = ['cpi', 'law_enforcement', 'prosecutor', 'judge', 'medical', 'school', 'advocate', 'forensic', 'mandated_reporter', 'supervisor', 'admin'];
    for (const role of expectedRoles) {
      expect(ROLE_TIER_MAP).toHaveProperty(role);
    }
  });
});
