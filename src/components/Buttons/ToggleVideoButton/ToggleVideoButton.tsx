import React, { useCallback, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

export default function ToggleVideoButton(props: {
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
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const hasVideoDevices = useHasVideoInputDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Tooltip
      placement={props.tooltipPlacement || 'right'}
      title={!isVideoEnabled ? 'Enable Your Camera' : 'Disable Your Camera'}
    >
      <span>
        <Button
          className={props.className}
          onClick={toggleVideo}
          disabled={!hasVideoDevices || props.disabled}
          startIcon={isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        />
      </span>
    </Tooltip>
  );
}
