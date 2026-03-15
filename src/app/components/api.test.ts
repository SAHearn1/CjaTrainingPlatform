/**
 * api.test.ts — RBAC integration tests for the edge function API layer (#123)
 *
 * Strategy: mock global `fetch` to simulate edge function responses.
 * Verifies that:
 *  1. Every authenticated request carries the correct Authorization header.
 *  2. 401 / 403 responses surface as thrown errors (not silently swallowed).
 *  3. RBAC-denied responses include a meaningful error message.
 *  4. The changePassword endpoint propagates server-side policy errors.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from './api';

const TEST_TOKEN = 'test-access-token';

function mockFetch(status: number, body: Record<string, unknown>) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('api request: Authorization header forwarding', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getProfile sends Bearer token in Authorization header', async () => {
    const fetchMock = mockFetch(200, { profile: { role: 'cpi' } });
    vi.stubGlobal('fetch', fetchMock);

    await api.getProfile(TEST_TOKEN);

    const callArgs = fetchMock.mock.calls[0];
    const headers = callArgs[1].headers as Record<string, string>;
    expect(headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(headers['apikey']).toBeTruthy();
  });

  it('updateProfile sends Bearer token', async () => {
    const fetchMock = mockFetch(200, { profile: { name: 'Test' } });
    vi.stubGlobal('fetch', fetchMock);

    await api.updateProfile(TEST_TOKEN, { name: 'Test' });

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
  });
});

describe('api request: 401 Unauthorized handling', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getProfile throws on 401', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Unauthorized' }));
    await expect(api.getProfile(TEST_TOKEN)).rejects.toThrow();
  });

  it('getProgress throws on 401', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Unauthorized' }));
    await expect(api.getProgress(TEST_TOKEN)).rejects.toThrow();
  });

  it('getAdminStats throws on 401', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Unauthorized' }));
    await expect(api.getAdminStats(TEST_TOKEN)).rejects.toThrow();
  });
});

describe('api request: 403 Forbidden / RBAC denied', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getAdminStats throws on 403 with server error message', async () => {
    vi.stubGlobal('fetch', mockFetch(403, { error: 'Forbidden: admin role required' }));
    await expect(api.getAdminStats(TEST_TOKEN)).rejects.toThrow('Forbidden: admin role required');
  });

  it('getAdminUsers throws on 403', async () => {
    vi.stubGlobal('fetch', mockFetch(403, { error: 'Forbidden: insufficient role' }));
    await expect(api.getAdminUsers(TEST_TOKEN)).rejects.toThrow('Forbidden: insufficient role');
  });
});

describe('api request: 429 Rate limit', () => {
  afterEach(() => vi.restoreAllMocks());

  it('signUp throws on 429 with rate-limit message', async () => {
    vi.stubGlobal('fetch', mockFetch(429, { error: 'Too many requests' }));
    await expect(api.signUp('a@b.com', 'pass', 'Test')).rejects.toThrow('Too many requests');
  });
});

describe('changePassword API', () => {
  afterEach(() => vi.restoreAllMocks());

  it('sends currentPassword and newPassword to the endpoint', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await api.changePassword(TEST_TOKEN, 'OldPass1!', 'NewPass2@');

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.currentPassword).toBe('OldPass1!');
    expect(body.newPassword).toBe('NewPass2@');
  });

  it('throws on 403 when current password is wrong', async () => {
    vi.stubGlobal('fetch', mockFetch(403, { error: 'Current password is incorrect.' }));
    await expect(api.changePassword(TEST_TOKEN, 'wrong', 'NewPass2@')).rejects.toThrow('Current password is incorrect.');
  });

  it('throws on 422 when new password fails CJIS policy', async () => {
    vi.stubGlobal('fetch', mockFetch(422, { error: 'Minimum 8 characters required' }));
    await expect(api.changePassword(TEST_TOKEN, 'OldPass1!', 'weak')).rejects.toThrow('Minimum 8 characters required');
  });
});

describe('api request: successful responses pass through', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getProfile returns profile object on 200', async () => {
    const profileData = { role: 'cpi', name: 'Test User' };
    vi.stubGlobal('fetch', mockFetch(200, { profile: profileData }));
    const result = await api.getProfile(TEST_TOKEN);
    expect(result.profile).toEqual(profileData);
  });

  it('generateCertificate returns cert on 200', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { certificate: { certId: 'abc123' } }));
    const result = await api.generateCertificate(TEST_TOKEN);
    expect(result.certificate.certId).toBe('abc123');
  });
});
