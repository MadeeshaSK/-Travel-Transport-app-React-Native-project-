import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-native-feather';
import { toggleFavourite } from '../redux/favouritesSlice';
import { getColors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function DetailsScreen({ route, navigation }) {
  const { destination } = route.params;
  const dispatch = useDispatch();
  const { items: favourites } = useSelector((state) => state.favourites);
  const { isDark } = useSelector((state) => state.theme);
  const colors = getColors(isDark);

  const isFavourite = favourites.some((fav) => fav.id === destination.id);

  const handleToggleFavourite = () => {
    dispatch(toggleFavourite(destination));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: destination.name || 'Details',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavourite}
          style={styles.headerButton}
        >
          {isFavourite ? (
            <Icon.Heart stroke="#FFFFFF" fill="#FFFFFF" width={24} height={24} />
          ) : (
            <Icon.Heart stroke="#FFFFFF" width={24} height={24} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavourite]);

  const InfoCard = ({ icon: IconComponent, label, value }) => (
    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
      <View style={[styles.infoIconContainer, { backgroundColor: isDark ? '#1C3A57' : '#E8F4FD' }]}>
        <IconComponent stroke={colors.primary} width={24} height={24} />
      </View>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value || 'N/A'}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerImage: {
      width: width,
      height: 300,
      backgroundColor: '#E5E5EA',
    },
    content: {
      padding: 20,
    },
    titleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1C3A57' : '#E8F4FD',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: 4,
    },
    locationSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    locationText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    infoCard: {
      width: '48%',
      borderRadius: 12,
      padding: 16,
      margin: '1%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    infoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    detailIconContainer: {
      width: 40,
      height: 40,
      backgroundColor: isDark ? '#1C3A57' : '#E8F4FD',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    actionButton: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      marginBottom: 32,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    headerButton: {
      marginRight: 16,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: destination.image }} style={styles.headerImage} />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.statusBadge}>
            <Icon.TrendingUp stroke={colors.primary} width={16} height={16} />
            <Text style={styles.statusText}>{destination.status || 'Popular'}</Text>
          </View>
        </View>

        <View style={styles.locationSection}>
          <Icon.MapPin stroke={colors.textSecondary} width={20} height={20} />
          <Text style={styles.locationText}>
            {destination.continent || 'Unknown'} • {destination.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>
          <View style={styles.infoGrid}>
            <InfoCard
              icon={Icon.Navigation}
              label="Capital"
              value={destination.capital || 'N/A'}
            />
            <InfoCard
              icon={Icon.Users}
              label="Population"
              value={destination.population ? destination.population.toLocaleString() : 'N/A'}
            />
            <InfoCard
              icon={Icon.Map}
              label="Area"
              value={destination.area ? `${destination.area.toLocaleString()} km²` : 'N/A'}
            />
            <InfoCard
              icon={Icon.Globe}
              label="Languages"
              value={destination.languages || 'N/A'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.DollarSign stroke={colors.primary} width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Currency</Text>
              <Text style={styles.detailValue}>{destination.currency || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.Clock stroke={colors.primary} width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Timezone</Text>
              <Text style={styles.detailValue}>{destination.timezone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.MapPin stroke={colors.primary} width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Coordinates</Text>
              <Text style={styles.detailValue}>
                {destination.lat && destination.lng
                  ? `${destination.lat.toFixed(2)}°, ${destination.lng.toFixed(2)}°`
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {destination.name}</Text>
          <Text style={styles.description}>
            {destination.name} is located in {destination.continent || 'this region'}, offering unique
            cultural experiences and breathtaking landscapes. With a population of{' '}
            {destination.population ? destination.population.toLocaleString() : 'many'} people, this destination
            provides visitors with an authentic glimpse into {destination.description}{' '}
            culture and traditions.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleToggleFavourite}
        >
          {isFavourite ? (
            <>
              <Icon.X stroke="#FFFFFF" width={20} height={20} />
              <Text style={styles.actionButtonText}>Remove from Favourites</Text>
            </>
          ) : (
            <>
              <Icon.Heart stroke="#FFFFFF" width={20} height={20} />
              <Text style={styles.actionButtonText}>Add to Favourites</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}