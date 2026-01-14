import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useSocket } from '../contexts/SocketContext';
import { getCurrentUserId } from '../utils/authStorage';

export default function MessagesPage() {
  const { userId: selectedUserId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const currentUserId = getCurrentUserId();

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedUserId || null);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [ndaStatus, setNdaStatus] = useState<any>(null);
  const [collaborationId, setCollaborationId] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();

    // Listen for real-time messages
    if (socket) {
      const handleMessage = (data: any) => {
        if (selectedConversation === data.fromUserId._id.toString() ||
            selectedConversation === data.fromUserId._id) {
          setMessages((prev) => [...prev, data]);
        }
        // Refresh conversations to update last message
        fetchConversations();
      };

      socket.on('message', handleMessage);
      return () => {
        socket.off('message', handleMessage);
      };
    }
  }, [socket, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      fetchNDAStatus(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await api.getDirectMessages(userId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    }
  };

  const fetchNDAStatus = async (conversationUserId: string) => {
    try {
      // Get collaborations to find the collaboration ID with this user
      const collabRes = await api.getInvitations();
      if (collabRes.success && collabRes.data) {
        const collab = collabRes.data.find((c: any) =>
          (c.collaboratorId._id === conversationUserId || c.creatorId._id === conversationUserId)
        );

        if (collab) {
          setCollaborationId(collab._id);
          const ndaRes = await api.getNDAStatus(collab._id);
          if (ndaRes.success && ndaRes.data) {
            setNdaStatus(ndaRes.data);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch NDA status:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageContent.trim()) return;

    setSendingMessage(true);
    try {
      const res = await api.sendDirectMessage(selectedConversation, messageContent);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setMessageContent('');
      } else {
        alert(res.error || 'Failed to send message');
      }
    } catch (err: any) {
      alert(err.message || 'Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading messages...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Conversations Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>💬 Messages</h2>
          <div style={styles.conversationsList}>
            {conversations.length === 0 ? (
              <p style={styles.emptyText}>No conversations yet</p>
            ) : (
              conversations.map((conv: any) => (
                <div
                  key={conv.user._id}
                  onClick={() => setSelectedConversation(conv.user._id)}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedConversation === conv.user._id ? styles.conversationItemActive : {}),
                  }}
                >
                  <div style={styles.conversationHeader}>
                    <span style={styles.conversationName}>
                      {conv.user.profile?.firstName || conv.user.username}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span style={styles.unreadBadge}>{conv.unreadCount}</span>
                    )}
                  </div>
                  <p style={styles.conversationPreview}>
                    {conv.lastMessage?.content?.substring(0, 50)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {!selectedConversation ? (
            <div style={styles.noChatSelected}>
              <p style={styles.noChatText}>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* NDA Warning Banner */}
              {ndaStatus && !ndaStatus.bothAccepted && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  borderBottom: '1px solid #ffc107',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ color: '#856404', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span>
                      <strong>NDA Required:</strong> An NDA must be accepted by both parties before continuing conversation
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/ideas/${messages[0]?.ideaId || ''}`)}
                    style={{
                      background: '#ffc107',
                      color: '#000',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Accept NDA
                  </button>
                </div>
              )}

              {/* Messages */}
              <div style={styles.messagesList}>
                {messages.length === 0 ? (
                  <p style={styles.noMessagesText}>No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg: any) => {
                    const isOwn = msg.fromUserId._id === currentUserId || msg.fromUserId === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        style={{
                          ...styles.messageRow,
                          justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther),
                          }}
                        >
                          <p style={styles.messageText}>{msg.content}</p>
                          <span style={styles.messageTimestamp}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div style={styles.messageInputArea}>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message... (Shift+Enter for new line)"
                  style={styles.messageInputField}
                  disabled={sendingMessage}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageContent.trim()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: sendingMessage || !messageContent.trim() ? '#555' : '#0099ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: sendingMessage || !messageContent.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    opacity: sendingMessage || !messageContent.trim() ? 0.6 : 1,
                  }}
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
  },
  mainContent: {
    display: 'flex',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    height: 'calc(100vh - 40px)',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#111',
    borderRadius: '12px',
    border: '1px solid #333',
    padding: '20px',
    overflowY: 'auto' as const,
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 15px 0',
    paddingBottom: '15px',
    borderBottom: '1px solid #333',
  },
  conversationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  conversationItem: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  conversationItemActive: {
    backgroundColor: '#0099ff',
    border: '1px solid #0099ff',
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  conversationName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  unreadBadge: {
    backgroundColor: '#ffaa00',
    color: '#000',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '600',
  },
  conversationPreview: {
    fontSize: '12px',
    color: '#999',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: '30px 0',
    margin: 0,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: '12px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  noChatSelected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  noChatText: {
    color: '#666',
    fontSize: '16px',
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '5px',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    wordWrap: 'break-word' as const,
  },
  messageBubbleOther: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
  },
  messageBubbleOwn: {
    backgroundColor: '#0099ff',
    color: '#fff',
  },
  messageText: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  messageTimestamp: {
    fontSize: '11px',
    opacity: 0.6,
  },
  noMessagesText: {
    color: '#666',
    textAlign: 'center',
    margin: '0',
    padding: '20px',
  },
  messageInputArea: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    borderTop: '1px solid #333',
    backgroundColor: '#0a0a0a',
  },
  messageInputField: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '44px',
    maxHeight: '100px',
    resize: 'vertical' as const,
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    padding: '40px',
    margin: 0,
  },
};
