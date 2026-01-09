import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar, Alert } from '../components/ui';
import { ArrowLeft } from 'lucide-react';
import { Role, TShirtSize } from '../types';
import { Layout } from '../components/Layout';
import {
  people,
  quarters,
  TSHIRT_LOAD_MAPPING,
  calculatePersonLoad,
  getCapacityStatus,
} from '../data/seedData';

// Static dropdown options as specified
const AREA_OPTIONS = [
  'Platform',
  'Devices & Filtering',
  'Network Services',
  'App Security',
  'App Performance',
];

const PRODUCT_OPTIONS = ['Navigation', 'WARP Client', 'SSL/TLS'];

interface ShipFormData {
  area: string;
  product: string;
  targetQuarters: string[];
  title: string;
}

interface RoleRequirement {
  role: Role;
  tshirtSize: TShirtSize;
}

export const PlanShip: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isDesignOnly, setIsDesignOnly] = useState(false);

  const [formData, setFormData] = useState<ShipFormData>({
    area: '',
    product: '',
    targetQuarters: ['Q1 2026'],
    title: '',
  });

  const [roleRequirements, setRoleRequirements] = useState<RoleRequirement[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<Record<Role, string>>(
    {} as Record<Role, string>
  );

  const availableProducts = PRODUCT_OPTIONS;

  const setField = (field: keyof ShipFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'area' ? { product: '' } : {}),
    }));
  };

  // ---- availability & capacity ----

  const roleAvailability = useMemo(() => {
    const availability: Record<
      Role,
      Array<{
        person: (typeof people)[0];
        currentLoad: number;
        projectedLoad: number;
        status: 'healthy' | 'borderline' | 'overloaded';
      }>
    > = {
      Designer: [],
      Content: [],
      Frontend: [],
    };

    roleRequirements.forEach(req => {
      const roleLoad = TSHIRT_LOAD_MAPPING[req.tshirtSize];

      const rolePeople = people.filter(p => {
        if (p.role !== req.role) return false;
        if (formData.area && p.area !== formData.area) return false;
        // Only filter by product if the person has a product set
        if (formData.product && p.product && p.product !== formData.product) return false;
        return true;
      });

      availability[req.role] = rolePeople
        .map(person => {
          const totalCurrentLoad = formData.targetQuarters.reduce(
            (sum, q) => sum + calculatePersonLoad(person.id, q),
            0
          );

          const currentLoad =
            formData.targetQuarters.length > 0 ? totalCurrentLoad / formData.targetQuarters.length : 0;

          const projectedLoad = currentLoad + roleLoad;
          const status = getCapacityStatus(projectedLoad);

          return { person, currentLoad, projectedLoad, status };
        })
        .sort((a, b) => a.projectedLoad - b.projectedLoad);
    });

    return availability;
  }, [roleRequirements, formData.area, formData.product, formData.targetQuarters]);

  const hasCapacityIssues = useMemo(() => {
    return roleRequirements.some(req => {
      const available = roleAvailability[req.role];
      return available.length === 0 || available.every(p => p.status === 'overloaded');
    });
  }, [roleRequirements, roleAvailability]);

  const canProceedWithDesignOnly = useMemo(() => {
    const hasDesigner = roleRequirements.some(r => r.role === 'Designer');
    const hasContent = roleRequirements.some(r => r.role === 'Content');

    const designerAvailable = roleAvailability.Designer.some(p => p.status !== 'overloaded');
    const contentAvailable = roleAvailability.Content.some(p => p.status !== 'overloaded');

    return hasDesigner && hasContent && designerAvailable && !contentAvailable;
  }, [roleRequirements, roleAvailability]);

  // ---- role requirement helpers ----

  const addRoleRequirement = (role: Role, tshirtSize: TShirtSize) => {
    setRoleRequirements(prev => {
      const existing = prev.find(r => r.role === role);
      if (existing) {
        return prev.map(r => (r.role === role ? { role, tshirtSize } : r));
      }
      return [...prev, { role, tshirtSize }];
    });
  };

  const removeRoleRequirement = (role: Role) => {
    setRoleRequirements(prev => prev.filter(r => r.role !== role));
    setSelectedAssignments(prev => {
      const next = { ...prev };
      delete next[role];
      return next;
    });
  };

  const handleProceedWithDesignOnly = () => {
    setIsDesignOnly(true);
    setRoleRequirements(prev => prev.filter(r => r.role !== 'Content'));
    setCurrentStep(4);
  };

  // ---- validation ----

  const isStep1Valid = useMemo(() => {
    return (
      formData.area.trim().length > 0 &&
      formData.product.trim().length > 0 &&
      formData.targetQuarters.length > 0 &&
      formData.title.trim().length > 0
    );
  }, [formData.area, formData.product, formData.targetQuarters, formData.title]);

  // ---- step renderers ----

  const renderStep1 = () => (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Step 1: Project Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Area - native select (reliable) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
          <select
            value={formData.area}
            onChange={(e) => setField('area', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">Select area</option>
            {AREA_OPTIONS.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Product - native select (reliable) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
          <select
            value={formData.product}
            onChange={(e) => setField('product', e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">Select product</option>
            {availableProducts.map(product => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        {/* Target Quarters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Quarter</label>
          <div className="grid grid-cols-2 gap-3">
            {quarters.map(quarter => (
              <label key={quarter} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.targetQuarters.includes(quarter)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        targetQuarters: Array.from(new Set([...prev.targetQuarters, quarter])),
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        targetQuarters: prev.targetQuarters.filter(q => q !== quarter),
                      }));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{quarter}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jira ticket - native input (reliable) */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Jira ticket</label>
          <input
            value={formData.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Drop your Jira link"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Step 2: Scope estimation</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Select the roles needed and their T-shirt sizes:</p>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Select Roles Needed</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['Designer', 'Content', 'Frontend'] as Role[]).map(role => {
                const existing = roleRequirements.find(r => r.role === role);

                return (
                  <div
                    key={role}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      existing ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (existing) removeRoleRequirement(role);
                      else addRoleRequirement(role, 'M');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{role}</span>
                      <div
                        className={`w-4 h-4 rounded border-2 ${
                          existing ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        {existing && (
                          <svg className="w-3 h-3 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {existing && (
                      <div className="mt-2 text-sm text-blue-600">
                        Current: {existing.tshirtSize} ({TSHIRT_LOAD_MAPPING[existing.tshirtSize]}%)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {roleRequirements.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Configure T-shirt Sizes</h3>
              <div className="space-y-4">
                {roleRequirements.map(req => (
                  <div key={req.role} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{req.role}</h4>
                      <Button variant="danger" size="small" onClick={() => removeRoleRequirement(req.role)}>
                        Remove
                      </Button>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {(['S', 'M', 'L', 'XL'] as TShirtSize[]).map(size => (
                        <Button
                          key={size}
                          variant={req.tshirtSize === size ? 'primary' : 'secondary'}
                          size="small"
                          onClick={() => addRoleRequirement(req.role, size)}
                        >
                          {size} ({TSHIRT_LOAD_MAPPING[size]}%)
                        </Button>
                      ))}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {req.tshirtSize} ({TSHIRT_LOAD_MAPPING[req.tshirtSize]}% capacity)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {roleRequirements.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Requirements:</h4>
            <div className="space-y-1">
              {roleRequirements.map(req => (
                <div key={req.role} className="text-sm">
                  {req.role}: {req.tshirtSize} ({TSHIRT_LOAD_MAPPING[req.tshirtSize]}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Step 3: Availability</h2>

      {hasCapacityIssues && (
        <Alert variant="warning" className="mb-4">
          <div>
            <h4 className="font-medium">Capacity Issues Detected</h4>
            <p>Some roles have limited or no availability. Consider the recommendations below.</p>
          </div>
        </Alert>
      )}

      <div className="space-y-6">
        {roleRequirements.map(req => {
          const available = roleAvailability[req.role];

          return (
            <div key={req.role}>
              <h3 className="font-medium mb-3">
                {req.role} - {req.tshirtSize} ({TSHIRT_LOAD_MAPPING[req.tshirtSize]}%)
              </h3>

              {available.length === 0 ? (
                <div className="text-gray-500 italic">No {req.role}s available</div>
              ) : (
                <div className="space-y-2">
                  {available.map(({ person, currentLoad, projectedLoad, status }) => (
                    <div
                      key={person.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAssignments[req.role] === person.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() =>
                        setSelectedAssignments(prev => ({
                          ...prev,
                          [req.role]: person.id,
                        }))
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-sm text-gray-500">
                            {person.area} • {person.product || 'Unassigned'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm">
                              {currentLoad}% → {projectedLoad}%
                            </div>
                            <Badge
                              variant={
                                status === 'healthy' ? 'success' : status === 'borderline' ? 'warning' : 'danger'
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="w-24">
                            <ProgressBar value={projectedLoad} showLabel={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasCapacityIssues && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Recommendations</h4>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">• Consider breaking this project into smaller milestones</div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">• Move some committed work to next quarter</div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">• Consider moving this project to next quarter</div>
          </div>
        </div>
      )}

      {canProceedWithDesignOnly && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Alternative Option</h4>
            <p className="text-sm text-blue-800 mb-4">
              Designers are available but content strategists aren’t. You can proceed with design work now and add content later.
            </p>
            <Button onClick={handleProceedWithDesignOnly} className="bg-blue-600 text-white hover:bg-blue-700">
              Proceed With Design Only
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Step 4: Summary & Submit</h2>

      {isDesignOnly && (
        <Alert variant="info" className="mb-4">
          <div>
            <h4 className="font-medium">Design-Only Project</h4>
            <p>This project will proceed without content support until capacity is available.</p>
          </div>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Project Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Area:</strong> {formData.area}</div>
            <div><strong>Product:</strong> {formData.product}</div>
            <div><strong>Quarter:</strong> {formData.targetQuarters.join(', ')}</div>
            {isDesignOnly && (
              <div>
                <strong>Status:</strong>{' '}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Design-Only
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Assignments</h3>
          <div className="space-y-2">
            {roleRequirements.map(req => {
              const personId = selectedAssignments[req.role];
              const person = people.find(p => p.id === personId);

              const currentLoad =
                person && formData.targetQuarters.length > 0
                  ? formData.targetQuarters.reduce((sum, q) => sum + calculatePersonLoad(person.id, q), 0) /
                    formData.targetQuarters.length
                  : 0;

              const projectedLoad = currentLoad + TSHIRT_LOAD_MAPPING[req.tshirtSize];

              return (
                <div key={req.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{req.role}</div>
                    <div className="text-sm text-gray-600">
                      {person?.name || '—'} • {req.tshirtSize} ({TSHIRT_LOAD_MAPPING[req.tshirtSize]}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{currentLoad}% → {projectedLoad}%</div>
                    <Badge variant={projectedLoad <= 85 ? 'success' : projectedLoad <= 100 ? 'warning' : 'danger'}>
                      {getCapacityStatus(projectedLoad)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Alert variant="info">
          <div>
            <h4 className="font-medium">Ready to Submit</h4>
            <p>This request will be sent to the relevant managers for approval.</p>
          </div>
        </Alert>
      </div>
    </Card>
  );

  // ---- navigation ----

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) return;
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="mr-4 p-2 text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check Resources Availability</h1>
              <p className="text-gray-600">Request resources for your product initiative</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              <div className="ml-2 text-sm">
                {step === 1 && 'Project Details'}
                {step === 2 && 'Scope estimation'}
                {step === 3 && 'Availability'}
                {step === 4 && 'Summary'}
              </div>
              {step < 4 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handlePrev} disabled={currentStep === 1}>
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} disabled={currentStep === 1 && !isStep1Valid}>
              Next
            </Button>
          ) : (
            <Button onClick={() => navigate('/')}>Submit for Approval</Button>
          )}
        </div>
      </div>
    </Layout>
  );
};
