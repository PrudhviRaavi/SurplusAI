import React from 'react';
import { CreateDonationFlow } from './CreateDonationFlow';

export const CreateDonationModalScreen = ({ onClose, onSubmitDonation }) => {
  return (
    <CreateDonationFlow
      onClose={onClose}
      onCompleteFlow={() => {
        if (onSubmitDonation) onSubmitDonation();
        else onClose();
      }}
    />
  );
};
