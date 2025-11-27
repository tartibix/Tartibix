export type CreateDropdownOption = {
  value: string
  label: string
  description?: string
}

export type DocumentIconVariant = 'archive' | 'edit' | 'note'

export type DocumentUploadRow = {
  order: number
  name: string
  type: string
}

export type CreateDocumentItem = {
  id: string
  name: string
  icon: DocumentIconVariant
  required: boolean
  completed?: boolean
  locked?: boolean
  uploads?: DocumentUploadRow[]
}

export type CreateTeamMember = {
  id: string
  name: string
  role: string
  availability: number
  allocation: number
  selected?: boolean
}

const initiativeOptions: CreateDropdownOption[] = [
  { value: 'website-redesign', label: 'Website Redesign', description: 'Rebuild marketing and product pages in one sprint' },
  { value: 'mobile-refresh', label: 'Mobile App Refresh', description: 'Redesign navigation and onboarding flows' },
  { value: 'intranet-upgrade', label: 'Intranet Upgrade', description: 'Upgrade legacy knowledge base to new stack' },
  { value: 'crm-implementation', label: 'CRM Implementation', description: 'Roll out HubSpot automation to GTM teams' },
]

const templateOptions: CreateDropdownOption[] = [
  { value: 'blank', label: 'Blank Blueprint' },
  { value: 'product-launch', label: 'Product Launch' },
  { value: 'process-optimization', label: 'Process Optimization' },
  { value: 'governance-pack', label: 'Governance Pack' },
]

const documentItems: CreateDocumentItem[] = [
  {
    id: 'contractual-legal',
    name: 'Contractual & Legal',
    icon: 'archive',
    required: true,
    completed: true,
    locked: true,
    uploads: [
      { order: 1, name: 'Master Service Agreement', type: 'PDF' },
      { order: 2, name: 'Statement of Work v2', type: 'DOCX' },
      { order: 3, name: 'Non-Disclosure Agreement', type: 'PDF' },
      { order: 4, name: 'Security Compliance Checklist', type: 'XLSX' },
    ],
  },
  {
    id: 'project-setup-files',
    name: 'Project Setup Files',
    icon: 'edit',
    required: true,
    uploads: [
      { order: 1, name: 'Discovery Notes', type: 'DOCS' },
      { order: 2, name: 'Sprint 0 Plan', type: 'Notion' },
      { order: 3, name: 'Stakeholder Matrix', type: 'Sheet' },
      { order: 4, name: 'Kickoff Deck', type: 'Slides' },
    ],
  },
  {
    id: 'supporting-documents',
    name: 'Supporting Documents',
    icon: 'note',
    required: false,
    uploads: [
      { order: 1, name: 'Research Insights', type: 'PDF' },
      { order: 2, name: 'Accessibility Checklist', type: 'Sheet' },
      { order: 3, name: 'QA Readiness Form', type: 'DOCX' },
      { order: 4, name: 'Training Plan', type: 'PPT' },
    ],
  },
]

const teamMembers: CreateTeamMember[] = [
  { id: 'maria-chen', name: 'Maria Chen', role: 'Project Manager', availability: 32, allocation: 24, selected: true },
  { id: 'dario-vega', name: 'Dario Vega', role: 'UX Lead', availability: 28, allocation: 18, selected: true },
  { id: 'lena-ortiz', name: 'Lena Ortiz', role: 'Engineering Lead', availability: 35, allocation: 26 },
  { id: 'haruto-sato', name: 'Haruto Sato', role: 'QA Specialist', availability: 30, allocation: 12 },
  { id: 'amira-khan', name: 'Amira Khan', role: 'Data Analyst', availability: 20, allocation: 8 },
]

export const projectCreateFlowData = {
  initiativeOptions,
  templateOptions,
  documentItems,
  teamMembers,
}
