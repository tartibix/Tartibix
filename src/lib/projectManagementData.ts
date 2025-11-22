export type Milestone = {
  label: string
  complete: boolean
}

export type Project = {
  id: number
  name: string
  status: string
  manager: string
  owner: string
  description: string
  progress: number
  health: 'on-track' | 'watch' | 'blocked'
  program: string
  category: string
  start: string
  end: string
  budgetUsed: number
  budgetTotal: number
  team: string[]
  milestones: Milestone[]
}

export type ProgramPerformanceMetric = {
  id: string
  label: string
  completion: number
  velocity: number
  timelineConfidence: number
  budgetUsed: number
  budgetTotal: number
  owners: string[]
}

export type StatusBreakdownSlice = {
  label: string
  value: number
  target: number
  color: string
}

export type RiskChecklistItem = {
  id: string
  label: string
  complete: boolean
  owner: string
}

export type GovernanceReviewRow = {
  id: number
  review: string
  lead: string
  status: 'Scheduled' | 'In Review' | 'Blocked' | 'Complete'
  date: string
  focus: string
  quarter: string
}

const programOptions = [
  { label: 'Website Redesign', value: 'website-redesign' },
  { label: 'Mobile App Launch', value: 'mobile-app' },
  { label: 'Process Automation', value: 'automation' },
]

const projects: Project[] = [
  {
    id: 1,
    name: 'Marketing Website Refresh',
    status: 'Execution',
    manager: 'Grace Miller',
    owner: 'Avi Patel',
    description:
      'Re-architecting the marketing site with a new visual identity, optimized component library, and measurable conversion uplift goals.',
    progress: 82,
    health: 'on-track',
    program: 'website-redesign',
    category: 'Experience Design',
    start: 'Mar 04, 2025',
    end: 'Jun 21, 2025',
    budgetUsed: 620000,
    budgetTotal: 820000,
    team: ['GM', 'AP', 'LK', 'ST', 'HB'],
    milestones: [
      { label: 'Brief', complete: true },
      { label: 'Design', complete: true },
      { label: 'Build', complete: true },
      { label: 'QA', complete: false },
      { label: 'Launch', complete: false },
    ],
  },
  {
    id: 2,
    name: 'Component Library Rollout',
    status: 'Pilot Stage',
    manager: 'Marcus Tan',
    owner: 'Clara Cortez',
    description:
      'Delivering a modular React + Tailwind system to marketing squads with governance tooling and performance guardrails.',
    progress: 58,
    health: 'watch',
    program: 'website-redesign',
    category: 'Design Systems',
    start: 'Feb 10, 2025',
    end: 'Jul 05, 2025',
    budgetUsed: 410000,
    budgetTotal: 700000,
    team: ['MT', 'CC', 'DN', 'RS'],
    milestones: [
      { label: 'Audit', complete: true },
      { label: 'Tokens', complete: true },
      { label: 'Components', complete: false },
      { label: 'Docs', complete: false },
      { label: 'Adoption', complete: false },
    ],
  },
  {
    id: 3,
    name: 'Legacy Decommission',
    status: 'At Risk',
    manager: 'Priya Shah',
    owner: 'Mason Rivers',
    description:
      'Migrating content, analytics, and contracts away from the legacy CMS stack without interrupting live ad campaigns.',
    progress: 34,
    health: 'blocked',
    program: 'website-redesign',
    category: 'Platform Ops',
    start: 'Jan 15, 2025',
    end: 'Sep 02, 2025',
    budgetUsed: 280000,
    budgetTotal: 600000,
    team: ['PS', 'MR', 'JG'],
    milestones: [
      { label: 'Inventory', complete: true },
      { label: 'Mapping', complete: true },
      { label: 'Rewrite', complete: false },
      { label: 'Cutover', complete: false },
      { label: 'Sunset', complete: false },
    ],
  },
  {
    id: 4,
    name: 'iOS & Android Rollout',
    status: 'Beta Testing',
    manager: 'Valentina Roy',
    owner: 'Clara Cortez',
    description:
      'Field teams are piloting the offline-first mobile experience with staged security reviews and telemetry dashboards.',
    progress: 66,
    health: 'watch',
    program: 'mobile-app',
    category: 'Product Delivery',
    start: 'Apr 01, 2025',
    end: 'Aug 14, 2025',
    budgetUsed: 510000,
    budgetTotal: 760000,
    team: ['VR', 'JH', 'KT', 'PM'],
    milestones: [
      { label: 'MVP', complete: true },
      { label: 'Private Beta', complete: true },
      { label: 'Public Beta', complete: false },
      { label: 'GA', complete: false },
      { label: 'Scale', complete: false },
    ],
  },
  {
    id: 5,
    name: 'Finance Automation Suite',
    status: 'Planning',
    manager: 'Nikhil Batra',
    owner: 'Mason Rivers',
    description:
      'Connecting purchasing, invoicing, and Supabase-triggered approvals so finance closes quarterly books in two clicks.',
    progress: 24,
    health: 'on-track',
    program: 'automation',
    category: 'Workflow Automation',
    start: 'May 19, 2025',
    end: 'Nov 30, 2025',
    budgetUsed: 120000,
    budgetTotal: 540000,
    team: ['NB', 'MR', 'LS', 'AL'],
    milestones: [
      { label: 'Discovery', complete: true },
      { label: 'Blueprint', complete: false },
      { label: 'Integrations', complete: false },
      { label: 'Pilot', complete: false },
      { label: 'Rollout', complete: false },
    ],
  },
]

