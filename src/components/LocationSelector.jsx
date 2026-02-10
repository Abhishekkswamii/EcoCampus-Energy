import React from 'react';
import { getAllBuildings, getRoomsByBuilding } from '../data/campusStructure';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DomainRoundedIcon from '@mui/icons-material/DomainRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

const LocationSelector = ({ level, selectedBuilding, selectedRoom, onLevelChange, onBuildingChange, onRoomChange }) => {
  const buildings = getAllBuildings();
  const rooms = selectedBuilding ? getRoomsByBuilding(selectedBuilding) : [];
  
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle2" color="text.secondary">
          Location Level
        </Typography>

        <ToggleButtonGroup
          exclusive
          value={level}
          onChange={(_, next) => next && onLevelChange(next)}
          fullWidth
          size="small"
        >
          <ToggleButton value="campus" sx={{ gap: 0.75 }}>
            <ApartmentRoundedIcon fontSize="small" />
            Campus
          </ToggleButton>
          <ToggleButton value="building" sx={{ gap: 0.75 }}>
            <DomainRoundedIcon fontSize="small" />
            Building
          </ToggleButton>
          <ToggleButton value="room" sx={{ gap: 0.75 }}>
            <MeetingRoomRoundedIcon fontSize="small" />
            Room
          </ToggleButton>
        </ToggleButtonGroup>

        {(level === 'building' || level === 'room') && (
          <FormControl fullWidth size="small">
            <InputLabel id="building-select-label">Building</InputLabel>
            <Select
              labelId="building-select-label"
              value={selectedBuilding || ''}
              label="Building"
              onChange={(e) => onBuildingChange(e.target.value)}
            >
              <MenuItem value="">
                <em>Choose a building…</em>
              </MenuItem>
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {level === 'room' && selectedBuilding && (
          <FormControl fullWidth size="small">
            <InputLabel id="room-select-label">Room</InputLabel>
            <Select
              labelId="room-select-label"
              value={selectedRoom || ''}
              label="Room"
              onChange={(e) => onRoomChange(e.target.value)}
            >
              <MenuItem value="">
                <em>Choose a room…</em>
              </MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>
    </Paper>
  );
};

export default LocationSelector;
