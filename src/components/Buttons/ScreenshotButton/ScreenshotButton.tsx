import React, { useContext, useCallback } from 'react';
import { ScreenshotContext } from '../../ScreenshotLayer/ScreenshotLayerContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { RoomContext } from '../../Room/RoomContext';

import { createCanvas } from 'canvas';
import ScreenshotIcon from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';

export default function ScreenshotButton(props: { clickHandler?: any; color?: string; roomDimensions?: any }) {
  const { screenshotDispatch } = useContext(ScreenshotContext);
  const { room } = useVideoContext();
  const { room: roomSize } = useContext(RoomContext);
  const { roomDimensions } = props;

  const handleClick = useCallback(() => {
    let video = document.getElementById('mainParticipant');
    console.debug('ScreenshotButton#video', video);
    if (video !== null) {
      // roomSize refers to the Twilio Video resolution
      console.debug('ScreenshotButton#roomSize', roomSize);
      // roomDimensions refers to Room#calculatedWidth x calculatedHeight
      console.debug('ScreenshotButton#roomDimensions', roomDimensions);

      // we need to pick the greatest value between roomSize vs roomDimensions
      let canvasDimensions = Object.create({
        width: Math.max(roomSize.width, roomDimensions.width),
        height: Math.max(roomSize.height, roomDimensions.height),
      });

      let canvas = createCanvas(canvasDimensions.width, canvasDimensions.height);
      let context = canvas?.getContext('2d');
      console.debug('ScreenshotButton#canvas', canvas);
      if (canvas && canvas?.width && canvas?.height) {
        context?.clearRect(0, 0, canvas?.width, canvas?.height);
      }
      // make sure you actually tell drawImage to scale to the max canvasDimensions calculated earlier
      context?.drawImage(video, 0, 0, canvasDimensions.width, canvasDimensions.height);
      context?.setTransform(1, 0, 0, 1, 0, 0);
      const item = {
        type: 'UPDATE_SCREENSHOT',
        screenshot: { src: canvas?.toDataURL('image/jpeg', 0.15) },
        roomDimensions,
        roomSize,
      };
      console.debug('Screenshot JSON:', item);
      const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
      localDataTrackPublication.track.send(JSON.stringify(item));
      screenshotDispatch(item);
      props.clickHandler();
    }
  }, [screenshotDispatch, props, room]);

  return (
    <IconButton onClick={handleClick}>
      <ScreenshotIcon fill={props.color} />
    </IconButton>
  );
}
