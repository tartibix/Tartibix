'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { ProjectSetupData } from '@/lib/projectSetupTypes'
import { projectCreateFlowData } from '@/lib/projectCreateFlowData'

const { initiativeOptions, templateOptions } = projectCreateFlowData

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const healthOptions = [
  { value: 'on-track', label: 'On Track' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'off-track', label: 'Off Track' },
]

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id
  
  const [project, setProject] = useState<ProjectSetupData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    ownerName: '',
    consultantName: '',
    contractNumber: '',
    contractValue: 0,
    contractStartDate: '',
    contractEndDate: '',
    projectLocation: '',
    initiative: '',
    template: '',
    status: 'draft',
    health: 'on-track',
    progress: 0,
  })

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
          setFormData({
            projectName: data.projectName || '',
            description: data.description || '',
            ownerName: data.ownerName || '',
            consultantName: data.consultantName || '',
            contractNumber: data.contractNumber || '',
            contractValue: data.contractValue || 0,
            contractStartDate: data.contractStartDate || '',
            contractEndDate: data.contractEndDate || '',
            projectLocation: data.projectLocation || '',
            initiative: data.initiative || '',
            template: data.template || '',
            status: data.status || 'draft',
            health: data.health || 'on-track',
            progress: data.progress || 0,
          })
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setIsSaving(true)
    try {
      const updatedProject = {
        ...project,
        ...formData,
        status: formData.status as 'draft' | 'in-progress' | 'completed',
        updatedAt: new Date().toISOString(),
      }

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      })

      if (response.ok) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        setError('Failed to save project')
      }
    } catch (err) {
      console.error('Error saving project:', err)
      setError('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <TopBar title="Edit Project" />
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="mt-4 text-soft-white/60">Loading project...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !project) {
    return (
      <DashboardShell>
        <TopBar title="Edit Project" />
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-soft-white/80 text-lg">{error || 'Project not found'}</p>
            <Link
              href="/dashboard/projects"
              className="mt-4 inline-block rounded-full bg-accent px-6 py-2 text-sm font-semibold text-night hover:brightness-110 transition"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </DashboardShell>
    )
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
                  value={formData.projectName}
                  onChange={(e) => updateField('projectName', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Contract Number</span>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => updateField('contractNumber', e.target.value)}
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
            <div className="grid gap-5 md:grid-cols-4">
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
                <span className="font-display text-sm font-medium text-soft-white/70">Initiative</span>
                <select
                  value={formData.initiative}
                  onChange={(e) => updateField('initiative', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white focus:border-accent focus:outline-none"
                >
                  <option value="">Select Initiative</option>
                  {initiativeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Progress (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => updateField('progress', Number(e.target.value))}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Team */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Owner & Consultant</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Owner / Client</span>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Consultant</span>
                <input
                  type="text"
                  value={formData.consultantName}
                  onChange={(e) => updateField('consultantName', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="font-display text-sm font-medium text-soft-white/70">Project Location (Google Maps URL)</span>
                <input
                  type="url"
                  value={formData.projectLocation}
                  onChange={(e) => updateField('projectLocation', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-6">Timeline & Budget</h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Start Date</span>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => updateField('contractStartDate', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">End Date</span>
                <input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => updateField('contractEndDate', e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-display text-sm font-medium text-soft-white/70">Contract Value (SAR)</span>
                <input
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => updateField('contractValue', Number(e.target.value))}
                  className="mt-2 w-full rounded-[8px] border border-[#323449] bg-night px-4 py-3 text-sm text-soft-white placeholder:text-soft-white/35 focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Resource Summary (Read Only) */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Project Resources</h3>
            <p className="text-sm text-soft-white/60 mb-4">Resources are managed in the project setup wizard. Below is a summary of current resources.</p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Employees</span>
                <span className="text-lg font-semibold text-soft-white">{project.employees?.length || 0}</span>
              </div>
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Equipment</span>
                <span className="text-lg font-semibold text-soft-white">{project.equipment?.length || 0}</span>
              </div>
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Materials</span>
                <span className="text-lg font-semibold text-soft-white">{project.materials?.length || 0}</span>
              </div>
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Services</span>
                <span className="text-lg font-semibold text-soft-white">{project.services?.length || 0}</span>
              </div>
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Tasks</span>
                <span className="text-lg font-semibold text-soft-white">{project.executionPlan?.length || 0}</span>
              </div>
              <div className="rounded-[10px] border border-[#323449] bg-night px-4 py-2">
                <span className="text-xs text-soft-white/50 block">Documents</span>
                <span className="text-lg font-semibold text-soft-white">{project.supportingDocuments?.length || 0}</span>
              </div>
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
