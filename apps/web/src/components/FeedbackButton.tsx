import React, { useState } from 'react';
import api from '../api';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    category: string;
    title: string;
    description: string;
    priority: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.createFeedback(data);
      if (res.success) {
        setShowModal(false);
        alert('Thank you for your feedback!');
      } else {
        alert(res.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={styles.feedbackButton}
        title="Send Feedback"
      >
        💬
      </button>

      {showModal && (
        <FeedbackModal
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}

const styles: any = {
  feedbackButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#0099ff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 153, 255, 0.4)',
    zIndex: '500',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#0077cc',
      boxShadow: '0 6px 16px rgba(0, 153, 255, 0.6)',
    },
  },
};
