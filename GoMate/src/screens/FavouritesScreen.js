import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Icon from 'react-native-feather';
import { toggleFavourite } from '../redux/favouritesSlice';
import { getColors } from '../constants/Colors';

export default function FavouritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items: favourites } = useSelector((state) => state.favourites);
  const { isDark } = useSelector((state) => state.theme);
  const colors = getColors(isDark);

  const handleRemoveFavourite = (destination) => {
    dispatch(toggleFavourite(destination));
  };

  const renderFavouriteCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Details', { destination: item })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleRemoveFavourite(item)}
            style={styles.removeButton}
          >
            <Icon.Heart
              stroke={colors.danger}
              fill={colors.danger}
              width={24}
              height={24}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Icon.MapPin stroke={colors.primary} width={16} height={16} />
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.capitalInfo}>
            <Icon.Navigation stroke={colors.textSecondary} width={14} height={14} />
            <Text style={[styles.capitalText, { color: colors.textSecondary }]}>{item.capital}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isDark ? '#1C3A57' : '#E8F4FD' }]}>
            <Text style={[styles.statusText, { color: colors.primary }]}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
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
    removeButton: {
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
    capitalInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    capitalText: {
      fontSize: 12,
      marginLeft: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      backgroundColor: colors.background,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      backgroundColor: colors.card,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    exploreButton: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center',
    },
    exploreButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon.Heart stroke={colors.textSecondary} width={64} height={64} />
        </View>
        <Text style={styles.emptyTitle}>No Favourites Yet</Text>
        <Text style={styles.emptyText}>
          Start exploring destinations and add them to your favourites!
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon.Compass stroke="#FFFFFF" width={20} height={20} />
          <Text style={styles.exploreButtonText}>Explore Destinations</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favourites</Text>
        <Text style={styles.headerSubtitle}>
          {favourites.length} {favourites.length === 1 ? 'destination' : 'destinations'}
        </Text>
      </View>

      <FlatList
        data={favourites}
        renderItem={renderFavouriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}