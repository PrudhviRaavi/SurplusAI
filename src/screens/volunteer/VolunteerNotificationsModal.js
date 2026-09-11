import React from 'react';
import { NotificationCenterScreen } from '../common/NotificationCenterScreen';

export const VolunteerNotificationsModal = ({ onClose }) => {
  return <NotificationCenterScreen onBack={onClose} />;
};
