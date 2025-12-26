export interface WorkLogEntry {
  id: number;
  project: string;
  taskDescription: string;
  notes: string;
  date: string;
  completion: string;
  status: "complete" | "ready-for-review" | "returned-for-review" | "pending";
  hasFiles: boolean;
  uploadedImages?: string[];
  rejectionReason?: string;
}

export interface LogType {
  id: string;
  name: string;
  fields: string[];
}

export interface TaskFormData {
  username: string;
  project: string;
  taskDescription: string;
  notes: string;
  date: string;
  completion: string;
}

export interface MeetingMinutesFormData {
  project: string;
  meetingTitle: string;
  locationLink: string;
  discussionDecisions: string;
  meetingDateTime: string;
  attendees: string;
}

export interface MaterialDeliveryFormData {
  project: string;
  supplier: string;
  linkToPO: string;
  deliveryNoteNo: string;
  deliveryDate: string;
}

export const logTypes: LogType[] = [
  {
    id: "daily-work-log",
    name: "Daily Work Log",
    fields: ["project", "taskDescription", "notes", "date", "completion"],
  },
  {
    id: "hse-report",
    name: "HSE Report",
    fields: ["project", "description", "date", "status"],
  },
  {
    id: "site-instruction",
    name: "Site Instruction",
    fields: ["project", "instruction", "date", "assignee"],
  },
  {
    id: "issue-log",
    name: "Issue Log",
    fields: ["project", "issue", "priority", "date", "status"],
  },
  {
    id: "meeting-minutes",
    name: "Meeting Minutes",
    fields: ["project", "meetingTitle", "locationLink", "discussionDecisions", "meetingDateTime", "attendees"],
  },
  {
    id: "material-delivery-log",
    name: "Material Delivery Log",
    fields: ["project", "supplier", "linkToPO", "deliveryNoteNo", "deliveryDate"],
  },
];

export const workLogData: WorkLogEntry[] = [
  {
    id: 1,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "complete",
    hasFiles: true,
    uploadedImages: [
      "/images/time-log/sample-doc-1.jpg",
      "/images/time-log/sample-photo-1.jpg",
      "/images/time-log/sample-photo-2.jpg",
      "/images/time-log/sample-drawing-1.jpg"
    ],
  },
  {
    id: 2,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "returned-for-review",
    hasFiles: true,
    uploadedImages: [
      "/images/time-log/sample-doc-1.jpg",
      "/images/time-log/sample-photo-1.jpg"
    ],
    rejectionReason: "..............",
  },
  {
    id: 3,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "ready-for-review",
    hasFiles: true,
    uploadedImages: [
      "/images/time-log/sample-photo-1.jpg",
      "/images/time-log/sample-photo-2.jpg"
    ],
  },
  {
    id: 4,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "pending",
    hasFiles: true,
  },
  {
    id: 5,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "pending",
    hasFiles: true,
  },
  {
    id: 6,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    status: "pending",
    hasFiles: true,
  },
];

export const defaultTaskFormData: TaskFormData = {
  username: "Username who uploaded the file",
  project: "Formwork installation for concrete pour",
  taskDescription: "Formwork installation for concrete pour",
  notes: "Verified level and alignment",
  date: "May 22,2026",
  completion: "20%",
};

export const defaultMeetingMinutesFormData: MeetingMinutesFormData = {
  project: "Formwork installation for concrete pour",
  meetingTitle: "Formwork installation for concrete pour",
  locationLink: "Formwork installation for concrete pour",
  discussionDecisions: "Verified level and alignment",
  meetingDateTime: "May 22,2026",
  attendees: "",
};

export const defaultMaterialDeliveryFormData: MaterialDeliveryFormData = {
  project: "Formwork installation for concrete pour",
  supplier: "Formwork installation for concrete pour",
  linkToPO: "Formwork installation for concrete pour",
  deliveryNoteNo: "20%",
  deliveryDate: "May 22,2026",
};

// Storage keys
const WORK_LOGS_STORAGE_KEY = 'tartibix_work_logs';
const isBrowser = typeof window !== 'undefined';

