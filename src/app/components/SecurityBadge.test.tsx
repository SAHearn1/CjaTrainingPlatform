/**
 * SecurityBadge.test.tsx — Component tests for access guards (#124)
 *
 * Tests: RequireRole, LicenseGate, RequireSuperAdmin
 *
 * Strategy:
 *  - Mock react-router's Navigate/Outlet to render sentinel divs so we can
 *    assert redirect targets and successful pass-throughs without a real Router.
 *  - Mock useAuth to return configured auth state per test.
 *  - Wrap in MemoryRouter so hooks that call useNavigate don't throw.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RequireRole, LicenseGate, RequireSuperAdmin } from './SecurityBadge';

// ── Mock react-router Navigate + Outlet ──────────────────────────────────────
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to} />
    ),
    Outlet: () => <div data-testid="outlet">outlet-content</div>,
    useNavigate: () => vi.fn(),
  };
});

// ── Mock useAuth ─────────────────────────────────────────────────────────────
const mockUseAuth = vi.fn();
vi.mock('./AuthContext', () => ({ useAuth: () => mockUseAuth() }));

// ── Mock motion/react to avoid animation overhead ────────────────────────────
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, motion: { div: ({ children }: any) => <div>{children}</div> } };
});

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// ── RequireRole ──────────────────────────────────────────────────────────────

describe('RequireRole', () => {
  it('renders children when the user has the required permission', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'admin' }, user: {} });
    wrap(
      <RequireRole permission="admin:dashboard">
        <div data-testid="protected">admin content</div>
      </RequireRole>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('renders fallback when permission is denied', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'cpi' }, user: {} });
    wrap(
      <RequireRole permission="admin:dashboard" fallback={<div data-testid="fallback">no access</div>}>
        <div data-testid="protected">admin content</div>
      </RequireRole>
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders AccessDenied when no fallback provided and permission denied', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'cpi' }, user: {} });
    wrap(
      <RequireRole permission="admin:dashboard">
        <div data-testid="protected">admin content</div>
      </RequireRole>
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('renders children when allowedRoles includes the user role', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'supervisor' }, user: {} });
    wrap(
      <RequireRole allowedRoles={['supervisor', 'admin']}>
        <div data-testid="protected">supervisor content</div>
      </RequireRole>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('denies access when allowedRoles excludes the user role', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'cpi' }, user: {} });
    wrap(
      <RequireRole allowedRoles={['supervisor', 'admin']} fallback={<div data-testid="denied" />}>
        <div data-testid="protected">content</div>
      </RequireRole>
    );
    expect(screen.getByTestId('denied')).toBeInTheDocument();
  });

  it('renders children when minTier is satisfied', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'admin' }, user: {} });
    wrap(
      <RequireRole minTier="admin">
        <div data-testid="protected">content</div>
      </RequireRole>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  it('denies access when minTier is not met', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'cpi' }, user: {} });
    wrap(
      <RequireRole minTier="admin" fallback={<div data-testid="denied" />}>
        <div data-testid="protected">content</div>
      </RequireRole>
    );
    expect(screen.getByTestId('denied')).toBeInTheDocument();
  });
});

// ── LicenseGate ──────────────────────────────────────────────────────────────

describe('LicenseGate', () => {
  it('renders Outlet when licensing is disabled (pass-through for everyone)', () => {
    mockUseAuth.mockReturnValue({
      profile: { role: 'cpi' },
      loading: false,
      licenseActive: false,
      platformLicensingEnabled: false,
    });
    wrap(<LicenseGate />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders Outlet when license is active', () => {
    mockUseAuth.mockReturnValue({
      profile: { role: 'cpi' },
      loading: false,
      licenseActive: true,
      platformLicensingEnabled: true,
    });
    wrap(<LicenseGate />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to /licensing when license is inactive and licensing is enabled', () => {
    mockUseAuth.mockReturnValue({
      profile: { role: 'cpi' },
      loading: false,
      licenseActive: false,
      platformLicensingEnabled: true,
    });
    wrap(<LicenseGate />);
    const nav = screen.getByTestId('navigate');
    expect(nav).toHaveAttribute('data-to', '/licensing');
  });

  it('renders Outlet for admin regardless of license status', () => {
    mockUseAuth.mockReturnValue({
      profile: { role: 'admin' },
      loading: false,
      licenseActive: false,
      platformLicensingEnabled: true,
    });
    wrap(<LicenseGate />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders Outlet for superadmin regardless of license status', () => {
    mockUseAuth.mockReturnValue({
      profile: { role: 'superadmin' },
      loading: false,
      licenseActive: false,
      platformLicensingEnabled: true,
    });
    wrap(<LicenseGate />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders null while loading', () => {
    mockUseAuth.mockReturnValue({
      profile: null,
      loading: true,
      licenseActive: false,
      platformLicensingEnabled: false,
    });
    const { container } = wrap(<LicenseGate />);
    expect(container.firstChild).toBeNull();
  });
});

// ── RequireSuperAdmin ─────────────────────────────────────────────────────────

describe('RequireSuperAdmin', () => {
  it('renders Outlet when user is superadmin', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'superadmin' }, loading: false });
    wrap(<RequireSuperAdmin />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('redirects to /dashboard when user is admin (not superadmin)', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'admin' }, loading: false });
    wrap(<RequireSuperAdmin />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });

  it('redirects to /dashboard when user is a learner role', () => {
    mockUseAuth.mockReturnValue({ profile: { role: 'cpi' }, loading: false });
    wrap(<RequireSuperAdmin />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });

  it('renders null while loading', () => {
    mockUseAuth.mockReturnValue({ profile: null, loading: true });
    const { container } = wrap(<RequireSuperAdmin />);
    expect(container.firstChild).toBeNull();
  });
});
