import { useEffect, useCallback, useState, useContext } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import { AnnotationContext } from '../AnnotationLayer/AnnotationLayerContext';
import { ScreenshotContext } from '../ScreenshotLayer/ScreenshotLayerContext';
import _ from 'lodash';
//TODO: refactor this to seperate file
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';

export default function DataTrack({ track }: { track: IDataTrack }) {
  const { dispatch } = useContext(AnnotationContext);
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const { screenshot, screenshotDispatch } = useContext(ScreenshotContext);
  const [itemQue, setItemQue] = useState([]);
  const { room } = useVideoContext();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const participants = useParticipants();

  const handleMessage = useCallback(
    (item: any) => {
      // quick and dirty force click actions to get around
      const adminAction = (actionObj: any) => {
        const { action, identity } = actionObj;
        if (action === 'mute' && identity === room.localParticipant.identity) {
          console.debug('Receiving signal to disable microphone from remote admin');
          toggleAudioEnabled();
        }
        if (action === 'disable' && identity === room.localParticipant.identity) {
          console.debug('Receiving signal to disable video from remote admin');
          toggleVideoEnabled();
        }
        if (action === 'kick' && identity === room.localParticipant.identity) {
          console.debug('Receiving signal to kick from remote admin, goodbye');
          room.disconnect();
        }
        if (actionObj.action === 'broadcastSelectedParticipant') {
          console.debug('Receiving signal to pin a participant:', identity);
          if (room.localParticipant.sid === identity) {
            setSelectedParticipant(room.localParticipant);
          } else {
            participants.forEach(participant => {
              if (participant['sid'] === identity) {
                setSelectedParticipant(participant);
              }
            });
          }
        }
        if (actionObj.action === 'roomState' && actionObj.pinnedParticipantSid && !selectedParticipant) {
          console.debug('Receiving signal to update roomState because new participant joined seconds ago');
          if (room.localParticipant.sid === actionObj.pinnedParticipantSid) {
            setSelectedParticipant(room.localParticipant);
          } else {
            participants.forEach(participant => {
              if (participant['sid'] === actionObj.pinnedParticipantSid) {
                setSelectedParticipant(participant);
              }
            });
          }
        }
      };

      if (item.includes('SCREENSHOT')) {
        screenshotDispatch(JSON.parse(item));
      } else if (item.includes('ADMIN')) {
        adminAction(JSON.parse(item));
      } else {
        let newQue: any = _.cloneDeep(itemQue);
        let newItem = JSON.parse(item);
        newQue.push(newItem);
        setItemQue(newQue);
      }
    },
    [
      room,
      participants,
      setSelectedParticipant,
      toggleAudioEnabled,
      toggleVideoEnabled,
      screenshotDispatch,
      itemQue,
      setItemQue,
    ]
  );

  useEffect(() => {
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track, handleMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!screenshot.isDrawing && itemQue.length >= 1) {
        let newQue: any = _.cloneDeep(itemQue);
        let newItem = newQue[0];
        dispatch(newItem);
        newQue.shift();
        setItemQue(newQue);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [dispatch, itemQue, setItemQue, screenshot]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
