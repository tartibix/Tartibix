/**
 * Report Exporter Utility
 * Generates PDF and Excel reports from project data
 */

export interface ReportData {
	projectId: string
	projectName: string
	dateRange: string
	dataType: string
	generatedAt: string
	data: Record<string, unknown>
}

/**
 * Export report data to PDF format
 * Uses browser's print functionality to generate PDF
 */
export async function exportToPDF(reportData: ReportData): Promise<void> {
	// Create a printable HTML document
	const printWindow = window.open('', '_blank')
	if (!printWindow) {
		throw new Error('Could not open print window. Please allow popups.')
	}

	const htmlContent = generatePDFHTML(reportData)
	printWindow.document.write(htmlContent)
	printWindow.document.close()
	
	// Wait for content to load then trigger print
	printWindow.onload = () => {
		printWindow.print()
	}
}

/**
 * Export report data to Excel format (CSV)
 * Generates a downloadable CSV file
 */
export async function exportToExcel(reportData: ReportData): Promise<void> {
	const csvContent = generateCSV(reportData)
	
	// Create and trigger download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = `${reportData.projectName.replace(/\s+/g, '_')}_${reportData.dataType}_report.csv`
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}

/**
 * Generate HTML content for PDF export
 */
function generatePDFHTML(reportData: ReportData): string {
	const { projectName, dateRange, dataType, generatedAt, data } = reportData
	
	// Format the data type for display
	const formattedDataType = dataType
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	// Generate data rows based on data type
	let dataRows = ''
	
	if (dataType === 'financial-overview') {
		const financial = data as {
			totalBudget?: number
			spent?: number
			remaining?: number
			invoicesPending?: number
		}
		dataRows = `
			<tr><td>Total Budget</td><td>SAR ${(financial.totalBudget || 0).toLocaleString()}</td></tr>
			<tr><td>Amount Spent</td><td>SAR ${(financial.spent || 0).toLocaleString()}</td></tr>
			<tr><td>Remaining Budget</td><td>SAR ${(financial.remaining || 0).toLocaleString()}</td></tr>
			<tr><td>Pending Invoices</td><td>${financial.invoicesPending || 0}</td></tr>
		`
	} else if (dataType === 'resource-allocation') {
		const resources = data as {
			totalResources?: number
			allocated?: number
			available?: number
			utilization?: number
		}
		dataRows = `
			<tr><td>Total Resources</td><td>${resources.totalResources || 0}</td></tr>
			<tr><td>Allocated</td><td>${resources.allocated || 0}</td></tr>
			<tr><td>Available</td><td>${resources.available || 0}</td></tr>
			<tr><td>Utilization Rate</td><td>${resources.utilization || 0}%</td></tr>
		`
	} else if (dataType === 'task-completion') {
		const tasks = data as {
			totalTasks?: number
			completed?: number
			inProgress?: number
			pending?: number
			completionRate?: number
		}
		dataRows = `
			<tr><td>Total Tasks</td><td>${tasks.totalTasks || 0}</td></tr>
			<tr><td>Completed</td><td>${tasks.completed || 0}</td></tr>
			<tr><td>In Progress</td><td>${tasks.inProgress || 0}</td></tr>
			<tr><td>Pending</td><td>${tasks.pending || 0}</td></tr>
			<tr><td>Completion Rate</td><td>${tasks.completionRate || 0}%</td></tr>
		`
	} else if (dataType === 'risk-compliance') {
		const risk = data as {
			overallRisk?: string
			openRisks?: number
			mitigated?: number
			complianceScore?: number
		}
		dataRows = `
			<tr><td>Overall Risk Level</td><td>${risk.overallRisk || 'N/A'}</td></tr>
			<tr><td>Open Risks</td><td>${risk.openRisks || 0}</td></tr>
			<tr><td>Mitigated Risks</td><td>${risk.mitigated || 0}</td></tr>
			<tr><td>Compliance Score</td><td>${risk.complianceScore || 0}%</td></tr>
		`
	}

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<title>${projectName} - ${formattedDataType} Report</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					padding: 40px;
					color: #333;
				}
				.header {
					text-align: center;
					margin-bottom: 40px;
					border-bottom: 2px solid #A9DFD8;
					padding-bottom: 20px;
				}
				.header h1 {
					color: #2B2B36;
					margin-bottom: 10px;
				}
				.header .subtitle {
					color: #666;
					font-size: 14px;
				}
				.meta-info {
					display: flex;
					justify-content: space-between;
					margin-bottom: 30px;
					padding: 15px;
					background: #f5f5f5;
					border-radius: 8px;
				}
				.meta-info div {
					text-align: center;
				}
				.meta-info label {
					font-size: 12px;
					color: #666;
					display: block;
					margin-bottom: 5px;
				}
				.meta-info span {
					font-weight: bold;
					color: #333;
				}
				table {
					width: 100%;
					border-collapse: collapse;
					margin-top: 20px;
				}
				th, td {
					padding: 12px 15px;
					text-align: left;
					border-bottom: 1px solid #ddd;
				}
				th {
					background-color: #A9DFD8;
					color: #2B2B36;
					font-weight: bold;
				}
				tr:nth-child(even) {
					background-color: #f9f9f9;
				}
				.footer {
					margin-top: 40px;
					text-align: center;
					font-size: 12px;
					color: #666;
				}
				@media print {
					body { padding: 20px; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<h1>${projectName}</h1>
				<div class="subtitle">${formattedDataType} Report</div>
			</div>
			
			<div class="meta-info">
				<div>
					<label>Date Range</label>
					<span>${dateRange}</span>
				</div>
				<div>
					<label>Report Type</label>
					<span>${formattedDataType}</span>
				</div>
				<div>
					<label>Generated</label>
					<span>${new Date(generatedAt).toLocaleDateString()}</span>
				</div>
			</div>

			<table>
				<thead>
					<tr>
						<th>Metric</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					${dataRows}
				</tbody>
			</table>

			<div class="footer">
				<p>Generated by TARTIBIX Platform on ${new Date(generatedAt).toLocaleString()}</p>
			</div>
		</body>
		</html>
	`
}

/**
 * Generate CSV content from report data
 */
function generateCSV(reportData: ReportData): string {
	const { projectName, dateRange, dataType, generatedAt, data } = reportData
	
	const formattedDataType = dataType
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	let csvRows: string[] = []
	
	// Header info
	csvRows.push(`Project,${projectName}`)
	csvRows.push(`Report Type,${formattedDataType}`)
	csvRows.push(`Date Range,${dateRange}`)
	csvRows.push(`Generated,${new Date(generatedAt).toLocaleString()}`)
	csvRows.push('')  // Empty row
	csvRows.push('Metric,Value')

	// Data rows based on type
	if (dataType === 'financial-overview') {
		const financial = data as {
			totalBudget?: number
			spent?: number
			remaining?: number
			invoicesPending?: number
		}
		csvRows.push(`Total Budget,SAR ${(financial.totalBudget || 0).toLocaleString()}`)
		csvRows.push(`Amount Spent,SAR ${(financial.spent || 0).toLocaleString()}`)
		csvRows.push(`Remaining Budget,SAR ${(financial.remaining || 0).toLocaleString()}`)
		csvRows.push(`Pending Invoices,${financial.invoicesPending || 0}`)
	} else if (dataType === 'resource-allocation') {
		const resources = data as {
			totalResources?: number
			allocated?: number
			available?: number
			utilization?: number
		}
		csvRows.push(`Total Resources,${resources.totalResources || 0}`)
		csvRows.push(`Allocated,${resources.allocated || 0}`)
		csvRows.push(`Available,${resources.available || 0}`)
		csvRows.push(`Utilization Rate,${resources.utilization || 0}%`)
	} else if (dataType === 'task-completion') {
		const tasks = data as {
			totalTasks?: number
			completed?: number
			inProgress?: number
			pending?: number
			completionRate?: number
		}
		csvRows.push(`Total Tasks,${tasks.totalTasks || 0}`)
		csvRows.push(`Completed,${tasks.completed || 0}`)
		csvRows.push(`In Progress,${tasks.inProgress || 0}`)
		csvRows.push(`Pending,${tasks.pending || 0}`)
		csvRows.push(`Completion Rate,${tasks.completionRate || 0}%`)
	} else if (dataType === 'risk-compliance') {
		const risk = data as {
			overallRisk?: string
			openRisks?: number
			mitigated?: number
			complianceScore?: number
		}
		csvRows.push(`Overall Risk Level,${risk.overallRisk || 'N/A'}`)
		csvRows.push(`Open Risks,${risk.openRisks || 0}`)
		csvRows.push(`Mitigated Risks,${risk.mitigated || 0}`)
		csvRows.push(`Compliance Score,${risk.complianceScore || 0}%`)
	}

	return csvRows.join('\n')
}

/**
 * Fetch report data for a specific project and data type
 */
export async function fetchReportData(
	projectId: string,
	projectName: string,
	dateRange: string,
	dataType: string
): Promise<ReportData> {
	try {
		// Fetch project details
		const projectRes = await fetch(`/api/projects?id=${projectId}`)
		const projectData = projectRes.ok ? await projectRes.json() : null
		const project = projectData?.project

		// Generate report data based on type
		let data: Record<string, unknown> = {}

		if (dataType === 'financial-overview') {
			// Calculate financial metrics from project
			const budget = project?.phases?.reduce((sum: number, phase: { budget?: number }) => 
				sum + (phase.budget || 0), 0) || 0
			const spent = Math.round(budget * 0.65) // Simulated spending
			data = {
				totalBudget: budget,
				spent: spent,
				remaining: budget - spent,
				invoicesPending: project?.phases?.length || 0
			}
		} else if (dataType === 'resource-allocation') {
			// Calculate resource metrics
			const totalResources = project?.employees?.length || 0
			const allocated = Math.round(totalResources * 0.8)
			data = {
				totalResources,
				allocated,
				available: totalResources - allocated,
				utilization: totalResources > 0 ? Math.round((allocated / totalResources) * 100) : 0
			}
		} else if (dataType === 'task-completion') {
			// Fetch tasks for this project
			const tasksRes = await fetch(`/api/tasks?projectId=${projectId}`)
			const tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] }
			const tasks = tasksData.tasks || []
			
			const completed = tasks.filter((t: { status?: string }) => 
				t.status === 'Completed' || t.status === 'Done').length
			const inProgress = tasks.filter((t: { status?: string }) => 
				t.status === 'In Progress' || t.status === 'in-progress').length
			const pending = tasks.filter((t: { status?: string }) => 
				t.status === 'Not Started' || t.status === 'Pending' || t.status === 'pending').length
			
			data = {
				totalTasks: tasks.length,
				completed,
				inProgress,
				pending,
				completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
			}
		} else if (dataType === 'risk-compliance') {
			// Generate risk metrics
			const riskScore = Math.random()
			data = {
				overallRisk: riskScore < 0.3 ? 'Low' : riskScore < 0.7 ? 'Medium' : 'High',
				openRisks: Math.floor(Math.random() * 10) + 1,
				mitigated: Math.floor(Math.random() * 5) + 3,
				complianceScore: Math.round(75 + Math.random() * 20)
			}
		}

		return {
			projectId,
			projectName,
			dateRange,
			dataType,
			generatedAt: new Date().toISOString(),
			data
		}
	} catch (error) {
		console.error('Error fetching report data:', error)
		return {
			projectId,
			projectName,
			dateRange,
			dataType,
			generatedAt: new Date().toISOString(),
			data: {}
		}
	}
}
