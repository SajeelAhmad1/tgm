import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {colors} from '../theme/colors';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  variant = 'primary',
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({pressed}) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.ghost,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}>
      <Text
        style={[
          styles.label,
          variant === 'ghost' ? styles.labelGhost : styles.labelPrimary,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelPrimary: {
    color: colors.textPrimary,
  },
  labelGhost: {
    color: colors.textSecondary,
  },
});
