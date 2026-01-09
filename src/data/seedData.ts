import { Person, Ship, Assignment } from '../types';
import jiraShips from './jiraShips.json';

// T-shirt Size → Load% mapping
export const TSHIRT_LOAD_MAPPING = {
  S: 8,
  M: 31,
  L: 80,
  XL: 160
} as const;

// Designer Pool (as specified)
export const people: Person[] = [
  { id: '1', name: 'Tc Ye', role: 'Designer', area: 'Core', product: 'Dashboard', managerName: 'Sarah Chen' },
  { id: '2', name: 'Thi Le', role: 'Designer', area: 'Core', product: 'Analytics', managerName: 'Sarah Chen' },
  { id: '3', name: 'Chris Nemeth', role: 'Designer', area: 'Platform', product: 'API', managerName: 'Sarah Chen' },
  { id: '4', name: 'Natalie Yeh', role: 'Designer', area: 'Growth', product: 'Onboarding', managerName: 'Sarah Chen' },
  { id: '5', name: 'Nick Reed', role: 'Designer', area: 'Core', product: 'Security', managerName: 'Sarah Chen' },
  { id: '6', name: 'Rhiannon Richards', role: 'Designer', area: 'Platform', product: 'Workers', managerName: 'Sarah Chen' },
  { id: '7', name: 'Leah Wang', role: 'Designer', area: 'Growth', product: 'Marketing', managerName: 'Sarah Chen' },
  { id: '8', name: 'Yelena Koslova', role: 'Designer', area: 'Core', product: 'DNS', managerName: 'Sarah Chen' },
  
  // Content Strategists
  { id: '9', name: 'Alex Johnson', role: 'Content', area: 'Core', product: 'Documentation', managerName: 'Mike Torres' },
  { id: '10', name: 'Sam Rodriguez', role: 'Content', area: 'Growth', product: 'Marketing', managerName: 'Mike Torres' },
  { id: '11', name: 'Jordan Kim', role: 'Content', area: 'Platform', product: 'Developer Docs', managerName: 'Mike Torres' },
  
  // Frontend Engineers
  { id: '12', name: 'Taylor Swift', role: 'Frontend', area: 'Core', product: 'Dashboard', managerName: 'Lisa Park' },
  { id: '13', name: 'Morgan Davis', role: 'Frontend', area: 'Platform', product: 'API Console', managerName: 'Lisa Park' },
  { id: '14', name: 'Casey Wilson', role: 'Frontend', area: 'Growth', product: 'Landing Pages', managerName: 'Lisa Park' },
  { id: '15', name: 'Riley Brown', role: 'Frontend', area: 'Core', product: 'Analytics', managerName: 'Lisa Park' }
];

// Sample SHIPs
export const ships: Ship[] = jiraShips as Ship[];

// Current assignments
export const assignments: Assignment[] = [
  // Q1 2026 assignments - Creating varied capacity levels
  
  // Overloaded team members (>100%)
  { personId: '1', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 80 }, // Tc Ye - Dashboard Redesign (L)
  { personId: '1', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 31 }, // Tc Ye - Additional project (M) - Total: 111%
  
  { personId: '11', shipId: 'SHIP-002', quarter: 'Q1 2026', loadPercent: 80 }, // Jordan Kim - API Docs (L)
  { personId: '11', shipId: 'SHIP-004', quarter: 'Q1 2026', loadPercent: 31 }, // Jordan Kim - Security (M) - Total: 111%
  
  // Borderline team members (85-100%)
  { personId: '2', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 31 }, // Thi Le - Dashboard (M)
  { personId: '2', shipId: 'SHIP-002', quarter: 'Q1 2026', loadPercent: 31 }, // Thi Le - API Docs (M)
  { personId: '2', shipId: 'SHIP-004', quarter: 'Q1 2026', loadPercent: 31 }, // Thi Le - Security (M) - Total: 93%
  
  { personId: '12', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 31 }, // Taylor Swift - Dashboard (M)
  { personId: '12', shipId: 'SHIP-004', quarter: 'Q1 2026', loadPercent: 31 }, // Taylor Swift - Security (M)
  { personId: '12', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 31 }, // Taylor Swift - Onboarding (M) - Total: 93%
  
  { personId: '9', shipId: 'SHIP-002', quarter: 'Q1 2026', loadPercent: 80 }, // Alex Johnson - API Docs (L)
  { personId: '9', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 8 }, // Alex Johnson - Additional (S) - Total: 88%
  
  // Healthy team members (≤85%)
  { personId: '3', shipId: 'SHIP-002', quarter: 'Q1 2026', loadPercent: 31 }, // Chris Nemeth - API Docs (M)
  { personId: '3', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 31 }, // Chris Nemeth - Onboarding (M) - Total: 62%
  
  { personId: '4', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 80 }, // Natalie Yeh - Onboarding (L) - Total: 80%
  
  { personId: '5', shipId: 'SHIP-004', quarter: 'Q1 2026', loadPercent: 8 }, // Nick Reed - Security (S)
  { personId: '5', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 31 }, // Nick Reed - Dashboard (M) - Total: 39%
  
  { personId: '13', shipId: 'SHIP-002', quarter: 'Q1 2026', loadPercent: 8 }, // Morgan Davis - API Docs (S)
  { personId: '13', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 31 }, // Morgan Davis - Dashboard (M) - Total: 39%
  
  { personId: '14', shipId: 'SHIP-003', quarter: 'Q1 2026', loadPercent: 80 }, // Casey Wilson - Onboarding (L) - Total: 80%
  
  { personId: '15', shipId: 'SHIP-001', quarter: 'Q1 2026', loadPercent: 31 }, // Riley Brown - Dashboard (M)
  { personId: '15', shipId: 'SHIP-004', quarter: 'Q1 2026', loadPercent: 31 }, // Riley Brown - Security (M) - Total: 62%
  
  // Some team members with no assignments (0% - healthy)
  // Rhiannon Richards (id: 6), Leah Wang (id: 7), Yelena Koslova (id: 8), Sam Rodriguez (id: 10)
];

// Areas and Products
export const areas = ['Core', 'Platform', 'Growth'];

export const productsByArea = {
  Core: ['Dashboard', 'Analytics', 'Security', 'DNS', 'Documentation', 'Platform', 'Access', 'Radar', 'SSL/TLS'],
  Platform: ['API', 'Workers', 'Developer Docs', 'API Console', 'Developer Tools', 'CLI', 'SDK', 'Terraform Provider'],
  Growth: ['Onboarding', 'Marketing', 'Landing Pages', 'Email Campaigns', 'User Acquisition', 'Conversion Optimization']
};

export const quarters = ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

// Utility functions for capacity calculations
export const calculatePersonLoad = (personId: string, quarter: string): number => {
  return assignments
    .filter(a => a.personId === personId && a.quarter === quarter)
    .reduce((total, assignment) => total + assignment.loadPercent, 0);
};

export const getCapacityStatus = (loadPercent: number): 'healthy' | 'borderline' | 'overloaded' => {
  if (loadPercent <= 85) return 'healthy';
  if (loadPercent <= 100) return 'borderline';
  return 'overloaded';
};

export const getCapacityColor = (status: 'healthy' | 'borderline' | 'overloaded'): string => {
  switch (status) {
    case 'healthy': return 'text-green-600 bg-green-100';
    case 'borderline': return 'text-amber-600 bg-amber-100';
    case 'overloaded': return 'text-red-600 bg-red-100';
  }
};
