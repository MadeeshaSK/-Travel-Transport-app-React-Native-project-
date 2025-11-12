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

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.destinations);
  const { items: favourites } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { destination: item })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleToggleFavourite(item)}
            style={styles.favouriteButton}
          >
            {isFavourite(item.id) ? (
              <Icon.Heart
                stroke="#FF3B30"
                fill="#FF3B30"
                width={24}
                height={24}
              />
            ) : (
              <Icon.Heart stroke="#8E8E93" width={24} height={24} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Icon.MapPin stroke="#007AFF" width={16} height={16} />
          <Text style={styles.cardDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          {item.capital && (
            <View style={styles.capitalInfo}>
              <Icon.Navigation stroke="#8E8E93" width={14} height={14} />
              <Text style={styles.capitalText}>{item.capital}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Popular':
        return styles.popularBadge;
      case 'Trending':
        return styles.trendingBadge;
      case 'Must Visit':
        return styles.mustVisitBadge;
      default:
        return styles.popularBadge;
    }
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading destinations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName || user?.username || 'Traveler'}!
          </Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Icon.Search stroke="#8E8E93" width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon.X stroke="#8E8E93" width={20} height={20} />
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
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon.Search stroke="#8E8E93" width={48} height={48} />
            <Text style={styles.emptyText}>No destinations found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
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
    color: '#8E8E93',
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  popularBadge: {
    backgroundColor: '#E8F4FD',
  },
  trendingBadge: {
    backgroundColor: '#FFF4E5',
  },
  mustVisitBadge: {
    backgroundColor: '#FFE5E5',
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
    color: '#8E8E93',
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
    color: '#8E8E93',
  },
});