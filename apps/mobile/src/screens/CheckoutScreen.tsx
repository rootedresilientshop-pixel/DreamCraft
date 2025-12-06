import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import api from '../api';

export default function CheckoutScreen({ route, navigation }: any) {
  const { ideaId } = route.params;
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any>({});

  useEffect(() => {
    fetchIdea();
    navigation.setOptions({
      headerTitle: 'Checkout',
    });
  }, [ideaId]);

  const fetchIdea = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getIdeaDetail(ideaId);
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

  const validateForm = () => {
    const errors: any = {};

    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }

    // Basic card number validation (Luhn algorithm not implemented for simplicity)
    if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Invalid card number';
    }

    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      errors.expiryDate = 'Use MM/YY format';
    }

    if (!cvc.match(/^\d{3,4}$/)) {
      errors.cvc = 'Invalid CVC';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check your card details');
      return;
    }

    setProcessing(true);
    try {
      // Create payment intent
      const intentRes = await api.createPaymentIntent(ideaId, idea.price * 100);
      if (!intentRes.success || !intentRes.data) {
        setError(intentRes.error || 'Failed to create payment intent');
        setProcessing(false);
        return;
      }

      const paymentIntentId = intentRes.data.paymentIntentId;

      // Simulate payment confirmation (in production, use Stripe SDK)
      const confirmRes = await api.confirmPayment(paymentIntentId, 'pm_card_visa');
      if (confirmRes.success) {
        setSucceeded(true);
        setError('');
        Alert.alert('Success', 'Payment completed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('IdeaDetail', { ideaId });
            },
          },
        ]);
      } else {
        setError(confirmRes.error || 'Payment failed');
        setProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0099ff" style={{ marginTop: 40 }} />
        <Text style={styles.loading}>Loading checkout...</Text>
      </View>
    );
  }

  if (error && !idea) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!idea) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Idea not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>Purchase Idea</Text>

        {/* Idea Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>{idea.title}</Text>
          <Text style={styles.description}>{idea.description}</Text>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${idea.price}</Text>
          </View>
        </View>

        {/* Payment Form */}
        <Text style={styles.formTitle}>Payment Details</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {succeeded && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✓ Payment successful!</Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput
            style={[styles.input, fieldErrors.cardholderName && styles.inputError]}
            placeholder="John Doe"
            placeholderTextColor="#666"
            value={cardholderName}
            onChangeText={setCardholderName}
            editable={!processing && !succeeded}
          />
          {fieldErrors.cardholderName && (
            <Text style={styles.fieldError}>{fieldErrors.cardholderName}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={[styles.input, fieldErrors.cardNumber && styles.inputError]}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={formatCardNumber}
            maxLength={19}
            editable={!processing && !succeeded}
          />
          {fieldErrors.cardNumber && (
            <Text style={styles.fieldError}>{fieldErrors.cardNumber}</Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={[styles.input, fieldErrors.expiryDate && styles.inputError]}
              placeholder="MM/YY"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={formatExpiryDate}
              maxLength={5}
              editable={!processing && !succeeded}
            />
            {fieldErrors.expiryDate && (
              <Text style={styles.fieldError}>{fieldErrors.expiryDate}</Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVC</Text>
            <TextInput
              style={[styles.input, fieldErrors.cvc && styles.inputError]}
              placeholder="123"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={cvc}
              onChangeText={setCvc}
              maxLength={4}
              secureTextEntry={true}
              editable={!processing && !succeeded}
            />
            {fieldErrors.cvc && (
              <Text style={styles.fieldError}>{fieldErrors.cvc}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (processing || succeeded) && { opacity: 0.7 },
          ]}
          onPress={handlePayment}
          disabled={processing || succeeded}
        >
          <Text style={styles.submitButtonText}>
            {processing ? '⏳ Processing...' : succeeded ? '✓ Payment Confirmed' : `Pay $${idea.price}`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your payment is secure. Test card: 4242 4242 4242 4242
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  summarySection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#999',
    fontSize: 13,
  },
  priceValue: {
    color: '#0099ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'Courier New',
  },
  inputError: {
    borderColor: '#ff6666',
  },
  fieldError: {
    color: '#ff6666',
    fontSize: 11,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#00cc66',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  successBox: {
    backgroundColor: '#1a3d1a',
    borderWidth: 1,
    borderColor: '#4d9d4d',
    color: '#66ff66',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  successText: {
    color: '#66ff66',
    textAlign: 'center',
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: '#3d1f1f',
    borderWidth: 1,
    borderColor: '#7a3f3f',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  errorText: {
    color: '#ff6666',
    textAlign: 'center',
    fontSize: 13,
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: '#ff6666',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
});
