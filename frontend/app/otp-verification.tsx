import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { login, saveToken } from '../src/lib/auth';
import { apiPost } from '../src/lib/api';

export default function OTPVerification() {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { email, purpose, password, name } = useLocalSearchParams();

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Por favor ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Verificando OTP para:', { email, code: otpCode, purpose });
      
      // Si es para login, hacer login directamente con OTP
      if (purpose === 'login' && password) {
        try {
          console.log('🔑 Haciendo login con OTP...');
          const loginData = await apiPost('/api/auth/login', {
            email,
            password,
            otpCode,
          });

          await saveToken(loginData.token);
          Alert.alert('Éxito', 'Inicio de sesión exitoso');
          router.replace('/home');
        } catch (loginError) {
          console.error('❌ Error en login:', loginError);
          Alert.alert('Error', (loginError as any)?.message || 'Error completando el login');
        }
      } else if (purpose === 'register') {
        // Para registro, verificar OTP primero
        const otpData = await apiPost('/api/auth/verify-otp', {
          email,
          code: otpCode,
          purpose,
        });

        console.log('📄 Datos OTP:', otpData);

        if (otpData.verified) {
          Alert.alert('Éxito', 'Código verificado correctamente');
          // Redirigir a completar perfil con los datos del registro
          router.push({
            pathname: './profile-setup' as any,
            params: { 
              name: name,
              email: email,
              password: password,
              otpCode: otpCode
            }
          });
        } else {
          Alert.alert('Error', otpData.message);
        }
      } else {
        // Para otros propósitos, verificar OTP normalmente
        const otpData = await apiPost('/api/auth/verify-otp', {
          email,
          code: otpCode,
          purpose,
        });

        if (otpData.verified) {
          Alert.alert('Éxito', 'Código verificado correctamente');
        } else {
          Alert.alert('Error', otpData.message);
        }
      }
    } catch (error) {
      console.error('❌ Error en verificación OTP:', error);
      Alert.alert('Error', `Error de conexión: ${(error as any)?.message || 'Verifica tu conexión a internet'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      console.log('🔄 Reenviando OTP para:', { email, purpose });
      const data = await apiPost('/api/auth/request-otp', {
        email,
        purpose,
      });

      Alert.alert('Éxito', 'Nuevo código enviado');
    } catch (error) {
      console.error('❌ Error reenviando OTP:', error);
      Alert.alert('Error', (error as any)?.message || 'Error enviando nuevo código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verificación de Código</Text>
        <Text style={styles.subtitle}>
          Hemos enviado un código de 6 dígitos a:
        </Text>
        <Text style={styles.email}>{email}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Ingresa el código"
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="numeric"
          maxLength={6}
          autoFocus
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={loading}
        >
          <Text style={styles.resendText}>Reenviar código</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#007bff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#007bff',
    textAlign: 'center',
    fontSize: 14,
  },
});