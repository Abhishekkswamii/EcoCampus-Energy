import React, { useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Alerts from './components/Alerts';
import Usage from './components/Usage';
import { ENERGY_DATA } from './data/energyData';
import { buildUnifiedAlertFeed } from './utils/alertFeed';
import { advanceLiveEnergy } from './utils/liveMock';
import { getTheme } from './theme';

const LIVE_REFRESH_MS = 5000;
const LIVE_WINDOW_DAYS = 30;

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [energyData, setEnergyData] = useState(() => ENERGY_DATA);
  const [themeMode, setThemeMode] = useState(() => {
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'dark';
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEnergyData((prev) => advanceLiveEnergy(prev, { windowDays: LIVE_WINDOW_DAYS }));
    }, LIVE_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const alertFeed = useMemo(() => buildUnifiedAlertFeed(energyData), [energyData]);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const handleToggleTheme = () =>
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));

  const sharedProps = {
    activeView,
    onViewChange: setActiveView,
    alertFeed,
    themeMode,
    onToggleTheme: handleToggleTheme,
  };

  let viewContent = (
    <Dashboard
      {...sharedProps}
      energyData={energyData}
    />
  );

  if (activeView === 'alerts') {
    viewContent = <Alerts {...sharedProps} />;
  }

  if (activeView === 'analytics') {
    viewContent = <Analytics {...sharedProps} />;
  }

  if (activeView === 'usage') {
    viewContent = <Usage {...sharedProps} energyData={energyData} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {viewContent}
    </ThemeProvider>
  );
}

export default App;
