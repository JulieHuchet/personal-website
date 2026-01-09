import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Select, Input, ProgressBar } from '../components/ui';
import { ArrowLeft, Target, AlertTriangle, CheckCircle, Clock, Plus, X, Download, FileText, ExternalLink } from 'lucide-react';
import { ships, quarters, calculatePersonLoad, getCapacityStatus, people, TSHIRT_LOAD_MAPPING } from '../data/seedData';
import { usePlanningContext } from '../context/PlanningContext';

// Static dropdown options as specified
const AREA_OPTIONS = [
  "Platform",
  "Devices & Filtering", 
  "Network Services",
  "App Security",
  "App Performance"
];

const PRODUCT_OPTIONS = [
  "Navigation",
  "WARP Client",
  "SSL/TLS"
];
import { Ship, Role, TShirtSize } from '../types';
import { Layout } from '../components/Layout';

interface ResourceNeed {
  role: Role;
  tshirtSize: TShirtSize;
}

interface NewProject {
  title: string;
  area: string;
  product: string;
  resourceNeeds: ResourceNeed[];
  timeline: string[];
}

interface FeasibilityAnalysis {
  feasible: Ship[];
  partiallyFeasible: Ship[];
  notFeasible: Ship[];
  capacitySummary: Record<Role, { used: number; total: number; status: string }>;
  recommendations: {
    moveToNextQuarter: Ship[];
    reduceScope: Ship[];
    breakIntoMilestones: Ship[];
    deprioritizeNiceToHave: Ship[];
  };
}

