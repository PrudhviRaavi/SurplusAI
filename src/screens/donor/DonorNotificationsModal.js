import React from 'react';
import { NotificationCenterScreen } from '../common/NotificationCenterScreen';

export const DonorNotificationsModal = ({ onClose }) => {
  return <NotificationCenterScreen onBack={onClose} />;
};
