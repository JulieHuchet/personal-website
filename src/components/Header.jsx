import React from 'react';
import { DashboardCard, CardContent } from './CloudflareUI';
import { AuthButton } from './AuthButton';

const Header = () => {
  return (
    <DashboardCard className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Design Capacity Planner
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Powered by Cloudflare
              </p>
            </div>
          </div>
          <AuthButton />
        </div>
        <p className="text-gray-600 text-base leading-relaxed">
          Assess workload, negotiate priorities, and drive focused planning conversations with product managers. 
          Built with authentic Cloudflare dashboard components for optimal performance and user experience.
        </p>
      </CardContent>
    </DashboardCard>
  );
};

export default Header;
