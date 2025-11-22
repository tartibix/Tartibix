'use client';

import Image from 'next/image';

export type InvoiceStatus = 'Paid' | 'Pending';

export type Invoice = {
  id: string;
  description: string;
  status: InvoiceStatus;
};

export type ProjectBudgetSummary = {
  totalBudget: number;
  totalCost: number;
  planned: number;
  actual: number;
  maxBarHeight?: number;
  backgroundImageSrc?: string;
};

export type InvoicePaymentSectionProps = {
  invoices?: Invoice[];
  budgetSummary?: ProjectBudgetSummary;
  className?: string;
  onProjectClosureClick?: () => void;
};

export const sampleInvoices: Invoice[] = [
  {
    id: 'INV - 001',
    description: 'Pouring foundations',
    status: 'Paid',
  },
  {
    id: 'INV - 002',
    description: 'Paid',
    status: 'Paid',
  },
  {
    id: 'INV - 003',
    description: 'Pending',
    status: 'Pending',
  },
  {
    id: 'INV - 004',
    description: 'Pending',
    status: 'Pending',
  },
  {
    id: 'INV - 005',
    description: 'Pending',
    status: 'Pending',
  },
  {
    id: 'INV - 006',
    description: 'Pending',
    status: 'Pending',
  },
];

export const sampleBudgetSummary: ProjectBudgetSummary = {
  totalBudget: 10000,
  totalCost: 7500,
  planned: 10000,
  actual: 7500,
  maxBarHeight: 192,
  backgroundImageSrc: '/images/project-budget/budget-card-right.svg',
};

const calculateBarHeight = (value: number, maxValue: number, maxHeight: number) => {
  if (maxValue === 0) {
    return 0;
  }

  return Math.round((value / maxValue) * maxHeight);
};

export default function InvoicePaymentSection({
  invoices = sampleInvoices,
  budgetSummary = sampleBudgetSummary,
  className,
  onProjectClosureClick,
}: InvoicePaymentSectionProps) {
  const maxHeight = budgetSummary.maxBarHeight ?? 192;
  const maxValue = Math.max(budgetSummary.totalBudget, budgetSummary.totalCost, 0.001);
  const plannedHeight = calculateBarHeight(budgetSummary.planned, maxValue, maxHeight - 42);
  const actualHeight = calculateBarHeight(budgetSummary.actual, maxValue, maxHeight - 42);

  return (
    <section className={className}>
      <h1 className="text-[32px] font-medium text-white mb-9">Project Budget</h1>

      <div className="relative bg-[#21222D] rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] p-6 mb-12">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-start gap-16">
              <div>
                <p className="text-[24px] font-medium text-white mb-[5px]">Total Budget</p>
                <p className="text-[32px] font-medium text-white">
                  $ {budgetSummary.totalBudget.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[24px] font-medium text-white mb-[5px]">Total Cost</p>
                <p className="text-[32px] font-medium text-white">
                  $ {budgetSummary.totalCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-12" style={{ height: `${maxHeight}px` }}>
            <div className="flex flex-col items-center justify-end h-full">
              <div
                className="w-[132px] bg-[#A9DFD8] rounded-t-[20px] transition-all duration-500"
                style={{ height: `${plannedHeight}px` }}
              />
              <p className="text-[24px] font-semibold text-white mt-[6px]">Planned</p>
            </div>

            <div className="flex flex-col items-center justify-end h-full">
              <div
                className="w-[132px] bg-[#CCCCCC] rounded-t-[20px] transition-all duration-500"
                style={{ height: `${actualHeight}px` }}
              />
              <p className="text-[24px] font-semibold text-white mt-[6px]">Actual</p>
            </div>
          </div>
        </div>

        {budgetSummary.backgroundImageSrc ? (
          <div className="absolute right-0 top-0 bottom-0 w-[250px] rounded-r-[10px] overflow-hidden pointer-events-none">
            <Image
              src={budgetSummary.backgroundImageSrc}
              alt=""
              width={250}
              height={143}
              className="absolute top-0 right-0 w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-semibold text-white">Invoice / Payment</h2>
      </div>

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

      <div className="space-y-3">
        {invoices.map((invoice, index) => (
          <div
            key={`${invoice.id}-${index}`}
            className="relative bg-[#21222D] rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] h-[70px] flex items-center px-8 overflow-hidden"
          >
            <div className="flex items-center w-full">
              <div className="flex-[0_0_120px]">
                <p className="text-[24px] font-medium text-white">{invoice.id}</p>
              </div>

              <div className="flex-1 text-center">
                <p
                  className="text-[24px] font-medium text-white"
                  style={{ opacity: invoice.description === invoice.status ? 0.2 : 1 }}
                >
                  {invoice.description}
                </p>
              </div>

              <div className="flex-[0_0_150px] flex justify-end">
                <div className="bg-[#A9DFD8] rounded-[15px] px-8 py-2 min-w-[146px] flex items-center justify-center">
                  <p className="text-[20px] font-medium text-[#21222D]">{invoice.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          type="button"
          onClick={onProjectClosureClick}
          className="bg-[#21222D] hover:bg-[#2a2b38] transition-colors rounded-[10px] shadow-[0_0_4px_rgba(169,223,216,0.2)] px-16 py-3"
        >
          <p className="text-[20px] font-medium text-white">Project closure</p>
        </button>
      </div>
    </section>
  );
}
