import React, { useMemo } from 'react';
import { Card } from './ui';
import { Activity, Target, FileText, ExternalLink } from 'lucide-react';
import { people, ships, calculatePersonLoad, getCapacityStatus } from '../data/seedData';
import { Role } from '../types';

interface SummaryWidgetsProps {
  selectedQuarters: string[];
}

export const SummaryWidgets: React.FC<SummaryWidgetsProps> = ({ selectedQuarters }) => {
  // Calculate capacity snapshot
  const capacitySnapshot = useMemo(() => {
    const roleStats: Record<Role, { healthy: number; borderline: number; overloaded: number; avgLoad: number }> = {
      Designer: { healthy: 0, borderline: 0, overloaded: 0, avgLoad: 0 },
      Content: { healthy: 0, borderline: 0, overloaded: 0, avgLoad: 0 },
      Frontend: { healthy: 0, borderline: 0, overloaded: 0, avgLoad: 0 }
    };

    const roleLoads: Record<Role, number[]> = {
      Designer: [],
      Content: [],
      Frontend: []
    };

    people.forEach(person => {
      // Calculate average load across selected quarters
      const totalLoad = selectedQuarters.reduce((sum, quarter) => {
        return sum + calculatePersonLoad(person.id, quarter);
      }, 0);
      const avgLoad = selectedQuarters.length > 0 ? totalLoad / selectedQuarters.length : 0;
      
      roleLoads[person.role].push(avgLoad);
      
      const status = getCapacityStatus(avgLoad);
      if (status === 'healthy') roleStats[person.role].healthy++;
      else if (status === 'borderline') roleStats[person.role].borderline++;
      else roleStats[person.role].overloaded++;
    });

    // Calculate average loads per role
    Object.keys(roleStats).forEach(role => {
      const loads = roleLoads[role as Role];
      roleStats[role as Role].avgLoad = loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : 0;
    });

    return roleStats;
  }, [selectedQuarters]);

  // Calculate priority overview
  const priorityOverview = useMemo(() => {
    const quarterShips = ships.filter(ship => 
      selectedQuarters.some(quarter => ship.targetQuarter === quarter)
    );

    return {
      P1: quarterShips.filter(ship => ship.priority === 'P1').length,
      P2: quarterShips.filter(ship => ship.priority === 'P2').length,
      P3: quarterShips.filter(ship => ship.priority === 'P3').length,
      P4: quarterShips.filter(ship => ship.priority === 'P4').length,
      unassigned: quarterShips.filter(ship => !ship.priority).length
    };
  }, [selectedQuarters]);

  // Calculate one-pager readiness
  const onePagerReadiness = useMemo(() => {
    const quarterShips = ships.filter(ship => 
      selectedQuarters.some(quarter => ship.targetQuarter === quarter)
    );

    return {
      missing: quarterShips.filter(ship => !ship.onePagerStatus || ship.onePagerStatus === 'missing').length,
      in_progress: quarterShips.filter(ship => ship.onePagerStatus === 'in_progress').length,
      ready_for_review: quarterShips.filter(ship => ship.onePagerStatus === 'ready_for_review').length,
      approved: quarterShips.filter(ship => ship.onePagerStatus === 'approved').length
    };
  }, [selectedQuarters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Capacity Snapshot */}
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Capacity Snapshot</h3>
          </div>
          <div className="space-y-4">
            {(Object.keys(capacitySnapshot) as Role[]).map(role => {
              const stats = capacitySnapshot[role];
              return (
                <div key={role} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{role}</span>
                    <span className="text-sm text-gray-500">{Math.round(stats.avgLoad)}%</span>
                  </div>
                  <div className="flex space-x-1 text-xs">
                    <div className="flex-1 bg-green-100 text-green-800 px-2 py-1 rounded text-center">
                      {stats.healthy}
                    </div>
                    <div className="flex-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-center">
                      {stats.borderline}
                    </div>
                    <div className="flex-1 bg-red-100 text-red-800 px-2 py-1 rounded text-center">
                      {stats.overloaded}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Priority Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Priority Overview</h3>
          </div>
          <div className="space-y-3">
            {[
              { key: 'P1', label: 'P1 (Critical)', count: priorityOverview.P1, color: 'bg-red-500' },
              { key: 'P2', label: 'P2 (High)', count: priorityOverview.P2, color: 'bg-orange-500' },
              { key: 'P3', label: 'P3 (Medium)', count: priorityOverview.P3, color: 'bg-yellow-500' },
              { key: 'P4', label: 'P4 (Low)', count: priorityOverview.P4, color: 'bg-green-500' },
              { key: 'unassigned', label: 'Unassigned', count: priorityOverview.unassigned, color: 'bg-gray-400' }
            ].map(priority => (
              <div key={priority.key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${priority.color} mr-2`}></div>
                  <span className="text-sm text-gray-700">{priority.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{priority.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* One-Pager Readiness */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">One-Pager Readiness</h3>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { key: 'missing', label: 'Missing', count: onePagerReadiness.missing, color: 'text-red-600' },
              { key: 'in_progress', label: 'In Progress', count: onePagerReadiness.in_progress, color: 'text-yellow-600' },
              { key: 'ready_for_review', label: 'Ready for Review', count: onePagerReadiness.ready_for_review, color: 'text-blue-600' },
              { key: 'approved', label: 'Approved', count: onePagerReadiness.approved, color: 'text-green-600' }
            ].map(status => (
              <div key={status.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{status.label}</span>
                <span className={`text-sm font-medium ${status.color}`}>{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
