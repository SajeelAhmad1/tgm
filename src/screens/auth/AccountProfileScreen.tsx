import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {useAuthStore} from '../../store/authStore';

export function AccountProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const clearSession = useAuthStore(s => s.clearSession);

  return (
    <View style={[styles.screen, {paddingTop: insets.top + verticalScale(16)}]}>
      <Text style={styles.title}>Account Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || '-'}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || '-'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={clearSession} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F1419',
    paddingHorizontal: scale(20),
  },
  title: {
    color: '#F8FAFC',
    fontSize: moderateScale(24),
    fontWeight: '700',
    marginBottom: verticalScale(20),
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: scale(16),
    gap: verticalScale(6),
  },
  label: {
    color: '#94A3B8',
    fontSize: moderateScale(12),
    marginTop: verticalScale(8),
  },
  value: {
    color: '#F1F5F9',
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: verticalScale(24),
    height: verticalScale(44),
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
});
