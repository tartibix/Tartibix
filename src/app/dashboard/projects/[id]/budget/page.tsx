'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'

// Budget data
const budgetSummary = {
  totalBudget: 1250000,
  totalSpent: 875000,
  totalRemaining: 375000,
  budgetUtilization: 70,
}

const budgetCategories = [
  { id: 'labor', name: 'Labor Costs', budget: 500000, spent: 350000, color: '#A9DFD8' },
  { id: 'materials', name: 'Materials', budget: 400000, spent: 320000, color: '#FFE48C' },
  { id: 'equipment', name: 'Equipment', budget: 200000, spent: 125000, color: '#C5D3FF' },
  { id: 'subcontractors', name: 'Subcontractors', budget: 100000, spent: 60000, color: '#F8B4B4' },
  { id: 'overhead', name: 'Overhead & Admin', budget: 50000, spent: 20000, color: '#D1D5DB' },
]

const invoices = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2024-001',
    vendor: 'ABC Contractors',
    category: 'Subcontractors',
    amount: 15000,
    date: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'Paid',
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2024-002',
    vendor: 'Steel Supply Co',
    category: 'Materials',
    amount: 32500,
    date: '2024-01-18',
    dueDate: '2024-02-18',
    status: 'Paid',
  },
  {
    id: 'inv3',
    invoiceNumber: 'INV-2024-003',
    vendor: 'Equipment Rentals LLC',
    category: 'Equipment',
    amount: 8750,
    date: '2024-01-22',
    dueDate: '2024-02-22',
    status: 'Pending',
  },
  {
    id: 'inv4',
    invoiceNumber: 'INV-2024-004',
    vendor: 'Concrete Solutions',
    category: 'Materials',
    amount: 45000,
    date: '2024-01-25',
    dueDate: '2024-02-25',
    status: 'Overdue',
  },
  {
    id: 'inv5',
    invoiceNumber: 'INV-2024-005',
    vendor: 'Design Partners',
    category: 'Labor Costs',
    amount: 22000,
    date: '2024-01-28',
    dueDate: '2024-02-28',
    status: 'Draft',
  },
]

const monthlySpending = [
  { month: 'Jan', planned: 80000, actual: 75000 },
  { month: 'Feb', planned: 95000, actual: 102000 },
  { month: 'Mar', planned: 110000, actual: 98000 },
  { month: 'Apr', planned: 125000, actual: 130000 },
  { month: 'May', planned: 140000, actual: 145000 },
  { month: 'Jun', planned: 150000, actual: 142000 },
  { month: 'Jul', planned: 130000, actual: 128000 },
  { month: 'Aug', planned: 120000, actual: 55000 },
  { month: 'Sep', planned: 100000, actual: 0 },
  { month: 'Oct', planned: 90000, actual: 0 },
  { month: 'Nov', planned: 70000, actual: 0 },
  { month: 'Dec', planned: 40000, actual: 0 },
]

