import React, { ReactNode, useState, ReactElement } from "react";

type Props = {
  children: ReactNode;
};

const AppErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const resetError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong.</h1>
        <button onClick={resetError}>Try Again</button>
      </div>
    );
  }

  return children as ReactElement;
};
export default AppErrorBoundary;
