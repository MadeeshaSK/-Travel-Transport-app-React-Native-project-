import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-native-feather';
import { fetchDestinations } from '../redux/destinationsSlice';
import { loadFavourites, toggleFavourite } from '../redux/favouritesSlice';
import { getColors } from '../constants/Colors';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.destinations);
  const { items: favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);
  const colors = getColors(isDark);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('🚀 HomeScreen: Fetching destinations...');
    dispatch(fetchDestinations());
    dispatch(loadFavourites());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDestinations());
    setRefreshing(false);
  };

  const isFavourite = (id) => {
    return favourites.some((fav) => fav.id === id);
  };

  const handleToggleFavourite = (destination) => {
    dispatch(toggleFavourite(destination));
  };

  const filteredDestinations = items.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status) => {
    const baseStyle = {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    };
    
    switch (status) {
      case 'Popular':
        return { ...baseStyle, backgroundColor: isDark ? '#1C3A57' : '#E8F4FD' };
      case 'Trending':
        return { ...baseStyle, backgroundColor: isDark ? '#3D3420' : '#FFF4E5' };
      case 'Must Visit':
        return { ...baseStyle, backgroundColor: isDark ? '#3D2020' : '#FFE5E5' };
      default:
        return { ...baseStyle, backgroundColor: isDark ? '#1C3A57' : '#E8F4FD' };
    }
  };

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Details', { destination: item })}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleToggleFavourite(item)}
            style={styles.favouriteButton}
          >
            {isFavourite(item.id) ? (
              <Icon.Heart
                stroke={colors.danger}
                fill={colors.danger}
                width={24}
                height={24}
              />
            ) : (
              <Icon.Heart stroke={colors.textSecondary} width={24} height={24} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Icon.MapPin stroke={colors.primary} width={16} height={16} />
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={getStatusStyle(item.status)}>
            <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
          </View>
          {item.capital && item.capital !== 'N/A' && (
            <View style={styles.capitalInfo}>
              <Icon.Navigation stroke={colors.textSecondary} width={14} height={14} />
              <Text style={[styles.capitalText, { color: colors.textSecondary }]}>{item.capital}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && items.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading destinations...</Text>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Icon.AlertCircle stroke={colors.danger} width={48} height={48} />
        <Text style={[styles.errorText, { color: colors.danger }]}>Oops! Something went wrong</Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => dispatch(fetchDestinations())}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.firstName || user?.username || 'Traveler'}!
          </Text>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }]}>
          <Icon.Search stroke={colors.textSecondary} width={20} height={20} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search destinations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon.X stroke={colors.textSecondary} width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon.Search stroke={colors.textSecondary} width={48} height={48} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No destinations found</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => dispatch(fetchDestinations())}
            >
              <Text style={styles.retryButtonText}>Load Destinations</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  errorDetail: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5EA',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  favouriteButton: {
    padding: 4,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  capitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capitalText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});