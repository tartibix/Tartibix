import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Project Manager' | 'Editor' | 'Viewer'
  department?: string
  avatar?: string
  createdAt: string
  lastActive?: string
  status: 'active' | 'inactive' | 'pending'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  memberCount: number
}

// Storage file paths
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const ROLES_FILE = path.join(process.cwd(), 'data', 'roles.json')

// Permission groups
export const PERMISSION_GROUPS = [
  'Projects',
  'Tasks',
  'Documents',
  'Billing',
  'Resources',
  'Reports',
  'People',
  'Settings',
]

// Helper to read users from file
function getUsers(): User[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users:', error)
  }
  return getDefaultUsers()
}

// Helper to save users to file
function saveUsers(users: User[]): void {
  try {
    const dir = path.dirname(USERS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

// Helper to read roles from file
function getRoles(): Role[] {
  try {
    if (fs.existsSync(ROLES_FILE)) {
      const data = fs.readFileSync(ROLES_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading roles:', error)
  }
  return getDefaultRoles()
}

// Helper to save roles to file
function saveRoles(roles: Role[]): void {
  try {
    const dir = path.dirname(ROLES_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ROLES_FILE, JSON.stringify(roles, null, 2))
  } catch (error) {
    console.error('Error saving roles:', error)
  }
}

// Default users
function getDefaultUsers(): User[] {
  return [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'John@example.com',
      role: 'Admin',
      department: 'Management',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'Jane@example.com',
      role: 'Editor',
      department: 'Engineering',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-3',
      name: 'Tom Johnson',
      email: 'Tom@example.com',
      role: 'Viewer',
      department: 'Operations',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-4',
      name: 'Emily Davis',
      email: 'Emily@example.com',
      role: 'Editor',
      department: 'Design',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-5',
      name: 'Michael Chen',
      email: 'Michael@example.com',
      role: 'Project Manager',
      department: 'Construction',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-6',
      name: 'Sarah Williams',
      email: 'Sarah@example.com',
      role: 'Viewer',
      department: 'Finance',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]
}

// Default roles
function getDefaultRoles(): Role[] {
  return [
    {
      id: 'role-1',
      name: 'Administrator',
      description: 'Full access to all workspace settings and billing.',
      permissions: ['Projects', 'Tasks', 'Documents', 'Billing', 'People', 'Settings', 'Resources', 'Reports'],
      memberCount: 4,
    },
    {
      id: 'role-2',
      name: 'Project Manager',
      description: 'Manage projects, tasks, resources, and reports.',
      permissions: ['Projects', 'Tasks', 'Resources', 'Reports', 'Documents'],
      memberCount: 9,
    },
    {
      id: 'role-3',
      name: 'Editor',
      description: 'Update documents and monitor project progress.',
      permissions: ['Projects', 'Documents', 'Reports'],
      memberCount: 14,
    },
    {
      id: 'role-4',
      name: 'Viewer',
      description: 'Read-only access to dashboards and reports.',
      permissions: ['Reports'],
      memberCount: 21,
    },
  ]
}

// GET /api/users - Get all users or roles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'users' or 'roles'
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    if (type === 'roles') {
      const roles = getRoles()
      return NextResponse.json({
        roles,
        permissionGroups: PERMISSION_GROUPS,
      })
    }

    let users = getUsers()

    // Filter by role
    if (role) {
      users = users.filter(u => u.role === role)
    }

    // Filter by status
    if (status) {
      users = users.filter(u => u.status === status)
    }

    // Search by name or email
    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      )
    }

    // Calculate stats
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      byRole: {
        Admin: users.filter(u => u.role === 'Admin').length,
        'Project Manager': users.filter(u => u.role === 'Project Manager').length,
        Editor: users.filter(u => u.role === 'Editor').length,
        Viewer: users.filter(u => u.role === 'Viewer').length,
      },
    }

    return NextResponse.json({
      users,
      stats,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user or role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'role') {
      const roles = getRoles()
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        permissions: data.permissions || [],
        memberCount: 0,
      }
      roles.push(newRole)
      saveRoles(roles)
      return NextResponse.json(newRole, { status: 201 })
    }

    // Create user
    const users = getUsers()
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'Viewer',
      department: data.department,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update a user or role
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, updates } = body

    if (type === 'role') {
      const roles = getRoles()
      const roleIndex = roles.findIndex(r => r.id === id)
      if (roleIndex === -1) {
        return NextResponse.json({ error: 'Role not found' }, { status: 404 })
      }
      roles[roleIndex] = { ...roles[roleIndex], ...updates }
      saveRoles(roles)
      return NextResponse.json(roles[roleIndex])
    }

    // Update user
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    users[userIndex] = { ...users[userIndex], ...updates }
    saveUsers(users)

    return NextResponse.json(users[userIndex])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete a user or role
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (type === 'role') {
      let roles = getRoles()
      roles = roles.filter(r => r.id !== id)
      saveRoles(roles)
      return NextResponse.json({ success: true })
    }

    let users = getUsers()
    users = users.filter(u => u.id !== id)
    saveUsers(users)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
