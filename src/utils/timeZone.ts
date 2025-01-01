import { formatInTimeZone } from 'date-fns-tz';
import { parse } from 'date-fns';

// Map major US cities to their time zones
const cityTimeZones: Record<string, string> = {
  'New York': 'America/New_York',
  'Los Angeles': 'America/Los_Angeles',
  'Chicago': 'America/Chicago',
  'Houston': 'America/Chicago',
  'Phoenix': 'America/Phoenix',
  'Philadelphia': 'America/New_York',
  'San Antonio': 'America/Chicago',
  'San Diego': 'America/Los_Angeles',
  'Dallas': 'America/Chicago',
  'San Jose': 'America/Los_Angeles',
  'San Francisco': 'America/Los_Angeles',
  // Add more cities as needed
};

// Default to Eastern Time if city not found
const DEFAULT_TIMEZONE = 'America/New_York';

export const getCityTimeZone = (city: string): string => {
  // Try to find an exact match
  const timeZone = cityTimeZones[city];
  if (timeZone) return timeZone;

  // Check if the city name contains any known city
  const matchingCity = Object.keys(cityTimeZones).find(knownCity => 
    city.toLowerCase().includes(knownCity.toLowerCase())
  );
  
  return matchingCity ? cityTimeZones[matchingCity] : DEFAULT_TIMEZONE;
};

export const convertLocalToUTC = (timeString: string, city: string): string => {
  const timeZone = getCityTimeZone(city);
  
  // Create a date object for today with the selected time
  const today = new Date();
  const selectedTime = parse(timeString, 'HH:mm', today);
  
  // Format in UTC
  return formatInTimeZone(selectedTime, timeZone, 'HH:mm');
};

export const convertUTCToLocal = (timeString: string | null, city: string): string => {
  if (!timeString) return '09:00';
  
  const timeZone = getCityTimeZone(city);
  
  // Create a date object for today with the stored UTC time
  const today = new Date();
  const utcTime = parse(timeString, 'HH:mm', today);
  
  // Format in local time zone
  return formatInTimeZone(utcTime, timeZone, 'HH:mm');
};