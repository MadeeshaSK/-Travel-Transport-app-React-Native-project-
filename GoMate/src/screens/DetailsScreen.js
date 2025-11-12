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

const { width } = Dimensions.get('window');

export default function DetailsScreen({ route, navigation }) {
  const { destination } = route.params;
  const dispatch = useDispatch();
  const { items: favourites } = useSelector((state) => state.favourites);

  const isFavourite = favourites.some((fav) => fav.id === destination.id);

  const handleToggleFavourite = () => {
    dispatch(toggleFavourite(destination));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: destination.name,
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
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <IconComponent stroke="#007AFF" width={24} height={24} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: destination.image }} style={styles.headerImage} />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.statusBadge}>
            <Icon.TrendingUp stroke="#007AFF" width={16} height={16} />
            <Text style={styles.statusText}>{destination.status}</Text>
          </View>
        </View>

        <View style={styles.locationSection}>
          <Icon.MapPin stroke="#8E8E93" width={20} height={20} />
          <Text style={styles.locationText}>
            {destination.continent} • {destination.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>
          <View style={styles.infoGrid}>
            <InfoCard
              icon={Icon.Navigation}
              label="Capital"
              value={destination.capital}
            />
            <InfoCard
              icon={Icon.Users}
              label="Population"
              value={destination.population.toLocaleString()}
            />
            <InfoCard
              icon={Icon.Map}
              label="Area"
              value={`${destination.area.toLocaleString()} km²`}
            />
            <InfoCard
              icon={Icon.Globe}
              label="Languages"
              value={destination.languages}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.DollarSign stroke="#007AFF" width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Currency</Text>
              <Text style={styles.detailValue}>{destination.currency}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.Clock stroke="#007AFF" width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Timezone</Text>
              <Text style={styles.detailValue}>{destination.timezone}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon.MapPin stroke="#007AFF" width={20} height={20} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Coordinates</Text>
              <Text style={styles.detailValue}>
                {destination.lat.toFixed(2)}°, {destination.lng.toFixed(2)}°
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {destination.name}</Text>
          <Text style={styles.description}>
            {destination.name} is located in {destination.continent}, offering unique
            cultural experiences and breathtaking landscapes. With a population of{' '}
            {destination.population.toLocaleString()} people, this destination
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
              <Icon.HeartOff stroke="#FFFFFF" width={20} height={20} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
    color: '#000000',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#E8F4FD',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F4FD',
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
    color: '#8E8E93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3C3C43',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
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