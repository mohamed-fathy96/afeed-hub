import React, { ReactNode } from 'react';
import RestrictedWrapper from './RestrictedWrapper';

interface RestrictedSectionProps {
  requiredPermissions: string;
  action: string;
  children: ReactNode;
}

const RestrictedSection: React.FC<RestrictedSectionProps> = ({ requiredPermissions, action, children }) => (
  <RestrictedWrapper requiredPermissions={requiredPermissions} action={action}>
    {children}
  </RestrictedWrapper>
);

export default RestrictedSection;
