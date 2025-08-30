import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export const fetchAllCitiesAndStates = async (db) => {
  try {
    const citiesRef = collection(db, 'states_cities');
    const snapshot = await getDocs(citiesRef);
    
    const citiesData = [];
    const statesSet = new Set();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      citiesData.push({
        id: doc.id,
        cityName: data.city_name,
        stateName: data.state
      });
      statesSet.add(data.state);
    });
    
    const states = Array.from(statesSet).sort();
    
    return { citiesData, states };
  } catch (error) {
    console.error('Error fetching cities and states:', error);
    return { citiesData: [], states: [] };
  }
};

// Method 2: Get unique states only
export const fetchStates = async (db) => {
  try {
    const citiesRef = collection(db, 'states_cities');
    const snapshot = await getDocs(citiesRef);
    
    const statesSet = new Set();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.state) {
        statesSet.add(data.state);
      }
    });
    
    return Array.from(statesSet).sort();
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// Method 3: Get cities by state
export const fetchCitiesByState = async (db, stateName) => {
  try {
    const citiesRef = collection(db, 'states_cities');
    const q = query(
      citiesRef, 
      where('state', '==', stateName),
      orderBy('city_name')
    );
    const snapshot = await getDocs(q);
    
    const cities = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      cities.push({
        id: doc.id,
        cityName: data.city_name,
        stateName: data.state
      });
    });
    
    return cities;
  } catch (error) {
    console.error('Error fetching cities by state:', error);
    return [];
  }
};

// Method 4: Get organized states and cities object (like your current structure)
export const fetchStatesAndCitiesObject = async (db) => {
  try {
    const citiesRef = collection(db, 'states_cities');
    const snapshot = await getDocs(citiesRef);
    
    const statesAndCities = {};
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const stateName = data.state;
      const cityName = data.city_name;
      
      if (!statesAndCities[stateName]) {
        statesAndCities[stateName] = [];
      }
      
      if (!statesAndCities[stateName].includes(cityName)) {
        statesAndCities[stateName].push(cityName);
      }
    });
    
    // Sort cities within each state
    Object.keys(statesAndCities).forEach(state => {
      statesAndCities[state].sort();
    });
    
    return statesAndCities;
  } catch (error) {
    console.error('Error fetching states and cities object:', error);
    return {};
  }
};

// Method 5: Search cities by name
export const searchCities = async (db, searchTerm) => {
  try {
    const citiesRef = collection(db, 'states_cities');
    const snapshot = await getDocs(citiesRef);
    
    const results = [];
    const searchLower = searchTerm.toLowerCase();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const cityName = data.city_name?.toLowerCase() || '';
      const stateName = data.state?.toLowerCase() || '';
      
      if (cityName.includes(searchLower) || stateName.includes(searchLower)) {
        results.push({
          id: doc.id,
          cityName: data.city_name,
          stateName: data.state
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};