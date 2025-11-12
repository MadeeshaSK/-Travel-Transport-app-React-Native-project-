import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    return data.slice(0, 50).map((country, index) => ({
      id: country.cca3,
      name: country.name.common,
      description: country.region,
      image: country.flags.png,
      capital: country.capital?.[0] || 'N/A',
      population: country.population,
      area: country.area,
      languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
      currency: country.currencies 
        ? Object.values(country.currencies)[0]?.name 
        : 'N/A',
      status: ['Popular', 'Trending', 'Must Visit'][index % 3],
      continent: country.continents?.[0] || 'Unknown',
      timezone: country.timezones?.[0] || 'N/A',
      lat: country.latlng?.[0] || 0,
      lng: country.latlng?.[1] || 0,
    }));
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedDestination, clearSelectedDestination } = destinationsSlice.actions;
export default destinationsSlice.reducer;