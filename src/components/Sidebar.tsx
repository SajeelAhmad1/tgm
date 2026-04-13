import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type SidebarRoute = 'Home' | 'AccountProfile' | 'Logout';

type Props = {
  visible: boolean;
  userName: string;
  userRole?: string;
  onClose: () => void;
  onNavigate?: (screen: SidebarRoute) => void;
};

type SidebarMenuItemProps = {
  label: string;
  danger?: boolean;
  onPress: () => void;
};

function SidebarMenuItem({label, danger = false, onPress}: SidebarMenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.menuText, danger ? styles.logoutText : undefined]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Sidebar({
  visible,
  userName,
  userRole = 'Field Inspector',
  onClose,
  onNavigate,
}: Props) {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const sidebarWidth = useMemo(
    () => Math.min(Math.max(Math.round(screenWidth * 0.82), 260), 360),
    [screenWidth],
  );
  const slideAnim = useRef(new Animated.Value(sidebarWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: sidebarWidth,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, sidebarWidth, slideAnim, visible]);

  useEffect(() => {
    if (!visible) {
      slideAnim.setValue(sidebarWidth);
    }
  }, [sidebarWidth, slideAnim, visible]);

  const displayName = useMemo(() => {
    const trimmed = userName.trim();
    return trimmed.length > 0 ? trimmed : 'User';
  }, [userName]);

  const handleNavigate = (screen: SidebarRoute) => {
    onClose();
    onNavigate?.(screen);
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, {opacity: fadeAnim}]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar,
          {
            width: sidebarWidth,
            height: screenHeight,
            transform: [{translateX: slideAnim}],
          },
        ]}>
        <LinearGradient
          colors={['#1E88E5', '#1467C3', '#0D47A1']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>x</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>U</Text>
            </View>
            <View>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userRole}>{userRole}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.menuItems}>
          <SidebarMenuItem label="Home" onPress={() => handleNavigate('Home')} />
          <SidebarMenuItem
            label="Account Profile"
            onPress={() => handleNavigate('AccountProfile')}
          />

          <View style={styles.divider} />

          <SidebarMenuItem
            label="Logout"
            danger
            onPress={() => handleNavigate('Logout')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>TGM Field App</Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 25},
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  userRole: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.70)',
  },
  menuItems: {
    flex: 1,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#0F172A',
  },
  logoutText: {
    color: '#DC2626',
  },
  divider: {
    marginHorizontal: 20,
    marginVertical: 8,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#94A3B8',
  },
});
