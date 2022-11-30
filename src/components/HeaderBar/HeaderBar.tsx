import React from 'react';

import OrcanaLogo from '../IntroContainer/OrcanaLogo';
import ParticipantList from '../ParticipantList/ParticipantList';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu/Menu';

import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import useParticipants from '../../hooks/useParticipants/useParticipants';

const useStyles = makeStyles((theme: Theme) => ({
  clickables: {
    margin: '0 2% 0 auto',
  },
  root: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: '#dfeaef',
  },
  title: {
    fill: '#393939',
    height: '65px',
    width: '65px',
    marginLeft: '3%',
    marginRight: '3%',
  },
  box: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    position: 'relative',
    maxWidth: '1920px',
    margin: '0 auto',
    padding: '0',
  },
}));

interface HeaderBarProps {
  setTitleBarHeight: (height: number) => void;
}

export default function HeaderBar(props: HeaderBarProps) {
  const classes = useStyles();

  React.useEffect(() => {
    const headerBarHeight = document.querySelector(`.${classes.root}`)?.clientHeight;
    if (headerBarHeight) props.setTitleBarHeight(headerBarHeight);
  }, []);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    console.debug('HeaderBar#windowWidth', windowWidth);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const participants = useParticipants();
  const [displayPaginationButtons, setDisplayPaginationButtons] = React.useState(false);
  React.useEffect(() => {
    const participantCount = participants.length + 1;
    console.debug('HeaderBar#participantCount', participantCount);

    const totalParticipantWidth = 161 * participantCount;
    console.debug('HeaderBar#totalParticipantWidth', totalParticipantWidth);

    setDisplayPaginationButtons(totalParticipantWidth + 450 > windowWidth ? true : false);
    console.debug('HeaderBar#displayPaginationButtons', totalParticipantWidth + 500 > windowWidth ? true : false);
  }, [participants, windowWidth]);

  const divRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        <OrcanaLogo className={classes.title} />
        {displayPaginationButtons && (
          <IconButton aria-label="Back" onClick={() => divRef.current?.scrollBy({ left: -161, behavior: 'smooth' })}>
            <ArrowBackIosIcon />
          </IconButton>
        )}
        <ParticipantList divRef={divRef} />
        {displayPaginationButtons && (
          <IconButton aria-label="Forward" onClick={() => divRef.current?.scrollBy({ left: 161, behavior: 'smooth' })}>
            <ArrowForwardIosIcon />
          </IconButton>
        )}
        <Toolbar></Toolbar>
        <Grid className={classes.clickables}>
          <Menu />
          <EndCallButton />
        </Grid>
      </Box>
    </div>
  );
}
