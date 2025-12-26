'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Employee,
  Equipment,
  Material,
  Service,
  ExecutionPlanTask,
  ProjectSetupData,
  SetupStepId,
  setupSteps,
  generateProjectId,
  isEmployeeValid,
  isEquipmentValid,
  isMaterialValid,
  isServiceValid,
} from '@/lib/projectSetupTypes'

interface ProjectSetupWizardProps {
  projectName: string
  onComplete: (data: ProjectSetupData) => void
  onBack: () => void
  initialData?: Partial<ProjectSetupData>
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export default function ProjectSetupWizard({
  projectName,
  onComplete,
  onBack,
  initialData,
}: ProjectSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectId] = useState(() => initialData?.projectId || generateProjectId())
  
  // Data states for each table
  const [employees, setEmployees] = useState<Employee[]>(initialData?.employees || [])
  const [equipment, setEquipment] = useState<Equipment[]>(initialData?.equipment || [])
  const [materials, setMaterials] = useState<Material[]>(initialData?.materials || [])
  const [services, setServices] = useState<Service[]>(initialData?.services || [])
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlanTask[]>(initialData?.executionPlan || [])
  
  const [isSaving, setIsSaving] = useState(false)

  // Steps for the wizard (first 5 steps only, excluding supporting docs)
  const wizardSteps = setupSteps.filter(step => step.id !== 'supporting-docs')