export const QuarterPlanningFlow: React.FC = () => {
  const navigate = useNavigate();
  const { quarter, area, product } = usePlanningContext();
  const [shipUpdates, setShipUpdates] = useState<Record<string, Partial<Ship>>>({});
  const [addedProjects, setAddedProjects] = useState<Ship[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<NewProject>({
    title: '',
    area: '',
    product: '',
    resourceNeeds: [],
    timeline: []
  });

  // Use static product options
  const availableProducts = PRODUCT_OPTIONS;
  const [showFeasibilityReport, setShowFeasibilityReport] = useState(false);

  // Get ships for selected quarter (including added projects)
  const quarterShips = useMemo(() => {
    const originalShips = ships.filter(ship => ship.targetQuarter === quarter);
    const relevantAddedProjects = addedProjects.filter(project => 
      project.targetQuarter === quarter
    );
    return [...originalShips, ...relevantAddedProjects];
  }, [quarter, addedProjects]);

  const filteredQuarterShips = useMemo(() => {
    return quarterShips.filter(ship => {
      if (area && ship.area !== area) return false;
      if (product && ship.product !== product) return false;
      return true;
    });
  }, [quarterShips, area, product]);

  // Apply updates to ships
  const updatedShips = useMemo(() => {
    return filteredQuarterShips.map(ship => ({
      ...ship,
      ...shipUpdates[ship.id]
    }));
  }, [filteredQuarterShips, shipUpdates]);

  // Calculate capacity impact
  const capacityImpact = useMemo(() => {
    const roleLoads: Record<Role, number> = {
      Designer: 0,
      Content: 0,
      Frontend: 0
    };

    updatedShips.forEach(ship => {
      Object.entries(ship.tshirtSizeByRole).forEach(([role, size]) => {
        const loadMapping = { S: 20, M: 40, L: 60, XL: 80 };
        roleLoads[role as Role] += loadMapping[size] || 0;
      });
    });

    const roleCapacity: Record<Role, { total: number; used: number; status: string }> = {
      Designer: { total: 0, used: 0, status: 'healthy' },
      Content: { total: 0, used: 0, status: 'healthy' },
      Frontend: { total: 0, used: 0, status: 'healthy' }
    };

    people.forEach(person => {
      if (area && person.area !== area) return;
      if (product && person.product !== product) return;

      const currentLoad = calculatePersonLoad(person.id, quarter);
      roleCapacity[person.role].total += 100;
      roleCapacity[person.role].used += currentLoad;
    });

    Object.keys(roleCapacity).forEach(role => {
      const capacity = roleCapacity[role as Role];
      const utilization = capacity.total > 0 ? (capacity.used / capacity.total) * 100 : 0;
      capacity.status = getCapacityStatus(utilization);
    });

    return roleCapacity;
  }, [updatedShips, quarter, area, product]);

  const updateShip = (shipId: string, updates: Partial<Ship>) => {
    setShipUpdates(prev => ({
      ...prev,
      [shipId]: { ...prev[shipId], ...updates }
    }));
  };

  const addResourceNeed = (role: Role) => {
    if (!newProject.resourceNeeds.find(rn => rn.role === role)) {
      setNewProject(prev => ({
        ...prev,
        resourceNeeds: [...prev.resourceNeeds, { role, tshirtSize: 'M' as TShirtSize }]
      }));
    }
  };

  const removeResourceNeed = (role: Role) => {
    setNewProject(prev => ({
      ...prev,
      resourceNeeds: prev.resourceNeeds.filter(rn => rn.role !== role)
    }));
  };

  const updateResourceNeedSize = (role: Role, tshirtSize: TShirtSize) => {
    setNewProject(prev => ({
      ...prev,
      resourceNeeds: prev.resourceNeeds.map(rn => 
        rn.role === role ? { ...rn, tshirtSize } : rn
      )
    }));
  };

  const toggleQuarterInTimeline = (quarter: string) => {
    setNewProject(prev => ({
      ...prev,
      timeline: prev.timeline.includes(quarter)
        ? prev.timeline.filter(q => q !== quarter)
        : [...prev.timeline, quarter]
    }));
  };

  const resetNewProject = () => {
    setNewProject({
      title: '',
      area: '',
      product: '',
      resourceNeeds: [],
      timeline: []
    });
  };

  const validationResult = useMemo(() => {
    const errors = [];
    
    // Check project name
    if (!newProject.title.trim()) {
      errors.push('project name');
    }
    
    // Check at least one role selected
    if (newProject.resourceNeeds.length === 0) {
      errors.push('at least one role');
    }
    
    // Check T-shirt size for each selected role
    const rolesWithoutSize = newProject.resourceNeeds.filter(need => !need.tshirtSize);
    if (rolesWithoutSize.length > 0) {
      errors.push('T-shirt size for all selected roles');
    }
    
    // Check at least one quarter selected
    if (newProject.timeline.length === 0) {
      errors.push('at least one quarter');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [newProject]);

  const canAddProject = validationResult.isValid;

  const handleAddProject = () => {
    if (!canAddProject) return;
    
    // Create a new Ship object from the newProject data
    const newShip: Ship = {
      id: `SHIP-NEW-${Date.now()}`, // Generate unique ID
      title: newProject.title,
      area: newProject.area || area || 'Platform', // Default area if not selected
      product: newProject.product || product || 'API', // Default product if not selected
      pmNames: ['Current User'], // Default PM name
      targetQuarter: newProject.timeline[0] || quarter, // Use first selected quarter
      tshirtSizeByRole: newProject.resourceNeeds.reduce((acc, need) => {
        acc[need.role] = need.tshirtSize;
        return acc;
      }, {} as Partial<Record<Role, TShirtSize>>),
      status: 'Planned',
      priority: undefined,
      mustHave: true, // Default to must-have for new projects
      onePagerStatus: 'missing'
    };
    
    // Add the new project to the added projects list
    setAddedProjects(prev => [...prev, newShip]);
    
    // Close modal and reset form
    setShowAddProjectModal(false);
    resetNewProject();
  };

  // Generate feasibility analysis
  const generateFeasibilityAnalysis = (): FeasibilityAnalysis => {
    const analysis: FeasibilityAnalysis = {
      feasible: [],
      partiallyFeasible: [],
      notFeasible: [],
      capacitySummary: {
        Designer: { used: 0, total: 0, status: 'healthy' },
        Content: { used: 0, total: 0, status: 'healthy' },
        Frontend: { used: 0, total: 0, status: 'healthy' }
      },
      recommendations: {
        moveToNextQuarter: [],
        reduceScope: [],
        breakIntoMilestones: [],
        deprioritizeNiceToHave: []
      }
    };

    // Calculate total capacity per role
    people.forEach(person => {
      if (['Designer', 'Content', 'Frontend'].includes(person.role)) {
        analysis.capacitySummary[person.role as Role].total += 100;
      }
    });

    // Calculate used capacity and categorize projects
    updatedShips.forEach(ship => {
      let hasCapacityIssues = false;
      let hasMissingRoles = false;
      
      // Simulate resource requirements (in real app, this would come from project data)
      const requiredRoles: Role[] = ['Designer', 'Content', 'Frontend'];
      const roleLoad = 50; // Simplified - would be based on T-shirt sizing
      
      requiredRoles.forEach(role => {
        const roleCapacity = analysis.capacitySummary[role];
        const availableCapacity = roleCapacity.total - roleCapacity.used;
        
        if (availableCapacity < roleLoad) {
          hasCapacityIssues = true;
        }
        
        roleCapacity.used += roleLoad;
      });

      // Categorize project
      if (hasCapacityIssues) {
        analysis.notFeasible.push(ship);
        
        // Generate recommendations
        if (!ship.mustHave) {
          analysis.recommendations.deprioritizeNiceToHave.push(ship);
        } else if (ship.priority === 'P3' || ship.priority === 'P4') {
          analysis.recommendations.moveToNextQuarter.push(ship);
        } else {
          analysis.recommendations.breakIntoMilestones.push(ship);
        }
      } else if (hasMissingRoles) {
        analysis.partiallyFeasible.push(ship);
        analysis.recommendations.reduceScope.push(ship);
      } else {
        analysis.feasible.push(ship);
      }
    });

    // Update capacity status
    Object.keys(analysis.capacitySummary).forEach(role => {
      const capacity = analysis.capacitySummary[role as Role];
      const utilization = capacity.used / capacity.total;
      
      if (utilization > 1.0) {
        capacity.status = 'overloaded';
      } else if (utilization > 0.8) {
        capacity.status = 'at-risk';
      } else {
        capacity.status = 'healthy';
      }
    });

    return analysis;
  };

  const feasibilityAnalysis = useMemo(() => generateFeasibilityAnalysis(), [updatedShips]);

  const handleFinalizeQuarterPlan = () => {
    setShowFeasibilityReport(true);
  };

  const handleDownloadPDF = () => {
    // Placeholder for PDF generation
    alert('PDF download functionality would be implemented here');
  };

  const handleSyncToJira = () => {
    // Placeholder for Jira sync
    alert('Jira sync functionality would be implemented here');
  };

  const handleSyncToSmartsheet = () => {
    // Placeholder for Smartsheet sync
    alert('Smartsheet sync functionality would be implemented here');
  };

  const getRecommendations = () => {
    const recommendations = [];
    const overloadedRoles = Object.entries(capacityImpact).filter(([_, capacity]) => capacity.status === 'overloaded');
    
    if (overloadedRoles.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Capacity Overload Detected',
        message: `${overloadedRoles.map(([role]) => role).join(', ')} teams are over capacity`,
        actions: ['Reprioritize P3/P4 projects', 'Move projects to next quarter', 'Break large projects into milestones']
      });
    }

    const unassignedPriority = updatedShips.filter(ship => !ship.priority);
    if (unassignedPriority.length > 0) {
      recommendations.push({
        type: 'info',
        title: 'Unassigned Priorities',
        message: `${unassignedPriority.length} projects need priority assignment`,
        actions: ['Assign P1-P4 priorities', 'Mark as must-have or nice-to-have']
      });
    }

    return recommendations;
  };

  const priorityColors = {
    P1: 'bg-red-500',
    P2: 'bg-orange-500',
    P3: 'bg-yellow-500',
    P4: 'bg-green-500'
  };

  const onePagerStatusColors = {
    missing: 'text-red-600',
    in_progress: 'text-yellow-600',
    ready_for_review: 'text-blue-600',
    approved: 'text-green-600'
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quarter Planning</h1>
            <p className="text-gray-600">Review and prioritize your projects for {quarter}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Context filters apply globally: {area ? area : 'All Areas'} • {product ? product : 'All Products'}
        </div>
      </div>

      {/* Capacity Overview */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(capacityImpact) as Role[]).map(role => {
              const capacity = capacityImpact[role];
              const utilization = capacity.total > 0 ? (capacity.used / capacity.total) * 100 : 0;
              return (
                <div key={role} className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">{role}</div>
                  <div className={`text-2xl font-bold mb-1 ${
                    capacity.status === 'healthy' ? 'text-green-600' :
                    capacity.status === 'borderline' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(utilization)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {capacity.used}% / {capacity.total}% capacity
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      {getRecommendations().length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-4">
              {getRecommendations().map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'warning' ? 'bg-amber-50 border-amber-400' : 'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-center mb-2">
                    {rec.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    ) : (
                      <Target className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.message}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rec.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Projects List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Projects for {quarter}</h2>
            <Button
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
          <div className="space-y-4">
            {updatedShips.map(ship => (
              <div key={ship.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{ship.title}</h3>
                    <p className="text-sm text-gray-600">{ship.area} • {ship.product}</p>
                  </div>
                  <Badge variant={ship.status === 'Committed' ? 'success' : 'neutral'}>
                    {ship.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={ship.priority || ''}
                      onChange={(e) => updateShip(ship.id, { priority: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="">Select priority</option>
                      <option value="P1">P1 (Critical)</option>
                      <option value="P2">P2 (High)</option>
                      <option value="P3">P3 (Medium)</option>
                      <option value="P4">P4 (Low)</option>
                    </select>
                  </div>

                  {/* Must Have */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={ship.mustHave ? 'must-have' : 'nice-to-have'}
                      onChange={(e) => updateShip(ship.id, { mustHave: e.target.value === 'must-have' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="must-have">Must-have</option>
                      <option value="nice-to-have">Nice-to-have</option>
                    </select>
                  </div>

                  {/* One-pager Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">One-pager</label>
                    <select
                      value={ship.onePagerStatus || 'missing'}
                      onChange={(e) => updateShip(ship.id, { onePagerStatus: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="missing">Missing</option>
                      <option value="in_progress">In Progress</option>
                      <option value="ready_for_review">Ready for Review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate(`/plan-ship?project=${ship.id}`)}
                    >
                      Edit Details
                    </Button>
                  </div>
                </div>

                {/* Visual indicators */}
                <div className="flex items-center mt-3 space-x-4">
                  {ship.priority && (
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${priorityColors[ship.priority]} mr-2`}></div>
                      <span className="text-sm text-gray-600">{ship.priority}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    {ship.mustHave ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                    )}
                    <span className="text-sm text-gray-600">
                      {ship.mustHave ? 'Must-have' : 'Nice-to-have'}
                    </span>
                  </div>
                  <div className={`text-sm ${onePagerStatusColors[ship.onePagerStatus || 'missing']}`}>
                    One-pager: {ship.onePagerStatus?.replace('_', ' ') || 'missing'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Save Draft
        </Button>
        <Button onClick={handleFinalizeQuarterPlan}>
          Finalize Quarter Plan
        </Button>
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
          onClick={() => {
            setShowAddProjectModal(false);
            resetNewProject();
          }}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
                <button
                  onClick={() => {
                    setShowAddProjectModal(false);
                    resetNewProject();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Project Title"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                    />
                    <Select
                      label="Area"
                      value={newProject.area || area}
                      onChange={(e) => setNewProject(prev => ({ 
                        ...prev, 
                        area: e.target.value,
                        product: '' // Reset product when area changes
                      }))}
                      options={[
                        { value: '', label: 'All Areas' },
                        ...AREA_OPTIONS.map(area => ({ value: area, label: area }))
                      ]}
                    />
                    <Select
                      label="Product"
                      value={newProject.product || product}
                      onChange={(e) => setNewProject(prev => ({ ...prev, product: e.target.value }))}
                      options={[
                        { value: '', label: 'All Products' },
                        ...availableProducts.map(product => ({ value: product, label: product }))
                      ]}
                    />
                  </div>
                </div>

                {/* Resource Needs */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Needs</h3>
                  <p className="text-sm text-gray-600 mb-4">Select which roles are required and their T-shirt sizes</p>
                  
                  <div className="space-y-4">
                    {(['Designer', 'Content', 'Frontend'] as Role[]).map(role => {
                      const resourceNeed = newProject.resourceNeeds.find(rn => rn.role === role);
                      const isSelected = !!resourceNeed;
                      
                      return (
                        <div key={role} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addResourceNeed(role);
                                } else {
                                  removeResourceNeed(role);
                                }
                              }}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 font-medium text-gray-900">{role}</span>
                          </label>
                          
                          {isSelected && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Size:</span>
                              <Select
                                value={resourceNeed.tshirtSize}
                                onChange={(e) => updateResourceNeedSize(role, e.target.value as TShirtSize)}
                                options={[
                                  { value: 'S', label: `S (${TSHIRT_LOAD_MAPPING.S}%)` },
                                  { value: 'M', label: `M (${TSHIRT_LOAD_MAPPING.M}%)` },
                                  { value: 'L', label: `L (${TSHIRT_LOAD_MAPPING.L}%)` },
                                  { value: 'XL', label: `XL (${TSHIRT_LOAD_MAPPING.XL}%)` }
                                ]}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                  <p className="text-sm text-gray-600 mb-4">Select which quarter(s) this project spans</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quarters.map(quarter => (
                      <label key={quarter} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={newProject.timeline.includes(quarter)}
                          onChange={() => toggleQuarterInTimeline(quarter)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">{quarter}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  {/* Validation Message */}
                  {!canAddProject && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Please complete: {validationResult.errors.join(', ')}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowAddProjectModal(false);
                        resetNewProject();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddProject}
                      disabled={!canAddProject}
                    >
                      Add Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Feasibility Report Modal */}
      {showFeasibilityReport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
          onClick={() => setShowFeasibilityReport(false)}
        >
          <Card
            className="max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quarter Feasibility Report</h2>
                  <p className="text-gray-600">{quarter} • Generated {new Date().toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setShowFeasibilityReport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-green-900">{feasibilityAnalysis.feasible.length}</div>
                          <div className="text-sm text-green-700">Feasible Projects</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <div className="flex items-center">
                        <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-yellow-900">{feasibilityAnalysis.partiallyFeasible.length}</div>
                          <div className="text-sm text-yellow-700">Partially Feasible</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-red-50 border-red-200">
                      <div className="flex items-center">
                        <X className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-red-900">{feasibilityAnalysis.notFeasible.length}</div>
                          <div className="text-sm text-red-700">Not Feasible</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Capacity Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Capacity Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(feasibilityAnalysis.capacitySummary).map(([role, capacity]) => (
                      <Card key={role} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{role}</h4>
                          <Badge variant={
                            capacity.status === 'healthy' ? 'success' :
                            capacity.status === 'at-risk' ? 'warning' : 'danger'
                          }>
                            {capacity.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Used: {capacity.used}%</span>
                            <span>Available: {capacity.total}%</span>
                          </div>
                          <ProgressBar 
                            value={capacity.used} 
                            max={capacity.total}
                            variant={
                              capacity.status === 'healthy' ? 'success' :
                              capacity.status === 'at-risk' ? 'warning' : 'danger'
                            }
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Project Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Feasible Projects */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Feasible Projects
                    </h3>
                    <div className="space-y-3">
                      {feasibilityAnalysis.feasible.map(project => (
                        <Card key={project.id} className="p-3 border-green-200">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-600">{project.area} • {project.product}</div>
                          <div className="flex items-center mt-2">
                            <Badge variant={project.priority === 'P1' ? 'danger' : project.priority === 'P2' ? 'warning' : 'neutral'}>
                              {project.priority}
                            </Badge>
                            <Badge variant={project.mustHave ? 'success' : 'neutral'} className="ml-2">
                              {project.mustHave ? 'Must-have' : 'Nice-to-have'}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Partially Feasible Projects */}
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Partially Feasible
                    </h3>
                    <div className="space-y-3">
                      {feasibilityAnalysis.partiallyFeasible.map(project => (
                        <Card key={project.id} className="p-3 border-yellow-200">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-600">{project.area} • {project.product}</div>
                          <div className="text-xs text-yellow-700 mt-1">Missing required roles</div>
                          <div className="flex items-center mt-2">
                            <Badge variant={project.priority === 'P1' ? 'danger' : project.priority === 'P2' ? 'warning' : 'neutral'}>
                              {project.priority}
                            </Badge>
                            <Badge variant={project.mustHave ? 'success' : 'neutral'} className="ml-2">
                              {project.mustHave ? 'Must-have' : 'Nice-to-have'}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Not Feasible Projects */}
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                      <X className="w-5 h-5 mr-2" />
                      Not Feasible
                    </h3>
                    <div className="space-y-3">
                      {feasibilityAnalysis.notFeasible.map(project => (
                        <Card key={project.id} className="p-3 border-red-200">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-600">{project.area} • {project.product}</div>
                          <div className="text-xs text-red-700 mt-1">Capacity overages</div>
                          <div className="flex items-center mt-2">
                            <Badge variant={project.priority === 'P1' ? 'danger' : project.priority === 'P2' ? 'warning' : 'neutral'}>
                              {project.priority}
                            </Badge>
                            <Badge variant={project.mustHave ? 'success' : 'neutral'} className="ml-2">
                              {project.mustHave ? 'Must-have' : 'Nice-to-have'}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Trade-off Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feasibilityAnalysis.recommendations.moveToNextQuarter.length > 0 && (
                      <Card className="p-4 bg-blue-50 border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Move to Next Quarter</h4>
                        <div className="space-y-1">
                          {feasibilityAnalysis.recommendations.moveToNextQuarter.map(project => (
                            <div key={project.id} className="text-sm text-blue-800">• {project.title}</div>
                          ))}
                        </div>
                      </Card>
                    )}
                    
                    {feasibilityAnalysis.recommendations.deprioritizeNiceToHave.length > 0 && (
                      <Card className="p-4 bg-purple-50 border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">Deprioritize Nice-to-Haves</h4>
                        <div className="space-y-1">
                          {feasibilityAnalysis.recommendations.deprioritizeNiceToHave.map(project => (
                            <div key={project.id} className="text-sm text-purple-800">• {project.title}</div>
                          ))}
                        </div>
                      </Card>
                    )}
                    
                    {feasibilityAnalysis.recommendations.breakIntoMilestones.length > 0 && (
                      <Card className="p-4 bg-orange-50 border-orange-200">
                        <h4 className="font-medium text-orange-900 mb-2">Break into Milestones</h4>
                        <div className="space-y-1">
                          {feasibilityAnalysis.recommendations.breakIntoMilestones.map(project => (
                            <div key={project.id} className="text-sm text-orange-800">• {project.title}</div>
                          ))}
                        </div>
                      </Card>
                    )}
                    
                    {feasibilityAnalysis.recommendations.reduceScope.length > 0 && (
                      <Card className="p-4 bg-gray-50 border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Reduce Scope</h4>
                        <div className="space-y-1">
                          {feasibilityAnalysis.recommendations.reduceScope.map(project => (
                            <div key={project.id} className="text-sm text-gray-800">• {project.title}</div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSyncToJira}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Sync to Jira
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSyncToSmartsheet}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Sync to Smartsheet
                    </Button>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      onClick={() => setShowFeasibilityReport(false)}
                    >
                      Close Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      </div>
    </Layout>
  );
};
