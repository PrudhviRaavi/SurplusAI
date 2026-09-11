import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { supportService } from '../../services/support/supportService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const HelpSupportScreen = ({ onBack }) => {
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = supportService.getFaqs();

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleSubmitTicket = async () => {
    await supportService.submitSupportRequest({ subject, message });
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setSubject('');
      setMessage('');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>HELP & SUPPORT</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            How can we <Text style={styles.italicSerif}>help you?</Text>
          </Text>
          <Text style={styles.subtitle}>Frequently asked questions and direct support ticket submission.</Text>
        </View>

        {/* Expandable FAQs Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>FREQUENTLY ASKED QUESTIONS</Text>

          <View style={styles.faqList}>
            {faqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <TouchableOpacity
                  key={faq.id}
                  activeOpacity={0.8}
                  onPress={() => toggleFaq(faq.id)}
                  style={styles.faqItem}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
                  </View>

                  {isExpanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Support Ticket Submission Form */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>CONTACT SUPPORT TEAM</Text>

          {ticketSubmitted ? (
            <View style={styles.submittedBox}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.submittedText}>Support Request Submitted! ✓</Text>
              <Text style={styles.submittedSub}>Our team will review and respond within 24 hours.</Text>
            </View>
          ) : (
            <View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>SUBJECT</Text>
                <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="e.g. Issue with pickup verification" />
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.label}>MESSAGE DETAILS</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  multiline
                  numberOfLines={4}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Describe your issue or feedback in detail..."
                />
              </View>

              <LuxuryButton
                title="Submit Support Ticket →"
                onPress={handleSubmitTicket}
                variant="primary"
                size="large"
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#FAF4EB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  fieldBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins',
  },
  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  submittedBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  submittedText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 6,
  },
  submittedSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
