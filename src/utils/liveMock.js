import { campusStructure } from '../data/campusStructure';

const roomNameById = new Map(
  campusStructure.buildings.flatMap((building) =>
    building.rooms.map((room) => [room.id, room.name])
  )
);

const toHourStart = (date) => {
  const hourStart = new Date(date);
  hourStart.setMinutes(0, 0, 0);
  return hourStart;
};

export const advanceLiveEnergy = (data, options = {}) => {
  const { now = new Date(), windowDays = 30 } = options;
  const hourStamp = toHourStart(now);
  const hourIso = hourStamp.toISOString();
  const cutoff = new Date(hourStamp);
  cutoff.setDate(cutoff.getDate() - windowDays);

  const latestByRoom = new Map();
  data.forEach((record) => {
    if (!record?.roomId) return;
    const prev = latestByRoom.get(record.roomId);
    if (!prev || new Date(record.timestamp) > new Date(prev.timestamp)) {
      latestByRoom.set(record.roomId, record);
    }
  });

  const cleanedData = data.filter((record) => {
    const time = new Date(record.timestamp);
    if (Number.isNaN(time.getTime())) return false;
    if (time < cutoff) return false;
    return record.timestamp !== hourIso;
  });

  const newRecords = Array.from(roomNameById.entries()).map(([roomId, roomName]) => {
    const base = latestByRoom.get(roomId);
    const baseConsumption = base?.consumption ?? 40 + Math.random() * 40;
    const variation = 0.92 + Math.random() * 0.16;
    let consumption = baseConsumption * variation;

    if (Math.random() < 0.03) {
      consumption *= 1.8 + Math.random() * 0.7;
    }

    return {
      timestamp: hourIso,
      consumption: Math.max(5, Math.round(consumption * 10) / 10),
      roomId,
      roomName,
      hour: hourStamp.getHours(),
      day: hourIso.split('T')[0],
    };
  });

  return [...cleanedData, ...newRecords];
};
