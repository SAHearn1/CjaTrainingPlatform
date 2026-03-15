import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Bell, Shield, Moon, Sun, KeyRound, Save, Loader2, CheckCircle2, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTheme } from "next-themes";
import { ROLES } from "./data";
import { changePassword } from "./api";
import { PasswordStrengthMeter } from "./SecurityBadge";

export function Settings() {
  const { profile, updateProfile, accessToken } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const [name, setName] = useState(profile?.name ?? "");
  const [role, setRole] = useState(profile?.role ?? "cpi");
  const [selectedState, setSelectedState] = useState(profile?.selectedState ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const [emailDigest, setEmailDigest] = useState(
    () => localStorage.getItem("pref:emailDigest") !== "false"
  );
  const [browserNotify, setBrowserNotify] = useState(
    () => localStorage.getItem("pref:browserNotify") === "true"
  );

  async function handleSaveProfile() {
    if (!name.trim()) { setError("Name is required"); return; }
    setError(null);
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), role, selectedState: selectedState || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function handleEmailDigestToggle(val: boolean) {
    setEmailDigest(val);
    localStorage.setItem("pref:emailDigest", String(val));
  }

  function handleBrowserNotifyToggle(val: boolean) {
    setBrowserNotify(val);
    localStorage.setItem("pref:browserNotify", String(val));
  }

  async function handleChangePassword() {
    setPwError(null);
    if (!currentPw || !newPw || !confirmPw) { setPwError("All fields are required"); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match"); return; }
    if (newPw === currentPw) { setPwError("New password must differ from current password"); return; }
    setPwSaving(true);
    try {
      await changePassword(accessToken!, currentPw, newPw);
      setPwSuccess(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => { setPwSuccess(false); setShowPwForm(false); }, 2500);
    } catch (e: any) {
      setPwError(e.message || "Password change failed");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences and profile information.</p>
      </motion.div>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="settings-full-name" className="block text-sm mb-1.5">Full Name</label>
            <input
              id="settings-full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="settings-email" className="block text-sm mb-1.5">Email</label>
            <input
              id="settings-email"
              type="email"
              value={profile?.email ?? ""}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-muted-foreground text-sm cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed. Contact support to update.</p>
          </div>

          <div>
            <label htmlFor="settings-role" className="block text-sm mb-1.5">Role</label>
            <select
              id="settings-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="settings-state" className="block text-sm mb-1.5">State / Jurisdiction</label>
            <input
              id="settings-state"
              type="text"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              placeholder="e.g. Florida"
              className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </motion.section>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          {resolvedTheme === "dark" ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-muted-foreground" />
          )}
          <h2 className="text-base">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <button
            role="switch"
            aria-checked={resolvedTheme === "dark"}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${resolvedTheme === "dark" ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${resolvedTheme === "dark" ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </motion.section>

      {/* Notifications */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Weekly progress digest</p>
              <p className="text-xs text-muted-foreground">Receive a weekly email summary of your training progress</p>
            </div>
            <button
              role="switch"
              aria-checked={emailDigest}
              onClick={() => handleEmailDigestToggle(!emailDigest)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailDigest ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${emailDigest ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Browser notifications</p>
              <p className="text-xs text-muted-foreground">Get notified when new modules or announcements are posted</p>
            </div>
            <button
              role="switch"
              aria-checked={browserNotify}
              onClick={() => handleBrowserNotifyToggle(!browserNotify)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${browserNotify ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${browserNotify ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Security */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base">Security</h2>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm">Password</p>
            <p className="text-xs text-muted-foreground">Change your password — must meet CJIS 5.6.2.1 requirements</p>
          </div>
          <button
            onClick={() => { setShowPwForm((v) => !v); setPwError(null); }}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPwForm ? "rotate-180" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {showPwForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-4 pt-5 border-t border-border">
                {/* Current password */}
                <div>
                  <label htmlFor="settings-current-pw" className="block text-sm mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      id="settings-current-pw"
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label htmlFor="settings-new-pw" className="block text-sm mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      id="settings-new-pw"
                      type={showNewPw ? "text" : "password"}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrengthMeter password={newPw} showRequirements />
                </div>

                {/* Confirm new password */}
                <div>
                  <label htmlFor="settings-confirm-pw" className="block text-sm mb-1.5">Confirm New Password</label>
                  <input
                    id="settings-confirm-pw"
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    autoComplete="new-password"
                  />
                  {confirmPw && newPw !== confirmPw && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {pwError && <p className="text-sm text-red-600">{pwError}</p>}

                <button
                  onClick={handleChangePassword}
                  disabled={pwSaving || !currentPw || !newPw || !confirmPw}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {pwSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : pwSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  {pwSuccess ? "Password Updated!" : "Update Password"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
