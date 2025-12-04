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

export type TeamHierarchyMember = {
  id: string
  name: string
  employeeId: string
  role: string
  level: number
  children?: TeamHierarchyMember[]
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

const teamHierarchy: TeamHierarchyMember[] = [
  {
    id: 'coo',
    name: 'E. Mohammed',
    employeeId: '14893',
    role: 'COO',
    level: 0,
    children: [
      {
        id: 'pmo',
        name: 'E. Mohammed',
        employeeId: '14563',
        role: 'PMO',
        level: 1,
        children: [
          {
            id: 'pm',
            name: 'E. Mohammed',
            employeeId: '14563',
            role: 'PM',
            level: 2,
            children: [
              {
                id: 'tech-office',
                name: 'E. Mohammed',
                employeeId: '14563',
                role: 'Technical Office Manager',
                level: 3,
                children: [
                  { id: 'pcm-1', name: 'A. Rahman', employeeId: '14501', role: 'Project Coordinator', level: 4 },
                  { id: 'pcm-2', name: 'S. Hassan', employeeId: '14502', role: 'Project Coordinator', level: 4 },
                  { id: 'pcm-3', name: 'K. Ahmed', employeeId: '14503', role: 'Project Coordinator', level: 4 },
                  { id: 'pcm-4', name: 'M. Ali', employeeId: '14504', role: 'Project Coordinator', level: 4 },
                ],
              },
              {
                id: 'construction',
                name: 'F. Ibrahim',
                employeeId: '14510',
                role: 'Construction Manager',
                level: 3,
                children: [
                  { id: 'cm-1', name: 'R. Khan', employeeId: '14511', role: 'Site Engineer', level: 4 },
                  { id: 'cm-2', name: 'Y. Osman', employeeId: '14512', role: 'Site Engineer', level: 4 },
                  { id: 'cm-3', name: 'T. Salem', employeeId: '14513', role: 'Site Engineer', level: 4 },
                  { id: 'cm-4', name: 'B. Nasser', employeeId: '14514', role: 'Site Engineer', level: 4 },
                ],
              },
              {
                id: 'controls',
                name: 'H. Mansour',
                employeeId: '14520',
                role: 'Project Controls Manager',
                level: 3,
                children: [
                  { id: 'ctrl-1', name: 'D. Farouk', employeeId: '14521', role: 'Cost Controller', level: 4 },
                  { id: 'ctrl-2', name: 'L. Mostafa', employeeId: '14522', role: 'Scheduler', level: 4 },
                  { id: 'ctrl-3', name: 'N. Youssef', employeeId: '14523', role: 'Document Controller', level: 4 },
                  { id: 'ctrl-4', name: 'W. Sharif', employeeId: '14524', role: 'Risk Analyst', level: 4 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const projectCreateFlowData = {
  initiativeOptions,
  templateOptions,
  documentItems,
  teamMembers,
  teamHierarchy,
}
