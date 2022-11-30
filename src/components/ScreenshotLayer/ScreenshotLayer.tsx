import React, { useContext } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { styled, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { AnnotationLayer } from '../AnnotationLayer/AnnotationLayer';

import { ScreenshotContext } from './ScreenshotLayerContext';

import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import { useAppState } from '../../state';

interface IProps {
  isOpen?: boolean;
  roomDimensions: { width: number | undefined; height: number | undefined };
  src?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    screenshotContainer: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      'max-width': '100%',
      'max-height': '100%',
      overflow: 'hidden',
      'z-index': '10',
      display: 'none',
    },
    active: {
      display: 'block',
    },
  })
);

const GreenFrame = styled('div')({
  position: 'absolute',
  pointerEvents: 'none',
  border: '10px solid #5cb953',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  'z-index': '6',
});
const GreenMenu = styled('div')({
  position: 'absolute',
  background: '#5cb953',
  color: '#fff',
  top: '0',
  left: '10px',
  'border-bottom-right-radius': '5px',
  overflow: 'hidden',
  'z-index': '4',
  '& p': {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export const ScreenshotLayer = (props: IProps) => {
  const {
    isOpen,
    roomDimensions,
    roomDimensions: { width, height },
  } = props;
  const classes = useStyles();
  const { screenshot, screenshotDispatch } = useContext(ScreenshotContext);
  const { room } = useVideoContext();
  const handleClose = () => {
    const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
    const item = { type: 'UPDATE_SCREENSHOT', screenshot: { src: null }, roomDimensions };
    console.log('data track publication from ScreenshotLayer');
    console.log(item);
    localDataTrackPublication.track.send(JSON.stringify(item));
    screenshotDispatch(item);
  };

  const { orcanaUser } = useAppState();
  const canAdmin = orcanaUser?.canAdmin || false;

  return (
    <div
      className={clsx(classes.screenshotContainer, {
        [classes.active]: isOpen,
      })}
    >
      {screenshot && width && height && <img src={screenshot.src} alt="" width={width} height={height} />}
      <GreenFrame />
      <AnnotationLayer roomDimensions={roomDimensions} />
      {canAdmin && (
        <GreenMenu>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
            <Typography>Close Screenshot</Typography>
          </IconButton>
        </GreenMenu>
      )}
    </div>
  );
};
