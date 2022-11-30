import useVideoContext from '../useVideoContext/useVideoContext';
import useParticipants from '../useParticipants/useParticipants';
import useScreenShareParticipant from '../useScreenShareParticipant/useScreenShareParticipant';
import useSelectedParticipant from '../../components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import isSupportedHeadset from '../../hooks/headsetHooks/headsetHooks';

export default function useMainParticipant() {
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const participants = useParticipants();
  const headsetParticipant = participants.find(p => isSupportedHeadset(p.identity));
  const {
    room: { localParticipant },
  } = useVideoContext();
  const remoteScreenShareParticipant = screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return remoteScreenShareParticipant || selectedParticipant || localParticipant;
}
