import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, DataTable, Alert } from '../components/ui';
import { ArrowLeft, X } from 'lucide-react';
import { PendingRequest } from '../types';
import { Layout } from '../components/Layout';
import { people, ships, TSHIRT_LOAD_MAPPING, calculatePersonLoad, getCapacityStatus } from '../data/seedData';

// Mock pending requests data
const mockPendingRequests: PendingRequest[] = [
  {
    id: '1',
    shipId: 'SHIP-003',
    personId: '4', // Natalie Yeh
    requestedBy: 'Bob Wilson',
    requestedAt: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    id: '2',
    shipId: 'SHIP-002',
    personId: '3', // Chris Nemeth
    requestedBy: 'Jane Doe',
    requestedAt: new Date('2024-01-14'),
    status: 'pending'
  }
];

export const Approvals: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PendingRequest[]>(mockPendingRequests);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    setSelectedRequest(null);
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'declined' as const } : req
    ));
    setSelectedRequest(null);
  };

  const getRequestDetails = (request: PendingRequest) => {
    const ship = ships.find(s => s.id === request.shipId);
    const person = people.find(p => p.id === request.personId);
    
    if (!ship || !person) return null;

    const roleRequirement = ship.tshirtSizeByRole[person.role];
    const loadIncrease = roleRequirement ? TSHIRT_LOAD_MAPPING[roleRequirement] : 0;
    const currentLoad = calculatePersonLoad(person.id, ship.targetQuarter);
    const projectedLoad = currentLoad + loadIncrease;
    const status = getCapacityStatus(projectedLoad);

    return {
      ship,
      person,
      roleRequirement,
      loadIncrease,
      currentLoad,
      projectedLoad,
      status
    };
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const columns = [
    {
      key: 'requestedAt' as keyof PendingRequest,
      header: 'Date',
      render: (value: Date) => value.toLocaleDateString()
    },
    {
      key: 'shipId' as keyof PendingRequest,
      header: 'Project',
      render: (value: string) => {
        const ship = ships.find(s => s.id === value);
        return ship ? ship.title : value;
      }
    },
    {
      key: 'personId' as keyof PendingRequest,
      header: 'Person',
      render: (value: string) => {
        const person = people.find(p => p.id === value);
        return person ? `${person.name} (${person.role})` : 'Unknown';
      }
    },
    {
      key: 'requestedBy' as keyof PendingRequest,
      header: 'Requested By'
    },
    {
      key: 'id' as keyof PendingRequest,
      header: 'Impact',
      render: (_value: string, request: PendingRequest) => {
        const details = getRequestDetails(request);
        if (!details) return '-';
        
        return (
          <div className="text-sm">
            <div>{details.currentLoad}% → {details.projectedLoad}%</div>
            <Badge
              variant={
                details.status === 'healthy' ? 'success' :
                details.status === 'borderline' ? 'warning' : 'danger'
              }
            >
              {details.status}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'id' as keyof PendingRequest,
      header: 'Actions',
      render: (_value: string, request: PendingRequest) => (
        <Button
          size="small"
          onClick={() => setSelectedRequest(request)}
        >
          Review
        </Button>
      )
    }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Approval Queue (Manager Only)</h1>
            <p className="text-gray-600">Review and approve resource requests</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="medium">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingRequests.length}</div>
            <div className="text-sm text-gray-500">Pending Requests</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-500">Approved Today</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === 'declined').length}
            </div>
            <div className="text-sm text-gray-500">Declined Today</div>
          </div>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending requests
          </div>
        ) : (
          <DataTable
            data={pendingRequests}
            columns={columns}
          />
        )}
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
          onClick={() => setSelectedRequest(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Review Request</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {(() => {
              const details = getRequestDetails(selectedRequest);
              if (!details) return <div>Request details not found</div>;
              
              return (
                <div className="space-y-4">
                  {/* Project Info */}
                  <div>
                    <h3 className="font-medium mb-2">Project Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                      <div><strong>Title:</strong> {details.ship.title}</div>
                      <div><strong>ID:</strong> {details.ship.id}</div>
                      <div><strong>Area:</strong> {details.ship.area}</div>
                      <div><strong>Product:</strong> {details.ship.product}</div>
                      <div><strong>Quarter:</strong> {details.ship.targetQuarter}</div>
                      <div><strong>PM:</strong> {details.ship.pmNames.join(', ')}</div>
                    </div>
                  </div>

                  {/* Person Info */}
                  <div>
                    <h3 className="font-medium mb-2">Assignment Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                      <div><strong>Person:</strong> {details.person.name}</div>
                      <div><strong>Role:</strong> {details.person.role}</div>
                      <div><strong>Current Area:</strong> {details.person.area}</div>
                      <div><strong>Manager:</strong> {details.person.managerName}</div>
                      <div><strong>T-shirt Size:</strong> {details.roleRequirement} ({details.loadIncrease}%)</div>
                    </div>
                  </div>

                  {/* Capacity Impact */}
                  <div>
                    <h3 className="font-medium mb-2">Capacity Impact</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Current Load: {details.currentLoad}%</span>
                        <span className="text-sm">Projected Load: {details.projectedLoad}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${Math.min(details.currentLoad, 100)}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            details.status === 'healthy' ? 'bg-green-500' :
                            details.status === 'borderline' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(details.projectedLoad, 100)}%` }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <Badge
                          variant={
                            details.status === 'healthy' ? 'success' :
                            details.status === 'borderline' ? 'warning' : 'danger'
                          }
                        >
                          {details.status} ({details.projectedLoad}%)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Warning for overloaded */}
                  {details.status === 'overloaded' && (
                    <Alert variant="warning">
                      <div>
                        <h4 className="font-medium">Capacity Warning</h4>
                        <p>This assignment would put {details.person.name} over 100% capacity. Consider declining or suggesting alternatives.</p>
                      </div>
                    </Alert>
                  )}

                  {/* Request Info */}
                  <div className="text-sm text-gray-600">
                    <div>Requested by: {selectedRequest.requestedBy}</div>
                    <div>Requested on: {selectedRequest.requestedAt.toLocaleDateString()}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="primary"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDecline(selectedRequest.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedRequest(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}
      </div>
    </Layout>
  );
};
