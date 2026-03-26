import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on both native (Alert.alert) and web (window.confirm/alert).
 */
export function showAlert(
  title: string,
  message: string,
  buttons?: { text: string; style?: 'cancel' | 'destructive' | 'default'; onPress?: () => void }[]
) {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  // Web fallback
  if (!buttons || buttons.length === 0) {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  // Single button (info alert)
  if (buttons.length === 1) {
    window.alert(`${title}\n\n${message}`);
    buttons[0].onPress?.();
    return;
  }

  // Two buttons (confirm dialog) — cancel + action
  const cancelButton = buttons.find((b) => b.style === 'cancel');
  const actionButton = buttons.find((b) => b.style !== 'cancel') || buttons[buttons.length - 1];

  const confirmed = window.confirm(`${title}\n\n${message}`);
  if (confirmed) {
    actionButton.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
}
