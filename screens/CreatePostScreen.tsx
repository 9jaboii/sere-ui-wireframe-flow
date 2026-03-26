import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { showAlert } from '../lib/alert';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { ActivityCategory, SkillLevel } from '../types/database';

// Only import DateTimePicker on native platforms
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

const categories: { label: string; value: ActivityCategory }[] = [
  { label: 'Sport / Gym', value: 'sport_gym' },
  { label: 'Casual Hangout', value: 'casual_hangout' },
  { label: 'Party', value: 'party' },
  { label: 'Other', value: 'other' },
];

const skillLevels: { label: string; value: SkillLevel }[] = [
  { label: 'All skill levels welcome', value: 'just_for_fun' },
  { label: 'Beginners only', value: 'beginner' },
  { label: 'Intermediate players', value: 'intermediate' },
  { label: 'Advanced players', value: 'advanced' },
];

export default function CreatePostScreen({ navigation }: any) {
  const [activityCategory, setActivityCategory] = useState<ActivityCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const dateInputRef = useRef<any>(null);
  const timeInputRef = useRef<any>(null);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('');
  const [eventLink, setEventLink] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const { createActivity } = useActivityStore();

  const handleSubmit = async () => {
    if (!activityCategory || !description || !location || !selectedDate || !selectedTime || !maxAttendees) {
      showAlert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (activityCategory === 'sport_gym' && !skillLevel) {
      showAlert('Skill Level Required', 'Please select a skill level for Sport / Gym activities');
      return;
    }

    if (!user) {
      showAlert('Error', 'You must be logged in to create an activity.');
      return;
    }

    const spotsTotal = parseInt(maxAttendees, 10);
    if (isNaN(spotsTotal) || spotsTotal < 1 || spotsTotal > 12) {
      showAlert('Invalid', 'Number of people must be between 1 and 12.');
      return;
    }

    const eventDate = format(selectedDate, 'yyyy-MM-dd');
    const eventTime = format(selectedTime, 'HH:mm:ss');

    setIsSubmitting(true);

    const { error, data: newActivity } = await createActivity({
      host_user_id: user.id,
      category: activityCategory,
      skill_level: activityCategory === 'sport_gym' && skillLevel ? skillLevel : null,
      description,
      event_date: eventDate,
      event_time: eventTime,
      location_text: location,
      spots_total: spotsTotal,
      external_link: eventLink || null,
    });

    // Upload photo if selected and activity was created
    if (!error && newActivity && photoUri) {
      try {
        const fileExt = photoUri.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = `${user.id}/${newActivity.id}.${fileExt}`;

        // Fetch the local image as a blob
        const response = await fetch(photoUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('activity-photos')
          .upload(filePath, blob, { contentType: `image/${fileExt}`, upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('activity-photos')
            .getPublicUrl(filePath);

          // Update activity with photo URL
          await supabase
            .from('activities')
            .update({ photo_url: urlData.publicUrl })
            .eq('id', newActivity.id);
        }
      } catch (uploadErr) {
        // Photo upload failed but activity was created — don't block
        console.warn('Photo upload failed:', uploadErr);
      }
    }

    setIsSubmitting(false);

    if (error) {
      showAlert('Error', error.message || 'Failed to create activity.');
    } else {
      showAlert('Success!', 'Your activity has been posted.', [
        {
          text: 'View My Posts',
          onPress: () => navigation.navigate('MainFeed', { tab: 'my-posts' }),
        },
      ]);
    }
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission needed', 'Please allow access to your photo library to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onTimeChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) setSelectedTime(date);
  };

  const getCategoryLabel = (value: ActivityCategory) => {
    return categories.find((c) => c.value === value)?.label || '';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>✨</Text>
          <Text style={styles.bannerText}>Post an activity and find people ready to join you today!</Text>
        </View>

        {/* Activity Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Details</Text>

          <Text style={styles.label}>Activity Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  activityCategory === cat.value && styles.categoryButtonActive,
                ]}
                onPress={() => setActivityCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    activityCategory === cat.value && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activityCategory === 'sport_gym' && (
            <>
              <Text style={styles.label}>Skill Level</Text>
              <View style={styles.skillLevelContainer}>
                {skillLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.skillLevelButton,
                      skillLevel === level.value && styles.skillLevelButtonActive,
                    ]}
                    onPress={() => setSkillLevel(level.value)}
                  >
                    <Text
                      style={[
                        styles.skillLevelText,
                        skillLevel === level.value && styles.skillLevelTextActive,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Give more details about what you want to do..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Activity Photo (Optional)</Text>
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setPhotoUri(null)}
              >
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <Ionicons name="camera-outline" size={40} color="#666" />
              <Text style={styles.addPhotoText}>Tap to add photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* When & Where */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When & Where</Text>

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Where should everyone meet?"
            value={location}
            onChangeText={setLocation}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Date *</Text>
              {Platform.OS === 'web' ? (
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e: any) => {
                    if (e.target.value) {
                      setSelectedDate(new Date(e.target.value + 'T00:00:00'));
                    }
                  }}
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: '#e5e5e5',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box' as any,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={selectedDate ? styles.pickerValueText : styles.pickerPlaceholderText}>
                      {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && DateTimePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      minimumDate={new Date()}
                      onChange={onDateChange}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    />
                  )}
                </>
              )}
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Time *</Text>
              {Platform.OS === 'web' ? (
                <input
                  ref={timeInputRef}
                  type="time"
                  value={selectedTime ? format(selectedTime, 'HH:mm') : ''}
                  onChange={(e: any) => {
                    if (e.target.value) {
                      const [h, m] = e.target.value.split(':');
                      const d = new Date();
                      d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                      setSelectedTime(d);
                    }
                  }}
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: '#e5e5e5',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box' as any,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={selectedTime ? styles.pickerValueText : styles.pickerPlaceholderText}>
                      {selectedTime ? format(selectedTime, 'h:mm a') : 'Select time'}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && DateTimePicker && (
                    <DateTimePicker
                      value={selectedTime || new Date()}
                      mode="time"
                      onChange={onTimeChange}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    />
                  )}
                </>
              )}
            </View>
          </View>

          <Text style={styles.label}>Number of People Needed (max 12) *</Text>
          <TextInput
            style={styles.input}
            placeholder="How many people?"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Link (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={eventLink}
            onChangeText={setEventLink}
            keyboardType="url"
            autoCapitalize="none"
          />
          <Text style={styles.helperText}>
            Add a link to help people understand the activity (menu, tickets, etc.)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Post Activity</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#000000',
    padding: 20,
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#ffffff',
  },
  categoryButtonActive: {
    backgroundColor: '#000000',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  skillLevelContainer: {
    gap: 8,
  },
  skillLevelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f5f5f5',
  },
  skillLevelButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  skillLevelText: {
    fontSize: 14,
    color: '#333',
  },
  skillLevelTextActive: {
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerValueText: {
    fontSize: 14,
    color: '#000',
  },
  pickerPlaceholderText: {
    fontSize: 14,
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  photoContainer: {
    position: 'relative',
    marginTop: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
  },
  addPhotoButton: {
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    marginTop: 8,
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
