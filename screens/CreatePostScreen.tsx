import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePostScreen({ navigation }: any) {
  const [activityCategory, setActivityCategory] = useState('');
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const categories = ['Sport / Gym', 'Casual Hangout', 'Party', 'Other'];
  const skillLevels = [
    'All skill levels welcome',
    'Beginners only',
    'Intermediate players',
    'Advanced players',
    'Just for fun (any level)',
  ];

  const handleSubmit = () => {
    if (!activityCategory || !description || !location || !date || !time || !maxAttendees) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (activityCategory === 'Sport / Gym' && !skillLevel) {
      Alert.alert('Skill Level Required', 'Please select a skill level for Sport / Gym activities');
      return;
    }

    Alert.alert('Success!', 'Your activity has been posted.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleAddPhoto = () => {
    // Mock photo - in real app would use expo-image-picker
    setPhotoUri('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400');
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
                key={cat}
                style={[
                  styles.categoryButton,
                  activityCategory === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setActivityCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    activityCategory === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activityCategory === 'Other' && (
            <>
              <Text style={styles.label}>Custom Activity *</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe your activity"
                value={activityName}
                onChangeText={setActivityName}
              />
            </>
          )}

          {activityCategory === 'Sport / Gym' && (
            <>
              <Text style={styles.label}>Skill Level</Text>
              <View style={styles.skillLevelContainer}>
                {skillLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.skillLevelButton,
                      skillLevel === level && styles.skillLevelButtonActive,
                    ]}
                    onPress={() => setSkillLevel(level)}
                  >
                    <Text
                      style={[
                        styles.skillLevelText,
                        skillLevel === level && styles.skillLevelTextActive,
                      ]}
                    >
                      {level}
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
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Time *</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
              />
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post Activity</Text>
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
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
