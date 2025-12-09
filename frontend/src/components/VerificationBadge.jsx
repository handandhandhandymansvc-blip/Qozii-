import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const VerificationBadge = ({ verified, verificationDate, size = 'md', showText = true, showDate = false }) => {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full ${sizeClasses[size]} font-semibold shadow-md`}>
      <Shield className={`${iconSizes[size]} fill-white`} />
      {showText && <span>Verified</span>}
      {showDate && verificationDate && (
        <span className="text-xs opacity-90">({new Date(verificationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})</span>
      )}
    </div>
  );
};

export default VerificationBadge;