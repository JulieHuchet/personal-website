
import { Routes, Route } from "react-router-dom";

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { PlanShip } from './pages/PlanShip';
import { PersonDetail } from './pages/PersonDetail';
import { Approvals } from './pages/Approvals';
import { QuarterPlanningFlow } from './pages/QuarterPlanningFlow';
import { JiraQuarter } from "./pages/JiraQuarter";
import { AuthProvider } from './components/AuthProvider';
import { AuthStateManager } from './components/AuthStateManager';
import { PlanningContextProvider } from './context/PlanningContext';

function App() {
  return (
    <AuthProvider>
      <AuthStateManager>
        <PlanningContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/plan-ship" element={<PlanShip />} />
            <Route path="/quarter-planning" element={<QuarterPlanningFlow />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/person/:id" element={<PersonDetail />} />
            <Route path="/jira" element={<JiraQuarter />} />
            <Route path="/jira/:year/:quarter" element={<JiraQuarter />} />
          </Routes>
        </PlanningContextProvider>
      </AuthStateManager>
    </AuthProvider>
  );
}

export default App;
