import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from 'react-native-feather';
import { logoutUser } from '../redux/authSlice';
import { clearFavourites } from '../redux/favouritesSlice';
import { toggleThemeMode } from '../redux/themeSlice';
import { getColors } from '../constants/Colors';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: favourites } = useSelector((state) => state.favourites);
  const { isDark } = useSelector((state) => state.theme);
  const colors = getColors(isDark);

  const handleLogout = () => {
    console.log('🔴 handleLogout called - dispatching actions');
    
    // Clear favourites first
    dispatch(clearFavourites());
    console.log('🔴 Favourites cleared');
    
    // Then logout
    console.log('🔴 Dispatching logoutUser...');
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log('✅ Logout completed successfully');
      })
      .catch((error) => {
        console.log('⚠️ Logout error but proceeding:', error);
      });
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
          onPress: async () => {
            dispatch(clearFavourites());
            await AsyncStorage.removeItem('@favourites');
            Alert.alert('Success', 'All favourites have been cleared.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleThemeMode());
  };

  const ProfileOption = ({ icon: IconComponent, title, subtitle, onPress, danger, hasSwitch, switchValue }) => (
    <TouchableOpacity
      style={[styles.optionCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={hasSwitch}
    >
      <View style={[
        styles.optionIconContainer, 
        { backgroundColor: danger ? (isDark ? '#3D2020' : '#FFE5E5') : (isDark ? '#1C3A57' : '#E8F4FD') }
      ]}>
        <IconComponent
          stroke={danger ? colors.danger : colors.primary}
          width={24}
          height={24}
        />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, { color: danger ? colors.danger : colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onPress}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={switchValue ? '#FFFFFF' : '#f4f3f4'}
        />
      ) : (
        <Icon.ChevronRight stroke={colors.textSecondary} width={20} height={20} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || 'User'}
        </Text>
        {user?.email && <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>}
        <Text style={[styles.username, { color: colors.primary }]}>@{user?.username || 'traveler'}</Text>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
        <View style={styles.statCard}>
          <Icon.Heart stroke={colors.danger} fill={colors.danger} width={24} height={24} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{favourites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favourites</Text>
        </View>
        <View style={styles.statCard}>
          <Icon.MapPin stroke={colors.primary} width={24} height={24} />
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Visited</Text>
        </View>
        <View style={styles.statCard}>
          <Icon.Bookmark stroke={colors.success} width={24} height={24} />
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
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
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
        <ProfileOption
          icon={Icon.Bell}
          title="Notifications"
          subtitle="Manage notification settings"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
        />
        <ProfileOption
          icon={Icon.Moon}
          title="Dark Mode"
          subtitle={isDark ? 'Enabled' : 'Disabled'}
          onPress={handleToggleDarkMode}
          hasSwitch={true}
          switchValue={isDark}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Actions</Text>
        <ProfileOption
          icon={Icon.Trash2}
          title="Clear Favourites"
          subtitle={`Remove all ${favourites.length} favourites`}
          onPress={handleClearFavourites}
          danger
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</Text>
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

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.danger }]} 
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon.LogOut stroke="#FFFFFF" width={20} height={20} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>GoMate © 2025</Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Made with ❤️ for travelers</Text>
      </View>
    </ScrollView>
  );
}

// Move styles outside the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
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
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
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
    marginVertical: 2,
  },
});