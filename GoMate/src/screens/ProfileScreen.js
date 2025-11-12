import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Icon from 'react-native-feather';
import { logoutUser } from '../redux/authSlice';
import { clearFavourites } from '../redux/favouritesSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: favourites } = useSelector((state) => state.favourites);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearFavourites = () => {
    if (favourites.length === 0) {
      Alert.alert('No Favourites', 'You have no favourites to clear.');
      return;
    }

    Alert.alert(
      'Clear Favourites',
      `Are you sure you want to remove all ${favourites.length} favourite destinations?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearFavourites());
            Alert.alert('Success', 'All favourites have been cleared.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const ProfileOption = ({ icon: IconComponent, title, subtitle, onPress, danger }) => (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIconContainer, danger && styles.dangerIconContainer]}>
        <IconComponent
          stroke={danger ? '#FF3B30' : '#007AFF'}
          width={24}
          height={24}
        />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, danger && styles.dangerText]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Icon.ChevronRight stroke="#C7C7CC" width={20} height={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || 'User'}
        </Text>
        {user?.email && <Text style={styles.email}>{user.email}</Text>}
        <Text style={styles.username}>@{user?.username || 'traveler'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon.Heart stroke="#FF3B30" fill="#FF3B30" width={24} height={24} />
          <Text style={styles.statNumber}>{favourites.length}</Text>
          <Text style={styles.statLabel}>Favourites</Text>
        </View>
        <View style={styles.statCard}>
          <Icon.MapPin stroke="#007AFF" width={24} height={24} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Visited</Text>
        </View>
        <View style={styles.statCard}>
          <Icon.Bookmark stroke="#34C759" width={24} height={24} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ProfileOption
          icon={Icon.User}
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing feature coming soon!')}
        />
        <ProfileOption
          icon={Icon.Settings}
          title="Settings"
          subtitle="Manage your preferences"
          onPress={() => Alert.alert('Coming Soon', 'Settings feature coming soon!')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <ProfileOption
          icon={Icon.Bell}
          title="Notifications"
          subtitle="Manage notification settings"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
        />
        <ProfileOption
          icon={Icon.Moon}
          title="Dark Mode"
          subtitle="Toggle dark mode (Bonus Feature)"
          onPress={() => Alert.alert('Coming Soon', 'Dark mode feature coming soon!')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <ProfileOption
          icon={Icon.Trash2}
          title="Clear Favourites"
          subtitle={`Remove all ${favourites.length} favourites`}
          onPress={handleClearFavourites}
          danger
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <ProfileOption
          icon={Icon.HelpCircle}
          title="Help & Support"
          subtitle="Get help with the app"
          onPress={() => Alert.alert('Help', 'For support, contact support@gomate.com')}
        />
        <ProfileOption
          icon={Icon.Info}
          title="About"
          subtitle="GoMate v1.0.0"
          onPress={() => Alert.alert('About GoMate', 'GoMate - Your Travel Companion\nVersion 1.0.0\n\nDeveloped for IN3210 Mobile Applications Development')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon.LogOut stroke="#FFFFFF" width={20} height={20} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GoMate © 2025</Text>
        <Text style={styles.footerText}>Made with ❤️ for travelers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerIconContainer: {
    backgroundColor: '#FFE5E5',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  dangerText: {
    color: '#FF3B30',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    marginVertical: 2,
  },
});
