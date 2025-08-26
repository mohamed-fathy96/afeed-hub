import React, { ReactNode, ReactElement } from 'react';

interface ConditionalWrapperProps {
  initialWrapper: (children: ReactNode) => ReactElement | null;
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement | null;
  children: ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  initialWrapper,
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : initialWrapper(children));

export default ConditionalWrapper;
