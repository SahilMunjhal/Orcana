import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'rgba(255, 255, 255, 0)',
      margin: '0 0.6em',
      border: '1px solid #1086be',
      color: '#1086be',
      '&:hover': {
        background: '#1b263b',
        color: '#fff',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button
      size="small"
      onClick={() => {
        room.disconnect();
        window.location.reload();
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      LEAVE SESSION
    </Button>
  );
}
