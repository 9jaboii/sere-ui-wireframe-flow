import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { showAlert } from '../lib/alert';
import { useActivityStore } from '../stores/activityStore';
import { ActivityCategory, SkillLevel } from '../types/database';

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

export default function EditActivityScreen({ navigation, route }: any) {
  const { activityId } = route.params;
  const { currentActivity, fetchActivity, updateActivity } = useActivityStore();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchActivity(activityId);
  }, [activityId]);

  useEffect(() => {
    if (currentActivity && !loaded) {
      setActivityCategory(currentActivity.category);
      setDescription(currentActivity.description);
      setLocation(currentActivity.location_text);
      setMaxAttendees(String(currentActivity.spots_total));
      setSkillLevel(currentActivity.skill_level || '');
      setEventLink(currentActivity.external_link || '');
      // Parse date and time
      const [year, month, day] = currentActivity.event_date.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
      const [h, m] = currentActivity.event_time.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(h, m, 0, 0);
      setSelectedTime(timeDate);
      setLoaded(true);
    }
  }, [currentActivity, loaded]);

  const getCategoryLabel = (value: ActivityCategory) => {
    return categories.find((c) => c.value === value)?.label || '';
  };

  const handleSubmit = async () => {
    if (!activityCategory || !description || !location || !selectedDate || !selectedTime || !maxAttendees) {
      showAlert('Missing Fields', 'Please fill in all required fields.');
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
    const { error } = await updateActivity(activityId, {
      category: activityCategory as ActivityCategory,
      skill_level: activityCategory === 'sport_gym' && skillLevel ? skillLevel as SkillLevel : null,
      description,
      event_date: eventDate,
      event_time: eventTime,
      location_text: location,
      spots_total: spotsTotal,
      external_link: eventLink || null,
    });
    setIsSubmitting(false);

    if (error) {
      showAlert('Error', 'Failed to update activity.');
    } else {
      showAlert('Updated', 'Activity has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
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

  if (!loaded) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Activity</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Details</Text>

          <Text style={styles.label}>Activity Category *</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={activityCategory ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
              {activityCategory ? getCategoryLabel(activityCategory as ActivityCategory) : 'Select a category...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <Modal
            visible={showCategoryPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCategoryPicker(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowCategoryPicker(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        activityCategory === item.value && styles.modalOptionActive,
                      ]}
                      onPress={() => {
                        setActivityCategory(item.value);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        activityCategory === item.value && styles.modalOptionTextActive,
                      ]}>{item.label}</Text>
                      {activityCategory === item.value && (
                        <Ionicons name="checkmark" size={20} color="#000" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

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
                    <Text style={[
                      styles.skillLevelText,
                      skillLevel === level.value && styles.skillLevelTextActive,
                    ]}>{level.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When & Where</Text>

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
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
                    border: '1px solid #e5e5e5',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box' as any,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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
                    border: '1px solid #e5e5e5',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box' as any,
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
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

          <Text style={styles.label}>Number of People (max 12) *</Text>
          <TextInput
            style={styles.input}
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Link (Optional)</Text>
          <TextInput
            style={styles.input}
            value={eventLink}
            onChangeText={setEventLink}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1 },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#e5e5e5' },
  textArea: { height: 100, paddingTop: 12 },
  dropdownButton: {
    backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e5e5e5',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  dropdownValueText: { fontSize: 14, color: '#000' },
  dropdownPlaceholderText: { fontSize: 14, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 360, paddingVertical: 16 },
  modalTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalOptionActive: { backgroundColor: '#f5f5f5' },
  modalOptionText: { fontSize: 14, color: '#333' },
  modalOptionTextActive: { fontWeight: '600', color: '#000' },
  skillLevelContainer: { gap: 8 },
  skillLevelButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e5e5e5', backgroundColor: '#f5f5f5' },
  skillLevelButtonActive: { backgroundColor: '#000000', borderColor: '#000000' },
  skillLevelText: { fontSize: 14, color: '#333' },
  skillLevelTextActive: { color: '#ffffff' },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  pickerValueText: { fontSize: 14, color: '#000' },
  pickerPlaceholderText: { fontSize: 14, color: '#999' },
  submitButton: { backgroundColor: '#000000', marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
