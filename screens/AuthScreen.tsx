import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

// Cross-platform alert (Alert.alert doesn't work on web)
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple } = useAuthStore();

  const handleForgotPassword = async () => {
    const emailToReset = forgotPasswordEmail || email;
    if (!emailToReset) {
      showAlert('Email Required', 'Please enter your email address to reset your password.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailToReset);
      if (error) {
        showAlert('Error', error.message);
      } else {
        showAlert('Email Sent', 'Check your email for a password reset link.');
      }
    } catch (err) {
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please enter email and password');
      return;
    }

    if (isSignUp && (!firstName || !lastName)) {
      showAlert('Error', 'Please enter your first and last name');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, firstName, lastName);
        if (error) {
          showAlert('Sign Up Error', error.message);
        } else {
          setSignUpEmail(email);
          setSignUpSuccess(true);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          showAlert('Sign In Error', error.message);
        }
      }
    } catch (err) {
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showAlert('Google Sign In Error', error.message);
      }
    } catch (err) {
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        showAlert('Apple Sign In Error', error.message);
      }
    } catch (err) {
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signUpEmail,
      });
      if (error) {
        showAlert('Error', error.message);
      } else {
        showAlert('Email Sent', 'A new verification email has been sent.');
      }
    } catch (err) {
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (signUpSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="mail-outline" size={64} color="#ffffff" style={{ marginBottom: 24 }} />
          <Text style={styles.logo}>Check Your Email</Text>
          <Text style={styles.verifySubtitle}>
            We sent a verification link to
          </Text>
          <Text style={styles.verifyEmail}>{signUpEmail}</Text>
          <Text style={styles.verifyHint}>
            Click the link in the email to verify your account and start using SERE.
          </Text>

          <View style={styles.form}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleResendVerification}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.buttonText}>Resend Verification Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSignUpSuccess(false);
                setIsSignUp(false);
                setPassword('');
              }}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.switchText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.logo}>[şere]</Text>
            <Text style={styles.tagline}>Never go alone</Text>

            <View style={styles.form}>
              {isSignUp && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>

              {!isSignUp && (
                <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.socialButton, isLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton, isLoading && styles.buttonDisabled]}
                  onPress={handleAppleSignIn}
                  disabled={isLoading}
                >
                  <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                <Text style={styles.switchText}>
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  verifySubtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 4,
    textAlign: 'center',
  },
  verifyEmail: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  forgotPasswordText: {
    color: '#999999',
    textAlign: 'right',
    fontSize: 13,
    marginBottom: 4,
    marginTop: 4,
  },
  switchText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
