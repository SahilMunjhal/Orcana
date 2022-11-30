import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FlipCameraButton from './FlipCameraButton/FlipCameraButton';

import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography, Grid } from '@material-ui/core';
import ToggleAudioButton from '../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../Buttons/ToggleVideoButton/ToggleVideoButton';
import VideoStatusIndicator from '../VideoStatusIndicator/VideoStatusIndicator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      top: '0.5em',
      right: 0,
      color: 'white',
      position: 'absolute',
      display: 'flex',
      zIndex: 8,
      fill: 'white',
      '& button': {
        color: 'white',
        '& svg': {
          fill: 'white',
        },
        '&:hover': {
          color: 'white',
        },
      },
    },
    screenShareBanner: {
      position: 'fixed',
      zIndex: 10,
      bottom: '10%',
      left: 0,
      right: 0,
      height: '104px',
      background: 'rgba(0, 0, 0, 0.5)',
      '& h6': {
        color: 'white',
      },
      '& button': {
        background: 'white',
        color: 'red',
        border: `2px solid red`,
        margin: '0 2em',
        '&:hover': {
          color: 'white',
          border: `2px solid red`,
          background: 'red',
        },
      },
    },
    opaqueBackground: {
      paddingRight: '0.5em',
      marginRight: '20px',
      background: 'rgba(0, 0, 0, 0.5)',
      justify: 'space-between',
    },
  })
);

export default function MainParticipantMenu(props: { openScreenshot?: any }) {
  const classes = useStyles();
  const { isSharingScreen, toggleScreenShare } = useVideoContext();
  const roomState = useRoomState();
  const isReconnecting = roomState === 'reconnecting';

  return (
    <>
      {isSharingScreen && (
        <Grid container justify="center" alignItems="center" className={classes.screenShareBanner}>
          <Typography variant="h6">You are sharing your screen</Typography>
          <Button onClick={() => toggleScreenShare()}>Stop Sharing</Button>
        </Grid>
      )}
      <div className={classes.container}>
        <Grid container justify="space-around" alignItems="center">
          <Grid item>
            <Grid container justify="flex-end">
              <VideoStatusIndicator />
              <FlipCameraButton />
              <ToggleVideoButton
                tooltipPlacement={'bottom'}
                className={classes.opaqueBackground}
                color={'white'}
                disabled={isReconnecting}
              />
              <ToggleAudioButton
                tooltipPlacement={'bottom'}
                className={classes.opaqueBackground}
                color={'white'}
                disabled={isReconnecting}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