const programPerformance: ProgramPerformanceMetric[] = [
  {
    id: 'website-redesign',
    label: 'Website Redesign',
    completion: 82,
    velocity: 7.1,
    timelineConfidence: 88,
    budgetUsed: 620000,
    budgetTotal: 820000,
    owners: ['Grace Miller', 'Avi Patel'],
  },
  {
    id: 'mobile-app',
    label: 'Mobile App Launch',
    completion: 66,
    velocity: 6.4,
    timelineConfidence: 74,
    budgetUsed: 510000,
    budgetTotal: 760000,
    owners: ['Valentina Roy', 'Clara Cortez'],
  },
  {
    id: 'automation',
    label: 'Process Automation',
    completion: 24,
    velocity: 4.2,
    timelineConfidence: 62,
    budgetUsed: 120000,
    budgetTotal: 540000,
    owners: ['Nikhil Batra', 'Mason Rivers'],
  },
]

const statusBreakdown: StatusBreakdownSlice[] = [
  { label: 'On Track', value: 8, target: 10, color: '#63FFC9' },
  { label: 'Watch', value: 3, target: 2, color: '#FFE48C' },
  { label: 'Blocked', value: 2, target: 1, color: '#FF6B7F' },
  { label: 'Planning', value: 4, target: 5, color: '#70B7FF' },
]

const riskChecklist: RiskChecklistItem[] = [
  { id: 'scope', label: 'Scope & success metrics approved', complete: true, owner: 'Grace Miller' },
  { id: 'budget', label: 'Budget variance within 5%', complete: false, owner: 'Marcus Tan' },
  { id: 'resourcing', label: 'Critical roles staffed', complete: true, owner: 'Priya Shah' },
  { id: 'compliance', label: 'Compliance review scheduled', complete: false, owner: 'Valentina Roy' },
  { id: 'handoff', label: 'Deployment handoff artifacts ready', complete: false, owner: 'Nikhil Batra' },
]

const governanceReviews: GovernanceReviewRow[] = [
  { id: 1, review: 'June Steering Update', lead: 'Grace Miller', status: 'Scheduled', date: 'Jun 18, 2025', focus: 'Experience', quarter: 'Q2' },
  { id: 2, review: 'Mobile Beta Readout', lead: 'Valentina Roy', status: 'In Review', date: 'May 28, 2025', focus: 'Mobile', quarter: 'Q2' },
  { id: 3, review: 'Automation Finance Sync', lead: 'Nikhil Batra', status: 'Blocked', date: 'Jul 03, 2025', focus: 'Automation', quarter: 'Q3' },
  { id: 4, review: 'Platform Sunset', lead: 'Priya Shah', status: 'Scheduled', date: 'Aug 12, 2025', focus: 'Platform', quarter: 'Q3' },
  { id: 5, review: 'Design System Pilot', lead: 'Marcus Tan', status: 'Complete', date: 'Apr 09, 2025', focus: 'Experience', quarter: 'Q2' },
]

const focusOptions = ['All', 'Experience', 'Platform', 'Mobile', 'Automation']
const quarterOptions = ['All', 'Q1', 'Q2', 'Q3', 'Q4']

export const projectManagementData = {
  programOptions,
  projects,
  programPerformance,
  statusBreakdown,
  riskChecklist,
  governanceReviews,
  focusOptions,
  quarterOptions,
}
