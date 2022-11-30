import React, { useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LocalAudioTrack, LocalVideoTrack, Participant, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

import OrcanaLogo from '../../icons/OrcanaLogoWhite.png';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import AvatarIcon from '../../icons/AvatarIcon';
import NetworkQualityLevel from '../NetworkQualityLevel/NetworkQualityLevel';
import PinIcon from './PinIcon/PinIcon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ScreenShareIcon from '../../icons/ScreenShareIcon';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import MicOnIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as HeadsetOffIcon } from './HeadsetOffIcon.svg';
import { ReactComponent as HeadsetOnIcon } from './HeadsetOnIcon.svg';

import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import usePublications from '../../hooks/usePublications/usePublications';
import useTrack from '../../hooks/useTrack/useTrack';
import useParticipantIsReconnecting from '../../hooks/useParticipantIsReconnecting/useParticipantIsReconnecting';
import useIsTrackEnabled from '../../hooks/useIsTrackEnabled/useIsTrackEnabled';

import isSupportedHeadset from '../../hooks/headsetHooks/headsetHooks';

import { useAppState } from '../../state';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      width: '160px',
      height: '99px',
      padding: '0 16px 0 0',
      alignItems: 'center',
      '& video': {
        filter: 'none',
        objectFit: 'contain !important',
      },
      background: 'black',
    },
    innerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      background: 'transparent',
      top: 0,
    },
    avatarContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        '& svg': {
          transform: 'scale(0.7)',
        },
      },
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
    screenShareIconContainer: {
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '0.18em 0.3em',
      marginRight: '0.3em',
      display: 'flex',
      '& path': {
        fill: 'white',
      },
    },
    identity: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '0.18em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRowTop: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    infoRowBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    networkQualityContainer: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
    },
    participantOptionsContainer: {
      position: 'absolute',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '0',
      right: '0',
      color: '#fff',
      zIndex: 12,
      background: 'rgba(0, 0, 0, 0.5)',
    },
    adminParticipantContainer: {
      position: 'absolute',
      width: '56px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '0',
      right: '0',
      color: '#fff',
      zIndex: 12,
      background: 'rgba(0, 0, 0, 0.5)',
    },
    typeography: {
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    hideParticipant: {
      display: 'none',
    },
    selectedParticipant: {
      border: '4px solid #1086be',
    },
    selectedArrow: {
      position: 'absolute',
      zIndex: 10,
      top: '124px',
      left: '79px',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '16px 16px 0 16px',
      borderColor: '#1086be transparent transparent transparent',
    },
    cursorPointer: {
      cursor: 'pointer',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  canAdmin?: boolean;
}

export default function ParticipantInfo({
  participant,
  onClick,
  isSelected,
  children,
  isLocalParticipant,
  canAdmin,
}: ParticipantInfoProps) {
  const publications = usePublications(participant);
  const { room } = useVideoContext();
  const [isHovered, setHovered] = useState(false);
  const [isHeadsetScreenOn, setHeadsetScreenOn] = useState(true);
  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));

  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack | undefined;
  const isAudioTrackEnabled = useIsTrackEnabled(audioTrack as LocalAudioTrack | RemoteAudioTrack);

  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { confirm, setConfirm } = useAppState();

  const handleMoreClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const adminAction = (identity: string, action: string) => {
    const item = { type: 'ADMIN', identity, action };
    const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
    if (action == 'toggle_glasses') {
      setHeadsetScreenOn(!isHeadsetScreenOn);
    }
    localDataTrackPublication.track.send(JSON.stringify(item));
  };

  const kickAdminAction = (identity: string) => {
    setConfirm({
      title: 'Are you sure?',
      message: 'Are you sure you want to disconnect this user?',
      confirmButton: 'Yes',
      cancelButton: 'Cancel',
      dismissConfirm: _.partial(adminAction, identity, 'kick'),
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const onEnter = () => {
    setHovered(true);
  };

  const onLeave = () => {
    setHovered(false);
  };

  const videoIcon = !isVideoEnabled || isVideoSwitchedOff ? <VideocamOffIcon /> : <VideocamIcon />;
  const audioIcon = !isAudioTrackEnabled ? <MicOffIcon /> : <MicOnIcon />;
  const headsetIcon = isHeadsetScreenOn ? <VisibilityIcon /> : <VisibilityOffIcon />;

  return (
    <div
      className={clsx(classes.container, {
        [classes.cursorPointer]: Boolean(onClick),
        [classes.selectedParticipant]: isSelected,
      })}
      data-cy-participant={participant.identity}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {isLocalParticipant && canAdmin && <div className={classes.adminParticipantContainer}>Admin</div>}
      {isHovered && !isLocalParticipant && canAdmin && (
        <div className={classes.participantOptionsContainer}>
          <MoreVertIcon onClick={handleMoreClick} />
          <Menu
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Tooltip placement="bottom" title={!isAudioTrackEnabled ? 'Enable Mic' : 'Disable Mic'}>
              <MenuItem onClick={_.partial(adminAction, participant.identity, 'mute')}>{audioIcon}</MenuItem>
            </Tooltip>
            {false && (
              <Tooltip
                placement="bottom"
                title={!isVideoEnabled || isVideoSwitchedOff ? 'Enable Camera' : 'Disable Camera'}
              >
                <MenuItem onClick={_.partial(adminAction, participant.identity, 'disable')}>{videoIcon}</MenuItem>
              </Tooltip>
            )}
            {isSupportedHeadset(participant.identity) && (
              <Tooltip placement="bottom" title={!isHeadsetScreenOn ? 'Enable AR Screen' : 'Disable AR Screen'}>
                <MenuItem onClick={_.partial(adminAction, participant.identity, 'toggle_glasses')}>
                  <SvgIcon>{headsetIcon}</SvgIcon>
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip placement="bottom" title={'Disconnect User'}>
              <MenuItem onClick={() => kickAdminAction(participant.identity)}>
                <CancelPresentationIcon />
              </MenuItem>
            </Tooltip>
          </Menu>
        </div>
      )}
      <div className={classes.infoContainer} onClick={onClick}>
        <div className={classes.networkQualityContainer}>
          <NetworkQualityLevel participant={participant} />
        </div>
        <div className={classes.infoRowBottom}>
          {isScreenShareEnabled && (
            <span className={classes.screenShareIconContainer}>
              <ScreenShareIcon />
            </span>
          )}
          <span className={classes.identity}>
            <AudioLevelIndicator audioTrack={audioTrack} />
            <Typography variant="body1" className={classes.typeography} component="span">
              {participant.identity.replace(/((?:\$[^\$\r\n]*){2})$/, '')}
              {isLocalParticipant && ' (You)'}
            </Typography>
          </span>
        </div>
        <div>{isSelected && <PinIcon />}</div>
      </div>
      <div className={classes.innerContainer}>
        {(!isVideoEnabled || isVideoSwitchedOff) && (
          <div className={classes.avatarContainer}>
            <img src={OrcanaLogo} width={75} height={70} />
          </div>
        )}
        {isParticipantReconnecting && (
          <div className={classes.reconnectingContainer}>
            <Typography variant="body1" className={classes.typeography}>
              Reconnecting...
            </Typography>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
