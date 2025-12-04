'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { projectManagementData } from '@/lib/projectManagementData'

const { projects, programOptions } = projectManagementData

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const healthOptions = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'critical', label: 'Critical' },
]

export default function EditProjectPage({ params }: { params: { id: string } }) {
  // Get the project (using first project for demo)
  const project = projects[0]

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    category: project.category,
    status: project.status.toLowerCase(),
    health: project.health,
    program: project.program,
    manager: project.manager,
    owner: project.owner,
    start: project.start,
    end: project.end,
    budgetTotal: project.budgetTotal,
    budgetUsed: project.budgetUsed,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Redirect back to project detail
  }

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardShell>
      <TopBar title="Edit Project" />
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Basic Information</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Project Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Category</span>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="font-display text-sm font-medium text-soft-white/70">Description</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none resize-none"
                />
              </label>
            </div>
          </div>

          {/* Status & Health */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Status & Health</h3>
            <div className="grid gap-5 md:grid-cols-3">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Status</span>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white focus:border-accent focus:outline-none"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Health</span>
                <select
                  value={formData.health}
                  onChange={(e) => updateField('health', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white focus:border-accent focus:outline-none"
                >
                  {healthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Program</span>
                <select
                  value={formData.program}
                  onChange={(e) => updateField('program', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white focus:border-accent focus:outline-none"
                >
                  {programOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Team */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Team</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Project Manager</span>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => updateField('manager', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Project Owner</span>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Timeline & Budget</h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Start Date</span>
                <input
                  type="text"
                  value={formData.start}
                  onChange={(e) => updateField('start', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">End Date</span>
                <input
                  type="text"
                  value={formData.end}
                  onChange={(e) => updateField('end', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Total Budget</span>
                <input
                  type="number"
                  value={formData.budgetTotal}
                  onChange={(e) => updateField('budgetTotal', Number(e.target.value))}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Budget Used</span>
                <input
                  type="number"
                  value={formData.budgetUsed}
                  onChange={(e) => updateField('budgetUsed', Number(e.target.value))}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/dashboard/projects/${params.id}`}
              className="rounded-[10px] border border-[#323449] px-6 py-3 text-sm font-display font-semibold text-soft-white transition hover:border-accent/50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-[10px] bg-accent px-6 py-3 text-sm font-display font-semibold text-night shadow-[0_0_12px_rgba(169,223,216,0.35)] transition hover:brightness-110 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </DashboardShell>
  )
}
