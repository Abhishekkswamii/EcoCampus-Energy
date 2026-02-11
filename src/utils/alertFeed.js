import { detectAnomalies } from './detectionLogic';
import { aggregateByCampus, aggregateByBuilding } from '../data/energyData';
import { campusStructure } from '../data/campusStructure';

const severityRank = { high: 0, medium: 1, low: 2 };

const normalizeAlerts = (alerts, meta) => {
  const fallbackTimestamp = meta.fallbackTimestamp || new Date().toISOString();
  return alerts.map((alert, index) => {
    const timestamp = alert.timestamp || fallbackTimestamp;
    return {
      ...alert,
      id: `${meta.scope}-${meta.entityId || 'campus'}-${alert.type}-${timestamp}-${index}`,
      scope: meta.scope,
      entityId: meta.entityId || null,
      location: alert.location || meta.location,
      timestamp,
    };
  });
};

export const buildUnifiedAlertFeed = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const campusSeries = aggregateByCampus(data);
  const campusAlerts = normalizeAlerts(detectAnomalies(campusSeries), {
    scope: 'campus',
    location: 'Campus',
    fallbackTimestamp: campusSeries[campusSeries.length - 1]?.timestamp,
  });

  const buildingAlerts = campusStructure.buildings.flatMap((building) => {
    const roomIds = building.rooms.map((room) => room.id);
    const buildingData = data.filter((record) => roomIds.includes(record.roomId));
    const buildingSeries = aggregateByBuilding(buildingData).filter(
      (record) => record.buildingId === building.id
    );
    return normalizeAlerts(detectAnomalies(buildingSeries), {
      scope: 'building',
      entityId: building.id,
      location: building.name,
      fallbackTimestamp: buildingSeries[buildingSeries.length - 1]?.timestamp,
    });
  });

  const roomAlerts = campusStructure.buildings.flatMap((building) =>
    building.rooms.flatMap((room) => {
      const roomData = data.filter((record) => record.roomId === room.id);
      return normalizeAlerts(detectAnomalies(roomData), {
        scope: 'room',
        entityId: room.id,
        location: room.name,
        fallbackTimestamp: roomData[roomData.length - 1]?.timestamp,
      });
    })
  );

  return [...campusAlerts, ...buildingAlerts, ...roomAlerts].sort((a, b) => {
    const severityDelta = severityRank[a.severity] - severityRank[b.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const formatAlertType = (type) => {
  if (type === 'after-hours') return 'After-hours';
  if (type === 'wasteful-pattern') return 'Wasteful pattern';
  if (type === 'spike') return 'Spike';
  return 'Alert';
};
