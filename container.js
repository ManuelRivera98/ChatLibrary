import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Talk from 'talkjs';
import { useMergedState } from 'hooks';
import { chatStorageKeys } from 'helpers/appConstants';
import { createChatSession, createChatUserInstance } from 'utils';
import ChatView from './presentational';

const { session: sessionName } = chatStorageKeys;
const Chat = ({
  campaign_public_id,
  creator_public_id,
  conversation_id,
  nameCampaign,
  nameCreator,
}) => {
  // state
  const [{ loadingInstance, errorInstance }, setState] = useMergedState({
    loadingInstance: false,
    errorInstance: null,
  });
  const { user, userChatInstance } = useSelector(
    ({ AppReducer }) => AppReducer,
  );

  // Hook
  const chatContainerRef = useRef(null);

  // Instance fn user creator
  const createInstanceUserCreatorFn = async () => {
    await Talk.ready;
    const user2 = createChatUserInstance({
      id: campaign_public_id,
      name: nameCampaign,
    });

    // get or create conversation
    const conversation = window[sessionName].getOrCreateConversation(
      conversation_id,
    );

    // Add user conversation
    conversation.setParticipant(userChatInstance);
    conversation.setParticipant(user2);

    // Create chat
    const inbox = window[sessionName].createChatbox(conversation, {
      showChatHeader: false,
    });

    // mount chat on DOM
    inbox.mount(chatContainerRef.current);
  };

  // Instance fn user brand
  const createInstanceUserBrandFn = async () => {
    try {
      setState({ loadingInstance: true });
      await Talk.ready;

      // Ok
      const user1 = createChatUserInstance({
        id: campaign_public_id,
        name: nameCampaign,
      });
      const user2 = createChatUserInstance({
        id: creator_public_id,
        name: nameCreator,
      });
      // start session
      createChatSession(user1);
      // get or create conversation
      const conversation = window[sessionName].getOrCreateConversation(
        conversation_id,
      );
      // Add user conversation
      conversation.setParticipant(user1);
      conversation.setParticipant(user2);
      // Create chat
      const inbox = window[sessionName].createChatbox(conversation, {
        showChatHeader: false,
      });
      // mount chat on DOM
      inbox.mount(chatContainerRef.current);
    } catch (error) {
      setState({ loadingInstance: false, errorInstance: error });
    }
  };

  useEffect(() => {
    if (conversation_id) {
      // Validation role user
      if (user.role !== 'CREATOR') {
        createInstanceUserBrandFn();
        return;
      }
      createInstanceUserCreatorFn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation_id]);

  return (
    <ChatView
      loadingInstance={loadingInstance}
      errorInstance={errorInstance}
      otherUserName={user.role !== 'CREATOR' ? nameCreator : nameCampaign}
      chatContainerRef={chatContainerRef}
    />
  );
};

Chat.defaultProps = {
  campaign_public_id: null,
  creator_public_id: null,
  conversation_id: null,
  nameCampaign: null,
  nameCreator: null,
};

Chat.propTypes = {
  campaign_public_id: PropTypes.any,
  creator_public_id: PropTypes.any,
  conversation_id: PropTypes.any,
  nameCampaign: PropTypes.any,
  nameCreator: PropTypes.any,
};

export default Chat;
