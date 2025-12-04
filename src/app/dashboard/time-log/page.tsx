"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import Image from "next/image";
import { workLogData, logTypes, defaultTaskFormData } from "@/lib/timeLogData";
import { useState } from "react";

type ViewState = "table" | "form" | "modal";
type ModalType = "task-details" | "notes" | null;

export default function TimeLogPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLogType, setSelectedLogType] = useState("daily-work-log");
  const [viewState, setViewState] = useState<ViewState>("table");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [showLogTypeDropdown, setShowLogTypeDropdown] = useState(false);
  const [formData, setFormData] = useState(defaultTaskFormData);
  const [notesText, setNotesText] = useState("");

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
            {/* Daily Work Log Card with Dropdown */}
            <div className="relative">
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
                      className={`w-full px-9 py-3 text-left font-['Poppins'] text-[24px] transition-colors hover:bg-white/5 ${
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

            {/* Add Tasks Card */}
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
            {/* Table Header with Title and Note */}
            <div className="mb-4 flex items-center gap-8">
              <h3 className="font-['Poppins'] text-[24px] font-medium text-white">
                Daily Work Log
              </h3>
              <p className="flex-1 text-center font-['Poppins'] text-[20px] font-medium text-[#ff0000]">
                The first 20 letters after it are &quot;...&quot;
              </p>
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
                    <th className="w-[18%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Notes
                    </th>
                    <th className="w-[14%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Date
                    </th>
                    <th className="w-[14%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      Completion
                    </th>
                    <th className="w-[10%] py-4 text-center font-['Poppins'] text-[20px] font-medium text-[#87888c]">
                      files
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workLogData.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={handleRowClick}
                      className="cursor-pointer border-b border-white/10 transition-colors hover:bg-white/5"
                    >
                      <td className="py-5 text-center font-['Poppins'] text-[14px] font-medium text-white">
                        {entry.project}
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
                      className={`w-full px-9 py-3 text-left font-['Poppins'] text-[24px] transition-colors hover:bg-white/5 ${
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
          <button className="h-[47px] w-[292px] rounded-[10px] bg-[#a9dfd8] font-['Poppins'] text-[16px] font-bold text-[#171821] transition-colors hover:bg-[#a9dfd8]/90">
            Save
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {modalType === "task-details" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[687px] rounded-[10px] bg-[#21222d] p-8 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-white/50 hover:text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[687px] rounded-[10px] bg-[#21222d] p-8 shadow-[0px_0px_6px_0px_rgba(169,223,216,0.2)]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-white/50 hover:text-white"
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
    </DashboardShell>
  );
}
