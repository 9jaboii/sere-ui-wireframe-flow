import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getInitials } from '../constants';

interface AvatarProps {
  firstName: string;
  lastName: string;
  color: string;
  size?: number;
  style?: ViewStyle;
}

export default function Avatar({
  firstName,
  lastName,
  color,
  size = 40,
  style,
}: AvatarProps) {
  const initials = getInitials(firstName, lastName) || '?';
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
