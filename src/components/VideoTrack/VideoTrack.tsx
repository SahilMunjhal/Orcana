import React, { useRef, useEffect, useContext } from 'react';
import _ from 'lodash';
import { IVideoTrack } from '../../types';
import { makeStyles } from '@material-ui/core';
import { Track } from 'twilio-video';
// import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';
import { RoomContext } from '../Room/RoomContext';
const useStyles = makeStyles({
  video: {
    background: 'black',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

interface VideoTrackProps {
  isMain?: boolean;
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
  id?: string;
  ref?: any;
}

export default function VideoTrack({ track, isLocal, priority, id }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const classes = useStyles();
  const { room, roomDispatch } = useContext(RoomContext);
  // const mediaStreamTrack = useMediaStreamTrack(track);
  const dimensions: any = useVideoTrackDimensions(track);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    const updateWindowDimensions = () => {
      if (_.get(room, 'width', 0) !== el.clientWidth && id === 'mainParticipant') {
        const width = dimensions.width;
        const height = dimensions.height;
        const aspectRatio = dimensions?.width / dimensions?.height;
        const item = { type: 'UPDATE_DIEMENSIONS', room: { aspectRatio, width, height } };
        roomDispatch(item);
      }
    };
    _.get(room, 'width', null) === null && updateWindowDimensions();
    track.attach(el);
    window.addEventListener('resize', updateWindowDimensions);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, [track, priority, id, dimensions, room, isPortrait, roomDispatch]);

  // The local video track is mirrored if it is not facing the environment.
  // const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  // const transform = isLocal && isFrontFacing ? 'rotateY(180deg)' : '';
  const style = {
    // transform: 'rotateY(180deg)',
    // objectFit: 'cover' as const,
  };

  return <video ref={ref} id={id} className={classes.video} style={style} />;
}
