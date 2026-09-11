import React from 'react';
import { NgoDonationDetailsScreen } from './NgoDonationDetailsScreen';

export const ClaimDonationModalScreen = ({ donation, onClose, onConfirmClaim }) => {
  return (
    <NgoDonationDetailsScreen
      donation={donation}
      onBack={onClose}
      onCompleteClaimFlow={() => {
        if (onConfirmClaim) onConfirmClaim(donation);
        else onClose();
      }}
    />
  );
};
