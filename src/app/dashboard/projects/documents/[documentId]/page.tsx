"use client"

import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { projectCreateFlowData } from '@/lib/projectCreateFlowData'
import type { CreateDropdownOption } from '@/lib/projectCreateFlowData'

const { documentItems, initiativeOptions, templateOptions } = projectCreateFlowData

const stepTabs = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'documents', label: 'Documents' },
  { id: 'team', label: 'Team' },
]

export default function DocumentUploadPage({ params }: { params: { documentId: string } }) {
  const router = useRouter()
  const document = documentItems.find((item) => item.id === params.documentId)
  const uploads = useMemo(() => document?.uploads ?? [], [document])
  const [selectedInitiative, setSelectedInitiative] = useState(initiativeOptions[0]?.value ?? '')
  const [selectedTemplate, setSelectedTemplate] = useState(templateOptions[0]?.value ?? '')
  const [uploadedRows, setUploadedRows] = useState<Set<number>>(new Set())

  const { completedCount, progressPercent } = useMemo(() => {
    const total = uploads.length
    const completed = Array.from(uploadedRows).filter((order) => uploads.some((row) => row.order === order)).length
    const percent = total ? Math.round((completed / total) * 100) : 0
    return { completedCount: completed, progressPercent: percent }
  }, [uploads, uploadedRows])

  if (!document) {
    notFound()
  }

  const handleUploadToggle = (order: number) => {
    setUploadedRows((prev) => {
      const next = new Set(prev)
      if (next.has(order)) {
        next.delete(order)
      } else {
        next.add(order)
      }
      return next
    })
  }

  const handleSave = () => {
    // Placeholder for future API wiring; currently just returns to the previous screen.
    router.back()
  }

  return (
    <DashboardShell>
      <TopBar title="Project Management" />
      <section className="mt-8 space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-display uppercase tracking-[0.35em] text-soft-white/55">Upload Center</p>
            <h1 className="font-display text-3xl font-semibold text-soft-white">{document.name}</h1>
            <p className="text-sm text-soft-white/70">Upload files and supporting assets for this requirement.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              label="Initiative"
              value={selectedInitiative}
              onChange={setSelectedInitiative}
              options={initiativeOptions}
            />
            <DropdownSelect
              label="Templates"
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              options={templateOptions}
              dark
            />
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-5 py-2 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110"
            >
              Create Project
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          {stepTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`rounded-[10px] border px-8 py-3 font-display text-sm font-semibold transition ${
                tab.id === 'documents'
                  ? 'border-transparent bg-accent text-night shadow-[0_0_8px_rgba(169,223,216,0.35)]'
                  : 'border-[#2F303A] bg-[#1B1C24] text-soft-white/70'
              }`}
              disabled={tab.id !== 'documents'}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="rounded-[10px] bg-[#1B1C24] px-8 py-3 text-sm font-display font-semibold text-soft-white shadow-[0_0_6px_rgba(0,0,0,0.35)]"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#2F3A43] bg-[#1A1B24] p-6 shadow-[0_0_14px_rgba(169,223,216,0.18)]">
          <div className="overflow-hidden rounded-[18px] border border-white/5 bg-[#171821]">
            <div className="grid grid-cols-[80px_1fr_180px_140px] border-b border-white/5 px-6 py-4 text-[13px] font-display uppercase tracking-[0.3em] text-soft-white/60">
              <span>#</span>
              <span>Document Name</span>
              <span>Document Type</span>
              <span className="text-right">Actions</span>
            </div>
            {uploads.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-soft-white/60">No upload slots configured yet.</p>
            ) : (
              <ul>
                {uploads.map((row) => {
                  const isComplete = uploadedRows.has(row.order)
                  return (
                    <li key={row.order} className="grid grid-cols-[80px_1fr_180px_140px] items-center border-b border-white/5 px-6 py-4 last:border-b-0">
                      <span className="text-soft-white/60">{row.order.toString().padStart(2, '0')}</span>
                      <span className="font-display text-soft-white">{row.name}</span>
                      <span className="text-soft-white/70">{row.type}</span>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleUploadToggle(row.order)}
                          className={`rounded-full border px-5 py-1 text-xs font-display font-semibold transition ${
                            isComplete ? 'border-accent bg-accent/15 text-accent' : 'border-accent text-soft-white hover:bg-accent/15'
                          }`}
                        >
                          {isComplete ? 'Uploaded' : 'Upload'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50">Step 02 · Documents</p>
              <p className="text-sm text-soft-white/70">{completedCount} of {uploads.length} uploads complete</p>
            </div>
            <div className="flex-1 md:max-w-[320px]">
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FFE48C] via-[#A9DFD8] to-[#63FFC9]" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-1 text-right text-xs text-soft-white/60">{progressPercent}% prepared</p>
            </div>
            <button
              type="button"
              className="rounded-[10px] bg-accent px-10 py-3 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)]"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}

type DropdownSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: CreateDropdownOption[]
  dark?: boolean
}

function DropdownSelect({ label, value, onChange, options, dark }: DropdownSelectProps) {
  return (
    <label className="text-[11px] uppercase tracking-[0.3em] text-soft-white/55">
      {label}
      <select
        className={`mt-1 min-w-[180px] rounded-[10px] border px-4 py-2 text-sm font-display transition focus:border-accent focus:outline-none ${
          dark ? 'border-[#2F303A] bg-[#1B1C24] text-soft-white/70' : 'border-transparent bg-accent text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)]'
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#1B1C24] text-soft-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
