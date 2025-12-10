import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IntegrationBar from './components/IntegrationBar';
import DesignerCapacityPanel from './components/DesignerCapacityPanel';
import CurrentInitiativesPanel from './components/CurrentInitiativesPanel';
import CapacityAlertsPanel from './components/CapacityAlertsPanel';
import PrioritizationScenariosPanel from './components/PrioritizationScenariosPanel';
import ProductContextPanel from './components/ProductContextPanel';
import AddInitiativePanel from './components/AddInitiativePanel';
import TalkingPointsPanel from './components/TalkingPointsPanel';

import { designers, sampleInitiatives, areas, products, productManagers } from './data/mockData';
import { 
  calculateDesignerWorkload, 
  calculateUtilization, 
  generateScenarios,
  generateTalkingPoints 
} from './utils/capacityUtils';

function App() {
  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState('Q3');
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productContext, setProductContext] = useState({
    area: '',
    product: '',
    pms: []
  });
  const [initiatives, setInitiatives] = useState([]);
  const [viewMode, setViewMode] = useState('designer'); // 'designer' or 'product'

  // Initialize with sample data
  useEffect(() => {
    setInitiatives(sampleInitiatives);
  }, []);

  // Calculate capacity alerts
  const capacityAlerts = {
    overloaded: designers.filter(designer => {
      const workload = calculateDesignerWorkload(designer.name, initiatives);
      const utilization = calculateUtilization(workload, designer.availability);
      return utilization > 100;
    }).map(d => d.name),
    nearCapacity: designers.filter(designer => {
      const workload = calculateDesignerWorkload(designer.name, initiatives);
      const utilization = calculateUtilization(workload, designer.availability);
      return utilization > 85 && utilization <= 100;
    }).map(d => d.name)
  };

  // Generate scenarios
  const scenarios = generateScenarios(initiatives, designers);

  // Generate talking points
  const talkingPoints = generateTalkingPoints(
    initiatives, 
    designers, 
    selectedProduct, 
    capacityAlerts
  );

  // Handler functions
  const handleAddInitiative = (newInitiative) => {
    const initiative = {
      ...newInitiative,
      id: Date.now()
    };
    setInitiatives([...initiatives, initiative]);
  };

  const handleRemoveInitiative = (id) => {
    setInitiatives(initiatives.filter(init => init.id !== id));
  };

  const handleProductContextChange = (context) => {
    setProductContext(context);
    setSelectedProduct(context.product);
  };

  const handleLoadSampleData = () => {
    setInitiatives(sampleInitiatives);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <Header />
        
        {/* Integration Bar */}
        <IntegrationBar 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          onLoadSampleData={handleLoadSampleData}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DesignerCapacityPanel
              designers={designers}
              initiatives={initiatives}
              selectedDesigners={selectedDesigners}
              onDesignersChange={setSelectedDesigners}
            />
            
            <CurrentInitiativesPanel
              initiatives={initiatives}
              selectedDesigners={selectedDesigners}
              selectedProduct={selectedProduct}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onRemoveInitiative={handleRemoveInitiative}
            />
            
            <CapacityAlertsPanel
              capacityAlerts={capacityAlerts}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProductContextPanel
              areas={areas}
              products={products}
              productManagers={productManagers}
              productContext={productContext}
              onProductContextChange={handleProductContextChange}
            />
            
            <AddInitiativePanel
              areas={areas}
              products={products}
              designers={designers}
              productContext={productContext}
              onAddInitiative={handleAddInitiative}
            />
            
            <TalkingPointsPanel
              talkingPoints={talkingPoints}
            />
          </div>
        </div>

        {/* Full Width Scenarios Panel */}
        <PrioritizationScenariosPanel
          scenarios={scenarios}
        />
      </div>
    </div>
  );
}

export default App;
