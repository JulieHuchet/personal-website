import React, { useState } from 'react';
import { areas, tShirtSizes, priorities, designReadinessOptions, timeframes, mockJiraTickets } from '../data/mockData';

const MultiSelectDropdown = ({ options, selectedValues, onSelectionChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <span className="text-sm text-slate-700">
          {selectedValues.length === 0 
            ? placeholder
            : selectedValues.length === 1
            ? selectedValues[0]
            : `${selectedValues.length} selected`
          }
        </span>
        <span className="float-right">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const AddInitiativePanel = ({ areas, products, designers, productContext, onAddInitiative }) => {
  const [formData, setFormData] = useState({
    jiraKey: '',
    name: '',
    area: productContext.area || '',
    product: productContext.product || '',
    assignedDesigners: [],
    size: '',
    priority: '',
    timeframe: 'Q3',
    designReadiness: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update form when product context changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      area: productContext.area || prev.area,
      product: productContext.product || prev.product
    }));
  }, [productContext]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset product when area changes
    if (field === 'area') {
      setFormData(prev => ({
        ...prev,
        product: ''
      }));
    }
  };

  const handleFetchFromJira = async () => {
    if (!formData.jiraKey.trim()) {
      alert('Please enter a Jira ticket ID');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTicket = mockJiraTickets[formData.jiraKey];
    
    if (mockTicket) {
      setFormData(prev => ({
        ...prev,
        name: mockTicket.name,
        description: mockTicket.description,
        area: mockTicket.area,
        product: mockTicket.product
      }));
      alert('Ticket data fetched successfully!');
    } else {
      alert('Ticket not found. This is a mock implementation - only EXP-124, EMAIL-790, and ACCESS-303 are available.');
    }
    
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.area || !formData.product || 
        formData.assignedDesigners.length === 0 || !formData.size || 
        !formData.priority || !formData.designReadiness) {
      alert('Please fill in all required fields');
      return;
    }

    const newInitiative = {
      ...formData,
      jiraKey: formData.jiraKey || `AUTO-${Date.now()}`
    };

    onAddInitiative(newInitiative);
    
    // Reset form
    setFormData({
      jiraKey: '',
      name: '',
      area: productContext.area || '',
      product: productContext.product || '',
      assignedDesigners: [],
      size: '',
      priority: '',
      timeframe: 'Q3',
      designReadiness: '',
      description: ''
    });

    alert('Initiative added successfully!');
  };

  const availableProducts = formData.area ? products[formData.area] || [] : [];
  const designerNames = designers.map(d => d.name);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        ➕ Add Initiative
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Jira Integration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Jira Ticket ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.jiraKey}
              onChange={(e) => handleInputChange('jiraKey', e.target.value)}
              placeholder="e.g., EXP-124"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleFetchFromJira}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors"
            >
              {isLoading ? 'Fetching...' : 'Fetch from Jira'}
            </button>
          </div>
        </div>

        {/* Initiative Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Initiative Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Area and Product */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Area *
            </label>
            <select
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Area</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product *
            </label>
            <select
              value={formData.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              disabled={!formData.area}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
            >
              <option value="">Select Product</option>
              {availableProducts.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assigned Designers */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Assigned Designer(s) *
          </label>
          <MultiSelectDropdown
            options={designerNames}
            selectedValues={formData.assignedDesigners}
            onSelectionChange={(designers) => handleInputChange('assignedDesigners', designers)}
            placeholder="Select designer(s)"
          />
        </div>

        {/* Size, Priority, Timeframe */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              T-shirt Size *
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Size</option>
              {tShirtSizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Priority</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Timeframe
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe} value={timeframe}>{timeframe}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Design Readiness */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Design Readiness *
          </label>
          <select
            value={formData.designReadiness}
            onChange={(e) => handleInputChange('designReadiness', e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Readiness</option>
            {designReadinessOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Brief description of the initiative..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Add Initiative
        </button>
      </form>
    </div>
  );
};

export default AddInitiativePanel;
