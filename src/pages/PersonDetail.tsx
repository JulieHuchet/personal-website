import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, ProgressBar, Button, DataTable } from '../components/ui';
import { people, ships, assignments, quarters, calculatePersonLoad, getCapacityStatus } from '../data/seedData';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';

export const PersonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const person = useMemo(() => {
    return people.find(p => p.id === id);
  }, [id]);

  const personAssignments = useMemo(() => {
    if (!person) return [];
    
    return assignments
      .filter(a => a.personId === person.id)
      .map(assignment => {
        const ship = ships.find(s => s.id === assignment.shipId);
        return {
          ...assignment,
          ship
        };
      })
      .filter(a => a.ship); // Only include assignments with valid ships
  }, [person]);

  const quarterlyLoad = useMemo(() => {
    if (!person) return {};
    
    return quarters.reduce((acc, quarter) => {
      const load = calculatePersonLoad(person.id, quarter);
      const status = getCapacityStatus(load);
      acc[quarter] = { load, status };
      return acc;
    }, {} as Record<string, { load: number; status: 'healthy' | 'borderline' | 'overloaded' }>);
  }, [person]);

  if (!person) {
    return (
      <div className="space-y-6">
        <Card padding="large">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Person Not Found</h1>
            <p className="text-gray-600 mb-4">The requested person could not be found.</p>
            <Button onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const assignmentColumns = [
    {
      key: 'ship' as keyof typeof personAssignments[0],
      header: 'Project',
      render: (ship: typeof personAssignments[0]['ship']) => (
        <div>
          <div className="font-medium">{ship?.title}</div>
          <div className="text-sm text-gray-500">{ship?.id}</div>
        </div>
      )
    },
    {
      key: 'quarter' as keyof typeof personAssignments[0],
      header: 'Quarter'
    },
    {
      key: 'ship' as keyof typeof personAssignments[0],
      header: 'Area/Product',
      render: (ship: typeof personAssignments[0]['ship']) => (
        <div className="text-sm">
          <div>{ship?.area}</div>
          <div className="text-gray-500">{ship?.product}</div>
        </div>
      )
    },
    {
      key: 'loadPercent' as keyof typeof personAssignments[0],
      header: 'Load %',
      render: (value: number) => `${value}%`
    },
    {
      key: 'ship' as keyof typeof personAssignments[0],
      header: 'Status',
      render: (ship: typeof personAssignments[0]['ship']) => {
        const statusMap = {
          'Committed': 'success' as const,
          'Planned': 'warning' as const,
          'Backlog': 'neutral' as const,
          'In Review': 'warning' as const
        };
        
        return ship ? (
          <Badge variant={statusMap[ship.status] || 'neutral'}>
            {ship.status}
          </Badge>
        ) : null;
      }
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
          <p className="text-gray-600">{person.role} • {person.area} • {person.managerName}</p>
        </div>
      </div>

      {/* Person Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Role</div>
            <div className="text-lg">{person.role}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Area</div>
            <div className="text-lg">{person.area}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Product</div>
            <div className="text-lg">{person.product || 'Unassigned'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Manager</div>
            <div className="text-lg">{person.managerName}</div>
          </div>
        </div>
      </Card>

      {/* Quarterly Capacity Overview */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Capacity</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quarters.map(quarter => {
            const quarterData = quarterlyLoad[quarter];
            return (
              <div key={quarter} className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">{quarter}</div>
                <div className="mb-2">
                  <ProgressBar value={quarterData.load} showLabel />
                </div>
                <Badge
                  variant={
                    quarterData.status === 'healthy' ? 'success' :
                    quarterData.status === 'borderline' ? 'warning' : 'danger'
                  }
                >
                  {quarterData.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Current Assignments */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
          <p className="text-sm text-gray-600">All projects assigned to {person.name}</p>
        </div>
        
        {personAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No current assignments
          </div>
        ) : (
          <DataTable
            data={personAssignments}
            columns={assignmentColumns}
          />
        )}
      </Card>

      {/* Timeline View */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline View</h2>
        <div className="space-y-4">
          {quarters.map(quarter => {
            const quarterAssignments = personAssignments.filter(a => a.quarter === quarter);
            const quarterLoad = quarterlyLoad[quarter];
            
            return (
              <div key={quarter} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{quarter}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{quarterLoad.load}%</span>
                    <Badge
                      variant={
                        quarterLoad.status === 'healthy' ? 'success' :
                        quarterLoad.status === 'borderline' ? 'warning' : 'danger'
                      }
                    >
                      {quarterLoad.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <ProgressBar value={quarterLoad.load} showLabel={false} />
                </div>
                
                {quarterAssignments.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No assignments this quarter</div>
                ) : (
                  <div className="space-y-2">
                    {quarterAssignments.map(assignment => (
                      <div key={assignment.shipId} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{assignment.ship?.title}</span>
                          <span className="text-gray-500 ml-2">({assignment.ship?.id})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{assignment.loadPercent}%</span>
                          <Badge
                            variant={
                              assignment.ship?.status === 'Committed' ? 'success' :
                              assignment.ship?.status === 'Planned' ? 'warning' : 'neutral'
                            }
                          >
                            {assignment.ship?.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      </div>
    </Layout>
  );
};
