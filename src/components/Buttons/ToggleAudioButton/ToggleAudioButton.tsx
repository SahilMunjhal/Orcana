import React from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MicOnIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function ToggleAudioButton(props: {
  disabled?: boolean;
  color?: string;
  className?: string;
  tooltipPlacement?:
    | 'right'
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | 'top'
    | undefined;
}) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Tooltip
      placement={props.tooltipPlacement || 'right'}
      title={!isAudioEnabled ? 'Enable Your Mic' : 'Disable Your Mic'}
    >
      <span>
        <Button
          className={props.className}
          onClick={toggleAudioEnabled}
          disabled={!hasAudioTrack || props.disabled}
          startIcon={isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
          data-cy-audio-toggle
        />
      </span>
    </Tooltip>
  );
}
