import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import api from '../api';

const { width } = Dimensions.get('window');

const AVAILABLE_SKILLS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'UI/UX Design',
  'Product Design',
  'Product Management',
  'Project Management',
  'Digital Marketing',
  'Content Marketing',
  'Sales & Business Development',
  'Customer Success',
  'Data Science',
  'DevOps & Infrastructure',
  'Quality Assurance',
  'Copywriting',
  'Video Production',
  'Graphic Design',
  'Legal & Compliance',
  'Finance & Accounting',
];

interface FormData {
  skills: string[];
  primarySkill: string | null;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
}

export default function CollaboratorProfileWizardScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState<'skills' | 'details' | 'confirmation'>('skills');
  const [formData, setFormData] = useState<FormData>({
    skills: [],
    primarySkill: null,
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSkillToggle = (skill: string) => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];

    let newPrimarySkill = formData.primarySkill;
    if (newPrimarySkill && !newSkills.includes(newPrimarySkill)) {
      newPrimarySkill = newSkills[0] || null;
    }

    setFormData({
      ...formData,
      skills: newSkills,
      primarySkill: newPrimarySkill,
    });
    setErrors({ ...errors, skills: '', primarySkill: '' });
  };

  const handlePrimarySkillChange = (skill: string) => {
    setFormData({ ...formData, primarySkill: skill });
    setErrors({ ...errors, primarySkill: '' });
  };

  const validateSkillsStep = (): boolean => {
    const newErrors: any = {};
    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    if (!formData.primarySkill) {
      newErrors.primarySkill = 'Please mark one skill as primary';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsStep = (): boolean => {
    const newErrors: any = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'skills') {
      if (validateSkillsStep()) {
        setCurrentStep('details');
      }
    } else if (currentStep === 'details') {
      if (validateDetailsStep()) {
        setCurrentStep('confirmation');
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('skills');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('details');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        primarySkill: formData.primarySkill as string,
        location: formData.location,
        profileCompleted: true,
      });

      await api.completeOnboarding({ type: 'collaborator-wizard' });

      Alert.alert('Success!', 'Profile completed. Please log in with your credentials.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
      setLoading(false);
    }
  };

  const stepNumber = { skills: 1, details: 2, confirmation: 3 }[currentStep];
  const stepTitles = {
    skills: 'Select Your Skills',
    details: 'Tell Us About Yourself',
    confirmation: 'All Set!',
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${(stepNumber / 3) * 100}%` }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepIndicator}>Step {stepNumber} of 3</Text>
        <Text style={styles.title}>{stepTitles[currentStep]}</Text>

        {currentStep === 'skills' && (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Select Skills (click to toggle)</Text>
            <View style={styles.skillsGrid}>
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = formData.skills.includes(skill);
                const isPrimary = formData.primarySkill === skill;

                return (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.skillButton,
                      isSelected && styles.skillButtonSelected,
                    ]}
                    onPress={() => handleSkillToggle(skill)}
                  >
                    {isPrimary && <Text style={styles.star}>⭐ </Text>}
                    <Text style={[styles.skillText, isSelected && styles.skillTextSelected]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}

            {formData.skills.length > 0 && (
              <View style={styles.primarySection}>
                <Text style={styles.label}>Mark Primary Skill</Text>
                <View style={styles.primaryOptions}>
                  {formData.skills.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.primaryOption,
                        formData.primarySkill === skill && styles.primaryOptionSelected,
                      ]}
                      onPress={() => handlePrimarySkillChange(skill)}
                    >
                      <Text
                        style={[
                          styles.primaryOptionText,
                          formData.primarySkill === skill && styles.primaryOptionTextSelected,
                        ]}
                      >
                        {formData.primarySkill === skill ? '✓ ' : ''}
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.primarySkill && <Text style={styles.errorText}>{errors.primarySkill}</Text>}
              </View>
            )}
          </View>
        )}

        {currentStep === 'details' && (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="John"
                placeholderTextColor="#666"
                value={formData.firstName}
                onChangeText={(text) => {
                  setFormData({ ...formData, firstName: text });
                  setErrors({ ...errors, firstName: '' });
                }}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor="#666"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell creators about yourself..."
                placeholderTextColor="#666"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.charCount}>{formData.bio.length}/500</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="San Francisco, CA"
                placeholderTextColor="#666"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />
            </View>
          </View>
        )}

        {currentStep === 'confirmation' && (
          <View style={styles.stepContent}>
            <View style={styles.confirmationBox}>
              <Text style={styles.confirmationTitle}>Skills</Text>
              <View style={styles.skillBadges}>
                {formData.skills.map((skill) => (
                  <View
                    key={skill}
                    style={[
                      styles.badge,
                      formData.primarySkill === skill && styles.badgePrimary,
                    ]}
                  >
                    {formData.primarySkill === skill && <Text style={styles.starBadge}>⭐ </Text>}
                    <Text
                      style={[
                        styles.badgeText,
                        formData.primarySkill === skill && styles.badgeTextPrimary,
                      ]}
                    >
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.confirmationTitle, { marginTop: 20 }]}>Personal Information</Text>
              <Text style={styles.confirmationInfo}>
                <Text style={styles.confirmationLabel}>Name: </Text>
                {formData.firstName} {formData.lastName}
              </Text>
              {formData.bio && (
                <Text style={styles.confirmationInfo}>
                  <Text style={styles.confirmationLabel}>Bio: </Text>
                  {formData.bio}
                </Text>
              )}
              {formData.location && (
                <Text style={styles.confirmationInfo}>
                  <Text style={styles.confirmationLabel}>Location: </Text>
                  {formData.location}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep('details')}>
              <Text style={styles.editButtonText}>← Edit Information</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep !== 'skills' && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBackStep}
              disabled={loading}
            >
              <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={currentStep === 'confirmation' ? handleComplete : handleNextStep}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.nextButtonText}>
                {currentStep === 'confirmation' ? 'Complete' : 'Next →'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099ff',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0099ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContent: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  skillButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1a1a2e',
    width: `${(width - 52) / 2}`,
    alignItems: 'center',
  },
  skillButtonSelected: {
    borderColor: '#0099ff',
    backgroundColor: '#0a2940',
  },
  skillText: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  skillTextSelected: {
    color: '#0099ff',
    fontWeight: '600',
  },
  star: {
    fontSize: 16,
  },
  primarySection: {
    marginTop: 20,
  },
  primaryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  primaryOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1a1a2e',
  },
  primaryOptionSelected: {
    borderColor: '#ffd700',
    backgroundColor: '#332d00',
  },
  primaryOptionText: {
    fontSize: 12,
    color: '#999',
  },
  primaryOptionTextSelected: {
    color: '#ffd700',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#ccc',
    backgroundColor: '#1a1a2e',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
  },
  confirmationBox: {
    backgroundColor: '#0f1419',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0099ff',
    marginBottom: 12,
  },
  skillBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1a3a5d',
  },
  badgePrimary: {
    backgroundColor: '#332d00',
  },
  badgeText: {
    fontSize: 12,
    color: '#0099ff',
    fontWeight: '500',
  },
  badgeTextPrimary: {
    color: '#ffd700',
  },
  starBadge: {
    fontSize: 14,
  },
  confirmationInfo: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  confirmationLabel: {
    color: '#999',
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1a1a2e',
    marginBottom: 16,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ccc',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1a1a2e',
  },
  nextButton: {
    backgroundColor: '#0099ff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
});
