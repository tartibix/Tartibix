'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import DashboardShell from '@/components/dashboard/DashboardShell'
import TopBar from '@/components/dashboard/TopBar'
import { ProjectSetupData } from '@/lib/projectSetupTypes'

type BudgetCategory = {
  id: string
  name: string
  budget: number
  spent: number
  color: string
}

type Invoice = {
  id: string
  invoiceNumber: string
  vendor: string
  category: string
  amount: number
  date: string
  dueDate: string
  status: string
}

export default function ProjectBudgetPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectSetupData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeInvoiceFilter, setActiveInvoiceFilter] = useState<string>('all')

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects?id=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [params.id])

  // Calculate budget data from project
  const budgetData = useMemo(() => {
    if (!project) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        budgetUtilization: 0,
        categories: [] as BudgetCategory[],
        invoices: [] as Invoice[],
      }
    }

    // Calculate labor costs from employees (using dailyCost)
    const laborBudget = (project.employees || []).reduce((sum, emp) => {
      const dailyCost = emp.dailyCost || 0
      // Assume 22 working days per month for the project duration
      return sum + (dailyCost * 22)
    }, 0)
    const laborSpent = laborBudget * (project.progress || 50) / 100

    // Calculate materials costs (using estimatedValue)
    const materialsBudget = (project.materials || []).reduce((sum, mat) => {
      return sum + (mat.estimatedValue || 0)
    }, 0)
    const materialsSpent = materialsBudget * (project.progress || 50) / 100

    // Calculate equipment costs (using dailyCost)
    const equipmentBudget = (project.equipment || []).reduce((sum, eq) => {
      const dailyCost = eq.dailyCost || 0
      // Assume 30 days for the project duration
      return sum + (dailyCost * 30)
    }, 0)
    const equipmentSpent = equipmentBudget * (project.progress || 50) / 100

    // Total from contract value or calculated
    const totalBudget = project.contractValue || (laborBudget + materialsBudget + equipmentBudget) || 1000000
    const totalSpent = laborSpent + materialsSpent + equipmentSpent
    const totalRemaining = totalBudget - totalSpent
    const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

    const categories: BudgetCategory[] = [
      { id: 'labor', name: 'Labor Costs', budget: laborBudget || totalBudget * 0.4, spent: laborSpent, color: '#A9DFD8' },
      { id: 'materials', name: 'Materials', budget: materialsBudget || totalBudget * 0.32, spent: materialsSpent, color: '#FFE48C' },
      { id: 'equipment', name: 'Equipment', budget: equipmentBudget || totalBudget * 0.16, spent: equipmentSpent, color: '#C5D3FF' },
      { id: 'subcontractors', name: 'Subcontractors', budget: totalBudget * 0.08, spent: totalBudget * 0.08 * (project.progress || 50) / 100, color: '#F8B4B4' },
      { id: 'overhead', name: 'Overhead & Admin', budget: totalBudget * 0.04, spent: totalBudget * 0.04 * (project.progress || 50) / 100, color: '#D1D5DB' },
    ]

    // Generate invoices from materials/equipment purchases
    const invoices: Invoice[] = [
      ...(project.materials || []).slice(0, 3).map((mat, i) => ({
        id: `inv-mat-${i}`,
        invoiceNumber: `INV-${project.projectId?.slice(-4) || '2024'}-M${String(i + 1).padStart(3, '0')}`,
        vendor: mat.materialName || 'Material Supplier',
        category: 'Materials',
        amount: mat.estimatedValue || 0,
        date: project.contractStartDate || new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: i === 0 ? 'Paid' : i === 1 ? 'Pending' : 'Draft',
      })),
      ...(project.equipment || []).slice(0, 2).map((eq, i) => ({
        id: `inv-eq-${i}`,
        invoiceNumber: `INV-${project.projectId?.slice(-4) || '2024'}-E${String(i + 1).padStart(3, '0')}`,
        vendor: eq.equipmentName || 'Equipment Vendor',
        category: 'Equipment',
        amount: (eq.dailyCost || 0) * 30,
        date: project.contractStartDate || new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: i === 0 ? 'Paid' : 'Pending',
      })),
    ]

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      budgetUtilization,
      categories,
      invoices,
    }
  }, [project])

  // Calculate monthly spending from execution plan
  const monthlySpending = useMemo(() => {
    if (!project?.executionPlan) {
      return [
        { month: 'Jan', planned: 0, actual: 0 },
        { month: 'Feb', planned: 0, actual: 0 },
        { month: 'Mar', planned: 0, actual: 0 },
      ]
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyData = new Map<number, { planned: number; actual: number }>()

    project.executionPlan.forEach(task => {
      if (task.startDate) {
        const month = new Date(task.startDate).getMonth()
        const existing = monthlyData.get(month) || { planned: 0, actual: 0 }
        const taskCost = (budgetData.totalBudget / project.executionPlan!.length)
        existing.planned += taskCost
        if (task.endDate && new Date(task.endDate) < new Date()) {
          existing.actual += taskCost * 0.95
        }
        monthlyData.set(month, existing)
      }
    })

    return Array.from(monthlyData.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([month, data]) => ({
        month: months[month],
        planned: Math.round(data.planned),
        actual: Math.round(data.actual),
      }))
  }, [project, budgetData.totalBudget])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredInvoices = budgetData.invoices.filter((inv) => {
    if (activeInvoiceFilter === 'all') return true
    return inv.status.toLowerCase() === activeInvoiceFilter.toLowerCase()
  })

  const maxSpending = Math.max(...monthlySpending.map((m) => Math.max(m.planned, m.actual)), 1)

  if (isLoading) {
    return (
      <DashboardShell>
        <TopBar title="Project Budget" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  if (!project) {
    return (
      <DashboardShell>
        <TopBar title="Project Budget" />
        <div className="flex items-center justify-center py-20">
          <p className="text-soft-white/60">Project not found</p>
        </div>
      </DashboardShell>
    )
  }

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
              {formatCurrency(budgetData.totalBudget)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Total Spent</p>
            <p className="font-display text-2xl font-semibold text-[#FF9BB0]">
              {formatCurrency(budgetData.totalSpent)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Remaining</p>
            <p className="font-display text-2xl font-semibold text-[#63FFC9]">
              {formatCurrency(budgetData.totalRemaining)}
            </p>
          </div>
          <div className="rounded-[14px] border border-[#323449] bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-soft-white/50 mb-2">Utilization</p>
                <p className="font-display text-2xl font-semibold text-soft-white">
                  {budgetData.budgetUtilization}%
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
                    strokeDasharray={`${(budgetData.budgetUtilization / 100) * 138} 138`}
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
              {budgetData.categories.map((cat) => {
                const percentUsed = cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0
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
                  {budgetData.categories.reduce(
                    (acc, item) => {
                      const offset = acc.offset
                      const circumference = 2 * Math.PI * 35
                      const percent = budgetData.totalSpent > 0 ? (item.spent / budgetData.totalSpent) * 100 : 0
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
                    {formatCurrency(budgetData.totalSpent)}
                  </span>
                  <span className="text-xs text-soft-white/50">Total Spent</span>
                </div>
              </div>
              {/* Legend */}
              <div className="w-full space-y-2">
                {budgetData.categories.map((cat) => {
                  const percent = budgetData.totalSpent > 0 ? Math.round((cat.spent / budgetData.totalSpent) * 100) : 0
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
              Showing {filteredInvoices.length} of {budgetData.invoices.length} invoices
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
                <p className="font-display text-xl font-semibold text-soft-white">{budgetData.invoices.length}</p>
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
                  {budgetData.invoices.filter((i: Invoice) => i.status === 'Paid').length}
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
                  {budgetData.invoices.filter((i: Invoice) => i.status === 'Pending').length}
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
                  {budgetData.invoices.filter((i: Invoice) => i.status === 'Overdue').length}
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
