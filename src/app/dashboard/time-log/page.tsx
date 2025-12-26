"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import Image from "next/image";
import { 
  logTypes, 
  defaultTaskFormData,
  getStoredWorkLogs,
  getProjectWorkLogs,
  saveWorkLog,
  initializeSampleWorkLogs,
  WorkLogEntry
} from "@/lib/timeLogData";
import { getLocalProjects, initializeSampleProjects } from "@/lib/projectStorage";
import { useState, useEffect, useRef } from "react";

type ViewState = "table" | "form" | "modal";
type ModalType = "task-details" | "notes" | "status-view" | null;
type StatusType = "complete" | "ready-for-review" | "returned-for-review" | "pending";

export default function TimeLogPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState("daily-work-log");
  const [viewState, setViewState] = useState<ViewState>("table");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [showLogTypeDropdown, setShowLogTypeDropdown] = useState(false);
  const [formData, setFormData] = useState(defaultTaskFormData);
  const [notesText, setNotesText] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  
  // New state for real data
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  
  // Refs for click outside detection
  const statusModalRef = useRef<HTMLDivElement>(null);
  const taskDetailsModalRef = useRef<HTMLDivElement>(null);
  const notesModalRef = useRef<HTMLDivElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const logTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      // Initialize sample projects first
      await initializeSampleProjects();
      
      // Initialize sample work logs
      initializeSampleWorkLogs();
      
      // Load all projects
      const loadedProjects = getLocalProjects();
      console.log('Loaded projects:', loadedProjects);
      setProjects(loadedProjects);
      
      // Select first project and load its work logs
      if (loadedProjects.length > 0) {
        const firstProject = loadedProjects[0].projectId;
        console.log('Selected project:', firstProject);
        setSelectedProject(firstProject);
        
        // Load work logs for this project
        const logs = getProjectWorkLogs(firstProject);
        console.log('Work logs for', firstProject, ':', logs);
        setWorkLogs(logs);
      } else {
        console.warn('No projects found');
      }
    };
    
    initializeData();
  }, []);

  // Load work logs for selected project
  const loadWorkLogsForProject = (projectId: string) => {
    const logs = getProjectWorkLogs(projectId);
    setWorkLogs(logs);
  };

  // Update work logs when project changes
  useEffect(() => {
    if (selectedProject) {
      loadWorkLogsForProject(selectedProject);
    }
  }, [selectedProject]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Status modal
      if (statusModalRef.current && modalType === "status-view") {
        const modalContent = statusModalRef.current.querySelector('[role="dialog"]');
        if (modalContent && !modalContent.contains(event.target as Node)) {
          handleCloseModal();
        }
      }
      
      // Task details modal
      if (taskDetailsModalRef.current && modalType === "task-details") {
        const modalContent = taskDetailsModalRef.current.querySelector('[role="dialog"]');
        if (modalContent && !modalContent.contains(event.target as Node)) {
          handleCloseModal();
        }
      }
      
      // Notes modal
      if (notesModalRef.current && modalType === "notes") {
        const modalContent = notesModalRef.current.querySelector('[role="dialog"]');
        if (modalContent && !modalContent.contains(event.target as Node)) {
          handleCloseModal();
        }
      }

      // Project dropdown
      if (projectDropdownRef.current && showProjectDropdown) {
        if (!projectDropdownRef.current.contains(event.target as Node)) {
          setShowProjectDropdown(false);
        }
      }

      // Log type dropdown
      if (logTypeDropdownRef.current && showLogTypeDropdown) {
        if (!logTypeDropdownRef.current.contains(event.target as Node)) {
          setShowLogTypeDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalType, showProjectDropdown, showLogTypeDropdown]);

  const getSelectedLogTypeName = () => {
    return logTypes.find((t) => t.id === selectedLogType)?.name || "Daily Work Log";
  };

  const handleLogTypeSelect = (logTypeId: string) => {
    setSelectedLogType(logTypeId);
    setShowLogTypeDropdown(false);
    setViewState("form");
  };

  const handleRowClick = () => {
    setModalType("task-details");
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleOpenNotesModal = () => {
    setModalType("notes");
  };

  const handleBackToTable = () => {
    setViewState("table");
    setShowLogTypeDropdown(false);
  };

  const handleAddTaskClick = () => {
    setViewState("form");
  };

  const handleStatusClick = (entry: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    setRejectionReason(entry.rejectionReason || "");
    setModalType("status-view");
  };

  const getStatusDisplay = (status: StatusType) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "ready-for-review":
        return "Ready for Review";
      case "returned-for-review":
        return "Returned for Review";
      default:
        return "----------";
    }
  };

  const handleSaveTask = () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }

    const newLog: WorkLogEntry = {
      id: Date.now(),
      project: selectedProject,
      taskDescription: formData.taskDescription,
      notes: formData.notes,
      date: formData.date,
      completion: formData.completion,
      status: "pending",
      hasFiles: false,
    };

    saveWorkLog(newLog);
    loadWorkLogsForProject(selectedProject);
    setViewState("table");
    setFormData(defaultTaskFormData);
  };

  const handleMarkComplete = () => {
    if (selectedEntry) {
      const updatedEntry = { ...selectedEntry, status: "complete" as StatusType };
      saveWorkLog(updatedEntry);
      loadWorkLogsForProject(selectedProject);
      handleCloseModal();
    }
  };

  const handleShowRejectionModal = () => {
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = () => {
    if (selectedEntry && rejectionReason.trim()) {
      const updatedEntry = { 
        ...selectedEntry, 
        status: "returned-for-review" as StatusType,
        rejectionReason: rejectionReason 
      };
      saveWorkLog(updatedEntry);
      loadWorkLogsForProject(selectedProject);
      setShowRejectionModal(false);
      setRejectionReason("");
      handleCloseModal();
    }
  };

  const handleCancelRejection = () => {
    setShowRejectionModal(false);
    setRejectionReason("");
  };

  const handleUploadAgain = () => {
    if (selectedEntry) {
      const updatedEntry = { 
        ...selectedEntry, 
        status: "pending" as StatusType,
        rejectionReason: "" 
      };
      saveWorkLog(updatedEntry);
      loadWorkLogsForProject(selectedProject);
      handleCloseModal();
    }
  };

  const getSelectedProjectName = () => {
    const project = projects.find(p => p.projectId === selectedProject);
    return project?.basicInfo?.projectName || "Select Project";
  };

  return (
    <DashboardShell>
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-['Poppins'] text-[32px] font-medium text-white">
          Site & Project Logs
        </h1>

        {/* Search and Profile */}
        <div className="flex items-center gap-6">
          <div className="relative flex h-[41px] w-[556px] items-center rounded-[10px] bg-[#21222d] px-3">
            <Image
              src="/images/time-log/search-icon.svg"
              alt="Search"
              width={24}
              height={24}
            />
          </div>

          <div className="flex items-center gap-3">
            <Image
              src="/images/time-log/dropdown.svg"
              alt="Dropdown"
              width={15}
              height={17}
            />
            <Image
              src="/images/time-log/profile.png"
              alt="Profile"
              width={29}
              height={29}
              className="rounded-full"
            />
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image
                src="/images/time-log/vector.svg"
                alt="Menu"
                width={6}
                height={12}
                className="rotate-90"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Based on View State */}
      {viewState === "table" ? (
        <>
          {/* Top Cards Row */}
          <div className="mb-6 flex gap-5">
            {/* Project Selector */}
            <div className="relative" ref={projectDropdownRef}>
              <div
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex h-[89px] w-[525px] cursor-pointer items-center justify-between rounded-[10px] bg-[#21222d] px-9 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]"
              >
                <h2 className="font-['Inter'] text-[30px] font-extrabold text-white">
                  {getSelectedProjectName()}
                </h2>
                <Image
                  src="/images/time-log/vector5.svg"
                  alt="Expand"
                  width={31}
                  height={19}
                  className={`transition-transform ${showProjectDropdown ? "" : "-scale-y-100"}`}
                />
              </div>

              {/* Project Dropdown Menu */}
              {showProjectDropdown && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[525px] rounded-[10px] bg-[#21222d] py-4 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.15)]">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <button
                        key={project.projectId}
                        onClick={() => {
                          setSelectedProject(project.projectId);
                          setShowProjectDropdown(false);
                        }}
                        className={`w-full px-9 py-3 text-left font-['Poppins'] text-[24px] transition-colors hover:bg-accent/15 ${
                          selectedProject === project.projectId
                            ? "font-extrabold text-white"
                            : "font-medium text-white"
                        }`}
                      >
                        {project.basicInfo?.projectName || project.projectId}
                      </button>
                    ))
                  ) : (
                    <div className="px-9 py-3 text-center font-['Poppins'] text-[18px] text-white/60">
                      No projects available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Daily Work Log Card with Dropdown */}
            <div className="relative" ref={logTypeDropdownRef}>
              <div
                onClick={() => setShowLogTypeDropdown(!showLogTypeDropdown)}
                className="flex h-[89px] w-[525px] cursor-pointer items-center justify-between rounded-[10px] bg-[#21222d] px-9 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]"
              >
                <h2 className="font-['Inter'] text-[30px] font-extrabold text-white">
                  {getSelectedLogTypeName()}
                </h2>
                <Image
                  src="/images/time-log/vector5.svg"
                  alt="Expand"
                  width={31}
                  height={19}
                  className={`transition-transform ${showLogTypeDropdown ? "" : "-scale-y-100"}`}
                />
              </div>

              {/* Log Type Dropdown Menu */}
              {showLogTypeDropdown && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[525px] rounded-[10px] bg-[#21222d] py-4 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.15)]">
                  {logTypes.map((logType) => (
                    <button
                      key={logType.id}
                      onClick={() => handleLogTypeSelect(logType.id)}
                      className={`w-full px-9 py-3 text-left font-['Poppins'] text-[24px] transition-colors hover:bg-accent/15 ${
                        selectedLogType === logType.id
                          ? "font-extrabold text-white"
                          : "font-medium text-white"
                      }`}
                    >
                      {logType.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Tasks Button - Separate row */}
          <div className="mb-6">
            <div
              onClick={handleAddTaskClick}
              className="flex h-[89px] w-[490px] cursor-pointer items-center gap-8 rounded-[10px] bg-[#21222d] px-12 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]"
            >
              <Image
                src="/images/time-log/vector6.svg"
                alt="Add"
                width={50}
                height={50}
              />
              <p className="font-['Poppins'] text-[24px] text-[#fff9f7]">
                Add Tasks
              </p>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="rounded-[10px] bg-[#21222d] px-8 py-7 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.18)]">
            {/* Table Header with Title */}
            <div className="mb-4 flex items-center gap-8">
              <h3 className="font-['Poppins'] text-[24px] font-medium text-white">
                Daily Work Log
              </h3>
              {workLogs.length === 0 && (
                <p className="flex-1 text-center font-['Poppins'] text-[18px] font-medium text-white/60">
                  No logs found for this project
                </p>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="w-[14%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Project
                    </th>
                    <th className="w-[20%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Task description
                    </th>
                    <th className="w-[14%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Notes
                    </th>
                    <th className="w-[12%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Date
                    </th>
                    <th className="w-[12%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Completion
                    </th>
                    <th className="w-[18%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Status
                    </th>
                    <th className="w-[10%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      files
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workLogs.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={handleRowClick}
                      className="cursor-pointer border-b border-white/10 transition-colors hover:bg-accent/15"
                    >
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {projects.find(p => p.projectId === entry.project)?.basicInfo?.projectName || entry.project}
                      </td>
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {entry.taskDescription}
                      </td>
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {entry.notes}
                      </td>
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {entry.date}
                      </td>
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {entry.completion}
                      </td>
                      <td className="py-5 text-center">
                        <button
                          onClick={(e) => handleStatusClick(entry, e)}
                          className="cursor-pointer font-['Poppins'] text-[16px] font-medium text-white hover:text-accent transition-colors"
                        >
                          {getStatusDisplay(entry.status)}
                        </button>
                      </td>
                      <td className="py-5 text-center">
                        {entry.hasFiles && (
                          <div className="flex justify-center">
                            <Image
                              src="/images/time-log/link-icon.svg"
                              alt="Files"
                              width={33}
                              height={33}
                              className="-rotate-[90deg] -scale-y-100"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : viewState === "form" ? (
        /* Form View */
        <div className="flex gap-6">
          {/* Left Side - Form Card */}
          <div className="w-[650px] rounded-[10px] bg-[#21222d] shadow-[0px_0px_6px_0px_rgba(169,223,216,0.18)]">
            {/* Log Type Selector Card */}
            <div className="relative">
              <div
                onClick={() => setShowLogTypeDropdown(!showLogTypeDropdown)}
                className="flex h-[89px] cursor-pointer items-center justify-between rounded-t-[10px] bg-[#21222d] px-9 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]"
              >
                <h2 className="font-['Inter'] text-[30px] font-extrabold text-white">
                  {getSelectedLogTypeName()}
                </h2>
                <Image
                  src="/images/time-log/vector5.svg"
                  alt="Expand"
                  width={31}
                  height={19}
                  className={`transition-transform ${showLogTypeDropdown ? "" : "-scale-y-100"}`}
                />
              </div>

              {/* Dropdown Menu */}
              {showLogTypeDropdown && (
                <div className="absolute left-0 top-full z-50 w-full rounded-b-[10px] bg-[#21222d] py-4 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.15)]">
                  {logTypes.map((logType) => (
                    <button
                      key={logType.id}
                      onClick={() => handleLogTypeSelect(logType.id)}
                      className={`w-full px-9 py-3 text-left font-['Poppins'] text-[24px] transition-colors hover:bg-accent/15 ${
                        selectedLogType === logType.id
                          ? "font-extrabold text-white"
                          : "font-medium text-white"
                      }`}
                    >
                      {logType.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-5 p-8">
              {/* Project Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Project
                </label>
                <div className="flex h-[42px] items-center justify-between rounded-[7px] border border-[#323449] px-4">
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) =>
                      setFormData({ ...formData, project: e.target.value })
                    }
                    className="w-full bg-transparent font-['Poppins'] text-[14px] text-[#fff9f7] outline-none"
                  />
                  <Image
                    src="/images/time-log/vector.svg"
                    alt="Dropdown"
                    width={8}
                    height={13}
                    className="rotate-90"
                  />
                </div>
              </div>

              {/* Task Description Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Task description
                </label>
                <div className="flex h-[42px] items-center justify-between rounded-[7px] border border-[#323449] px-4">
                  <input
                    type="text"
                    value={formData.taskDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        taskDescription: e.target.value,
                      })
                    }
                    className="w-full bg-transparent font-['Poppins'] text-[14px] text-[#fff9f7] outline-none"
                  />
                  <Image
                    src="/images/time-log/vector.svg"
                    alt="Dropdown"
                    width={8}
                    height={13}
                    className="rotate-90"
                  />
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="h-[72px] w-full resize-none rounded-[7px] border border-[#323449] bg-transparent px-4 py-3 font-['Poppins'] text-[14px] text-[#fff9f7] outline-none"
                />
              </div>

              {/* Date Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Date
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-transparent font-['Poppins'] text-[14px] text-[#fff9f7] outline-none"
                  />
                </div>
              </div>

              {/* Completion Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Completion
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <input
                    type="text"
                    value={formData.completion}
                    onChange={(e) =>
                      setFormData({ ...formData, completion: e.target.value })
                    }
                    className="w-full bg-transparent font-['Poppins'] text-[14px] text-[#fff9f7] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - File Upload */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="font-['Inter'] text-[16px] font-semibold text-white">
                Upload the files
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div className="flex h-[202px] flex-col items-center justify-center rounded-[4px] border border-dashed border-[rgba(8,133,134,0.3)] bg-[rgba(208,252,253,0.05)]">
              <Image
                src="/images/time-log/upload-icon.svg"
                alt="Upload"
                width={69}
                height={60}
              />
              <p className="mt-2 font-['Montserrat'] text-[16px] font-semibold text-[#454545]">
                Drag & drop files
              </p>
              <p className="mt-2 font-['Montserrat'] text-[10px] text-[#676767]">
                Supported formates:{" "}
                <span className="font-bold">
                  .pdf .xlsx .csv .dwg .doc .docx .mpp .jpg .png
                </span>
              </p>
            </div>

            {/* Upload Button */}
            <button className="mt-8 h-[47px] w-[204px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
              Upload
            </button>
          </div>
        </div>
      ) : null}

      {/* Save/Back Buttons for Form View */}
      {viewState === "form" && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleBackToTable}
            className="h-[47px] w-[146px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20"
          >
            Back
          </button>
          <button 
            onClick={handleSaveTask}
            className="h-[47px] w-[292px] rounded-[10px] bg-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#171821] transition-colors hover:bg-[#a9dfd8]/90"
          >
            Save
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {modalType === "task-details" && (
        <div ref={taskDetailsModalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div role="dialog" className="relative w-[687px] rounded-[10px] bg-[#21222d] p-8 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Username
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.username}
                  </p>
                </div>
              </div>

              {/* Project Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Project
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.project}
                  </p>
                </div>
              </div>

              {/* Task Description Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Task description
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.taskDescription}
                  </p>
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Notes
                </label>
                <div className="flex min-h-[72px] items-start rounded-[7px] border border-[#323449] px-4 py-3">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.notes}
                  </p>
                </div>
              </div>

              {/* Date Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Date
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.date}
                  </p>
                </div>
              </div>

              {/* Completion Field */}
              <div>
                <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                  Completion
                </label>
                <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                  <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                    {formData.completion}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="h-[47px] w-[150px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
                  Approve
                </button>
                <button
                  onClick={handleOpenNotesModal}
                  className="h-[47px] w-[150px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20"
                >
                  Send to
                </button>
                <button className="h-[47px] w-[150px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
                  Request Rework
                </button>
              </div>
              <Image
                src="/images/time-log/folder-icon.svg"
                alt="Folder"
                width={63}
                height={63}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {modalType === "notes" && (
        <div ref={notesModalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div role="dialog" className="relative w-[687px] rounded-[10px] bg-[#21222d] p-8 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Username Display */}
            <div className="mb-6">
              <label className="mb-2 block font-['Inter'] text-[16px] font-semibold text-white">
                Username
              </label>
              <div className="flex h-[42px] items-center rounded-[7px] border border-[#323449] px-4">
                <p className="font-['Poppins'] text-[14px] text-[#fff9f7]">
                  {formData.username}
                </p>
              </div>
            </div>

            {/* Notes Text Area */}
            <div className="mb-6">
              <label className="mb-2 block font-['Inter'] text-[32px] font-semibold text-white">
                Notes
              </label>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Enter your notes here..."
                className="h-[280px] w-full resize-none rounded-[7px] border border-[#323449] bg-transparent px-4 py-3 font-['Poppins'] text-[14px] text-[#fff9f7] outline-none placeholder:text-[#676767]"
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-center">
              <button className="h-[47px] w-[180px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
                send
              </button>
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="h-[47px] w-[180px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
                  Approve
                </button>
                <button className="h-[47px] w-[180px] rounded-[10px] border border-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#e9e9e9] transition-colors hover:bg-[#a9dfd8]/20">
                  Request Rework
                </button>
              </div>
              <Image
                src="/images/time-log/folder-icon.svg"
                alt="Folder"
                width={63}
                height={63}
              />
            </div>
          </div>
        </div>
      )}

      {/* Status View Modal - Ready for Review, Complete, Returned for Review */}
      {modalType === "status-view" && selectedEntry && (
        <div ref={statusModalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div role="dialog" className="relative max-h-[90vh] w-full max-w-[1070px] overflow-auto rounded-[10px] bg-[#21222d] shadow-[0px_0px_6px_0px_rgba(169,223,216,0.18)]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Header Section */}
            <div className="border-b border-white/10 p-8">
              <h2 className="font-['Poppins'] text-[28px] font-medium text-white">
                {selectedEntry.status === "complete" && "Task Completed"}
                {selectedEntry.status === "ready-for-review" && "Review Task"}
                {selectedEntry.status === "returned-for-review" && "Task Returned for Review"}
                {selectedEntry.status === "pending" && "Task Pending"}
              </h2>
              <p className="mt-2 font-['Poppins'] text-[16px] text-white/60">
                {selectedEntry.taskDescription}
              </p>
            </div>

            {/* Returned for Review - Rejection Reason Display */}
            {selectedEntry.status === "returned-for-review" && selectedEntry.rejectionReason && (
              <div className="border-b border-white/10 bg-[#2a1a1a] p-8">
                <h3 className="mb-4 font-['Poppins'] text-[20px] font-medium text-[#ff6b6b]">
                  ⚠ Reason for Rejection
                </h3>
                <div className="rounded-[10px] bg-[#1A1B24] p-6">
                  <p className="font-['Poppins'] text-[18px] text-white">
                    {selectedEntry.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            {/* Images Display Section */}
            {selectedEntry.uploadedImages && selectedEntry.uploadedImages.length > 0 && (
              <div className="space-y-6 p-8">
                <h3 className="font-['Poppins'] text-[20px] font-medium text-white">
                  Uploaded Documents ({selectedEntry.uploadedImages.length})
                </h3>
                {selectedEntry.uploadedImages.map((imagePath: string, index: number) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[10px] bg-white shadow-md"
                  >
                    <div className="relative aspect-[989/1319]">
                      <Image
                        src={imagePath}
                        alt={`Uploaded document ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons at Bottom */}
            <div className="sticky bottom-0 flex items-center justify-center gap-4 border-t border-white/10 bg-[#21222d] p-6">
              {selectedEntry.status === "ready-for-review" && (
                <>
                  <button 
                    onClick={handleMarkComplete}
                    className="h-[50px] w-[280px] rounded-[10px] bg-[#4ade80] font-['Poppins'] text-[16px] font-bold text-[#171821] transition-all hover:bg-[#22c55e] hover:shadow-lg"
                  >
                    ✓ Approve & Complete
                  </button>
                  <button 
                    onClick={handleShowRejectionModal}
                    className="h-[50px] w-[280px] rounded-[10px] border-2 border-[#ef4444] font-['Poppins'] text-[16px] font-bold text-[#ef4444] transition-all hover:bg-[#ef4444] hover:text-white"
                  >
                    ✕ Return for Review
                  </button>
                </>
              )}
              {selectedEntry.status === "returned-for-review" && (
                <button 
                  onClick={handleUploadAgain}
                  className="h-[50px] w-[280px] rounded-[10px] bg-[#fbbf24] font-['Poppins'] text-[16px] font-bold text-[#171821] transition-all hover:bg-[#f59e0b] hover:shadow-lg"
                >
                  📤 Re-upload & Resubmit
                </button>
              )}
              {selectedEntry.status === "complete" && (
                <div className="flex items-center gap-3 rounded-[10px] bg-[#4ade80]/10 px-6 py-3">
                  <span className="text-[32px]">✓</span>
                  <span className="font-['Poppins'] text-[20px] font-medium text-[#4ade80]">
                    Task Completed Successfully
                  </span>
                </div>
              )}
              {selectedEntry.status === "pending" && (
                <div className="flex items-center gap-3 rounded-[10px] bg-[#fbbf24]/10 px-6 py-3">
                  <span className="text-[32px]">⏳</span>
                  <span className="font-['Poppins'] text-[20px] font-medium text-[#fbbf24]">
                    Awaiting Review
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[600px] rounded-[10px] bg-[#21222d] p-8 shadow-2xl">
            <h2 className="mb-6 font-['Poppins'] text-[24px] font-medium text-white">
              Enter Reason for Rejection
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mb-6 w-full min-h-[150px] rounded-[10px] bg-[#1A1B24] p-4 font-['Poppins'] text-[16px] text-white outline-none focus:ring-2 focus:ring-[#ef4444] resize-none"
              placeholder="Please provide a detailed reason for returning this task..."
              autoFocus
            />
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleCancelRejection}
                className="h-[45px] w-[120px] rounded-[10px] border border-white/20 font-['Poppins'] text-[14px] font-medium text-white transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="h-[45px] w-[180px] rounded-[10px] bg-[#ef4444] font-['Poppins'] text-[14px] font-bold text-white transition-all hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
