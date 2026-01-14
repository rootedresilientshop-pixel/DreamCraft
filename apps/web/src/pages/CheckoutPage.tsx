import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const stripe: any = (window as any).Stripe;
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

  useEffect(() => {
    fetchIdea();
    initializeStripe();
  }, [id]);

  const initializeStripe = () => {
    if (!stripe) {
      setError('Stripe failed to load. Please refresh the page.');
      return;
    }

    const stripeKey = (import.meta.env as any).VITE_STRIPE_PUBLIC_KEY;
    if (!stripeKey) {
      setError('Stripe is not configured. Please contact support.');
      return;
    }

    try {
      const stripeInstance = stripe(stripeKey);
      const elementsInstance = stripeInstance.elements();
      const card = elementsInstance.create('card', {
        style: {
          base: {
            color: '#ccc',
            backgroundColor: '#1a1a1a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '14px',
            '::placeholder': {
              color: '#666',
            },
          },
          invalid: {
            color: '#ff6666',
          },
        },
      });

      card.mount('#card-element');
      card.addEventListener('change', (event: any) => {
        if (event.error) {
          setCardError(event.error.message);
        } else {
          setCardError('');
        }
      });

      setElements(stripeInstance);
      setCardElement(card);
    } catch (err: any) {
      setError('Failed to initialize payment form');
      console.error('Stripe error:', err);
    }
  };

  const fetchIdea = async () => {
    setLoading(true);
    setError('');
    try {
      if (!id) {
        setError('Idea ID not provided');
        return;
      }
      const res = await api.getIdeaDetail(id);
      if (res.success && res.data) {
        setIdea(res.data);
      } else {
        setError(res.error || 'Failed to load idea');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading idea');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !cardElement || !id) return;

    setProcessing(true);
    try {
      // Create payment intent
      const intentRes = await api.createPaymentIntent(id, idea.price * 100);
      if (!intentRes.success || !intentRes.data) {
        setError(intentRes.error || 'Failed to create payment intent');
        setProcessing(false);
        return;
      }

      const clientSecret = intentRes.data.clientSecret;

      // Confirm the payment
      const result = await elements.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError('');
        setTimeout(() => {
          navigate(`/ideas/${id}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <p style={styles.loading}>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !idea) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0099ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>Idea not found</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0099ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate(`/ideas/${id}`)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0099ff',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ← Back to Idea
        </button>
      </div>

      <div style={styles.checkoutCard}>
        <h1 style={styles.title}>Purchase Idea</h1>

        {/* Idea Summary */}
        <div style={styles.summarySection}>
          <h2 style={styles.sectionTitle}>{idea.title}</h2>
          <p style={styles.description}>{idea.description}</p>
          <div style={styles.divider} />
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>Price</span>
            <span style={styles.priceValue}>${idea.price}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.formTitle}>Payment Details</h3>

          {succeeded && (
            <div style={styles.successBox}>
              <p style={styles.successText}>✓ Payment successful! Redirecting...</p>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Card Details</label>
            <div
              id="card-element"
              style={{
                padding: '10px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                minHeight: '40px',
              }}
            />
            {cardError && <p style={styles.fieldError}>{cardError}</p>}
          </div>

          <button
            type="submit"
            disabled={processing || succeeded || !cardElement}
            style={{
              ...styles.submitButton,
              opacity: processing || succeeded ? 0.7 : 1,
              cursor: processing || succeeded ? 'not-allowed' : 'pointer',
            }}
          >
            {processing ? '⏳ Processing...' : succeeded ? '✓ Payment Confirmed' : `Pay $${idea.price}`}
          </button>
        </form>

        <p style={styles.disclaimer}>
          Your payment is secure and processed by Stripe. Your card details are never stored on our servers.
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  checkoutCard: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 30px 0',
  },
  summarySection: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #333',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#ddd',
  },
  description: {
    fontSize: '14px',
    color: '#999',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
  },
  divider: {
    height: '1px',
    backgroundColor: '#333',
    margin: '15px 0',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#999',
    fontSize: '14px',
  },
  priceValue: {
    color: '#0099ff',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: '20px',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#ddd',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ccc',
  },
  fieldError: {
    color: '#ff6666',
    fontSize: '12px',
    marginTop: '8px',
    margin: '0',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  successBox: {
    backgroundColor: '#1a3d1a',
    border: '1px solid #4d9d4d',
    color: '#66ff66',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  successText: {
    margin: 0,
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorText: {
    margin: 0,
    fontSize: '14px',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '40px',
  },
  loading: {
    color: '#999',
    margin: 0,
  },
  disclaimer: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    margin: '0',
  },
};
