import axios from 'axios'


const getCoordinates = async (postalCode) => {
  // Replace this with actual logic to get coordinates
  const postalCodeCoordinates = {
    "440001": { latitude: 25.939839, longitude: 75.835724 },
    "110085": { latitude: 28.704060, longitude: 77.102493 },
    // Add more postal codes and their coordinates as needed
  };
  return postalCodeCoordinates[postalCode] || { latitude: 0, longitude: 0 };// { latitude: 12.34, longitude: 56.78 }
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
const calculateShippingCost = (distance, weight) => {
  // Define your pricing rules here
  const baseCost = 5; // base cost in currency units
  const costPerKm = 0.5; // cost per kilometer
  const costPerKg = 0.2; // cost per kilogram
  return baseCost + (costPerKm * distance) + (costPerKg * weight);
};
export const calculateShipping = async(weight,deliveryPostalCode) => {
  try {
    const pickupPostalCode="44001"
    if (!pickupPostalCode || !deliveryPostalCode || !weight) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    const pickupCoords =await getCoordinates(pickupPostalCode);
    const deliveryCoords =await getCoordinates(deliveryPostalCode);
    const distance = haversineDistance(pickupCoords, deliveryCoords);
    const shippingCost = calculateShippingCost(distance, weight);
    return Math.floor(shippingCost)
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


