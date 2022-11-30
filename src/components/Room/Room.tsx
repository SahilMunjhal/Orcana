import React, { useContext, useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { AnnotationLayer } from '../AnnotationLayer/AnnotationLayer';
import { ScreenshotLayer } from '../ScreenshotLayer/ScreenshotLayer';
import { RoomContext } from './RoomContext';
import { ScreenshotContext } from '../ScreenshotLayer/ScreenshotLayerContext';
import MainParticipantMenu from '../MenuBar/MainParticipantMenu';

const Letterbox = styled('div')(({ theme }) => {
  return {
    width: '100%',
    padding: '0',
    margin: 'auto',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
    
  };
});

const MainVideoContainer = styled('div')(({ theme }) => {
  return {
    position: 'relative',
    height: '100%',
    width: '100%',
    padding: '0',
    margin: 'auto',
    backgroundColor: '#000',
    textAlign: 'left',
  };
});

interface RoomProps {
  verticalOffset: number;
}

export default function Room(props: RoomProps) {
  const [showScreenshot, setShowscreenshot] = useState(false);
  const { room } = useContext(RoomContext);
  const { screenshot } = useContext(ScreenshotContext);
  const [roomDimensions, setRoomDimensions] = useState({
    width: document.documentElement.clientHeight - props.verticalOffset,
    height: document.documentElement.clientWidth,
  });

  const toggleScreenShot = () => {
    setShowscreenshot(!showScreenshot);
  };

  const getRoomDimensions = () => {
    const viewWidth = document.documentElement.clientWidth;
    const viewHeight = document.documentElement.clientHeight - props.verticalOffset;
    console.debug('viewWidth x viewHeight - ', `${viewWidth} x ${viewHeight}\n\n`);

    let videoWidth = room && room.width;
    let videoHeight = room && room.height;
    console.debug('videoWidth x videoHeight - ', `${videoWidth} x ${videoHeight}\n\n`);

    const horizScale = viewWidth / videoWidth;
    const vertScale = viewHeight / videoHeight;
    const scale = Math.min(horizScale, vertScale);
    const calculatedWidth = videoWidth * scale;
    const calculatedHeight = videoHeight * scale;
    console.debug('calculatedWidth x calculatedHeight - ', `${calculatedWidth} x ${calculatedHeight}\n\n`);

    setRoomDimensions({ width: calculatedWidth, height: calculatedHeight });
  };

  useEffect(() => {
    let hasScreenshot = screenshot.src && screenshot.src.length >= 2;
    setShowscreenshot(hasScreenshot);
    getRoomDimensions();
  }, [room, screenshot]);

  return (
    <Letterbox>
      <MainVideoContainer
        style={{
          maxWidth: roomDimensions.width || 1280,
          minWidth: roomDimensions.width || 720,
          maxHeight: roomDimensions.height || 1280,
          minHeight: roomDimensions.height || 720,
        }}
      >
        <MainParticipant />
        <AnnotationLayer roomDimensions={roomDimensions} />
        <MainParticipantMenu openScreenshot={toggleScreenShot} />
        <ScreenshotLayer roomDimensions={roomDimensions} isOpen={showScreenshot} />
      </MainVideoContainer>
    </Letterbox>
  );
}
