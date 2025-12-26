# Data Directory

This directory contains project data and uploaded files.

## Structure

- `projects/` - JSON files for each project (named by project ID)
- `uploads/` - Uploaded files organized by project ID

## Sample Projects

### PRJ-SAMPLE-001 - Al-Riyadh Tower Construction
- **Type:** Commercial tower construction (25-story)
- **Location:** Riyadh, Saudi Arabia
- **Contract Value:** SAR 15,000,000
- **Duration:** January 2024 - June 2025
- **Status:** In Progress (45% complete)
- **Resources:** 8 employees, 5 equipment, 5 materials, 9 tasks
- **Work Logs:** 6 entries with various statuses

### PRJ-SAMPLE-002 - Jeddah Marina Development
- **Type:** Marina and yacht club construction
- **Location:** Jeddah, Saudi Arabia
- **Contract Value:** SAR 8,500,000
- **Duration:** March 2024 - February 2025
- **Status:** In Progress (62% complete)
- **Resources:** 5 employees, 3 equipment, 3 materials, 6 tasks
- **Work Logs:** 6 entries with various statuses

## Work Log Integration

Work logs are stored in browser localStorage and reference actual:
- Project IDs and names
- Employee codes from project resources
- Equipment codes from project resources
- Material codes from project resources
- Task IDs from execution plans

**Sample images:** 27 upload images in `/public/images/time-log/`

## Note

This directory is excluded from git (see .gitignore).

