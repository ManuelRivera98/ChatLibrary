// Dependencies
import PropTypes from 'prop-types';
import { Loader } from '..';
import './css.scss';

const ChatView = ({ chatContainerRef, otherUserName }) => (
  <div className="chat-container">
    <div className="chat-header">
      <div className="chat-iconContainer">
        <i className="fas fa-user" />
      </div>
      <p className="chat-username">{otherUserName}</p>
    </div>
    <div id="talkjs-container" className="chat-chatContainer" ref={chatContainerRef}>
      <div className="chat-loader-container">
        <Loader />
      </div>
    </div>
  </div>
);

ChatView.propTypes = {
  chatContainerRef: PropTypes.any.isRequired,
  otherUserName: PropTypes.string.isRequired,
};

export default ChatView;
