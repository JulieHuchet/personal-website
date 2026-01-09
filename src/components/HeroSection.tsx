import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Card } from './ui';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();


  const handlePlanQuarter = () => {
    navigate('/quarter-planning');
  };

  const handleCheckAvailability = () => {
    navigate('/plan-ship');
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What do you want to do today?
        </h1>
        <p className="text-lg text-gray-600">
          Choose your primary workflow to get started with capacity planning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-stretch">
        {/* Plan My Quarter Card */}
        <div 
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer hover:ring-1 hover:ring-gray-300 flex"
          onClick={handlePlanQuarter}
        >
          <Card className="w-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Plan My Quarter</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                Use Plan My Quarter to create a realistic projection of your upcoming quarter based on available resources.
              </p>
              <button
                onClick={handlePlanQuarter}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Start quarter planning
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* Check Resources Availability Card */}
        <div 
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer hover:ring-1 hover:ring-gray-300 flex"
          onClick={handleCheckAvailability}
        >
          <Card className="w-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Check Resources Availability</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                Find out who's free to support an unplanned project.
              </p>
              <button
                onClick={handleCheckAvailability}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                Check availability
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