  const handleNext = async () => {
    // Auto-save current step data
    await saveProgress()
    
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete wizard
      const data: ProjectSetupData = {
        projectId,
        projectName,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employees,
        equipment,
        materials,
        services,
        executionPlan,
        supportingDocuments: initialData?.supportingDocuments || [],
        status: 'in-progress',
        currentStep: wizardSteps.length,
      }
      onComplete(data)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const saveProgress = async () => {
    setIsSaving(true)
    try {
      const data: Partial<ProjectSetupData> = {
        projectId,
        projectName,
        employees,
        equipment,
        materials,
        services,
        executionPlan,
        currentStep,
        status: 'draft',
      }
      
      await fetch('/api/projects', {
        method: initialData?.projectId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const currentStepData = wizardSteps[currentStep]
  const isLastStep = currentStep === wizardSteps.length - 1

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'employees':
        return (
          <EmployeesTable
            employees={employees}
            onChange={setEmployees}
          />
        )
      case 'equipment':
        return (
          <EquipmentTable
            equipment={equipment}
            employees={employees}
            onChange={setEquipment}
          />
        )
      case 'materials':
        return (
          <MaterialsTable
            materials={materials}
            onChange={setMaterials}
          />
        )
      case 'services':
        return (
          <ServicesTable
            services={services}
            onChange={setServices}
          />
        )
      case 'execution-plan':
        return (
          <ExecutionPlanTable
            executionPlan={executionPlan}
            employees={employees}
            equipment={equipment}
            materials={materials}
            services={services}
            onChange={setExecutionPlan}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-soft-white">
            Project Setup Files
          </h2>
          <p className="mt-1 text-sm text-soft-white/60">
            Project ID: <span className="font-mono text-accent">{projectId}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={saveProgress}
          disabled={isSaving}
          className="rounded-[10px] border border-[#323449] px-4 py-2 text-sm font-display font-semibold text-soft-white/80 transition hover:border-accent disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
      </div>

      {/* Step Progress */}
      <div className="rounded-[16px] border border-[#323449] bg-[#1B1C24] p-4">
        <div className="flex items-center justify-between">
          {wizardSteps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const stepNumber = index + 1

            return (
              <div
                key={step.id}
                className={`flex flex-1 items-center ${index < wizardSteps.length - 1 ? '' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-2 transition ${
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : isCompleted
                      ? 'text-[#63FFC9] hover:bg-accent/15'
                      : 'text-soft-white/50 cursor-default'
                  }`}
                  disabled={index > currentStep}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                      isActive
                        ? 'border-accent bg-accent/20 text-accent'
                        : isCompleted
                        ? 'border-[#63FFC9] bg-[#63FFC9]/20 text-[#63FFC9]'
                        : 'border-[#323449] text-soft-white/50'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </span>
                  <div className="hidden text-left lg:block">
                    <p className="text-xs font-semibold">{step.label}</p>
                  </div>
                </button>
                {index < wizardSteps.length - 1 && (
                  <div
                    className={`mx-2 hidden h-px flex-1 lg:block ${
                      isCompleted ? 'bg-[#63FFC9]/50' : 'bg-[#323449]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="rounded-[18px] border border-[#2F3A43] bg-[#1C1D27] p-6">
        <div className="mb-6">
          <h3 className="font-display text-xl font-semibold text-soft-white">
            {currentStepData.label}
          </h3>
          <p className="text-sm text-soft-white/60">
            {currentStepData.description}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            className="rounded-[10px] border border-[#323449] px-8 py-3 text-sm font-display font-semibold text-soft-white transition hover:border-accent"
          >
            {currentStep === 0 ? 'Back to Documents' : 'Previous'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-[10px] bg-accent px-10 py-3 text-sm font-display font-semibold text-night shadow-[0_8px_20px_rgba(169,223,216,0.3)] transition hover:brightness-110"
          >
            {isLastStep ? 'Complete Setup' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== Employees Table Component ===== */
function EmployeesTable({
  employees,
  onChange,
}: {
  employees: Employee[]
  onChange: (employees: Employee[]) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({})

  const addEmployee = () => {
    if (isEmployeeValid(newEmployee)) {
      onChange([
        ...employees,
        {
          id: generateId(),
          employeeCode: newEmployee.employeeCode!,
          jobTitle: newEmployee.jobTitle!,
          rank: newEmployee.rank!,
          dailyCost: newEmployee.dailyCost!,
        },
      ])
      setNewEmployee({})
    }
  }

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    onChange(employees.map(emp => (emp.id === id ? { ...emp, ...updates } : emp)))
  }

  const deleteEmployee = (id: string) => {
    onChange(employees.filter(emp => emp.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-[12px] border border-[#323449]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] bg-[#1B1C24] text-left text-[11px] uppercase tracking-[0.15em] text-soft-white/55">
              <th className="px-4 py-3 font-medium">Employee Code</th>
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Daily Cost</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-[#323449]/50 last:border-b-0">
                <td className="px-4 py-3">
                  {editingId === emp.id ? (
                    <input
                      type="text"
                      value={emp.employeeCode}
                      onChange={(e) => updateEmployee(emp.id, { employeeCode: e.target.value })}
                      className="w-full rounded border border-[#323449] bg-[#13141b] px-2 py-1 text-sm text-soft-white"
                    />
                  ) : (
                    <span className="font-mono text-sm text-accent">{emp.employeeCode}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-soft-white">{emp.jobTitle}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70">{emp.rank}</td>
                <td className="px-4 py-3 text-sm text-soft-white">{emp.dailyCost.toLocaleString()} SAR</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(editingId === emp.id ? null : emp.id)}
                      className="rounded p-1 text-soft-white/60 hover:bg-white/10 hover:text-accent"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEmployee(emp.id)}
                      className="rounded p-1 text-soft-white/60 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-soft-white/50">
                  No employees added yet. Add your first employee below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Employee Form */}
      <div className="rounded-[12px] border border-dashed border-[#323449] bg-[#1B1C24]/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft-white/50">Add New Employee</p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Employee Code (e.g., PM-01)"
            value={newEmployee.employeeCode || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, employeeCode: e.target.value })}
            className="w-full rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Job Title"
            value={newEmployee.jobTitle || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
            className="w-full rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Rank"
            value={newEmployee.rank || ''}
            onChange={(e) => setNewEmployee({ ...newEmployee, rank: e.target.value })}
            className="w-full rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <input
              type="number"
              placeholder="Daily Cost (SAR)"
              value={newEmployee.dailyCost || ''}
              onChange={(e) => setNewEmployee({ ...newEmployee, dailyCost: parseFloat(e.target.value) || 0 })}
              className="flex-1 min-w-0 rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
            />
            <button
              type="button"
              onClick={addEmployee}
              disabled={!isEmployeeValid(newEmployee)}
              className="shrink-0 rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Equipment Table Component ===== */
function EquipmentTable({
  equipment,
  employees,
  onChange,
}: {
  equipment: Equipment[]
  employees: Employee[]
  onChange: (equipment: Equipment[]) => void
}) {
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({})

  const addEquipment = () => {
    if (isEquipmentValid(newEquipment)) {
      onChange([
        ...equipment,
        {
          id: generateId(),
          equipmentCode: newEquipment.equipmentCode!,
          equipmentName: newEquipment.equipmentName!,
          responsiblePosition: newEquipment.responsiblePosition!,
          responsibleEmployee: newEquipment.responsibleEmployee!,
          dailyCost: newEquipment.dailyCost,
        },
      ])
      setNewEquipment({})
    }
  }

  const deleteEquipment = (id: string) => {
    onChange(equipment.filter(eq => eq.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[12px] border border-[#323449]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] bg-[#1B1C24] text-left text-[11px] uppercase tracking-[0.15em] text-soft-white/55">
              <th className="px-4 py-3 font-medium">Equipment Code</th>
              <th className="px-4 py-3 font-medium">Equipment Name</th>
              <th className="px-4 py-3 font-medium">Responsible Position</th>
              <th className="px-4 py-3 font-medium">Responsible Employee</th>
              <th className="px-4 py-3 font-medium">Daily Cost (Optional)</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq) => (
              <tr key={eq.id} className="border-b border-[#323449]/50 last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-accent">{eq.equipmentCode}</span>
                </td>
                <td className="px-4 py-3 text-sm text-soft-white">{eq.equipmentName}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70">{eq.responsiblePosition}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70">{eq.responsibleEmployee}</td>
                <td className="px-4 py-3 text-sm text-soft-white">
                  {eq.dailyCost ? `${eq.dailyCost.toLocaleString()} SAR` : '–'}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => deleteEquipment(eq.id)}
                    className="rounded p-1 text-soft-white/60 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {equipment.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-soft-white/50">
                  No equipment added yet. Add your first equipment below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Equipment Form */}
      <div className="rounded-[12px] border border-dashed border-[#323449] bg-[#1B1C24]/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft-white/50">Add New Equipment</p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Equipment Code (e.g., EQ-CRANE)"
            value={newEquipment.equipmentCode || ''}
            onChange={(e) => setNewEquipment({ ...newEquipment, equipmentCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Equipment Name"
            value={newEquipment.equipmentName || ''}
            onChange={(e) => setNewEquipment({ ...newEquipment, equipmentName: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newEquipment.responsiblePosition || ''}
            onChange={(e) => setNewEquipment({ ...newEquipment, responsiblePosition: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Responsible Position</option>
            {[...new Set(employees.map(e => e.jobTitle))].map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <select
            value={newEquipment.responsibleEmployee || ''}
            onChange={(e) => setNewEquipment({ ...newEquipment, responsibleEmployee: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Responsible Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employeeCode}>{emp.employeeCode} - {emp.jobTitle}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Daily Cost (Optional)"
            value={newEquipment.dailyCost || ''}
            onChange={(e) => setNewEquipment({ ...newEquipment, dailyCost: parseFloat(e.target.value) || undefined })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <button
            type="button"
            onClick={addEquipment}
            disabled={!isEquipmentValid(newEquipment)}
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
          >
            Add Equipment
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== Materials Table Component ===== */
function MaterialsTable({
  materials,
  onChange,
}: {
  materials: Material[]
  onChange: (materials: Material[]) => void
}) {
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({})

  const addMaterial = () => {
    if (isMaterialValid(newMaterial)) {
      onChange([
        ...materials,
        {
          id: generateId(),
          materialCode: newMaterial.materialCode!,
          materialName: newMaterial.materialName!,
          description: newMaterial.description!,
          requiredQuantity: newMaterial.requiredQuantity!,
          unit: newMaterial.unit!,
          estimatedValue: newMaterial.estimatedValue,
        },
      ])
      setNewMaterial({})
    }
  }

  const deleteMaterial = (id: string) => {
    onChange(materials.filter(m => m.id !== id))
  }

  const unitOptions = ['Unit', 'Meter', 'Kg', 'Liter', 'Box', 'Roll', 'Set', 'Piece', 'Ton', 'Cubic Meter']

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[12px] border border-[#323449]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] bg-[#1B1C24] text-left text-[11px] uppercase tracking-[0.15em] text-soft-white/55">
              <th className="px-4 py-3 font-medium">Material Code</th>
              <th className="px-4 py-3 font-medium">Material Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Est. Value</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat.id} className="border-b border-[#323449]/50 last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-accent">{mat.materialCode}</span>
                </td>
                <td className="px-4 py-3 text-sm text-soft-white">{mat.materialName}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70 max-w-[200px] truncate">{mat.description}</td>
                <td className="px-4 py-3 text-sm text-soft-white">{mat.requiredQuantity.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70">{mat.unit}</td>
                <td className="px-4 py-3 text-sm text-soft-white">
                  {mat.estimatedValue ? `${mat.estimatedValue.toLocaleString()} SAR` : '–'}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => deleteMaterial(mat.id)}
                    className="rounded p-1 text-soft-white/60 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-soft-white/50">
                  No materials added yet. Add your first material below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Material Form */}
      <div className="rounded-[12px] border border-dashed border-[#323449] bg-[#1B1C24]/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft-white/50">Add New Material</p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            placeholder="Material Code (e.g., MAT-LED-150)"
            value={newMaterial.materialCode || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, materialCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Material Name"
            value={newMaterial.materialName || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, materialName: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Description"
            value={newMaterial.description || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="number"
            placeholder="Required Quantity"
            value={newMaterial.requiredQuantity || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, requiredQuantity: parseFloat(e.target.value) || 0 })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newMaterial.unit || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Unit</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Estimated Value (Optional)"
            value={newMaterial.estimatedValue || ''}
            onChange={(e) => setNewMaterial({ ...newMaterial, estimatedValue: parseFloat(e.target.value) || undefined })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
        </div>
        <button
          type="button"
          onClick={addMaterial}
          disabled={!isMaterialValid(newMaterial)}
          className="mt-3 rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
        >
          Add Material
        </button>
      </div>
    </div>
  )
}

/* ===== Services Table Component ===== */
function ServicesTable({
  services,
  onChange,
}: {
  services: Service[]
  onChange: (services: Service[]) => void
}) {
  const [newService, setNewService] = useState<Partial<Service>>({})

  const addService = () => {
    if (isServiceValid(newService)) {
      onChange([
        ...services,
        {
          id: generateId(),
          serviceCode: newService.serviceCode!,
          serviceName: newService.serviceName!,
          description: newService.description!,
          unit: newService.unit!,
        },
      ])
      setNewService({})
    }
  }

  const deleteService = (id: string) => {
    onChange(services.filter(s => s.id !== id))
  }

  const unitOptions = ['Visit', 'Hour', 'Day', 'Month', 'Project', 'Report', 'Inspection', 'Installation', 'Service Call']

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[12px] border border-[#323449]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] bg-[#1B1C24] text-left text-[11px] uppercase tracking-[0.15em] text-soft-white/55">
              <th className="px-4 py-3 font-medium">Service Code</th>
              <th className="px-4 py-3 font-medium">Service Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id} className="border-b border-[#323449]/50 last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-accent">{svc.serviceCode}</span>
                </td>
                <td className="px-4 py-3 text-sm text-soft-white">{svc.serviceName}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70 max-w-[300px] truncate">{svc.description}</td>
                <td className="px-4 py-3 text-sm text-soft-white/70">{svc.unit}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => deleteService(svc.id)}
                    className="rounded p-1 text-soft-white/60 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <DeleteIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-soft-white/50">
                  No services added yet. Add your first service below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Service Form */}
      <div className="rounded-[12px] border border-dashed border-[#323449] bg-[#1B1C24]/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft-white/50">Add New Service</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Service Code (e.g., SRV-INSP)"
            value={newService.serviceCode || ''}
            onChange={(e) => setNewService({ ...newService, serviceCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Service Name"
            value={newService.serviceName || ''}
            onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Description"
            value={newService.description || ''}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newService.unit || ''}
            onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Unit</option>
            {unitOptions.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={addService}
          disabled={!isServiceValid(newService)}
          className="mt-3 rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
        >
          Add Service
        </button>
      </div>
    </div>
  )
}

/* ===== Execution Plan Table Component ===== */
function ExecutionPlanTable({
  executionPlan,
  employees,
  equipment,
  materials,
  services,
  onChange,
}: {
  executionPlan: ExecutionPlanTask[]
  employees: Employee[]
  equipment: Equipment[]
  materials: Material[]
  services: Service[]
  onChange: (tasks: ExecutionPlanTask[]) => void
}) {
  const [newTask, setNewTask] = useState<Partial<ExecutionPlanTask>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTask = () => {
    if (newTask.taskId && newTask.taskName && newTask.startDate && newTask.endDate) {
      onChange([
        ...executionPlan,
        {
          id: generateId(),
          taskId: newTask.taskId,
          taskName: newTask.taskName,
          startDate: newTask.startDate,
          endDate: newTask.endDate,
          parentId: newTask.parentId,
          dependencies: newTask.dependencies,
          employeeCode: newTask.employeeCode,
          employeeCount: newTask.employeeCount,
          equipmentCode: newTask.equipmentCode,
          equipmentCount: newTask.equipmentCount,
          materialCode: newTask.materialCode,
          materialQuantity: newTask.materialQuantity,
          serviceCode: newTask.serviceCode,
          notes: newTask.notes,
        },
      ])
      setNewTask({})
    }
  }

  const deleteTask = (id: string) => {
    onChange(executionPlan.filter(t => t.id !== id))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Parse CSV/XLSX file
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      // Simple CSV parsing
      const lines = text.split('\n').filter(line => line.trim())
      if (lines.length < 2) return

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const tasks: ExecutionPlanTask[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const task: ExecutionPlanTask = {
          id: generateId(),
          taskId: values[headers.indexOf('task_id')] || values[0] || '',
          taskName: values[headers.indexOf('task_name')] || values[1] || '',
          startDate: values[headers.indexOf('start_date')] || values[2] || '',
          endDate: values[headers.indexOf('end_date')] || values[3] || '',
          parentId: values[headers.indexOf('parent_id')] || values[4] || undefined,
          dependencies: values[headers.indexOf('dependencies')] || values[5] || undefined,
          employeeCode: values[headers.indexOf('employee_code')] || values[6] || undefined,
          employeeCount: parseInt(values[headers.indexOf('employee_count')] || values[7]) || undefined,
          equipmentCode: values[headers.indexOf('equipment_code')] || values[8] || undefined,
          equipmentCount: parseInt(values[headers.indexOf('equipment_count')] || values[9]) || undefined,
          materialCode: values[headers.indexOf('material_code')] || values[10] || undefined,
          materialQuantity: parseInt(values[headers.indexOf('material_quantity')] || values[11]) || undefined,
          serviceCode: values[headers.indexOf('service_code')] || values[12] || undefined,
          notes: values[headers.indexOf('notes')] || values[13] || undefined,
        }

        if (task.taskId && task.taskName) {
          tasks.push(task)
        }
      }

      onChange([...executionPlan, ...tasks])
    }

    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'Task_ID', 'Task_Name', 'Start_Date', 'End_Date', 'Parent_ID', 'Dependencies',
      'Employee_Code', 'Employee_Count', 'Equipment_Code', 'Equipment_Count',
      'Material_Code', 'Material_Quantity', 'Service_Code', 'Notes'
    ]
    const csvContent = headers.join(',') + '\n1,Sample Task,2025-01-01,2025-01-15,,,,,,,,,,Sample note'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'execution_plan_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="rounded-[12px] border border-[#323449] bg-[#1B1C24] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-sm font-semibold text-soft-white">Upload Execution Plan</h4>
            <p className="text-xs text-soft-white/50">Upload CSV or XLSX file with your project execution plan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadTemplate}
              className="rounded-[8px] border border-[#323449] px-3 py-2 text-xs font-semibold text-soft-white/70 transition hover:border-accent hover:text-soft-white"
            >
              Download Template
            </button>
            <label className="cursor-pointer rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110">
              Upload File
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto rounded-[12px] border border-[#323449]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#323449] bg-[#1B1C24] text-left text-[10px] uppercase tracking-[0.1em] text-soft-white/55">
              <th className="px-3 py-3 font-medium">Task ID</th>
              <th className="px-3 py-3 font-medium">Task Name</th>
              <th className="px-3 py-3 font-medium">Start</th>
              <th className="px-3 py-3 font-medium">End</th>
              <th className="px-3 py-3 font-medium">Parent</th>
              <th className="px-3 py-3 font-medium">Dependencies</th>
              <th className="px-3 py-3 font-medium">Employee</th>
              <th className="px-3 py-3 font-medium">Equipment</th>
              <th className="px-3 py-3 font-medium">Material</th>
              <th className="px-3 py-3 font-medium">Service</th>
              <th className="px-3 py-3 font-medium">Notes</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {executionPlan.map((task) => (
              <tr key={task.id} className="border-b border-[#323449]/50 text-xs last:border-b-0">
                <td className="px-3 py-2">
                  <span className="font-mono text-accent">{task.taskId}</span>
                </td>
                <td className="px-3 py-2 text-soft-white max-w-[150px] truncate">{task.taskName}</td>
                <td className="px-3 py-2 text-soft-white/70">{task.startDate}</td>
                <td className="px-3 py-2 text-soft-white/70">{task.endDate}</td>
                <td className="px-3 py-2 text-soft-white/50">{task.parentId || '–'}</td>
                <td className="px-3 py-2 text-soft-white/50">{task.dependencies || '–'}</td>
                <td className="px-3 py-2 text-soft-white/70">
                  {task.employeeCode ? `${task.employeeCode} (${task.employeeCount || 1})` : '–'}
                </td>
                <td className="px-3 py-2 text-soft-white/70">
                  {task.equipmentCode ? `${task.equipmentCode} (${task.equipmentCount || 1})` : '–'}
                </td>
                <td className="px-3 py-2 text-soft-white/70">
                  {task.materialCode ? `${task.materialCode} (${task.materialQuantity || 0})` : '–'}
                </td>
                <td className="px-3 py-2 text-soft-white/70">{task.serviceCode || '–'}</td>
                <td className="px-3 py-2 text-soft-white/50 max-w-[100px] truncate">{task.notes || '–'}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="rounded p-1 text-soft-white/60 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <DeleteIcon className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
            {executionPlan.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-sm text-soft-white/50">
                  No tasks added yet. Upload a CSV file or add tasks manually below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Add Task Form */}
      <div className="rounded-[12px] border border-dashed border-[#323449] bg-[#1B1C24]/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-soft-white/50">Add Task Manually</p>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Task ID (e.g., 1.1.1)"
            value={newTask.taskId || ''}
            onChange={(e) => setNewTask({ ...newTask, taskId: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.taskName || ''}
            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newTask.startDate || ''}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          />
          <input
            type="date"
            placeholder="End Date"
            value={newTask.endDate || ''}
            onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          />
          <input
            type="text"
            placeholder="Parent ID (Optional)"
            value={newTask.parentId || ''}
            onChange={(e) => setNewTask({ ...newTask, parentId: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <input
            type="text"
            placeholder="Dependencies (Optional)"
            value={newTask.dependencies || ''}
            onChange={(e) => setNewTask({ ...newTask, dependencies: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newTask.employeeCode || ''}
            onChange={(e) => setNewTask({ ...newTask, employeeCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employeeCode}>{emp.employeeCode}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Employee Count"
            value={newTask.employeeCount || ''}
            onChange={(e) => setNewTask({ ...newTask, employeeCount: parseInt(e.target.value) || undefined })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newTask.equipmentCode || ''}
            onChange={(e) => setNewTask({ ...newTask, equipmentCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Equipment</option>
            {equipment.map(eq => (
              <option key={eq.id} value={eq.equipmentCode}>{eq.equipmentCode}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Equipment Count"
            value={newTask.equipmentCount || ''}
            onChange={(e) => setNewTask({ ...newTask, equipmentCount: parseInt(e.target.value) || undefined })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newTask.materialCode || ''}
            onChange={(e) => setNewTask({ ...newTask, materialCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Material</option>
            {materials.map(mat => (
              <option key={mat.id} value={mat.materialCode}>{mat.materialCode}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Material Quantity"
            value={newTask.materialQuantity || ''}
            onChange={(e) => setNewTask({ ...newTask, materialQuantity: parseInt(e.target.value) || undefined })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <select
            value={newTask.serviceCode || ''}
            onChange={(e) => setNewTask({ ...newTask, serviceCode: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white"
          >
            <option value="">Select Service</option>
            {services.map(svc => (
              <option key={svc.id} value={svc.serviceCode}>{svc.serviceCode}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Notes (Optional)"
            value={newTask.notes || ''}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            className="rounded-[8px] border border-[#323449] bg-[#13141b] px-3 py-2 text-sm text-soft-white placeholder:text-soft-white/35"
          />
          <button
            type="button"
            onClick={addTask}
            disabled={!newTask.taskId || !newTask.taskName || !newTask.startDate || !newTask.endDate}
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110 disabled:opacity-50"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Summary */}
      {executionPlan.length > 0 && (
        <div className="rounded-[12px] border border-[#323449] bg-[#13141b] p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-soft-white/50">Total Tasks</p>
              <p className="font-display text-xl font-semibold text-soft-white">{executionPlan.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-soft-white/50">Main Tasks</p>
              <p className="font-display text-xl font-semibold text-accent">
                {executionPlan.filter(t => !t.parentId).length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-soft-white/50">Sub Tasks</p>
              <p className="font-display text-xl font-semibold text-soft-white/70">
                {executionPlan.filter(t => t.parentId).length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-soft-white/50">With Resources</p>
              <p className="font-display text-xl font-semibold text-[#63FFC9]">
                {executionPlan.filter(t => t.employeeCode || t.equipmentCode || t.materialCode).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===== Icons ===== */
function EditIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 3.5l2 2-9 9H5.5v-2l9-9z" />
    </svg>
  )
}

function DeleteIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l8 8M14 6l-8 8" />
    </svg>
  )
}
