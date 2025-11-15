'use client';

import React, { useState } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import TopBar from '@/components/dashboard/TopBar';
import Image from 'next/image';

// Static data for the project budget - ready for database integration
const projectBudgetData = {
  totalBudget: 10000,
  totalCost: 7500,
  maxBarHeight: 192, // Maximum height for the bars in pixels
  planned: 10000, // Actual budget value
  actual: 7500, // Actual cost value
  invoices: [
    {
      id: 'INV - 001',
      description: 'Pouring foundations',
      status: 'Paid' as const,
    },
    {
      id: 'INV - 002',
      description: 'Paid',
      status: 'Paid' as const,
    },
    {
      id: 'INV - 003',
      description: 'Pending',
      status: 'Pending' as const,
    },
    {
      id: 'INV - 004',
      description: 'Pending',
      status: 'Pending' as const,
    },
    {
      id: 'INV - 005',
      description: 'Pending',
      status: 'Pending' as const,
    },
    {
      id: 'INV - 006',
      description: 'Pending',
      status: 'Pending' as const,
    },
  ],
};

// Calculate bar heights based on data
const calculateBarHeight = (value: number, maxValue: number, maxHeight: number) => {
  return Math.round((value / maxValue) * maxHeight);
};

export default function ProjectsPage() {
  // Calculate bar heights dynamically based on budget values
  const maxBudgetValue = Math.max(projectBudgetData.totalBudget, projectBudgetData.totalCost);
  const plannedHeight = calculateBarHeight(
    projectBudgetData.planned,
    maxBudgetValue,
    projectBudgetData.maxBarHeight - 42 // Subtract label height
  );
  const actualHeight = calculateBarHeight(
    projectBudgetData.actual,
    maxBudgetValue,
    projectBudgetData.maxBarHeight - 42 // Subtract label height
  );

  return (
    <DashboardShell>
      <TopBar />
      
      <div className="mt-6 px-6">
        <div className="max-w-[1103px] mx-auto">
          {/* Page Title */}
          <h1 className="text-[32px] font-medium text-white mb-9">
            Project Budget
          </h1>

          {/* Budget Card */}
          <div className="relative bg-[#21222D] rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] p-6 mb-9">
            <div className="flex items-center justify-between relative z-10">
              {/* Left Section - Budget Info */}
              <div className="flex-1">
                <div className="flex items-start gap-16">
                  {/* Total Budget */}
                  <div>
                    <p className="text-[24px] font-medium text-white mb-[5px]">
                      Total Budget
                    </p>
                    <p className="text-[32px] font-medium text-white">
                      $ {projectBudgetData.totalBudget.toLocaleString()}
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div>
                    <p className="text-[24px] font-medium text-white mb-[5px]">
                      Total Cost
                    </p>
                    <p className="text-[32px] font-medium text-white">
                      $ {projectBudgetData.totalCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - Chart Bars */}
              <div className="flex items-end gap-12 h-[192px]">
                {/* Planned Bar */}
                <div className="flex flex-col items-center justify-end h-full">
                  <div 
                    className="w-[132px] bg-[#A9DFD8] rounded-t-[20px] transition-all duration-500"
                    style={{ height: `${plannedHeight}px` }}
                  />
                  <p className="text-[24px] font-semibold text-white mt-[6px]">
                    Planned
                  </p>
                </div>

                {/* Actual Bar */}
                <div className="flex flex-col items-center justify-end h-full">
                  <div 
                    className="w-[132px] bg-[#CCCCCC] rounded-t-[20px] transition-all duration-500"
                    style={{ height: `${actualHeight}px` }}
                  />
                  <p className="text-[24px] font-semibold text-white mt-[6px]">
                    Actual
                  </p>
                </div>
              </div>
            </div>

            {/* Background Image - Right Side */}
            <div className="absolute right-0 top-0 bottom-0 w-[250px] rounded-r-[10px] overflow-hidden pointer-events-none">
              <Image
                src="/images/project-budget/budget-card-right.svg"
                alt=""
                width={250}
                height={143}
                className="absolute top-0 right-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Invoice / Payment Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[28px] font-semibold text-white">
                Invoice / Payment
              </h2>
            </div>

            {/* Table Headers */}
            <div className="flex items-center mb-4 px-8">
              <div className="flex-[0_0_120px]">
                <p className="text-[26px] font-medium text-white">Invoice</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-[26px] font-medium text-white">description</p>
              </div>
              <div className="flex-[0_0_150px] text-right">
                <p className="text-[24px] font-medium text-white">View All</p>
              </div>
            </div>

            {/* Invoice Rows */}
            <div className="space-y-3">
              {projectBudgetData.invoices.map((invoice, index) => (
                <div
                  key={`${invoice.id}-${index}`}
                  className="relative bg-[#21222D] rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] h-[70px] flex items-center px-8 overflow-hidden"
                >
                  {/* Content */}
                  <div className="flex items-center w-full">
                    {/* Invoice ID */}
                    <div className="flex-[0_0_120px]">
                      <p className="text-[24px] font-medium text-white">
                        {invoice.id}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="flex-1 text-center">
                      <p 
                        className="text-[24px] font-medium text-white"
                        style={{ 
                          opacity: invoice.description === invoice.status ? 0.2 : 1 
                        }}
                      >
                        {invoice.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-[0_0_150px] flex justify-end">
                      <div className="bg-[#A9DFD8] rounded-[15px] px-8 py-2 min-w-[146px] flex items-center justify-center">
                        <p className="text-[20px] font-medium text-[#21222D]">
                          {invoice.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Closure Button */}
            <div className="mt-14 flex justify-center">
              <button className="bg-[#21222D] hover:bg-[#2a2b38] transition-colors rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] px-16 py-3">
                <p className="text-[20px] font-medium text-white">
                  Project closure
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
