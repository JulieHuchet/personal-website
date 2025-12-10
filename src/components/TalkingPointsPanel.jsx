import React, { useState } from 'react';

const TalkingPointsPanel = ({ talkingPoints }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const groupedPoints = talkingPoints.reduce((acc, point) => {
    if (!acc[point.category]) {
      acc[point.category] = [];
    }
    acc[point.category].push(point.point);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          🗣️ Talking Points
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {Object.entries(groupedPoints).map(([category, points]) => (
            <div key={category} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">{category}</h4>
              <ul className="space-y-2">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="mt-1">💬</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-3">General Conversation Starters</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1">💡</span>
                <span><strong>Resource Reality:</strong> "Given our current capacity, what would success look like with 80% of the planned scope?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">💡</span>
                <span><strong>Quality vs Speed:</strong> "Would you prefer fewer initiatives done excellently, or more initiatives with acceptable quality?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">💡</span>
                <span><strong>Dependency Check:</strong> "What external dependencies could derail these timelines, and how do we mitigate them?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">💡</span>
                <span><strong>Success Metrics:</strong> "How will we measure success for each initiative beyond just shipping?"</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips for PM Conversations</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Lead with data: Show capacity numbers and utilization percentages</li>
              <li>• Offer alternatives: Don't just say "no" - propose different approaches</li>
              <li>• Focus on outcomes: Tie capacity decisions to business impact</li>
              <li>• Document decisions: Follow up conversations with written summaries</li>
              <li>• Regular check-ins: Schedule weekly capacity reviews during busy periods</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalkingPointsPanel;
