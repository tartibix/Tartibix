import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface Notification {
  id: string
  type: 'system' | 'task' | 'project' | 'document' | 'comment' | 'approval' | 'alert'
  title: string
  description: string
  time: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  link?: string
  projectId?: string
  userId?: string
}

export interface AuditLogEntry {
  id: string
  action: string
  user: string
  userId?: string
  timestamp: string
  details?: string
  entityType?: 'project' | 'task' | 'document' | 'user' | 'system'
  entityId?: string
  ipAddress?: string
}

// Storage file paths
const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json')
const AUDIT_LOG_FILE = path.join(process.cwd(), 'data', 'audit-log.json')

// Helper to read notifications from file
function getNotifications(): Notification[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading notifications:', error)
  }
  return getDefaultNotifications()
}

// Helper to save notifications to file
function saveNotifications(notifications: Notification[]): void {
  try {
    const dir = path.dirname(NOTIFICATIONS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2))
  } catch (error) {
    console.error('Error saving notifications:', error)
  }
}

// Helper to read audit log from file
function getAuditLog(): AuditLogEntry[] {
  try {
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const data = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading audit log:', error)
  }
  return getDefaultAuditLog()
}

// Helper to save audit log to file
function saveAuditLog(entries: AuditLogEntry[]): void {
  try {
    const dir = path.dirname(AUDIT_LOG_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(entries, null, 2))
  } catch (error) {
    console.error('Error saving audit log:', error)
  }
}

// Default notifications (initial data)
function getDefaultNotifications(): Notification[] {
  return [
    {
      id: 'notif-1',
      type: 'system',
      title: 'New System message',
      description: 'Release v2.4 shipped with analytics fixes and improved task syncing. See release notes.',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
    },
    {
      id: 'notif-2',
      type: 'alert',
      title: 'Your Password was changed',
      description: 'Security alert: Password updated from Account Settings on the web dashboard.',
      time: '7 hours ago',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
    },
    {
      id: 'notif-3',
      type: 'comment',
      title: 'New comment on your post',
      description: "Olivia Martin replied to 'Marketing Roadmap' with updated launch copy.",
      time: '4 hours ago',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: 'low',
    },
  ]
}

// Default audit log (initial data)
function getDefaultAuditLog(): AuditLogEntry[] {
  return [
    {
      id: 'audit-1',
      action: 'Updated project timeline',
      user: 'Amira Patel',
      timestamp: 'Apr 20, 2024, 09:22 PM',
      entityType: 'project',
    },
    {
      id: 'audit-2',
      action: 'Approved budget revision',
      user: 'Liam Rodriguez',
      timestamp: 'Apr 25, 2024, 09:22 PM',
      entityType: 'project',
    },
    {
      id: 'audit-3',
      action: 'Exported Q2 compliance report',
      user: 'Janelle Wong',
      timestamp: 'Apr 29, 2024, 09:22 PM',
      entityType: 'document',
    },
  ]
}

// GET /api/notifications - Get all notifications and audit log
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'notifications' or 'audit'
    const unreadOnly = searchParams.get('unread') === 'true'

    if (type === 'audit') {
      const auditLog = getAuditLog()
      return NextResponse.json({ auditLog })
    }

    let notifications = getNotifications()
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create a new notification or audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'audit') {
      // Add audit log entry
      const auditLog = getAuditLog()
      const newEntry: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        action: data.action,
        user: data.user,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        ...data,
      }
      auditLog.unshift(newEntry)
      saveAuditLog(auditLog)
      return NextResponse.json(newEntry, { status: 201 })
    }

    // Add notification
    const notifications = getNotifications()
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: data.type || 'system',
      title: data.title,
      description: data.description,
      time: 'Just now',
      timestamp: new Date(),
      read: false,
      priority: data.priority || 'medium',
      ...data,
    }
    notifications.unshift(newNotification)
    saveNotifications(notifications)

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, markAllRead } = body

    const notifications = getNotifications()

    if (markAllRead) {
      notifications.forEach(n => n.read = true)
    } else if (notificationIds && Array.isArray(notificationIds)) {
      notifications.forEach(n => {
        if (notificationIds.includes(n.id)) {
          n.read = true
        }
      })
    }

    saveNotifications(notifications)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete a notification
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    let notifications = getNotifications()
    notifications = notifications.filter(n => n.id !== notificationId)
    saveNotifications(notifications)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
