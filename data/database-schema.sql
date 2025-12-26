-- =====================================================
-- TARTIBIX Platform - Supabase Database Schema
-- Compatible with PROJECTS_BIG_DATA structure
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROJECTS TABLE - Main project information
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_name_ar VARCHAR(255),
    
    -- Basic Info
    owner_name VARCHAR(255),
    owner_name_ar VARCHAR(255),
    consultant_name VARCHAR(255),
    consultant_name_ar VARCHAR(255),
    contractor_name VARCHAR(255),
    contractor_name_ar VARCHAR(255),
    
    -- Contract Details
    contract_number VARCHAR(100),
    contract_type VARCHAR(50), -- 'Lump Sum', 'Unit Price', 'Cost Plus', 'Design Build', 'EPC', etc.
    contract_value DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'SAR',
    
    -- Dates
    contract_start_date DATE,
    contract_end_date DATE,
    duration_months INTEGER,
    extension_months INTEGER DEFAULT 0,
    revised_end_date DATE,
    site_possession_date DATE,
    mobilization_date DATE,
    actual_start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    handover_date DATE,
    defects_liability_period INTEGER, -- months
    
    -- Location
    project_location TEXT,
    project_city VARCHAR(100),
    project_region VARCHAR(100),
    coordinates JSONB, -- { lat: number, lng: number }
    
    -- Description & Scope
    description TEXT,
    scope TEXT,
    
    -- Classification
    project_type VARCHAR(50), -- 'Building', 'Infrastructure', etc.
    sector VARCHAR(50), -- 'Public', 'Private', etc.
    initiative VARCHAR(100),
    template VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'Medium',
    
    -- Status
    status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'in-progress', 'completed'
    phase VARCHAR(50), -- 'Initiation', 'Planning', 'Construction', etc.
    current_step INTEGER DEFAULT 0,
    
    -- Progress & Health
    progress INTEGER DEFAULT 0,
    health VARCHAR(20) DEFAULT 'on-track', -- 'on-track', 'watch', 'blocked'
    
    -- Financial Summary
    original_contract_value DECIMAL(15, 2),
    approved_variations DECIMAL(15, 2) DEFAULT 0,
    revised_contract_value DECIMAL(15, 2),
    invoiced_to_date DECIMAL(15, 2) DEFAULT 0,
    paid_to_date DECIMAL(15, 2) DEFAULT 0,
    retention_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Contacts
    project_manager_name VARCHAR(255),
    project_manager_email VARCHAR(255),
    project_manager_phone VARCHAR(50),
    site_manager_name VARCHAR(255),
    client_rep_name VARCHAR(255),
    consultant_rep_name VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- EMPLOYEES TABLE - Project team members
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    employee_code VARCHAR(50) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    rank VARCHAR(100),
    daily_cost DECIMAL(10, 2),
    
    -- Extended fields
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(100),
    specialty VARCHAR(100),
    certification TEXT[],
    hire_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EQUIPMENT TABLE - Project equipment
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    equipment_code VARCHAR(50) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    responsible_position VARCHAR(100),
    responsible_employee VARCHAR(255),
    daily_cost DECIMAL(10, 2),
    
    -- Extended fields
    equipment_type VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    capacity VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'In Use', 'Maintenance', 'Breakdown'
    location VARCHAR(255),
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MATERIALS TABLE - Project materials
-- =====================================================
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    material_code VARCHAR(50) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    description TEXT,
    required_quantity DECIMAL(15, 4),
    unit VARCHAR(50),
    estimated_value DECIMAL(15, 2),
    
    -- Extended fields
    category VARCHAR(100),
    supplier VARCHAR(255),
    unit_price DECIMAL(15, 4),
    quantity_ordered DECIMAL(15, 4) DEFAULT 0,
    quantity_received DECIMAL(15, 4) DEFAULT 0,
    quantity_used DECIMAL(15, 4) DEFAULT 0,
    quality_status VARCHAR(50) DEFAULT 'Pending', -- 'Approved', 'Pending', 'Rejected'
    storage_location VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SERVICES TABLE - Project services
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    service_code VARCHAR(50) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    
    -- Extended fields
    provider VARCHAR(255),
    contract_value DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EXECUTION_TASKS TABLE - Project execution plan
