import React from 'react';
import { timeframes } from '../data/mockData';
import { DashboardCard, CardContent, Button, Badge, Select } from './CloudflareUI';

const IntegrationBar = ({ selectedTimeframe, onTimeframeChange, onLoadSampleData }) => {
  const handleJiraIntegration = () => {
    alert('Jira Integration:\n\n1. Install Jira REST API connector\n2. Configure authentication (API token)\n3. Map Jira fields to capacity planner\n4. Set up automated sync\n\nRequired Jira fields:\n- Epic Name\n- T-shirt Size (custom field)\n- Priority\n- Assignee\n- Target Quarter');
  };

  const handleSmartsheetIntegration = () => {
    alert('Smartsheet Integration:\n\n1. Install Smartsheet API connector\n2. Configure authentication (access token)\n3. Map sheet columns to capacity planner\n4. Set up automated sync\n\nRequired Smartsheet columns:\n- Initiative Name\n- Product Area\n- T-shirt Size\n- Priority\n- Assigned Designer\n- Target Quarter');
  };

  return (
    <DashboardCard accent className="mb-6">
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-semibold text-lg">Data Integration Setup</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Planning for:</span>
            <Select 
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="w-auto min-w-[100px]"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe} value={timeframe}>{timeframe}</option>
              ))}
            </Select>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <Badge variant="info">All Product Areas</Badge>
          <div className="w-px h-6 bg-gray-300"></div>
          <Badge variant="info">All Designers</Badge>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleJiraIntegration}
            variant="primary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          >
            Connect Jira
          </Button>
          <Button 
            onClick={handleSmartsheetIntegration}
            variant="secondary"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            }
          >
            Connect Smartsheet
          </Button>
          <Button 
            onClick={onLoadSampleData}
            variant="ghost"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          >
            Load Sample Data
          </Button>
        </div>
      </CardContent>
    </DashboardCard>
  );
};

export default IntegrationBar;
