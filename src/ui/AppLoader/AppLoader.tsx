import React, { useSelector } from 'react-redux';
import classes from './Styles.module.scss';
import { getIsLoaderOpen } from '@app/store/app/AppSelectors';

export const AppLoader = (): JSX.Element => {
  const isLoaderOpen = useSelector((state: any) => getIsLoaderOpen({ state }));
  return (
    <div className={`${classes.pageLoader}`} style={{ display: isLoaderOpen ? '' : 'none' }}>
      <div className={classes.loader}></div>
    </div>
  );
};
