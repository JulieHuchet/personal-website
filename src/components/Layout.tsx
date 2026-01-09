import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, BarChart3, Home, Calendar, Layers, Package } from 'lucide-react';
import { Select } from './ui';
import { areas, productsByArea, quarters } from '../data/seedData';
import { usePlanningContext } from '../context/PlanningContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { quarter, area, product, setQuarter, setArea, setProduct } = usePlanningContext();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Overview', href: '/overview', icon: BarChart3 },
    { name: 'Quarter Planning', href: '/quarter-planning', icon: Calendar },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-14 px-4 flex items-center border-b border-gray-200">
            <img src="/cloudflare-logo.svg" alt="Cloudflare" className="h-9 w-9 mr-3" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Product Capacity</div>
              <div className="text-xs text-gray-500">Planner</div>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top context bar */}
          <header className="bg-gray-50/95 border-b border-gray-200 sticky top-0 z-30 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-14 flex items-center">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="w-full sm:w-72">
                      <Select
                        aria-label="Quarter"
                        value={quarter}
                        onChange={(e) => setQuarter(e.target.value)}
                        options={quarters.map(q => ({ value: q, label: q }))}
                        noBottomMargin
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <div className="w-full sm:w-80">
                      <Select
                        aria-label="Area"
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          setProduct('');
                        }}
                        options={[
                          { value: '', label: 'All Areas' },
                          ...areas.map(a => ({ value: a, label: a }))
                        ]}
                        noBottomMargin
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div className="w-full sm:w-80">
                      <Select
                        aria-label="Product"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        options={(() => {
                          const productOptions = area
                            ? (productsByArea as Record<string, string[]>)[area] || []
                            : Object.values(productsByArea).flat();

                          const unique = Array.from(new Set(productOptions));
                          return [
                            { value: '', label: 'All Products' },
                            ...unique.map(p => ({ value: p, label: p }))
                          ];
                        })()}
                        noBottomMargin
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
