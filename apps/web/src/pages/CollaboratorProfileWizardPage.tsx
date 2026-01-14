import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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

interface ValidationErrors {
  [key: string]: string;
}

const STEP_TITLES = {
  skills: 'Select Your Skills',
  details: 'Tell Us About Yourself',
  confirmation: 'All Set!',
};

const STEP_SUBTITLES = {
  skills: 'Choose your areas of expertise (at least 1 required)',
  details: 'Help creators understand who you are',
  confirmation: 'Review your profile before continuing',
};

export default function CollaboratorProfileWizardPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'skills' | 'details' | 'confirmation'>('skills');
  const [formData, setFormData] = useState<FormData>({
    skills: [],
    primarySkill: null,
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
    setFormData({
      ...formData,
      primarySkill: skill,
    });
    setErrors({ ...errors, primarySkill: '' });
  };

  const validateSkillsStep = (): boolean => {
    const newErrors: ValidationErrors = {};

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
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2 || formData.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must be 2-50 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, and hyphens';
    }

    if (
      formData.lastName &&
      (formData.lastName.length > 50 || !/^[a-zA-Z\s-]+$/.test(formData.lastName))
    ) {
      newErrors.lastName = 'Last name invalid';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be under 500 characters';
    }

    if (formData.location.length > 100) {
      newErrors.location = 'Location must be under 100 characters';
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

  const handleBackToRoleSelection = () => {
    navigate('/role-selection', { replace: true });
  };

  const handleSkipWizard = () => {
    navigate('/', { replace: true });
  };

  const handleComplete = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('userToken');
      console.log('Token exists:', !!token);
      console.log('Token value:', token ? `${token.substring(0, 50)}...` : 'NONE');

      // Update profile
      console.log('Updating profile with data:', {
        firstName: formData.firstName,
        skills: formData.skills,
        primarySkill: formData.primarySkill,
      });

      const profileRes = await api.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        primarySkill: formData.primarySkill as string,
        location: formData.location,
        profileCompleted: true,
      });
      console.log('Profile updated successfully:', profileRes);

      // Mark wizard as completed
      console.log('Completing onboarding...');
      const onboardingRes = await api.completeOnboarding({ type: 'collaborator-wizard' });
      console.log('Onboarding completed successfully:', onboardingRes);

      // Redirect to login
      navigate('/login', {
        state: { message: 'Profile completed! Please log in with your credentials.' },
        replace: true,
      });
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      setSubmitError(error.message || 'Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  const stepKey = currentStep;
  const title = STEP_TITLES[stepKey];
  const subtitle = STEP_SUBTITLES[stepKey];
  const stepNumber = { skills: 1, details: 2, confirmation: 3 }[stepKey];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        }}
      >
        <div style={{ maxWidth: '600px', width: '100%' }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                Step {stepNumber} of 3
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: num <= stepNumber ? '#0099ff' : '#333',
                    borderRadius: '2px',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1
              style={{
                color: '#0099ff',
                marginBottom: '8px',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              {title}
            </h1>
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>{subtitle}</p>
          </div>

          {/* Content */}
          {currentStep === 'skills' && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ color: '#ccc', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '16px' }}>
                  Select Skills (click to toggle)
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    const isPrimary = formData.primarySkill === skill;

                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '6px',
                          border: isSelected ? '2px solid #0099ff' : '1px solid #444',
                          backgroundColor: isSelected ? '#0a2940' : '#1a1a2e',
                          color: isSelected ? '#0099ff' : '#ccc',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '400',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        {isPrimary && <span style={{ fontSize: '16px' }}>⭐</span>}
                        {skill}
                      </button>
                    );
                  })}
                </div>
                {errors.skills && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                    {errors.skills}
                  </p>
                )}
              </div>

              {formData.skills.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ color: '#ccc', fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '12px' }}>
                    Mark Primary Skill
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {formData.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handlePrimarySkillChange(skill)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: formData.primarySkill === skill ? '2px solid #ffd700' : '1px solid #444',
                          backgroundColor:
                            formData.primarySkill === skill ? '#332d00' : '#1a1a2e',
                          color: formData.primarySkill === skill ? '#ffd700' : '#999',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: formData.primarySkill === skill ? '600' : '400',
                          transition: 'all 0.2s',
                        }}
                      >
                        {formData.primarySkill === skill ? '✓ ' : ''}
                        {skill}
                      </button>
                    ))}
                  </div>
                  {errors.primarySkill && (
                    <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '8px' }}>
                      {errors.primarySkill}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 'details' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ccc', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    setErrors({ ...errors, firstName: '' });
                  }}
                  placeholder="John"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.firstName ? '1px solid #ff6b6b' : '1px solid #444',
                    backgroundColor: '#1a1a2e',
                    color: '#ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.firstName && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ccc', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    setErrors({ ...errors, lastName: '' });
                  }}
                  placeholder="Doe"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.lastName ? '1px solid #ff6b6b' : '1px solid #444',
                    backgroundColor: '#1a1a2e',
                    color: '#ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.lastName && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ccc', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => {
                    setFormData({ ...formData, bio: e.target.value });
                    setErrors({ ...errors, bio: '' });
                  }}
                  placeholder="Tell creators about yourself..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.bio ? '1px solid #ff6b6b' : '1px solid #444',
                    backgroundColor: '#1a1a2e',
                    color: '#ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  {formData.bio.length}/500 characters
                </p>
                {errors.bio && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
                    {errors.bio}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ccc', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    setErrors({ ...errors, location: '' });
                  }}
                  placeholder="San Francisco, CA"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.location ? '1px solid #ff6b6b' : '1px solid #444',
                    backgroundColor: '#1a1a2e',
                    color: '#ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.location && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 'confirmation' && (
            <div>
              <div style={{ backgroundColor: '#0f1419', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#0099ff', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Skills
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          backgroundColor:
                            formData.primarySkill === skill ? '#332d00' : '#1a3a5d',
                          color: formData.primarySkill === skill ? '#ffd700' : '#0099ff',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {formData.primarySkill === skill && '⭐ '}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#0099ff', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Personal Information
                  </h3>
                  <div style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.8' }}>
                    <p style={{ margin: '4px 0' }}>
                      <span style={{ color: '#999' }}>Name:</span> {formData.firstName} {formData.lastName}
                    </p>
                    {formData.bio && (
                      <p style={{ margin: '4px 0' }}>
                        <span style={{ color: '#999' }}>Bio:</span> {formData.bio}
                      </p>
                    )}
                    {formData.location && (
                      <p style={{ margin: '4px 0' }}>
                        <span style={{ color: '#999' }}>Location:</span> {formData.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('details')}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#444',
                  color: '#ccc',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '10px',
                }}
              >
                ← Edit Information
              </button>
            </div>
          )}

          {submitError && (
            <div style={{
              backgroundColor: '#ff6b6b20',
              border: '1px solid #ff6b6b',
              borderRadius: '6px',
              padding: '12px',
              color: '#ff6b6b',
              fontSize: '14px',
              marginTop: '20px',
            }}>
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
            {currentStep === 'skills' ? (
              <>
                <button
                  onClick={handleBackToRoleSelection}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    backgroundColor: '#1a1a2e',
                    color: '#ccc',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSkipWizard}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #666',
                    backgroundColor: 'transparent',
                    color: '#999',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  Skip for Now
                </button>
              </>
            ) : (
              <button
                onClick={handleBackStep}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  backgroundColor: '#1a1a2e',
                  color: '#ccc',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={currentStep === 'confirmation' ? handleComplete : handleNextStep}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#0099ff',
                color: '#000',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Processing...' : currentStep === 'confirmation' ? 'Complete' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
