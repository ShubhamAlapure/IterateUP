import { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  GraduationCap,
  Lock,
  Save,
  Shield,
  Sliders,
  Sparkles,
  User,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { studentSettings, mockStudent } from '@/lib/mock/career-data';

export default function SettingsPage() {
  const [settings, setSettings] = useState(studentSettings);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <ProductShell>
      <TopBar eyebrow="Workspace control" title="Settings & Preferences">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
        >
          <Save size={13} /> Save changes
        </button>
      </TopBar>

      <div className="page-in mx-auto max-w-[1000px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {saveToast && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Workspace preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Career Objectives & Target Parameters */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Sliders size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Career Targets</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              These inputs calibrate your Career Readiness Score and recommendation priorities.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold">Primary Target Role</label>
                <input
                  type="text"
                  value={settings.careerPreferences.primaryTargetRole}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      careerPreferences: {
                        ...settings.careerPreferences,
                        primaryTargetRole: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold">Secondary Target Role</label>
                <input
                  type="text"
                  value={settings.careerPreferences.secondaryRole}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      careerPreferences: {
                        ...settings.careerPreferences,
                        secondaryRole: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold">Target Graduation Window</label>
                <input
                  type="text"
                  value={settings.careerPreferences.targetGraduation}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      careerPreferences: {
                        ...settings.careerPreferences,
                        targetGraduation: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold">Minimum Compensation Target</label>
                <input
                  type="text"
                  value={settings.careerPreferences.minTargetCompensation}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      careerPreferences: {
                        ...settings.careerPreferences,
                        minTargetCompensation: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Daily Career Copilot Notifications */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Bell size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">
                Daily Career Copilot &amp; Alerts
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure how IterateUP prompts your morning priority checklist and upcoming deadlines.
            </p>

            <div className="mt-5 space-y-3.5 text-xs">
              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Morning Priorities Digest</p>
                  <p className="text-muted-foreground">Receive your top 3 daily actions at {settings.notifications.dailyDigestTime}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.dailyDigest}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, dailyDigest: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">High-Fit Job Match Alerts (85%+)</p>
                  <p className="text-muted-foreground">Notify immediately when a new internship matches your verified skills</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.jobAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, jobAlerts: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Interview Countdown &amp; STAR Practice Reminders</p>
                  <p className="text-muted-foreground">Alert 24 hours prior to active recruiter calls</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.interviewReminders}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, interviewReminders: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>

          {/* Privacy & Student Data Protection */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">
                Privacy &amp; Data Boundaries
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your data stays yours. We do not sell student resumes or publish your profile to unverified recruiters.
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="rounded-xl border border-border bg-background p-3.5">
                <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Profile Visibility
                </span>
                <p className="mt-1 font-semibold text-foreground">
                  {settings.privacy.profileVisibility}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-3.5">
                <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Institutional Connection
                </span>
                <p className="mt-1 font-semibold text-foreground">
                  {settings.privacy.universityAffiliation}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  College placement portal is authorized for career advisor guidance.
                </p>
              </div>
            </div>
          </section>
        </form>
      </div>
    </ProductShell>
  );
}
