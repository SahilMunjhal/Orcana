import React, { useCallback, useRef } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import VideoOffIcon from '../../icons/VideoOffIcon';
import VideoOnIcon from '../../icons/VideoOnIcon';

import { useHasVideoInputDevices } from '../../hooks/deviceHooks/deviceHooks';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';

const useStyles = makeStyles((theme: Theme) => ({
  red: {
    backgroundColor: '#FF0000',
    marginRight: '2em',
  },
  green: {
    backgroundColor: '#149414',
    marginRight: '2em',
  },
}));

export default function VideoStatusIndicator() {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const hasVideoDevices = useHasVideoInputDevices();
  const classes = useStyles();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return <Chip label={isVideoEnabled ? 'LIVE' : 'OFF'} className={isVideoEnabled ? classes.green : classes.red} />;
}
