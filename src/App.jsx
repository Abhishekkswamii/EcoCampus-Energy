import React, { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import { ENERGY_DATA } from './data/energyData';
import { buildUnifiedAlertFeed } from './utils/alertFeed';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const alertFeed = useMemo(() => buildUnifiedAlertFeed(ENERGY_DATA), []);

  if (activeView === 'alerts') {
    return <Alerts activeView={activeView} onViewChange={setActiveView} alertFeed={alertFeed} />;
  }

  if (activeView === 'analytics') {
    return <Analytics activeView={activeView} onViewChange={setActiveView} alertFeed={alertFeed} />;
  }

  return <Dashboard activeView={activeView} onViewChange={setActiveView} alertFeed={alertFeed} />;
}

export default App;
