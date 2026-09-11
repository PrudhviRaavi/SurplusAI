import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

export const OtpInputField = ({ length = 6, value = '', onChangeCode, onResend }) => {
  const [digits, setDigits] = useState(
    Array.from({ length }, (_, i) => value[i] || '')
  );
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);

    const combined = newDigits.join('');
    if (onChangeCode) {
      onChangeCode(combined);
    }

    // Auto focus next box
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.otpRow}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpBox,
              !!digits[index] && styles.otpBoxFilled,
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digits[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity onPress={onResend} style={styles.resendBtn} activeOpacity={0.7}>
        <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend code</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: '#FAF4EB',
  },
  resendBtn: {
    marginTop: 20,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  resendLink: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
