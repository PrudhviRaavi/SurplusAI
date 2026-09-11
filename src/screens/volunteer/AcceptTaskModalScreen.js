import React from 'react';
import { VolunteerTaskDetailsModalScreen } from './VolunteerTaskDetailsModalScreen';
import { useAppStore } from '../../store/useAppStore';

export const AcceptTaskModalScreen = ({ task, onClose, onConfirmAccept }) => {
  const { acceptVolunteerTask } = useAppStore();

  return (
    <VolunteerTaskDetailsModalScreen
      donation={task}
      onClose={onClose}
      onAcceptTaskComplete={(item) => {
        acceptVolunteerTask(item?.id || 'DON-8842');
        if (onConfirmAccept) onConfirmAccept(item);
        else onClose();
      }}
    />
  );
};
