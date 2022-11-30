import { Grid, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      background: 'white',
      margin: '0.25em 0',
      display: 'flex',
      height: `${theme.mobileTopBarHeight}px`,
    },
    title: {
      fontWeight: 'lighter',
    },
  })
);

export default function TitleBar() {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Grid container alignItems="center" justify="space-between" className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        {room.name}
      </Typography>
      <Grid style={{ flex: 1 }}>
        <Grid container justify="flex-end">
          <Menu />
          <EndCallButton />
        </Grid>
      </Grid>
    </Grid>
  );
}
