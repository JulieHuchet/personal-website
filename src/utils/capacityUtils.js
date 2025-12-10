// Utility functions for capacity planning

// T-shirt size to effort percentage mapping
export const sizeToEffortPct = (size) => {
  const mapping = {
    'S': 8,
    'M': 31,
    'L': 80,
    'XL': 160
  };
  return mapping[size] || 0;
};

// Calculate designer workload based on assigned initiatives
export const calculateDesignerWorkload = (designerName, initiatives) => {
  return initiatives
    .filter(initiative => initiative.assignedDesigners.includes(designerName))
    .reduce((total, initiative) => total + sizeToEffortPct(initiative.size), 0);
};

// Calculate utilization percentage
export const calculateUtilization = (workload, availability) => {
  return availability > 0 ? (workload / availability) * 100 : 0;
};

// Get capacity status based on utilization
export const getCapacityStatus = (utilization) => {
  if (utilization <= 85) {
    return {
      status: 'healthy',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    };
  } else if (utilization <= 100) {
    return {
      status: 'near-capacity',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50'
    };
  } else {
    return {
      status: 'overloaded',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    };
  }
};

// Filter initiatives by designer
export const filterInitiativesByDesigner = (initiatives, selectedDesigners) => {
  if (!selectedDesigners || selectedDesigners.length === 0) {
    return initiatives;
  }
  return initiatives.filter(initiative =>
    initiative.assignedDesigners.some(designer => selectedDesigners.includes(designer))
  );
};

// Filter initiatives by product
export const filterInitiativesByProduct = (initiatives, selectedProduct) => {
  if (!selectedProduct) {
    return initiatives;
  }
  return initiatives.filter(initiative => initiative.product === selectedProduct);
};

// Generate prioritization scenarios
export const generateScenarios = (initiatives, designers) => {
  const scenarios = {
    A: {
      name: 'Must-Have Focus',
      description: 'Focus only on Must-have initiatives, park everything else for Q4.',
      initiatives: initiatives.filter(init => init.priority === 'Must'),
      riskLevel: 'low'
    },
    B: {
      name: 'Balanced Approach',
      description: 'Must-have initiatives + 1-2 strategic Should-have bets per product area.',
      initiatives: [],
      riskLevel: 'medium'
    },
    C: {
      name: 'Distributed Coverage',
      description: 'Shallow coverage across multiple initiatives, higher risk.',
      initiatives: initiatives,
      riskLevel: 'high'
    }
  };

  // For scenario B, include Must-haves and limited Should-haves
  const mustHaves = initiatives.filter(init => init.priority === 'Must');
  const shouldHaves = initiatives.filter(init => init.priority === 'Should');
  
  // Group should-haves by area and take max 2 per area
  const shouldHavesByArea = shouldHaves.reduce((acc, init) => {
    if (!acc[init.area]) acc[init.area] = [];
    acc[init.area].push(init);
    return acc;
  }, {});

  const limitedShouldHaves = Object.values(shouldHavesByArea)
    .flatMap(areaInitiatives => areaInitiatives.slice(0, 2));

  scenarios.B.initiatives = [...mustHaves, ...limitedShouldHaves];

  // Calculate metrics for each scenario
  Object.keys(scenarios).forEach(key => {
    const scenario = scenarios[key];
    const totalEffort = scenario.initiatives.reduce((sum, init) => 
      sum + sizeToEffortPct(init.size), 0
    );
    
    const designerUtilizations = designers.map(designer => {
      const workload = calculateDesignerWorkload(designer.name, scenario.initiatives);
      const utilization = calculateUtilization(workload, designer.availability);
      return { designer: designer.name, utilization };
    });

    const averageUtilization = designerUtilizations.reduce((sum, d) => 
      sum + d.utilization, 0
    ) / designers.length;

    const overloadedDesigners = designerUtilizations
      .filter(d => d.utilization > 100)
      .map(d => d.designer);

    scenario.metrics = {
      totalEffort,
      averageUtilization: Math.round(averageUtilization),
      overloadedDesigners,
      initiativeCount: scenario.initiatives.length
    };
  });

  return scenarios;
};

// Generate talking points based on current state
export const generateTalkingPoints = (initiatives, designers, selectedProduct, capacityAlerts) => {
  const points = [];

  // Capacity-based talking points
  if (capacityAlerts.overloaded.length > 0) {
    points.push({
      category: 'Critical Capacity',
      point: `🚨 ${capacityAlerts.overloaded.join(', ')} are overloaded. Immediate rebalancing required.`
    });
  }

  if (capacityAlerts.nearCapacity.length > 0) {
    points.push({
      category: 'Capacity Warning',
      point: `⚠️ ${capacityAlerts.nearCapacity.join(', ')} are near capacity. Monitor closely.`
    });
  }

  // Initiative-based talking points
  const mustHaves = initiatives.filter(init => init.priority === 'Must');
  const xlInitiatives = initiatives.filter(init => init.size === 'XL');

  if (xlInitiatives.length > 0) {
    points.push({
      category: 'Scope Negotiation',
      point: `Can we break ${xlInitiatives.map(i => i.name).join(', ')} into testable smaller pieces?`
    });
  }

  if (mustHaves.length > 3) {
    points.push({
      category: 'Priority Forcing',
      point: `We have ${mustHaves.length} Must-have initiatives. If we could only do 2-3 well, which ones?`
    });
  }

  // Product-specific talking points
  if (selectedProduct) {
    const productInitiatives = initiatives.filter(init => init.product === selectedProduct);
    const notReadyCount = productInitiatives.filter(init => init.designReadiness === 'N').length;
    
    if (notReadyCount > 0) {
      points.push({
        category: 'Design Readiness',
        point: `${notReadyCount} ${selectedProduct} initiatives lack clear design requirements.`
      });
    }
  }

  // Generic conversation starters
  points.push(
    {
      category: 'Timeline Reality',
      point: "What's the real consequence if this ships in Q4 instead of Q3?"
    },
    {
      category: 'Minimum Viable',
      point: "What's the minimum viable version that still delivers value?"
    },
    {
      category: 'Trade-off Clarity',
      point: "If we keep X, we need to move Y to Q4. Are you aligned?"
    }
  );

  return points;
};
