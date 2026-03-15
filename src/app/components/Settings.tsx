import { useState } from "react";
import { motion } from "motion/react";
import { User, Bell, Shield, Moon, Sun, KeyRound, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTheme } from "next-themes";
import { ROLES } from "./data";

export function Settings() {
  const { profile, updateProfile } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const [name, setName] = useState(profile?.name ?? "");
  const [role, setRole] = useState(profile?.role ?? "cpi");
  const [selectedState, setSelectedState] = useState(profile?.selectedState ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <p className="text-xs text-muted-foreground">Send a password reset link to your email address</p>
          </div>
          <a
            href="/reset-password"
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-secondary transition-colors whitespace-nowrap"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </a>
        </div>
      </motion.section>
    </div>
  );
}
