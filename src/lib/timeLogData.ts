export interface WorkLogEntry {
  id: number;
  project: string;
  taskDescription: string;
  notes: string;
  date: string;
  completion: string;
  hasFiles: boolean;
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
    hasFiles: true,
  },
  {
    id: 2,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    hasFiles: true,
  },
  {
    id: 3,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    hasFiles: true,
  },
  {
    id: 4,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    hasFiles: true,
  },
  {
    id: 5,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
    hasFiles: true,
  },
  {
    id: 6,
    project: "----------",
    taskDescription: "----------",
    notes: "----------",
    date: "----------",
    completion: "----------",
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
