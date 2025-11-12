import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Enhanced test data with all required fields
const TEST_DATA = [
  {
    id: '1',
    name: 'France',
    description: 'Western Europe',
    image: 'https://flagcdn.com/w320/fr.png',
    capital: 'Paris',
    status: 'Popular',
    population: 67390000,
    area: 551695,
    languages: 'French',
    currency: 'Euro',
    continent: 'Europe',
    timezone: 'UTC+01:00',
    lat: 46.23,
    lng: 2.21,
  },
  {
    id: '2',
    name: 'Japan',
    description: 'East Asia',
    image: 'https://flagcdn.com/w320/jp.png',
    capital: 'Tokyo',
    status: 'Trending',
    population: 125800000,
    area: 377975,
    languages: 'Japanese',
    currency: 'Japanese Yen',
    continent: 'Asia',
    timezone: 'UTC+09:00',
    lat: 36.20,
    lng: 138.25,
  },
  {
    id: '3',
    name: 'United States',
    description: 'North America',
    image: 'https://flagcdn.com/w320/us.png',
    capital: 'Washington, D.C.',
    status: 'Must Visit',
    population: 329500000,
    area: 9372610,
    languages: 'English',
    currency: 'United States Dollar',
    continent: 'Americas',
    timezone: 'UTC-05:00',
    lat: 37.09,
    lng: -95.71,
  },
  {
    id: '4',
    name: 'Australia',
    description: 'Oceania',
    image: 'https://flagcdn.com/w320/au.png',
    capital: 'Canberra',
    status: 'Popular',
    population: 25690000,
    area: 7692024,
    languages: 'English',
    currency: 'Australian Dollar',
    continent: 'Oceania',
    timezone: 'UTC+10:00',
    lat: -25.27,
    lng: 133.77,
  },
  {
    id: '5',
    name: 'Brazil',
    description: 'South America',
    image: 'https://flagcdn.com/w320/br.png',
    capital: 'Brasília',
    status: 'Trending',
    population: 212600000,
    area: 8515767,
    languages: 'Portuguese',
    currency: 'Brazilian Real',
    continent: 'Americas',
    timezone: 'UTC-03:00',
    lat: -14.24,
    lng: -51.93,
  },
  {
    id: '6',
    name: 'Germany',
    description: 'Central Europe',
    image: 'https://flagcdn.com/w320/de.png',
    capital: 'Berlin',
    status: 'Popular',
    population: 83240000,
    area: 357114,
    languages: 'German',
    currency: 'Euro',
    continent: 'Europe',
    timezone: 'UTC+01:00',
    lat: 51.17,
    lng: 10.45,
  },
  {
    id: '7',
    name: 'Italy',
    description: 'Southern Europe',
    image: 'https://flagcdn.com/w320/it.png',
    capital: 'Rome',
    status: 'Must Visit',
    population: 60360000,
    area: 301336,
    languages: 'Italian',
    currency: 'Euro',
    continent: 'Europe',
    timezone: 'UTC+01:00',
    lat: 41.87,
    lng: 12.57,
  },
  {
    id: '8',
    name: 'Canada',
    description: 'North America',
    image: 'https://flagcdn.com/w320/ca.png',
    capital: 'Ottawa',
    status: 'Trending',
    population: 38010000,
    area: 9984670,
    languages: 'English, French',
    currency: 'Canadian Dollar',
    continent: 'Americas',
    timezone: 'UTC-05:00',
    lat: 56.13,
    lng: -106.35,
  },
];

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  async (_, { rejectWithValue }) => {
    try {
      // STEP 1: Using enhanced test data
      console.log('✅ Using TEST DATA');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log('✅ Returning', TEST_DATA.length, 'destinations');
      return TEST_DATA;

      // STEP 2: After test data works, uncomment this to use real API:
      /*
      console.log('Fetching from API...');
      const response = await fetch('https://restcountries.com/v3.1/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      const data = await response.json();
      console.log('API returned:', data.length, 'countries');
      
      const validCountries = data.filter(country => 
        country.flags?.png && country.name?.common
      );
      
      return validCountries.slice(0, 50).map((country, index) => ({
        id: country.cca3 || `country-${index}`,
        name: country.name.common,
        description: country.region || 'Unknown Region',
        image: country.flags.png,
        capital: country.capital?.[0] || 'N/A',
        population: country.population || 0,
        area: country.area || 0,
        languages: country.languages 
          ? Object.values(country.languages).join(', ') 
          : 'N/A',
        currency: country.currencies 
          ? Object.values(country.currencies)[0]?.name 
          : 'N/A',
        status: ['Popular', 'Trending', 'Must Visit'][index % 3],
        continent: country.continents?.[0] || 'Unknown',
        timezone: country.timezones?.[0] || 'N/A',
        lat: country.latlng?.[0] || 0,
        lng: country.latlng?.[1] || 0,
      }));
      */
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return rejectWithValue(error.message);
    }
  }
);

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedDestination: null,
  },
  reducers: {
    setSelectedDestination: (state, action) => {
      state.selectedDestination = action.payload;
    },
    clearSelectedDestination: (state) => {
      state.selectedDestination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        console.log('Loading destinations...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        console.log('Destinations loaded:', action.payload.length);
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        console.log('Error loading destinations:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Failed to fetch destinations';
        state.items = [];
      });
  },
});

export const { setSelectedDestination, clearSelectedDestination } = destinationsSlice.actions;
export default destinationsSlice.reducer;