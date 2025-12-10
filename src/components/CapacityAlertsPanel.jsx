import React from 'react';

const AlertCard = ({ type, title, message, icon }) => {
  const alertStyles = {
    danger: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${alertStyles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

const CapacityAlertsPanel = ({ capacityAlerts }) => {
  const hasAlerts = capacityAlerts.overloaded.length > 0 || capacityAlerts.nearCapacity.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        ⚠️ Capacity Alerts
      </h2>

      <div className="space-y-3">
        {capacityAlerts.overloaded.length > 0 && (
          <AlertCard
            type="danger"
            icon="🚨"
            title="Critical Overload"
            message={`${capacityAlerts.overloaded.join(', ')} exceed 100% capacity. Immediate rebalancing required.`}
          />
        )}

        {capacityAlerts.nearCapacity.length > 0 && (
          <AlertCard
            type="warning"
            icon="⚠️"
            title="Near Capacity"
            message={`${capacityAlerts.nearCapacity.join(', ')} are 85-100% utilized. Monitor closely.`}
          />
        )}

        {!hasAlerts && (
          <AlertCard
            type="success"
            icon="✅"
            title="Healthy Capacity"
            message="All designers are within healthy capacity ranges."
          />
        )}
      </div>

      {hasAlerts && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <h4 className="font-medium text-slate-900 mb-2">Recommended Actions:</h4>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>• Review initiative priorities and consider deferring lower-priority items</li>
            <li>• Explore opportunities to redistribute work across the team</li>
            <li>• Consider breaking large initiatives into smaller, manageable pieces</li>
            <li>• Discuss timeline flexibility with product managers</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CapacityAlertsPanel;
