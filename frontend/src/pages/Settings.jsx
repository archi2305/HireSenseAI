import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  CreditCard,
  Download,
  Eye,
  LogOut,
  Moon,
  Palette,
  Save,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  User,
  UserRoundX,
  CheckCircle2,
  BriefcaseBusiness,
  Lock,
  RefreshCw,
  Gauge,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api, { API_BASE_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LOCAL_PREFS_KEY = "saas_settings_v1";
const ROLE_OPTIONS = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "UI/UX Designer",
  "Cloud Engineer",
];

const initialLocalPrefs = {
  ats_strictness: "Standard",
  auto_suggestions: true,
  ai_rewrite: true,
  ai_mode: "Smart",
  tone: "Professional",
  chatbot_memory: true,
  two_fa: false,
  ui_density: "Comfortable",
  weekly_tips: true,
  resume_analysis_alerts: true,
};

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-theme-border bg-theme-surface px-4 py-3">
      <span className="text-sm text-theme-text">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full p-1 transition ${
          checked ? "bg-theme-accent" : "bg-theme-sidebar"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-theme-border bg-theme-surface p-5 md:p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
      <p className="mt-1 text-sm text-theme-textSecondary">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usageStats, setUsageStats] = useState({ analyzed: 0, reports: 0 });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    avatar_url: "",
    job_role: "Backend Developer",
    email_alerts: true,
    weekly_reports: false,
    resume_match_alerts: true,
    ...initialLocalPrefs,
  });

  const sections = useMemo(
    () => [
      { id: "account", label: "Account Settings", icon: User },
      { id: "resume", label: "Resume Settings", icon: BriefcaseBusiness },
      { id: "ai", label: "AI Settings", icon: Bot },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: Shield },
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "privacy", label: "Data & Privacy", icon: Lock },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
    []
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          api.get("/settings"),
          api.get("/profile/me"),
        ]);
        const localPrefsRaw = localStorage.getItem(LOCAL_PREFS_KEY);
        const localPrefs = localPrefsRaw ? JSON.parse(localPrefsRaw) : {};
        setForm((prev) => ({
          ...prev,
          ...settingsRes.data,
          ...profileRes.data,
          ...initialLocalPrefs,
          ...localPrefs,
          email: profileRes.data.email || settingsRes.data.email || user?.email || "",
          job_role:
            profileRes.data.job_role ||
            settingsRes.data.job_role ||
            localPrefs.job_role ||
            "Backend Developer",
        }));
      } catch (error) {
        toast.error("Could not load settings. Using saved local preferences.");
      } finally {
        setLoading(false);
      }

      try {
        const [activityRes, historyRes] = await Promise.all([
          api.get("/profile/activity"),
          api.get("/analyses"),
        ]);
        setUsageStats({
          analyzed: historyRes.data?.length || activityRes.data?.total_analyzed || 0,
          reports: activityRes.data?.reports_generated || 0,
        });
      } catch {
        setUsageStats({ analyzed: 0, reports: 0 });
      }
    };
    bootstrap();
  }, [user?.email]);

  useEffect(() => {
    if (loading) return;
    const localSubset = {
      ats_strictness: form.ats_strictness,
      auto_suggestions: form.auto_suggestions,
      ai_rewrite: form.ai_rewrite,
      ai_mode: form.ai_mode,
      tone: form.tone,
      chatbot_memory: form.chatbot_memory,
      two_fa: form.two_fa,
      ui_density: form.ui_density,
      weekly_tips: form.weekly_tips,
      resume_analysis_alerts: form.resume_analysis_alerts,
      job_role: form.job_role,
    };
    localStorage.setItem(LOCAL_PREFS_KEY, JSON.stringify(localSubset));
  }, [form, loading]);

  useEffect(() => {
    if (form.ui_density === "Compact") {
      document.documentElement.setAttribute("data-density", "compact");
    } else {
      document.documentElement.setAttribute("data-density", "comfortable");
    }
  }, [form.ui_density]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Saving preferences...");
    try {
      await Promise.all([
        api.put("/settings", {
          fullname: form.fullname,
          job_role: form.job_role,
          email_alerts: form.email_alerts,
          weekly_reports: form.weekly_reports,
          resume_match_alerts: form.resume_match_alerts,
          dark_mode: theme === "dark",
        }),
        api.put("/profile/me", {
          fullname: form.fullname,
          job_role: form.job_role,
          email_alerts: form.email_alerts,
          weekly_reports: form.weekly_reports,
        }),
      ]);
      toast.success("Settings saved.", { id: loadingToast });
    } catch {
      toast.error("Failed to save some settings.", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateField("avatar_url", res.data.avatar_url);
      toast.success("Profile image updated.");
    } catch {
      toast.error("Avatar upload failed.");
    }
  };

  const changePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast.error("Fill current and new password.");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await api.post("/profile/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Password update failed.");
    }
  };

  const logoutAllSessions = async () => {
    try {
      await api.post("/auth/logout-all-sessions");
      logout();
      toast.success("Logged out from all sessions.");
    } catch {
      toast.error("Could not log out all sessions.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete account permanently? This cannot be undone.");
    if (!confirmed) return;
    try {
      await api.delete("/auth/delete-account");
      logout();
      toast.success("Account deleted.");
    } catch {
      toast.error("Account deletion failed.");
    }
  };

  const downloadData = async () => {
    try {
      const res = await api.get("/settings/export-data");
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "hiresense-data-export.json";
      anchor.click();
      URL.revokeObjectURL(href);
      toast.success("Data export downloaded.");
    } catch {
      toast.error("Data export failed.");
    }
  };

  const clearHistory = async () => {
    const ok = window.confirm("Clear analysis history?");
    if (!ok) return;
    try {
      await api.delete("/settings/clear-history");
      toast.success("History cleared.");
    } catch {
      toast.error("Failed to clear history.");
    }
  };

  const deleteAllResumes = async () => {
    const ok = window.confirm("Delete all resumes?");
    if (!ok) return;
    try {
      await api.delete("/settings/delete-all-resumes");
      toast.success("All resumes deleted.");
    } catch {
      toast.error("Failed to delete resumes.");
    }
  };

  if (loading) {
    return <div className="p-8 text-theme-textSecondary">Loading settings...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 md:flex-row">
      <aside className="md:sticky md:top-6 md:h-fit md:w-[280px] rounded-2xl border border-theme-border bg-theme-sidebar/40 p-4">
        <p className="mb-3 px-2 text-xs uppercase tracking-[0.2em] text-theme-textSecondary">
          Preferences
        </p>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-theme-surface text-theme-accent"
                    : "text-theme-textSecondary hover:bg-theme-surface hover:text-theme-text"
                }`}
              >
                <Icon size={16} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 space-y-4 pb-12">
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-5 md:p-6">
          <h1 className="text-2xl font-semibold text-theme-text">Settings & Preferences</h1>
          <p className="mt-1 text-sm text-theme-textSecondary">
            Configure your account, AI behavior, and privacy controls.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {activeSection === "account" && (
              <SectionCard title="Account Settings" description="Manage identity and account-level actions.">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs text-theme-textSecondary">Name</span>
                    <input
                      className="linear-input w-full px-3 py-2"
                      value={form.fullname}
                      onChange={(e) => updateField("fullname", e.target.value)}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-theme-textSecondary">Email (readonly)</span>
                    <input className="linear-input w-full px-3 py-2 opacity-70" value={form.email} readOnly />
                  </label>
                </div>
                <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          form.avatar_url
                            ? `${API_BASE_URL}${form.avatar_url}`
                            : "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                        }
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <p className="text-sm text-theme-textSecondary">Upload profile image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadAvatar(e.target.files?.[0])}
                      className="text-xs text-theme-textSecondary file:mr-3 file:rounded-lg file:border-0 file:bg-theme-accent file:px-3 file:py-2 file:text-white"
                    />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))
                    }
                    className="linear-input px-3 py-2"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))
                    }
                    className="linear-input px-3 py-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passwordForm.confirm_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirm_password: e.target.value }))
                    }
                    className="linear-input px-3 py-2"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={changePassword} className="linear-btn-secondary px-4 py-2">
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <UserRoundX size={14} /> Delete Account
                    </span>
                  </button>
                </div>
              </SectionCard>
            )}

            {activeSection === "resume" && (
              <SectionCard title="Resume Settings" description="Control scoring and analysis defaults.">
                <label className="space-y-1 block">
                  <span className="text-xs text-theme-textSecondary">Default role</span>
                  <select
                    className="linear-input w-full px-3 py-2"
                    value={form.job_role}
                    onChange={(e) => updateField("job_role", e.target.value)}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 block">
                  <span className="text-xs text-theme-textSecondary">ATS strictness</span>
                  <select
                    className="linear-input w-full px-3 py-2"
                    value={form.ats_strictness}
                    onChange={(e) => updateField("ats_strictness", e.target.value)}
                  >
                    <option>Basic</option>
                    <option>Standard</option>
                    <option>Strict</option>
                  </select>
                </label>
                <Toggle
                  label="Auto suggestions"
                  checked={form.auto_suggestions}
                  onChange={(value) => updateField("auto_suggestions", value)}
                />
                <Toggle
                  label="AI rewrite"
                  checked={form.ai_rewrite}
                  onChange={(value) => updateField("ai_rewrite", value)}
                />
              </SectionCard>
            )}

            {activeSection === "ai" && (
              <SectionCard title="AI Settings" description="Tune quality, speed, and style of AI output.">
                <label className="space-y-1 block">
                  <span className="text-xs text-theme-textSecondary">AI mode</span>
                  <select
                    className="linear-input w-full px-3 py-2"
                    value={form.ai_mode}
                    onChange={(e) => updateField("ai_mode", e.target.value)}
                  >
                    <option>Fast</option>
                    <option>Smart</option>
                  </select>
                </label>
                <label className="space-y-1 block">
                  <span className="text-xs text-theme-textSecondary">Tone</span>
                  <select
                    className="linear-input w-full px-3 py-2"
                    value={form.tone}
                    onChange={(e) => updateField("tone", e.target.value)}
                  >
                    <option>Professional</option>
                    <option>Creative</option>
                    <option>Concise</option>
                  </select>
                </label>
                <Toggle
                  label="Chatbot memory"
                  checked={form.chatbot_memory}
                  onChange={(value) => updateField("chatbot_memory", value)}
                />
              </SectionCard>
            )}

            {activeSection === "notifications" && (
              <SectionCard title="Notifications" description="Decide which updates you receive and when.">
                <Toggle
                  label="Email alerts"
                  checked={form.email_alerts}
                  onChange={(value) => updateField("email_alerts", value)}
                />
                <Toggle
                  label="Resume analysis alerts"
                  checked={form.resume_match_alerts}
                  onChange={(value) => updateField("resume_match_alerts", value)}
                />
                <Toggle
                  label="Weekly tips"
                  checked={form.weekly_tips}
                  onChange={(value) => updateField("weekly_tips", value)}
                />
              </SectionCard>
            )}

            {activeSection === "security" && (
              <SectionCard title="Security" description="Keep your account protected and controlled.">
                <Toggle
                  label="Enable 2FA"
                  checked={form.two_fa}
                  onChange={(value) => updateField("two_fa", value)}
                />
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={changePassword} className="linear-btn-secondary px-4 py-2">
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={logoutAllSessions}
                    className="rounded-lg border border-theme-border px-4 py-2 text-sm text-theme-text hover:bg-theme-bg"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut size={14} /> Logout all sessions
                    </span>
                  </button>
                </div>
              </SectionCard>
            )}

            {activeSection === "appearance" && (
              <SectionCard title="Appearance" description="Customize how the dashboard looks and feels.">
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      theme === "light"
                        ? "border-theme-accent bg-theme-accent/10 text-theme-accent"
                        : "border-theme-border text-theme-textSecondary"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Sun size={15} /> Light mode
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      theme === "dark"
                        ? "border-theme-accent bg-theme-accent/10 text-theme-accent"
                        : "border-theme-border text-theme-textSecondary"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Moon size={15} /> Dark mode
                    </span>
                  </button>
                </div>
                <label className="space-y-1 block">
                  <span className="text-xs text-theme-textSecondary">UI density</span>
                  <select
                    className="linear-input w-full px-3 py-2"
                    value={form.ui_density}
                    onChange={(e) => updateField("ui_density", e.target.value)}
                  >
                    <option>Comfortable</option>
                    <option>Compact</option>
                  </select>
                </label>
              </SectionCard>
            )}

            {activeSection === "privacy" && (
              <SectionCard title="Data & Privacy" description="Control your data, history, and resume records.">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={downloadData} className="linear-btn-secondary px-4 py-2">
                    <span className="inline-flex items-center gap-2">
                      <Download size={14} /> Download data
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="rounded-lg border border-theme-border px-4 py-2 text-sm text-theme-text hover:bg-theme-bg"
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={14} /> Clear history
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={deleteAllResumes}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 size={14} /> Delete all resumes
                    </span>
                  </button>
                </div>
              </SectionCard>
            )}

            {activeSection === "billing" && (
              <SectionCard title="Billing (UI)" description="Plan status and usage for your workspace.">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
                    <p className="text-xs text-theme-textSecondary">Current Plan</p>
                    <p className="mt-1 text-lg font-semibold text-theme-text">Free</p>
                  </div>
                  <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
                    <p className="text-xs text-theme-textSecondary">Resumes analyzed</p>
                    <p className="mt-1 text-lg font-semibold text-theme-text">{usageStats.analyzed}</p>
                  </div>
                  <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
                    <p className="text-xs text-theme-textSecondary">Reports generated</p>
                    <p className="mt-1 text-lg font-semibold text-theme-text">{usageStats.reports}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-theme-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  onClick={() => toast.success("Upgrade flow can be connected to Stripe later.")}
                >
                  Upgrade Plan
                </button>
              </SectionCard>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="rounded-lg bg-theme-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
