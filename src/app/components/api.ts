import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-39a35780`;

async function request(path: string, options: RequestInit = {}, accessToken?: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // apikey is required by Supabase edge function gateway for JWT verification routing
    "apikey": publicAnonKey,
    Authorization: `Bearer ${accessToken || publicAnonKey}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`API error [${res.status}] ${path}:`, data);
    throw new Error(data.error || data.message || `Request failed: ${res.status}`);
  }
  return data;
}

// ---------- Auth ----------

export async function signUp(email: string, password: string, name: string) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  }, token);
}

// ---------- Profile ----------

export async function getProfile(token: string) {
  return request("/profile", {}, token);
}

export async function updateProfile(token: string, profile: Record<string, any>) {
  return request("/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  }, token);
}

// ---------- Progress ----------

export async function getProgress(token: string) {
  return request("/progress", {}, token);
}

export async function updateProgress(token: string, moduleId: number, data: Record<string, any>) {
  return request(`/progress/${moduleId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, token);
}

// ---------- Vignettes ----------

export async function getVignettes(token: string) {
  return request("/vignettes", {}, token);
}

export async function updateVignettes(token: string, watched: string[]) {
  return request("/vignettes", {
    method: "PUT",
    body: JSON.stringify({ watched }),
  }, token);
}

// ---------- Simulations ----------

export async function saveSimulation(token: string, data: Record<string, any>) {
  return request("/simulations", {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
}

export async function getSimulations(token: string) {
  return request("/simulations", {}, token);
}

// ---------- Admin ----------

export async function getAdminStats(token: string) {
  return request("/admin/stats", {}, token);
}

// ---------- Admin: User Management ----------

export async function getAdminUsers(token: string) {
  return request("/admin/users", {}, token);
}

export async function updateUserRole(token: string, targetUserId: string, newRole: string) {
  return request(`/admin/users/${targetUserId}/role`, {
    method: "PUT",
    body: JSON.stringify({ newRole }),
  }, token);
}

// ---------- Admin: Audit Logs ----------

export async function getAuditLogs(token: string) {
  return request("/admin/audit", {}, token);
}

// ---------- Certificates ----------

export async function generateCertificate(token: string) {
  return request("/certificates/generate", { method: "POST" }, token);
}

export async function getCertificates(token: string) {
  return request("/certificates", {}, token);
}

export async function getCertificate(certId: string) {
  return request(`/certificates/${certId}`);
}

// ---------- Licensing ----------

export async function getLicensePlans() {
  return request("/licensing/plans");
}

export async function getLicenseStatus(token: string) {
  return request("/licensing/status", {}, token);
}

export async function createCheckoutSession(
  token: string,
  data: { planId: string; quantity?: number; orgName?: string; successUrl: string; cancelUrl: string }
) {
  return request("/licensing/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
}

export async function confirmLicense(token: string, sessionId: string) {
  return request("/licensing/confirm", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  }, token);
}

// ---------- Platform Settings ----------

export async function getPlatformSettings(): Promise<{ licensingEnabled: boolean }> {
  return request("/platform/settings");
}

export async function updatePlatformSettings(token: string, settings: { licensingEnabled: boolean }) {
  return request("/platform/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  }, token);
}

// ---------- Video Registry ----------

export async function getVideoRegistry(): Promise<Record<string, any>> {
  return request("/videos");
}

export async function getAdminVideos(token: string) {
  return request("/admin/videos", {}, token);
}

export async function updateVideoEntry(
  token: string,
  videoId: string,
  data: { url?: string; status?: string }
) {
  return request(`/admin/videos/${videoId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, token);
}

export async function rootyChat(
  token: string | null,
  messages: Array<{ role: "user" | "assistant"; text: string }>
): Promise<{ reply: string }> {
  return request("/rooty/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  }, token);
}
// ---------- Supervisor ----------

export async function getSupervisorTeamProgress(token: string) {
  return request("/supervisor/team-progress", {}, token);
}

// ---------- Certificate PDF ----------

/**
 * Downloads the server-generated PDF for a certificate (#135).
 * Returns a Blob for client-side download via createObjectURL.
 */
export async function downloadCertificatePDF(token: string, certId: string): Promise<Blob> {
  const res = await fetch(`${BASE}/certificates/${certId}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: publicAnonKey,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "PDF generation failed" }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.blob();
}

export async function approveVideo(token: string, videoId: string, notes?: string) {
  return request(`/admin/videos/${encodeURIComponent(videoId)}/approve`, {
    method: "PUT",
    body: JSON.stringify({ notes }),
  }, token);
}

export async function rejectVideo(token: string, videoId: string, notes: string, url?: string) {
  return request(`/admin/videos/${encodeURIComponent(videoId)}/reject`, {
    method: "PUT",
    body: JSON.stringify({ notes, ...(url !== undefined ? { url } : {}) }),
  }, token);
}

export async function getContentOverrides(): Promise<Record<string, any>> {
  return request("/content-overrides");
}

export async function updateContentOverride(
  token: string,
  videoId: string,
  data: { content?: string[]; keyTerms?: Array<{ term: string; definition: string }> }
) {
  return request(`/admin/content-overrides/${encodeURIComponent(videoId)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, token);
}
