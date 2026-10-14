import React from 'react';
import { CreateDonationFlow } from './CreateDonationFlow';

export const CreateDonationModalScreen = ({ onClose, onSubmitDonation, initialScannedData }) => {
  return (
    <CreateDonationFlow
      initialScannedData={initialScannedData}
      onClose={onClose}
      onCompleteFlow={() => {
        if (onSubmitDonation) onSubmitDonation();
        else onClose();
      }}
    />
  );
};
