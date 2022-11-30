import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Swoosh from './swoosh';
import OrcanaLogo from './OrcanaLogo';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, rgba(223,234,239,1) 55%, rgba(255,255,255,1) 55%)',
    height: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    width: '500px',
    height: '50%',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
    },
  },
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: Swoosh,
    backgroundSize: 'cover',
    width: '296px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  logoTest: {
    display: 'flex',
    width: '150px',
    height: '150px',
    fill: '#393939',
    margin: 'auto',
  },
  smallLogo: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -350px)',
    width: '150px',
    height: '150px',
    fill: '#393939',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '4em',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  title: {
    color: 'white',
    margin: '1em 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: '1.1rem',
    },
  },
  subContentContainer: {
    position: 'absolute',
    marginTop: '1em',
    width: '100%',
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
  subContent?: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();

  return (
    <div className={classes.background}>
      {user && location.pathname !== '/login' && <UserMenu />}
      <div className={classes.container}>
        <OrcanaLogo className={classes.logoTest} fill={'#dfeaef'} />
        <div className={classes.innerContainer}>
          <div className={classes.content}>{props.children}</div>
        </div>
        {props.subContent && <div className={classes.subContentContainer}>{props.subContent}</div>}
      </div>
    </div>
  );
};

export default IntroContainer;
