import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, TextStyle, ViewStyle} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

/** Matches NewItemModal `fieldLabel` styling. */
export function FormFieldLabel({children}: {children: string}) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

type FormTextInputProps = Omit<TextInputProps, 'style'> & {
  style?: ViewStyle | TextStyle | Array<ViewStyle | TextStyle | undefined>;
};

/** Matches NewItemModal `input` styling; optional `style` extends the base. */
export function FormTextInput({
  style,
  placeholderTextColor = '#94A3B8',
  ...rest
}: FormTextInputProps) {
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      style={[styles.input, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: '#0F172A',
    marginBottom: verticalScale(6),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22.5),
    color: '#0F172A',
  },
});
