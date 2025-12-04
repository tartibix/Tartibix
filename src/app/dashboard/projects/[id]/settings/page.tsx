'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

type SettingsTab = 'general' | 'notifications' | 'access' | 'integrations' | 'danger'

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const tabs: { id: SettingsTab; label: string; icon: JSX.Element }[] = [
    {
      id: 'general',
      label: 'General',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      id: 'access',
      label: 'Access & Permissions',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  return (
    <DashboardShell>
      <TopBar title="Project Settings" />
      <section className="mt-8 space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="flex items-center gap-2 text-soft-white/70 hover:text-soft-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" />
            </svg>
            <span className="text-sm">Back to Project</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="rounded-[14px] border border-[#2F303A] bg-surface p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-display transition ${
                    activeTab === tab.id
                      ? 'bg-accent text-night font-semibold'
                      : 'text-soft-white/70 hover:bg-night hover:text-soft-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'access' && <AccessSettings />}
            {activeTab === 'integrations' && <IntegrationsSettings />}
            {activeTab === 'danger' && <DangerZone projectId={params.id} />}
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}

function GeneralSettings() {
  const [projectVisibility, setProjectVisibility] = useState('private')
  const [autoArchive, setAutoArchive] = useState(false)

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <h3 className="font-display text-lg font-semibold text-soft-white mb-6">General Settings</h3>
        <div className="space-y-5">
          <div>
            <label className="font-display text-sm font-medium text-soft-white/70">Project Visibility</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { value: 'private', label: 'Private', desc: 'Only team members can access' },
                { value: 'public', label: 'Public', desc: 'Anyone in the organization can view' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setProjectVisibility(opt.value)}
                  className={`rounded-[10px] border p-4 text-left transition ${
                    projectVisibility === opt.value
                      ? 'border-accent bg-accent/10'
                      : 'border-[#323449] hover:border-accent/50'
                  }`}
                >
                  <p className="font-display text-sm font-semibold text-soft-white">{opt.label}</p>
                  <p className="text-xs text-soft-white/50 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#323449] pt-5">
            <div>
              <p className="font-display text-sm font-semibold text-soft-white">Auto-archive completed tasks</p>
              <p className="text-xs text-soft-white/50 mt-1">Automatically archive tasks that have been completed for more than 30 days</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoArchive(!autoArchive)}
              className={`relative h-6 w-11 rounded-full transition ${
                autoArchive ? 'bg-accent' : 'bg-[#323449]'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  autoArchive ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Project ID</h3>
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white/70 font-mono">
            proj_1a2b3c4d5e6f7g8h
          </code>
          <button
            type="button"
            className="rounded-[8px] border border-[#323449] px-4 py-3 text-sm text-soft-white/70 hover:border-accent transition"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    taskCompleted: true,
    commentMentions: true,
    statusChanges: false,
    budgetAlerts: true,
    weeklyDigest: true,
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    { key: 'taskAssigned' as const, label: 'Task assignments', desc: 'When you are assigned to a new task' },
    { key: 'taskCompleted' as const, label: 'Task completions', desc: 'When a task you created is completed' },
    { key: 'commentMentions' as const, label: 'Comment mentions', desc: 'When someone mentions you in a comment' },
    { key: 'statusChanges' as const, label: 'Status changes', desc: 'When project status changes' },
    { key: 'budgetAlerts' as const, label: 'Budget alerts', desc: 'When budget thresholds are reached' },
    { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Weekly summary of project activity' },
  ]

  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
      <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#323449] last:border-0">
            <div>
              <p className="font-display text-sm font-semibold text-soft-white">{item.label}</p>
              <p className="text-xs text-soft-white/50 mt-1">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification(item.key)}
              className={`relative h-6 w-11 rounded-full transition ${
                notifications[item.key] ? 'bg-accent' : 'bg-[#323449]'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  notifications[item.key] ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccessSettings() {
  const roles = [
    { id: 'admin', name: 'Admin', count: 2, desc: 'Full access to all project features' },
    { id: 'manager', name: 'Manager', count: 3, desc: 'Can manage tasks, team, and settings' },
    { id: 'member', name: 'Member', count: 8, desc: 'Can view and update assigned tasks' },
    { id: 'viewer', name: 'Viewer', count: 5, desc: 'Read-only access to project' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-soft-white">Team Roles</h3>
          <button
            type="button"
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-display font-semibold text-night hover:brightness-110 transition"
          >
            + Invite Member
          </button>
        </div>
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between rounded-[10px] border border-[#323449] bg-night px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-semibold">
                  {role.count}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-soft-white">{role.name}</p>
                  <p className="text-xs text-soft-white/50">{role.desc}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-[6px] border border-[#323449] px-3 py-1.5 text-xs text-soft-white/70 hover:border-accent transition"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
        <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Share Settings</h3>
        <div className="space-y-4">
          <label className="block">
            <span className="font-display text-sm font-medium text-soft-white/70">Share Link</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="https://tartibix.com/invite/proj_1a2b3c4d"
                className="flex-1 rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white/70 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-[8px] border border-[#323449] px-4 py-3 text-sm text-soft-white/70 hover:border-accent transition"
              >
                Copy
              </button>
              <button
                type="button"
                className="rounded-[8px] bg-accent px-4 py-3 text-sm font-semibold text-night hover:brightness-110 transition"
              >
                Reset
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

function IntegrationsSettings() {
  const integrations = [
    { id: 'slack', name: 'Slack', desc: 'Get notifications in your Slack workspace', connected: true, icon: '💬' },
    { id: 'github', name: 'GitHub', desc: 'Link commits and PRs to tasks', connected: false, icon: '🐙' },
    { id: 'jira', name: 'Jira', desc: 'Sync tasks with Jira issues', connected: false, icon: '🔵' },
    { id: 'figma', name: 'Figma', desc: 'Embed Figma designs in tasks', connected: true, icon: '🎨' },
    { id: 'drive', name: 'Google Drive', desc: 'Attach files from Google Drive', connected: false, icon: '📁' },
  ]

  return (
    <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
      <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Integrations</h3>
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between rounded-[10px] border border-[#323449] bg-night px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#323449] text-xl">
                {integration.icon}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-soft-white">{integration.name}</p>
                <p className="text-xs text-soft-white/50">{integration.desc}</p>
              </div>
            </div>
            <button
              type="button"
              className={`rounded-[8px] px-4 py-2 text-sm font-semibold transition ${
                integration.connected
                  ? 'border border-[#323449] text-soft-white/70 hover:border-[#FF9BB0] hover:text-[#FF9BB0]'
                  : 'bg-accent text-night hover:brightness-110'
              }`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function DangerZone({ projectId }: { projectId: string }) {
  const [confirmArchive, setConfirmArchive] = useState('')
  const [confirmDelete, setConfirmDelete] = useState('')

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-[#FF9BB0]/30 bg-[#FF9BB0]/5 p-6">
        <h3 className="font-display text-lg font-semibold text-[#FF9BB0] mb-2">Archive Project</h3>
        <p className="text-sm text-soft-white/70 mb-4">
          Archiving will hide this project from the main view. You can restore it later from the archived projects section.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={confirmArchive}
            onChange={(e) => setConfirmArchive(e.target.value)}
            placeholder="Type 'ARCHIVE' to confirm"
            className="flex-1 rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-[#FF9BB0] focus:outline-none"
          />
          <button
            type="button"
            disabled={confirmArchive !== 'ARCHIVE'}
            className="rounded-[8px] border border-[#FF9BB0] px-6 py-3 text-sm font-semibold text-[#FF9BB0] transition hover:bg-[#FF9BB0]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Archive Project
          </button>
        </div>
      </div>

      <div className="rounded-[18px] border border-[#FF4444]/30 bg-[#FF4444]/5 p-6">
        <h3 className="font-display text-lg font-semibold text-[#FF4444] mb-2">Delete Project</h3>
        <p className="text-sm text-soft-white/70 mb-4">
          This action is permanent and cannot be undone. All project data, tasks, and documents will be permanently deleted.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="Type 'DELETE' to confirm"
            className="flex-1 rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-[#FF4444] focus:outline-none"
          />
          <button
            type="button"
            disabled={confirmDelete !== 'DELETE'}
            className="rounded-[8px] bg-[#FF4444] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )
}