export default function ProjectBudgetPage({ params }: { params: { id: string } }) {
  const [activeInvoiceFilter, setActiveInvoiceFilter] = useState<string>('all')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredInvoices = invoices.filter((inv) => {
    if (activeInvoiceFilter === 'all') return true
    return inv.status.toLowerCase() === activeInvoiceFilter.toLowerCase()
  })

  const maxSpending = Math.max(...monthlySpending.map((m) => Math.max(m.planned, m.actual)))

  return (
    <DashboardShell>
      <TopBar title="Project Budget" />
      <section className="mt-8 space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="flex items-center gap-2 text-soft-white/70 hover:text-soft-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
              <path d="M12 4l-6 6 6 6" />
            </svg>
            <span className="text-sm">Back to Project</span>
          </Link>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Total Budget</p>
            <p className="font-display text-2xl font-semibold text-soft-white">
              {formatCurrency(budgetSummary.totalBudget)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Total Spent</p>
            <p className="font-display text-2xl font-semibold text-[#FF9BB0]">
              {formatCurrency(budgetSummary.totalSpent)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Remaining</p>
            <p className="font-display text-2xl font-semibold text-[#63FFC9]">
              {formatCurrency(budgetSummary.totalRemaining)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Utilization</p>
                <p className="font-display text-2xl font-semibold text-soft-white">
                  {budgetSummary.budgetUtilization}%
                </p>
              </div>
              {/* Progress Ring */}
              <div className="relative h-14 w-14">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#323449" strokeWidth="5" />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="#A9DFD8"
                    strokeWidth="5"
                    strokeDasharray={`${(budgetSummary.budgetUtilization / 100) * 138} 138`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Budget by Category */}
          <div className="lg:col-span-2 rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-soft-white">Budget by Category</h3>
              <button
                type="button"
                className="rounded-[8px] border border-[#323449] px-4 py-2 text-xs font-semibold text-soft-white hover:border-accent transition"
              >
                + Add Category
              </button>
            </div>
            <div className="space-y-5">
              {budgetCategories.map((cat) => {
                const percentUsed = Math.round((cat.spent / cat.budget) * 100)
                const remaining = cat.budget - cat.spent
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm font-medium text-soft-white">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-soft-white/60">
                        <span>Budget: {formatCurrency(cat.budget)}</span>
                        <span>Spent: {formatCurrency(cat.spent)}</span>
                        <span className={remaining >= 0 ? 'text-[#63FFC9]' : 'text-[#FF9BB0]'}>
                          Remaining: {formatCurrency(remaining)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 rounded-full bg-[#323449] overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all"
                        style={{
                          width: `${percentUsed}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <div className="text-right text-xs text-soft-white/40">{percentUsed}% used</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Budget Donut Chart */}
          <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-soft-white mb-4">Spending Distribution</h3>
            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="relative h-44 w-44 mb-6">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  {budgetCategories.reduce(
                    (acc, item) => {
                      const offset = acc.offset
                      const circumference = 2 * Math.PI * 35
                      const percent = (item.spent / budgetSummary.totalSpent) * 100
                      const strokeDasharray = (percent / 100) * circumference
                      acc.elements.push(
                        <circle
                          key={item.id}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="15"
                          strokeDasharray={`${strokeDasharray} ${circumference}`}
                          strokeDashoffset={-offset}
                        />
                      )
                      acc.offset += strokeDasharray
                      return acc
                    },
                    { elements: [] as JSX.Element[], offset: 0 }
                  ).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xl font-semibold text-soft-white">
                    {formatCurrency(budgetSummary.totalSpent)}
                  </span>
                  <span className="text-xs text-soft-white/50">Total Spent</span>
                </div>
              </div>
              {/* Legend */}
              <div className="w-full space-y-2">
                {budgetCategories.map((cat) => {
                  const percent = Math.round((cat.spent / budgetSummary.totalSpent) * 100)
                  return (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-soft-white/70">{cat.name}</span>
                      </div>
                      <span className="text-xs font-medium text-soft-white">{percent}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-soft-white">Monthly Spending vs Budget</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#A9DFD8]" />
                <span className="text-xs text-soft-white/60">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#C5D3FF]" />
                <span className="text-xs text-soft-white/60">Actual</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2">
            {monthlySpending.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full flex items-end justify-center gap-1 h-52">
                  {/* Planned bar */}
                  <div
                    className="w-3 rounded-t bg-[#A9DFD8]/30 transition-all"
                    style={{ height: `${(month.planned / maxSpending) * 100}%` }}
                  />
                  {/* Actual bar */}
                  <div
                    className="w-3 rounded-t bg-[#C5D3FF] transition-all"
                    style={{ height: `${(month.actual / maxSpending) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-soft-white/50">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices Section */}
        <div className="rounded-[18px] border border-[#2F303A] bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="font-display text-lg font-semibold text-soft-white">Invoices</h3>
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              {['all', 'paid', 'pending', 'overdue', 'draft'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveInvoiceFilter(filter)}
                  className={`rounded-[8px] px-4 py-2 text-xs font-semibold capitalize transition ${
                    activeInvoiceFilter === filter
                      ? 'bg-accent text-night'
                      : 'border border-[#323449] text-soft-white hover:border-accent/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <button
                type="button"
                className="ml-2 rounded-[8px] bg-accent px-4 py-2 text-xs font-semibold text-night hover:brightness-110 transition"
              >
                + New Invoice
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#323449] text-left text-xs uppercase tracking-wider text-soft-white/50">
                  <th className="px-4 py-3 font-medium">Invoice #</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-[#323449]/50 last:border-0">
                    <td className="px-4 py-4 text-sm font-medium text-soft-white">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 text-sm text-soft-white/70">{invoice.vendor}</td>
                    <td className="px-4 py-4 text-sm text-soft-white/70">{invoice.category}</td>
                    <td className="px-4 py-4 text-sm text-soft-white">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-4 text-sm text-soft-white/70">{invoice.date}</td>
                    <td className="px-4 py-4 text-sm text-soft-white/70">{invoice.dueDate}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          invoice.status === 'Paid'
                            ? 'bg-[#15352C]/80 text-[#63FFC9] border border-[#315b48]'
                            : invoice.status === 'Pending'
                            ? 'bg-[#3c3514]/70 text-[#FFE48C] border border-[#6b591f]'
                            : invoice.status === 'Overdue'
                            ? 'bg-[#3a1c1c]/70 text-[#FF9BB0] border border-[#7b3b3b]'
                            : 'bg-[#2a2a3a] text-soft-white/60 border border-[#3a3a4a]'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-[6px] border border-[#323449] p-1.5 text-soft-white/60 hover:border-accent hover:text-accent transition"
                          title="View"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="rounded-[6px] border border-[#323449] p-1.5 text-soft-white/60 hover:border-accent hover:text-accent transition"
                          title="Download"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1M12 12l-2 2m0 0l-2-2m2 2V4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="rounded-[6px] border border-[#323449] p-1.5 text-soft-white/60 hover:border-accent hover:text-accent transition"
                          title="More"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="4" cy="10" r="2" />
                            <circle cx="10" cy="10" r="2" />
                            <circle cx="16" cy="10" r="2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#323449]">
            <span className="text-xs text-soft-white/50">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-[6px] border border-[#323449] px-3 py-1.5 text-xs text-soft-white/60 hover:border-accent transition"
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-[6px] bg-accent px-3 py-1.5 text-xs font-semibold text-night"
              >
                1
              </button>
              <button
                type="button"
                className="rounded-[6px] border border-[#323449] px-3 py-1.5 text-xs text-soft-white/60 hover:border-accent transition"
              >
                2
              </button>
              <button
                type="button"
                className="rounded-[6px] border border-[#323449] px-3 py-1.5 text-xs text-soft-white/60 hover:border-accent transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-1">Total Invoices</p>
                <p className="font-display text-xl font-semibold text-soft-white">{invoices.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A9DFD8]/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-1">Paid</p>
                <p className="font-display text-xl font-semibold text-[#63FFC9]">
                  {invoices.filter((i) => i.status === 'Paid').length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#63FFC9]/10">
                <svg className="h-5 w-5 text-[#63FFC9]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
                  <path d="M5 10l3 3 7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-1">Pending</p>
                <p className="font-display text-xl font-semibold text-[#FFE48C]">
                  {invoices.filter((i) => i.status === 'Pending').length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE48C]/10">
                <svg className="h-5 w-5 text-[#FFE48C]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="8" />
                  <path d="M10 6v4l2 2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-1">Overdue</p>
                <p className="font-display text-xl font-semibold text-[#FF9BB0]">
                  {invoices.filter((i) => i.status === 'Overdue').length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9BB0]/10">
                <svg className="h-5 w-5 text-[#FF9BB0]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v4M12 16h.01M12 3L3 18h18L12 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
