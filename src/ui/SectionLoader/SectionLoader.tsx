import React from 'react';
import classes from './Styles.module.scss';

export const SectionLoader: React.FC = () => {
  return (
    <div className={classes.loaderContainer}>
      <div className={classes.loader}></div>
    </div>
  );
};