-- =====================================================
CREATE TABLE IF NOT EXISTS execution_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    task_id VARCHAR(50) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    parent_id VARCHAR(50),
    dependencies TEXT,
    
    -- Resource assignments
    employee_code VARCHAR(50),
    employee_count INTEGER DEFAULT 1,
    equipment_code VARCHAR(50),
    equipment_count INTEGER DEFAULT 0,
    material_code VARCHAR(50),
    material_quantity DECIMAL(15, 4),
    service_code VARCHAR(50),
    notes TEXT,
    
    -- Extended fields
    planned_progress DECIMAL(5, 2) DEFAULT 0,
    actual_progress DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed', 'Delayed'
    priority VARCHAR(20) DEFAULT 'Medium',
    wbs_code VARCHAR(50),
    cost_code VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DOCUMENTS TABLE - Project documents
-- =====================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    file_path TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    category VARCHAR(50), -- 'contractual', 'execution', 'design', 'financial', 'planning', 'closeout', etc.
    
    -- Extended fields
    document_number VARCHAR(100),
    revision VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active',
    uploaded_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- QUALITY_INSPECTIONS TABLE (from 1_Quality_Inspection.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS quality_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    inspection_number VARCHAR(50) NOT NULL,
    inspection_date DATE NOT NULL,
    inspection_time TIME,
    inspector_name VARCHAR(255),
    inspector_company VARCHAR(50), -- 'Contractor', 'Consultant', 'Client', 'Third Party'
    
    -- Location
    location VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(50),
    grid_line VARCHAR(50),
    
    -- Details
    inspection_type VARCHAR(100),
    work_activity VARCHAR(255),
    discipline VARCHAR(50),
    trade_contractor VARCHAR(255),
    
    -- Results
    result VARCHAR(50), -- 'Pass', 'Fail', 'Conditional Pass', 'Not Applicable'
    conformance DECIMAL(5, 2),
    defects_count INTEGER DEFAULT 0,
    defects JSONB, -- Array of defect objects
    ncr_required BOOLEAN DEFAULT FALSE,
    ncr_number VARCHAR(50),
    
    -- Follow-up
    corrective_action TEXT,
    responsible_party VARCHAR(255),
    due_date DATE,
    reinspection_date DATE,
    status VARCHAR(50) DEFAULT 'Open',
    
    -- Documentation
    checklist TEXT,
    drawings TEXT[],
    specifications TEXT[],
    photos TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SITE_PROGRESS TABLE (from 2_Site_Progress.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    report_number VARCHAR(50) NOT NULL,
    report_date DATE NOT NULL,
    report_period VARCHAR(20), -- 'Daily', 'Weekly', 'Monthly'
    prepared_by VARCHAR(255),
    approved_by VARCHAR(255),
    
    -- Weather
    weather_condition VARCHAR(50),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    wind_speed DECIMAL(5, 2),
    rain_hours DECIMAL(4, 2),
    workable_hours DECIMAL(4, 2),
    
    -- Progress
    sections JSONB, -- Array of progress section objects
    overall_planned_progress DECIMAL(5, 2),
    overall_actual_progress DECIMAL(5, 2),
    progress_variance DECIMAL(5, 2),
    
    -- Resources
    manpower_summary JSONB,
    equipment_summary JSONB,
    
    -- Issues
    delays_encountered TEXT[],
    issues_raised TEXT[],
    actions_required TEXT[],
    
    -- Plans
    work_completed_today TEXT[],
    work_planned_tomorrow TEXT[],
    lookahead_items TEXT[],
    
    -- Photos
    progress_photos JSONB, -- Array of photo objects
    
    -- Milestones
    milestones_achieved TEXT[],
    upcoming_milestones JSONB,
    
    status VARCHAR(50) DEFAULT 'Draft',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MATERIALS_LOG TABLE (from 3_Materials_Log.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS materials_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    material_code VARCHAR(50) NOT NULL,
    material_name VARCHAR(255) NOT NULL,
    supplier VARCHAR(255),
    po_number VARCHAR(100),
    
    quantity_ordered DECIMAL(15, 4),
    quantity_received DECIMAL(15, 4),
    quantity_used DECIMAL(15, 4),
    unit VARCHAR(50),
    unit_price DECIMAL(15, 4),
    total_value DECIMAL(15, 2),
    
    delivery_date DATE,
    storage_location VARCHAR(255),
    quality_status VARCHAR(50) DEFAULT 'Pending',
    batch_number VARCHAR(100),
    expiry_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENGINEERING_RECORDS TABLE (from 4_Engineering.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS engineering_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    document_type VARCHAR(50), -- 'Drawing', 'Specification', 'Calculation', 'RFI', 'Submittal', 'Shop Drawing'
    document_number VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    revision VARCHAR(20),
    discipline VARCHAR(50),
    
    status VARCHAR(50) DEFAULT 'For Review',
    prepared_by VARCHAR(255),
    reviewed_by VARCHAR(255),
    approved_by VARCHAR(255),
    
    submission_date DATE,
    response_date DATE,
    comments TEXT,
    file_path TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SAFETY_HSE TABLE (from 5_Safety_HSE.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS safety_hse (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    report_date DATE NOT NULL,
    incident_type VARCHAR(50), -- 'Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time', 'Fatality'
    incident_description TEXT,
    location VARCHAR(255),
    persons_involved TEXT[],
    corrective_actions TEXT,
    
    toolbox_meeting BOOLEAN DEFAULT FALSE,
    safety_induction_count INTEGER DEFAULT 0,
    ppe_compliance DECIMAL(5, 2), -- percentage
    housekeeping_score DECIMAL(4, 2), -- 1-10
    
    hazards_identified TEXT[],
    inspections_completed TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CORRESPONDENCE TABLE (from 6_Correspondence.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS correspondence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    correspondence_type VARCHAR(50), -- 'Letter', 'Email', 'Meeting Minutes', 'Site Instruction', 'Variation Order', 'NCR', 'Claim'
    reference_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    
    from_party VARCHAR(255),
    to_party VARCHAR(255),
    subject VARCHAR(500),
    content TEXT,
    attachments TEXT[],
    
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(20) DEFAULT 'Medium',
    due_date DATE,
    response_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FINANCIALS TABLE (from 7_Financials.xlsx)
-- =====================================================
CREATE TABLE IF NOT EXISTS financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50), -- 'Invoice', 'Payment', 'Retention', 'Variation', 'Claim', 'Cost'
    reference_number VARCHAR(100) NOT NULL,
    description TEXT,
    
    amount DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'SAR',
    
    status VARCHAR(50) DEFAULT 'Draft',
    category VARCHAR(50), -- 'Labor', 'Materials', 'Equipment', 'Subcontractor', 'Overheads', 'Profit'
    cost_code VARCHAR(50),
    
    approved_by VARCHAR(255),
    payment_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_employees_project_id ON employees(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_project_id ON equipment(project_id);
CREATE INDEX IF NOT EXISTS idx_materials_project_id ON materials(project_id);
CREATE INDEX IF NOT EXISTS idx_services_project_id ON services(project_id);
CREATE INDEX IF NOT EXISTS idx_execution_tasks_project_id ON execution_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

CREATE INDEX IF NOT EXISTS idx_quality_inspections_project_id ON quality_inspections(project_id);
CREATE INDEX IF NOT EXISTS idx_site_progress_project_id ON site_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_materials_log_project_id ON materials_log(project_id);
CREATE INDEX IF NOT EXISTS idx_engineering_records_project_id ON engineering_records(project_id);
CREATE INDEX IF NOT EXISTS idx_safety_hse_project_id ON safety_hse(project_id);
CREATE INDEX IF NOT EXISTS idx_correspondence_project_id ON correspondence(project_id);
CREATE INDEX IF NOT EXISTS idx_financials_project_id ON financials(project_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_hse ENABLE ROW LEVEL SECURITY;
ALTER TABLE correspondence ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for authenticated users - customize as needed)
CREATE POLICY "Allow all for authenticated users" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON employees FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON equipment FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON materials FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON execution_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON quality_inspections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON site_progress FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON materials_log FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON engineering_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON safety_hse FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON correspondence FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON financials FOR ALL TO authenticated USING (true);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_execution_tasks_updated_at BEFORE UPDATE ON execution_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quality_inspections_updated_at BEFORE UPDATE ON quality_inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_progress_updated_at BEFORE UPDATE ON site_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_log_updated_at BEFORE UPDATE ON materials_log FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_engineering_records_updated_at BEFORE UPDATE ON engineering_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_hse_updated_at BEFORE UPDATE ON safety_hse FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_correspondence_updated_at BEFORE UPDATE ON correspondence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
