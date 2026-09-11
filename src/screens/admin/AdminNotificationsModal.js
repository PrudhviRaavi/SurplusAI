import React from 'react';
import { NotificationCenterScreen } from '../common/NotificationCenterScreen';

export const AdminNotificationsModal = ({ onClose }) => {
  return <NotificationCenterScreen onBack={onClose} />;
};
