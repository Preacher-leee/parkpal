
import { ParkingLocation } from '../types';

export const mockParkingHistory: ParkingLocation[] = [
  {
    id: '1',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    timestamp: Date.now() - 86400000, // 1 day ago
    notes: 'Parked near the coffee shop',
    address: '123 Main St, New York, NY',
  },
  {
    id: '2',
    coordinates: { latitude: 40.7130, longitude: -74.0070 },
    timestamp: Date.now() - 172800000, // 2 days ago
    notes: 'Street parking, 2 hour limit',
    address: '456 Broadway, New York, NY',
    duration: 120,
  },
  {
    id: '3',
    coordinates: { latitude: 40.7135, longitude: -74.0065 },
    timestamp: Date.now() - 432000000, // 5 days ago
    address: 'Central Parking Garage, Level 3, Spot 42',
  },
  {
    id: '4',
    coordinates: { latitude: 40.7140, longitude: -74.0080 },
    timestamp: Date.now() - 864000000, // 10 days ago
    notes: 'Remember to pay at the kiosk',
    address: '789 Park Ave, New York, NY',
    duration: 60,
  },
  {
    id: '5',
    coordinates: { latitude: 40.7145, longitude: -74.0090 },
    timestamp: Date.now() - 1728000000, // 20 days ago
    address: 'City Center Mall Parking, Section B',
  }
];
