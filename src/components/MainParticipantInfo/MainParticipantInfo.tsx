import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

import OrcanaLogo from '../../icons/OrcanaLogoWhite.png';
import AvatarIcon from '../../icons/AvatarIcon';
import Typography from '@material-ui/core/Typography';

import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useTrack from '../../hooks/useTrack/useTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import { useAppState } from '../../state';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    display: 'block',
    alignItems: 'center',
  },
  identity: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    // background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 90%)',
    height: '40px',
    color: 'white',
    top: '0.5em',
    pointerEvents: 'none',
    touchAction: 'none',
    padding: '0 0 0 0',
    fontSize: '1.2em',
    display: 'inline-flex',
    '& svg': {
      marginLeft: '0.3em',
    },
  },
  infoContainer: {
    zIndex: 2,
    height: '100%',
    maxHeight: '720px',
    width: '100%',
  },
  reconnectingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(40, 42, 43, 0.75)',
    zIndex: 1,
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
    height: 'calc(100vw * 0.5625)',
    maxHeight: '720px',
    width: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    '& svg': {
      transform: 'scale(2)',
    },
  },
}));

interface MainParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
}

export default function MainParticipantInfo({ participant, children }: MainParticipantInfoProps) {
  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const isLocal = localParticipant === participant;

  const screenShareParticipant = useScreenShareParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  const publications = usePublications(participant);
  const videoPublication = publications.find(p => p.trackName.includes('camera'));
  const screenSharePublication = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(screenSharePublication || videoPublication);
  const isVideoEnabled = Boolean(videoTrack);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;

  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const { orcanaUser } = useAppState();
  const canAdmin = orcanaUser?.canAdmin || false;

  return (
    <div data-cy-main-participant data-cy-participant={participant.identity} className={classes.container}>
      <div className={classes.infoContainer}>
        <div className={classes.identity}>
          <AudioLevelIndicator audioTrack={audioTrack} />
          <Typography variant="body1" color="inherit">
            {participant.identity.replace(/((?:\$[^\$\r\n]*){2})$/, '')}
            {isLocal && ' (You)'}
            {screenSharePublication && ' - Screen'}
            {isLocal && canAdmin && ' (Admin)'}
          </Typography>
        </div>
      </div>
      {(!isVideoEnabled || isVideoSwitchedOff) && (
        <div className={classes.avatarContainer}>
          <img src={OrcanaLogo} />
        </div>
      )}
      {isParticipantReconnecting && (
        <div className={classes.reconnectingContainer}>
          <Typography variant="body1" style={{ color: 'white' }}>
            Reconnecting...
          </Typography>
        </div>
      )}
      {children}
    </div>
  );
}
