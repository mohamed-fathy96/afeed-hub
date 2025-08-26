import React from 'react';
import classes from './Styles.module.scss';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className={classes.notFoundContainer}>
      <div className={classes.notFoundContent}>
        <h1 className={classes.notFoundTitle}>404</h1>
        <h2 className={classes.notFoundSubtitle}>Page Not Found</h2>
        <p className={classes.notFoundText}>The page you are looking for does not exist</p>
        <Link to="/" className={classes.notFoundButton}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
