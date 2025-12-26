# TARTIBIX Platform

A comprehensive construction project management platform built with Next.js, TypeScript, and Tailwind CSS. Designed for managing construction projects with real-time tracking, document management, and financial oversight.

## Features

- **Project Management**: Create, track, and manage construction projects
- **Resource Allocation**: Manage employees, equipment, materials, and services
- **Execution Planning**: Gantt charts, Kanban boards, and timeline views
- **Document Management**: Upload and organize project documents
- **Financial Tracking**: Contract values, invoicing, and budget management
- **Quality Inspections**: Track quality control and site inspections
- **Progress Reporting**: Daily, weekly, and monthly site progress reports

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tartibix/Tartibix.git
cd tartibix-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.template .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── projects/      # Project CRUD operations
│   ├── dashboard/         # Dashboard pages
│   │   ├── projects/      # Project management
│   │   ├── tasks/         # Task management
│   │   ├── recources/     # Resource management
│   │   ├── time-log/      # Time tracking
│   │   └── ...
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── dashboard/         # Dashboard-specific components
├── lib/                   # Utilities and data
│   ├── projectSetupTypes.ts    # Core type definitions
│   ├── projectDataTypes.ts     # Extended project types
│   ├── database.ts             # Database connection utilities
│   ├── projectStorage.ts       # Local storage utilities
│   ├── excelParser.ts          # Excel file parsing
│   └── supabaseClient.ts       # Supabase client
└── styles/                # Global styles
data/
├── projects/              # JSON project files
├── PROJECTS_BIG_DATA/     # Real project data (Excel files)
│   ├── PRJ-BLD-ROSHN-09/
│   ├── PRJ-ELEC-SEC-05/
│   └── PRJ-INF-2025-01/
└── database-schema.sql    # Supabase database schema
```

## Database Setup (Supabase)

### Option 1: File-based Storage (Default)
The application works out of the box using file-based storage in the `data/projects/` directory.

### Option 2: Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `data/database-schema.sql`
   - Execute the script

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
USE_DATABASE=true
```

4. Restart the development server

## Real Project Data (PROJECTS_BIG_DATA)

The platform supports importing real construction project data from Excel files. Each project folder contains:

| File | Description |
|------|-------------|
| `0_Project_Registration.xlsx` | Project basic information |
| `1_Quality_Inspection.xlsx` | Quality control records |
| `2_Site_Progress.xlsx` | Daily/weekly progress reports |
| `3_Materials_Log.xlsx` | Material inventory and usage |
| `4_Engineering.xlsx` | Engineering documents and RFIs |
| `5_Safety_HSE.xlsx` | Safety and HSE records |
| `6_Correspondence.xlsx` | Project correspondence |
| `7_Financials.xlsx` | Financial transactions |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects?id={id}` | Get project by ID |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects` | Update project |
| DELETE | `/api/projects?id={id}` | Delete project |

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks
- **File Storage**: Local filesystem / Supabase Storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

