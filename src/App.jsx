import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import { ENERGY_DATA } from './data/energyData';
import { buildUnifiedAlertFeed } from './utils/alertFeed';
import { advanceLiveEnergy } from './utils/liveMock';

const LIVE_REFRESH_MS = 5000;
const LIVE_WINDOW_DAYS = 30;

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [energyData, setEnergyData] = useState(() => ENERGY_DATA);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEnergyData((prev) => advanceLiveEnergy(prev, { windowDays: LIVE_WINDOW_DAYS }));
    }, LIVE_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, []);

  const alertFeed = useMemo(() => buildUnifiedAlertFeed(energyData), [energyData]);

  if (activeView === 'alerts') {
    return <Alerts activeView={activeView} onViewChange={setActiveView} alertFeed={alertFeed} />;
  }

  if (activeView === 'analytics') {
    return <Analytics activeView={activeView} onViewChange={setActiveView} alertFeed={alertFeed} />;
  }

  return (
    <Dashboard
      activeView={activeView}
      onViewChange={setActiveView}
      alertFeed={alertFeed}
      energyData={energyData}
    />
  );
}

export default App;