// Get all work logs from storage
export function getStoredWorkLogs(): WorkLogEntry[] {
  if (!isBrowser) return [];
  
  try {
    const data = localStorage.getItem(WORK_LOGS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading work logs:', error);
    return [];
  }
}

// Get work logs for a specific project
export function getProjectWorkLogs(projectId: string): WorkLogEntry[] {
  const allLogs = getStoredWorkLogs();
  return allLogs.filter(log => log.project === projectId);
}

// Save work log
export function saveWorkLog(log: WorkLogEntry): void {
  if (!isBrowser) return;
  
  try {
    const logs = getStoredWorkLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    localStorage.setItem(WORK_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving work log:', error);
  }
}

// Delete work log
export function deleteWorkLog(logId: number): void {
  if (!isBrowser) return;
  
  try {
    const logs = getStoredWorkLogs().filter(l => l.id !== logId);
    localStorage.setItem(WORK_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error deleting work log:', error);
  }
}

// Initialize sample data if needed
export function initializeSampleWorkLogs(): void {
  if (!isBrowser) return;
  
  const existingLogs = getStoredWorkLogs();
  console.log('Existing work logs count:', existingLogs.length);
  
  if (existingLogs.length === 0) {
    console.log('Initializing sample work logs...');
    // Create realistic work logs based on actual project data
    const sampleLogs: WorkLogEntry[] = [
      // PRJ-SAMPLE-001 - Al-Riyadh Tower Construction
      {
        id: Date.now() + 1,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Task T-002: Foundation Excavation - Deep excavation for basement levels completed",
        notes: "Used equipment EX-001 (Excavator CAT 320). Crew led by CE-01 (Senior Civil Engineer). All soil removed as per design specifications. Waterproofing membrane (WTP-001) installation ready to commence.",
        date: "2024-03-28",
        completion: "100%",
        status: "complete",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-excavation-1.jpg",
          "/images/time-log/riyadh-tower-excavation-2.jpg",
          "/images/time-log/riyadh-tower-excavation-report.jpg",
        ],
      },
      {
        id: Date.now() + 2,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Task T-003: Foundation Concrete Work - Mat foundation pouring phase 1",
        notes: "Using concrete pump CP-001 and concrete mixer CM-001. Ready-mix concrete C40 (material CON-001) delivered on schedule. Team supervised by CE-01. Total 800m³ poured today. Quality tests in progress.",
        date: "2024-05-15",
        completion: "75%",
        status: "ready-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-concrete-1.jpg",
          "/images/time-log/riyadh-tower-concrete-2.jpg",
          "/images/time-log/riyadh-tower-concrete-quality.jpg",
        ],
      },
      {
        id: Date.now() + 3,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Task T-004: Structural Frame Floors 1-10 - Rebar installation floor 5",
        notes: "Reinforcement steel Grade 60 (STL-001) installation. Team of 30 workers under CE-02 supervision. Tower crane TC-001 operational. Issue identified with rebar spacing at grid E4-E5.",
        date: "2024-08-22",
        completion: "65%",
        status: "returned-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-rebar-issue.jpg",
          "/images/time-log/riyadh-tower-rebar-spacing.jpg",
        ],
        rejectionReason: "Rebar spacing at grid E4-E5 does not meet structural drawings specifications (Drawing Sheet S-05, Rev 3). Current spacing is 220mm instead of required 200mm. Please correct immediately and provide updated as-built measurements with photographic evidence.",
      },
      {
        id: Date.now() + 4,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Task T-006: MEP Rough-In Installation - Electrical conduit installation floors 1-3",
        notes: "EE-01 (Senior Electrical Engineer) leading the installation. Conduit routing verified against MEP shop drawings. All penetrations through slabs properly coordinated with structural team.",
        date: "2024-09-10",
        completion: "45%",
        status: "ready-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-mep-conduit-1.jpg",
          "/images/time-log/riyadh-tower-mep-conduit-2.jpg",
        ],
      },
      {
        id: Date.now() + 5,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Daily Safety Inspection - Site-wide safety compliance check",
        notes: "SF-01 (Safety Officer) conducted comprehensive site inspection. All scaffolding (SC-001) systems inspected and tagged. Tower crane TC-001 monthly inspection completed. Minor PPE violations corrected on-site.",
        date: "2024-12-15",
        completion: "100%",
        status: "complete",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-safety-1.jpg",
          "/images/time-log/riyadh-tower-safety-checklist.jpg",
        ],
      },
      {
        id: Date.now() + 6,
        project: "PRJ-SAMPLE-001",
        taskDescription: "Material Delivery Log - Reinforcement Steel Grade 60",
        notes: "Material STL-001 delivery note DN-2024-456. Quantity: 150 tons received and inspected by QS-01 (Quantity Surveyor). All material certificates verified. Storage area B allocated.",
        date: "2024-12-18",
        completion: "100%",
        status: "complete",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/riyadh-tower-delivery-note.jpg",
          "/images/time-log/riyadh-tower-material-cert.jpg",
        ],
      },

      // PRJ-SAMPLE-002 - Jeddah Marina Development
      {
        id: Date.now() + 7,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Task M-001: Marine Survey & Site Preparation - Bathymetric survey completed",
        notes: "ME-02 (Senior Marine Engineer) supervised the survey. Complete seabed mapping finished. Water depth measurements recorded. Environmental baseline data collected. Ready for breakwater design finalization.",
        date: "2024-04-10",
        completion: "100%",
        status: "complete",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-survey-1.jpg",
          "/images/time-log/jeddah-marina-survey-map.jpg",
          "/images/time-log/jeddah-marina-bathymetric.jpg",
        ],
      },
      {
        id: Date.now() + 8,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Task M-002: Breakwater Construction - Armor unit placement section A",
        notes: "Using barge crane BC-001 for placement. Marine concrete blocks (MAR-003) positioned according to design. CE-03 supervising placement. Weather conditions optimal. 250 units placed today.",
        date: "2024-06-20",
        completion: "80%",
        status: "ready-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-breakwater-1.jpg",
          "/images/time-log/jeddah-marina-breakwater-2.jpg",
          "/images/time-log/jeddah-marina-armor-placement.jpg",
        ],
      },
      {
        id: Date.now() + 9,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Task M-003: Dredging & Channel Formation - Main channel dredging",
        notes: "Dredging pump DP-001 operational. Two pumps working in tandem. ME-02 monitoring depth soundings. Current depth achieved: -4.5m. Target depth: -5.0m. Sediment disposal as per environmental permits.",
        date: "2024-07-25",
        completion: "60%",
        status: "pending",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-dredging-1.jpg",
          "/images/time-log/jeddah-marina-dredging-depth.jpg",
        ],
      },
      {
        id: Date.now() + 10,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Task M-004: Floating Dock Installation - Pontoon assembly section 1",
        notes: "HDPE floating pontoons (MAR-002) assembly in progress. Tugboat TB-001 assisting with positioning. 25 pontoon units connected. Connection quality requires review before proceeding with section 2.",
        date: "2024-10-15",
        completion: "40%",
        status: "returned-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-pontoon-1.jpg",
          "/images/time-log/jeddah-marina-pontoon-issue.jpg",
        ],
        rejectionReason: "Pontoon connection bolts show signs of improper torque application. Several connections measure below specified 180 Nm (measured range: 145-165 Nm). Must re-torque all connections to specification and provide certified torque wrench calibration certificate.",
      },
      {
        id: Date.now() + 11,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Weekly Progress Meeting - Week 48 coordination meeting",
        notes: "PM-02 (Project Manager) chaired the meeting. Attendees: ME-02, CE-03, AR-01, QS-02. Discussed: breakwater completion timeline, pontoon installation quality issues, upcoming landscaping phase. Action items assigned.",
        date: "2024-12-01",
        completion: "100%",
        status: "complete",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-meeting-minutes.jpg",
        ],
      },
      {
        id: Date.now() + 12,
        project: "PRJ-SAMPLE-002",
        taskDescription: "Task M-005: Yacht Club & Facilities - Marine grade steel pile installation",
        notes: "MAR-001 material installation using BC-001 (Barge Crane). CE-03 supervising. 50 piles driven to design depth. Pile integrity testing scheduled for next week. All piles within tolerance.",
        date: "2024-12-10",
        completion: "55%",
        status: "ready-for-review",
        hasFiles: true,
        uploadedImages: [
          "/images/time-log/jeddah-marina-piles-1.jpg",
          "/images/time-log/jeddah-marina-piles-2.jpg",
          "/images/time-log/jeddah-marina-pile-log.jpg",
        ],
      },
    ];
    
    console.log('Saving', sampleLogs.length, 'sample work logs to localStorage');
    localStorage.setItem(WORK_LOGS_STORAGE_KEY, JSON.stringify(sampleLogs));
    console.log('Sample work logs initialized successfully');
  } else {
    console.log('Work logs already exist, skipping initialization');
  }
}
