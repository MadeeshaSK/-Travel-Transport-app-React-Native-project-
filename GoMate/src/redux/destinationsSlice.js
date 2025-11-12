import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simple test data - Use this first to see if cards show
const TEST_DATA = [
  {
    id: '1',
    name: 'Paris',
    description: 'Europe',
    image: 'https://flagcdn.com/w320/fr.png',
    capital: 'Paris',
    status: 'Popular',
    population: 2161000,
  },
  {
    id: '2',
    name: 'Japan',
    description: 'Asia',
    image: 'https://flagcdn.com/w320/jp.png',
    capital: 'Tokyo',
    status: 'Trending',
    population: 125800000,
  },
  {
    id: '3',
    name: 'United States',
    description: 'Americas',
    image: 'https://flagcdn.com/w320/us.png',
    capital: 'Washington',
    status: 'Must Visit',
    population: 329500000,
  },
  {
    id: '4',
    name: 'Australia',
    description: 'Oceania',
    image: 'https://flagcdn.com/w320/au.png',
    capital: 'Canberra',
    status: 'Popular',
    population: 25690000,
  },
  {
    id: '5',
    name: 'Brazil',
    description: 'Americas',
    image: 'https://flagcdn.com/w320/br.png',
    capital: 'Brasília',
    status: 'Trending',
    population: 212600000,
  },
];

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  async (_, { rejectWithValue }) => {
    try {
      // STEP 1: Try with test data first
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