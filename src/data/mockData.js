// Mock data for the capacity planner

export const areas = [
  'Experience Lab',
  'Email Security',
  'Devices & Filtering',
  'Access',
  'Data Security',
  'Network Services'
];

export const products = {
  'Experience Lab': ['User Research Platform', 'Design System', 'Prototyping Tools'],
  'Email Security': ['Email Gateway', 'Threat Detection', 'Policy Engine'],
  'Devices & Filtering': ['Gateway DNS', 'Device Management', 'Content Filtering'],
  'Access': ['ZTIA Mobile', 'Access Policies', 'Identity Management'],
  'Data Security': ['DLP Engine', 'Data Classification', 'Compliance Dashboard'],
  'Network Services': ['Magic WAN', 'Network Analytics', 'Traffic Management']
};

export const productManagers = {
  'Experience Lab': ['Sarah Chen', 'Mike Rodriguez'],
  'Email Security': ['Jennifer Kim', 'David Park'],
  'Devices & Filtering': ['Lisa Wang', 'Tom Anderson'],
  'Access': ['Rachel Green', 'Alex Johnson'],
  'Data Security': ['Maria Garcia', 'Chris Taylor'],
  'Network Services': ['Kevin Liu', 'Amanda Davis']
};

export const designers = [
  { id: 1, name: 'Tc Ye', availability: 100 },
  { id: 2, name: 'Thi Le', availability: 100 },
  { id: 3, name: 'Chris Nemeth', availability: 67 }, // Out 4 weeks in Q4
  { id: 4, name: 'Natalie Yeh', availability: 100 },
  { id: 5, name: 'Nick Reed', availability: 100 },
  { id: 6, name: 'Rhiannon Richards', availability: 100 },
  { id: 7, name: 'Leah Wang', availability: 75 }, // Out 3 weeks in Q4
  { id: 8, name: 'Yelena Koslova', availability: 100 }
];

export const timeframes = ['Q1', 'Q2', 'Q3', 'Q4'];

export const priorities = [
  { value: 'Must', label: 'Must Have', color: 'bg-red-100 text-red-800' },
  { value: 'Should', label: 'Should Have', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Nice', label: 'Nice to Have', color: 'bg-blue-100 text-blue-800' }
];

export const tShirtSizes = [
  { value: 'S', label: 'S (8% - Small enhancement)', effort: 8 },
  { value: 'M', label: 'M (31% - Medium feature)', effort: 31 },
  { value: 'L', label: 'L (80% - Large project)', effort: 80 },
  { value: 'XL', label: 'XL (160% - Major initiative)', effort: 160 }
];

export const designReadinessOptions = [
  { value: 'Y', label: 'Yes - Ready to start' },
  { value: 'N', label: 'No - Needs definition' },
  { value: 'P', label: 'Partial - Some specs ready' }
];

export const sampleInitiatives = [
  {
    id: 1,
    jiraKey: 'EXP-123',
    name: 'ZTIA Mobile App Redesign',
    area: 'Access',
    product: 'ZTIA Mobile',
    assignedDesigners: ['Tc Ye'],
    size: 'L',
    priority: 'Must',
    timeframe: 'Q3',
    designReadiness: 'Y',
    description: 'Complete redesign of the mobile application interface'
  },
  {
    id: 2,
    jiraKey: 'DEV-456',
    name: 'Gateway DNS Performance UI',
    area: 'Devices & Filtering',
    product: 'Gateway DNS',
    assignedDesigners: ['Thi Le'],
    size: 'M',
    priority: 'Should',
    timeframe: 'Q3',
    designReadiness: 'N',
    description: 'New dashboard for DNS performance monitoring'
  },
  {
    id: 3,
    jiraKey: 'EMAIL-789',
    name: 'Email Security Dashboard V2',
    area: 'Email Security',
    product: 'Threat Detection',
    assignedDesigners: ['Chris Nemeth'],
    size: 'XL',
    priority: 'Must',
    timeframe: 'Q3',
    designReadiness: 'Y',
    description: 'Next generation email security dashboard'
  },
  {
    id: 4,
    jiraKey: 'DATA-101',
    name: 'DLP Policy Builder',
    area: 'Data Security',
    product: 'DLP Engine',
    assignedDesigners: ['Natalie Yeh'],
    size: 'L',
    priority: 'Should',
    timeframe: 'Q3',
    designReadiness: 'P',
    description: 'Visual policy builder for data loss prevention'
  },
  {
    id: 5,
    jiraKey: 'NET-202',
    name: 'Magic WAN Onboarding Flow',
    area: 'Network Services',
    product: 'Magic WAN',
    assignedDesigners: ['Nick Reed'],
    size: 'M',
    priority: 'Must',
    timeframe: 'Q3',
    designReadiness: 'Y',
    description: 'Streamlined onboarding experience for Magic WAN'
  }
];

// Mock Jira ticket data for auto-fill functionality
export const mockJiraTickets = {
  'EXP-124': {
    name: 'User Research Dashboard',
    description: 'Analytics dashboard for user research insights',
    area: 'Experience Lab',
    product: 'User Research Platform'
  },
  'EMAIL-790': {
    name: 'Threat Intelligence Feed',
    description: 'Real-time threat intelligence visualization',
    area: 'Email Security',
    product: 'Threat Detection'
  },
  'ACCESS-303': {
    name: 'Identity Verification Flow',
    description: 'Enhanced identity verification process',
    area: 'Access',
    product: 'Identity Management'
  }
};
