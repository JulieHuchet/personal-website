import React, { useState, useMemo } from 'react';
import { Card, DataTable, Badge, ProgressBar, Select } from '../components/ui';
import { Role } from '../types';
import { people, quarters, areas, calculatePersonLoad, getCapacityStatus } from '../data/seedData';
import { useNavigate } from 'react-router-dom';
import { SummaryWidgets } from '../components/SummaryWidgets';
import { Layout } from '../components/Layout';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>(['Q1 2026']);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  // Filter people based on selected filters
  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      if (selectedArea && person.area !== selectedArea) return false;
      if (selectedRoles.length > 0 && !selectedRoles.includes(person.role)) return false;
      return true;
    });
  }, [selectedArea, selectedRoles]);

  // Calculate capacity data for each person
  const capacityData = useMemo(() => {
    return filteredPeople.map(person => {
      // Calculate total load across all selected quarters
      const totalLoad = selectedQuarters.reduce((sum, quarter) => {
        return sum + calculatePersonLoad(person.id, quarter);
      }, 0);
      
      // Average load across selected quarters
      const loadPercent = selectedQuarters.length > 0 ? totalLoad / selectedQuarters.length : 0;
      const status = getCapacityStatus(loadPercent);
      
      return {
        ...person,
        loadPercent,
        status
      };
    });
  }, [filteredPeople, selectedQuarters]);

  const columns = [
    {
      key: 'name' as keyof typeof capacityData[0],
      header: 'Name',
      render: (value: string, row: typeof capacityData[0]) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.role}</div>
          </div>
        </div>
      )
    },
    {
      key: 'area' as keyof typeof capacityData[0],
      header: 'Area'
    },
    {
      key: 'product' as keyof typeof capacityData[0],
      header: 'Product',
      render: (value: string) => value || '-'
    },
    {
      key: 'managerName' as keyof typeof capacityData[0],
      header: 'Manager'
    },
    {
      key: 'loadPercent' as keyof typeof capacityData[0],
      header: 'Current Load',
      render: (value: number, row: typeof capacityData[0]) => {
        const variant = row.status === 'overloaded' ? 'danger' : 
                       row.status === 'borderline' ? 'warning' : 'success';
        return (
          <div className="w-32">
            <ProgressBar value={value} showLabel variant={variant} />
          </div>
        );
      }
    },
    {
      key: 'status' as keyof typeof capacityData[0],
      header: 'Status',
      render: (value: 'healthy' | 'borderline' | 'overloaded') => {
        const variantMap = {
          healthy: 'success' as const,
          borderline: 'warning' as const,
          overloaded: 'danger' as const
        };
        
        const labelMap = {
          healthy: 'Healthy',
          borderline: 'Borderline',
          overloaded: 'Overloaded'
        };
        
        return <Badge variant={variantMap[value]}>{labelMap[value]}</Badge>;
      }
    }
  ];

  const handleRowClick = (row: typeof capacityData[0]) => {
    navigate(`/person/${row.id}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Summary Widgets */}
        <SummaryWidgets selectedQuarters={selectedQuarters} />


        {/* Filters */}
        <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
            <div className="grid grid-cols-2 gap-3">
              {quarters.map(quarter => (
                <label key={quarter} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedQuarters.includes(quarter)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuarters(prev => [...prev, quarter]);
                      } else {
                        setSelectedQuarters(prev => prev.filter(q => q !== quarter));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{quarter}</span>
                </label>
              ))}
            </div>
          </div>
          <Select
            label="Area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            options={[
              { value: '', label: 'All Areas' },
              ...areas.map(area => ({ value: area, label: area }))
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Designer', 'Content', 'Frontend'] as Role[]).map(role => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles(prev => [...prev, role]);
                      } else {
                        setSelectedRoles(prev => prev.filter(r => r !== role));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Capacity Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Capacity - {selectedQuarters.length > 0 ? selectedQuarters.join(', ') : 'No quarters selected'}</h2>
          <p className="text-sm text-gray-600">Click on a person to view detailed workload</p>
        </div>
        <DataTable
          data={capacityData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Card>
      </div>
    </Layout>
  );
};
