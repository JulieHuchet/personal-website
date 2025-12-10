import React from 'react';

const RiskBadge = ({ level }) => {
  const riskConfig = {
    low: { color: 'bg-green-100 text-green-800', label: 'Low Risk' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Risk' },
    high: { color: 'bg-red-100 text-red-800', label: 'High Risk' }
  };

  const config = riskConfig[level];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const ScenarioCard = ({ scenario, scenarioKey }) => {
  const handleExportSummary = () => {
    const summary = `
Scenario ${scenarioKey}: ${scenario.name}
${scenario.description}

Metrics:
- Total Initiatives: ${scenario.metrics.initiativeCount}
- Total Effort: ${scenario.metrics.totalEffort}%
- Average Utilization: ${scenario.metrics.averageUtilization}%
- Risk Level: ${scenario.riskLevel}
${scenario.metrics.overloadedDesigners.length > 0 ? `- Overloaded Designers: ${scenario.metrics.overloadedDesigners.join(', ')}` : '- No overloaded designers'}

Included Initiatives:
${scenario.initiatives.map(init => `- ${init.name} (${init.size}, ${init.priority})`).join('\n')}
    `.trim();

    // Create a downloadable text file
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scenario-${scenarioKey.toLowerCase()}-summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            Scenario {scenarioKey}: {scenario.name}
          </h4>
          <p className="text-slate-600 text-sm mb-3">{scenario.description}</p>
          <RiskBadge level={scenario.riskLevel} />
        </div>
        <button
          onClick={handleExportSummary}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Export Summary
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{scenario.metrics.initiativeCount}</div>
          <div className="text-xs text-slate-600">Initiatives</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{scenario.metrics.totalEffort}%</div>
          <div className="text-xs text-slate-600">Total Effort</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{scenario.metrics.averageUtilization}%</div>
          <div className="text-xs text-slate-600">Avg Utilization</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-900">{scenario.metrics.overloadedDesigners.length}</div>
          <div className="text-xs text-slate-600">Overloaded</div>
        </div>
      </div>

      {scenario.metrics.overloadedDesigners.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-red-800 mb-1">Overloaded Designers:</div>
          <div className="text-sm text-red-700">{scenario.metrics.overloadedDesigners.join(', ')}</div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <h5 className="font-medium text-slate-900 mb-2">Included Initiatives:</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {scenario.initiatives.map(initiative => (
            <div key={initiative.id} className="flex justify-between items-center text-sm">
              <span className="text-slate-700">{initiative.name}</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  {initiative.size}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  initiative.priority === 'Must' ? 'bg-red-100 text-red-800' :
                  initiative.priority === 'Should' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {initiative.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PrioritizationScenariosPanel = ({ scenarios }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        🎯 Prioritization Scenarios
      </h2>

      <div className="space-y-6">
        {Object.entries(scenarios).map(([key, scenario]) => (
          <ScenarioCard
            key={key}
            scenario={scenario}
            scenarioKey={key}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Scenario Comparison Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Scenario A</strong> minimizes risk but may limit innovation opportunities</li>
          <li>• <strong>Scenario B</strong> balances delivery certainty with strategic bets</li>
          <li>• <strong>Scenario C</strong> maximizes coverage but increases execution risk</li>
          <li>• Consider team capacity, stakeholder expectations, and market timing</li>
        </ul>
      </div>
    </div>
  );
};

export default PrioritizationScenariosPanel;
