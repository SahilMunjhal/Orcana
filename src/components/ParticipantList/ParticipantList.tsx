import React, { useEffect, useCallback, RefObject } from 'react';
import _ from 'lodash';
import Participant from '../Participant/Participant';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import { useAppState } from '../../state';
import { debounce } from 'lodash';

interface ParticipantListProps {
  divRef: RefObject<HTMLDivElement>;
}

export default function ParticipantList({ divRef }: ParticipantListProps) {
  // The list should show 8 participants, then become scrollable
  const MAX_PARTICIPANTS = 8;
  const PARTICIPANT_INFO_WIDTH = 161;

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      scrollContainer: {
        background: 'transparent',
        display: 'inline-flex',
        maxWidth: `${MAX_PARTICIPANTS * PARTICIPANT_INFO_WIDTH}px`,
        overflowX: 'scroll',
        padding: '0.5em',
      },
    })
  );

  const classes = useStyles();
  const {
    room,
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();

  const { orcanaUser } = useAppState();
  const canAdmin = orcanaUser?.canAdmin || false;

  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  console.debug('ParticipantList#selectedParticipant', selectedParticipant);

  const broadcastSelectedParticipant = (identity: string) => {
    const item = {
      type: 'ADMIN',
      identity,
      action: 'broadcastSelectedParticipant',
      caseCreatorSid: localParticipant.sid,
    };
    console.debug('ParticipantList#broadcastSelectedPartition', item);
    const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
    localDataTrackPublication.track.send(JSON.stringify(item));
  };

  useEffect(() => {
    if (canAdmin) {
      setTimeout(() => {
        const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
        const item = {
          type: 'ADMIN',
          action: 'roomState',
          caseCreatorSid: room.localParticipant.sid,
          pinnedParticipantSid: room.localParticipant.sid,
        };
        localDataTrackPublication.track.send(JSON.stringify(item));
        console.debug('ParticipantList#useEffect->onConnect->roomStateCommand', item);
        setSelectedParticipant(room.localParticipant);
        broadcastSelectedParticipant(room.localParticipant.sid);
      }, 2000);
    }
  }, []);

  const sendOverDataTrack = useCallback(
    debounce(item => {
      const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
      localDataTrackPublication.track.send(JSON.stringify(item));
    }, 500),
    []
  );

  useEffect(() => {
    const onParticipantConnectedToRoom = (participant: any) => {
      setTimeout(() => {
        console.debug(participant.identity + ' joined the Room');
        console.debug('ParticipantList#useEffect->selectedParticipant', selectedParticipant);
        const item = {
          type: 'ADMIN',
          identity: participant.identity,
          action: 'roomState',
          caseCreatorSid: room.localParticipant.sid,
          pinnedParticipantSid: selectedParticipant?.sid,
        };
        sendOverDataTrack(item);
        console.debug('ParticipantList#useEffect->onParticipantConnectedToRoom->roomStateCommand', item);
      }, 1500);
    };

    if (canAdmin) {
      room.on('participantConnected', onParticipantConnectedToRoom);
      return () => {
        room.off('participantConnected', onParticipantConnectedToRoom);
      };
    }
  }, [selectedParticipant]);

  return (
    <div ref={divRef} className={classes.scrollContainer}>
      <Participant
        key={localParticipant.sid}
        participant={localParticipant}
        onClick={() => {
          if (canAdmin && selectedParticipant != localParticipant) {
            broadcastSelectedParticipant(localParticipant.sid);
            setSelectedParticipant(localParticipant);
          }
        }}
        isSelected={selectedParticipant === localParticipant}
        isLocalParticipant={true}
        canAdmin={canAdmin}
      />
      {participants.map(participant => {
        return (
          <Participant
            key={participant.sid}
            participant={participant}
            canAdmin={canAdmin}
            isSelected={participant === selectedParticipant}
            onClick={() => {
              if (canAdmin && selectedParticipant != participant) {
                broadcastSelectedParticipant(participant.sid);
                setSelectedParticipant(participant);
              }
            }}
          />
        );
      })}
    </div>
  );
}
