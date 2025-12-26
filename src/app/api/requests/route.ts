import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface Request {
  id: string
  type: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'in-review'
  submittedBy: string
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  rejectionReason?: string
  attachments: RequestAttachment[]
  projectId?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface RequestAttachment {
  id: string
  name: string
  size: string
  progress: number
  uploadedAt: string
}

// Storage file path
const REQUESTS_FILE = path.join(process.cwd(), 'data', 'requests.json')

// Request types
export const REQUEST_TYPES = [
  'Purchase request',
  'Software access',
  'Maintenance support',
  'Contract review',
  'Budget approval',
  'Resource allocation',
  'Change order',
  'Time extension',
  'Safety inspection',
  'Quality review',
]

// Helper to read requests from file
function getRequests(): Request[] {
  try {
    if (fs.existsSync(REQUESTS_FILE)) {
      const data = fs.readFileSync(REQUESTS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading requests:', error)
  }
  return getDefaultRequests()
}

// Helper to save requests to file
function saveRequests(requests: Request[]): void {
  try {
    const dir = path.dirname(REQUESTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2))
  } catch (error) {
    console.error('Error saving requests:', error)
  }
}

// Default requests
function getDefaultRequests(): Request[] {
  return [
    {
      id: 'req-1',
      type: 'Purchase request',
      description: 'Request for additional construction materials for Phase 2',
      status: 'pending',
      submittedBy: 'John Doe',
      submittedAt: 'Aug 1, 2024',
      attachments: [
        { id: 'att-1', name: 'Budget_breakdown.xlsx', size: '840 KB', progress: 100, uploadedAt: new Date().toISOString() },
      ],
      priority: 'high',
    },
    {
      id: 'req-2',
      type: 'Software access',
      description: 'Access to project management software for new team member',
      status: 'approved',
      submittedBy: 'Jane Smith',
      submittedAt: 'Aug 3, 2024',
      reviewedBy: 'Admin',
      reviewedAt: 'Aug 4, 2024',
      attachments: [],
      priority: 'medium',
    },
    {
      id: 'req-3',
      type: 'Contract review',
      description: 'Review of subcontractor agreement for electrical work',
      status: 'rejected',
      submittedBy: 'Tom Johnson',
      submittedAt: 'Aug 7, 2024',
      reviewedBy: 'Legal Team',
      reviewedAt: 'Aug 8, 2024',
      rejectionReason: 'Missing required documentation',
      attachments: [
        { id: 'att-2', name: 'Statement_of_work.pdf', size: '2.4 MB', progress: 100, uploadedAt: new Date().toISOString() },
      ],
      priority: 'high',
    },
  ]
}

// GET /api/requests - Get all requests
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const projectId = searchParams.get('projectId')

    let requests = getRequests()

    // Filter by status
    if (status) {
      requests = requests.filter(r => r.status === status)
    }

    // Filter by type
    if (type) {
      requests = requests.filter(r => r.type === type)
    }

    // Filter by project
    if (projectId) {
      requests = requests.filter(r => r.projectId === projectId)
    }

    // Calculate stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      inReview: requests.filter(r => r.status === 'in-review').length,
    }

    return NextResponse.json({
      requests,
      requestTypes: REQUEST_TYPES,
      stats,
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

// POST /api/requests - Create a new request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, description, submittedBy, projectId, priority, attachments } = body

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Type and description are required' },
        { status: 400 }
      )
    }

    const requests = getRequests()
    
    const newRequest: Request = {
      id: `req-${Date.now()}`,
      type,
      description,
      status: 'pending',
      submittedBy: submittedBy || 'Current User',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projectId,
      priority: priority || 'medium',
      attachments: attachments || [],
    }

    requests.push(newRequest)
    saveRequests(requests)

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    )
  }
}

// PUT /api/requests - Update request (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, reviewedBy, rejectionReason } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      )
    }

    const requests = getRequests()
    const requestIndex = requests.findIndex(r => r.id === id)

    if (requestIndex === -1) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    requests[requestIndex] = {
      ...requests[requestIndex],
      status,
      reviewedBy: reviewedBy || 'Current User',
      reviewedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...(rejectionReason && { rejectionReason }),
    }

    saveRequests(requests)

    return NextResponse.json(requests[requestIndex])
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
}

// DELETE /api/requests - Delete a request
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    let requests = getRequests()
    requests = requests.filter(r => r.id !== requestId)
    saveRequests(requests)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    )
  }
}
