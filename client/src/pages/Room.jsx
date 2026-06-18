import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomHeader from '../components/RoomHeader';
import { Shield, Smile, Search, X, FileText, Download } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import EmptyState from '../components/EmptyState';
import ParticipantsPanel from '../components/ParticipantsPanel';
import { useChat } from '../hooks/useChat';
import { usePrivacy } from '../context/PrivacyContext';
import socketService from '../services/socketService';

const FileImage = ({ fileId, alt }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    socketService.emit('get-file', { fileId }, (res) => {
      if (res.file) setSrc(res.file.data);
    });
  }, [fileId]);

  if (!src) {
    return (
      <div className="w-full h-40 bg-white/5 animate-pulse flex items-center justify-center rounded-lg">
        <Smile className="w-8 h-8 text-white/10 animate-bounce" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => window.open(src, '_blank')}
    />
  );
};

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('stealthchat_nickname');
  const messagesEndRef = useRef(null);

  const { messages, participantCount, participants, typers, error, sendMessage, setTyping, sendReaction, uploadFile } = useChat(roomCode, nickname);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [searchQuery, setSearchBar] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [reactionPickerMessageId, setReactionPickerMessageId] = useState(null);
  const { isPrivacyMode } = usePrivacy();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('stealthchat_notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('stealthchat_notifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!nickname) {
      navigate('/join');
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [nickname, navigate]);

  useEffect(() => {
    if (error) {
      alert(error);
      navigate('/join');
    }
  }, [error, navigate]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // If we are within 100px of the bottom, allow auto-scroll
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isAtBottom);
  };

  const handleDownload = (fileId, fileName) => {
    socketService.emit('get-file', { fileId }, (response) => {
      if (response.file) {
        const link = document.createElement('a');
        link.href = response.file.data;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(response.error || 'Failed to download file');
      }
    });
  };

  useEffect(() => {
    const handleFocus = () => {
      setIsWindowFocused(true);
      setUnreadCount(0);
    };
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsParticipantsOpen(false);
        setIsSearchOpen(false);
        setReactionPickerMessageId(null);
        setSearchBar('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const lastMessageIdRef = useRef(null);

  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (isWindowFocused) setUnreadCount(0);
    }

    // Increment unread if not auto-scrolled or window not focused
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // Notification Logic: Only play if it's a NEW message from ANOTHER user
      if (lastMessage.id !== lastMessageIdRef.current) {
        const isFirstLoad = lastMessageIdRef.current === null;
        lastMessageIdRef.current = lastMessage.id;

        // Don't play sound on initial load of messages
        if (isFirstLoad) return;

        if (lastMessage.sender !== nickname && lastMessage.type !== 'system') {
          if (!shouldAutoScroll || !isWindowFocused) {
            setUnreadCount(prev => prev + 1);
          }

          // Play notification sound for new chat/file messages if enabled
          if (notificationsEnabled && (lastMessage.type === 'chat' || lastMessage.type === 'file')) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
          }
        }
      }
    }
  }, [messages, shouldAutoScroll, notificationsEnabled, nickname, isWindowFocused]);

  const filteredMessages = messages.filter(msg =>
    (msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (msg.sender && msg.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full bg-dark-card/50 border-x border-white/5 shadow-2xl overflow-hidden relative">
      <RoomHeader
        roomCode={roomCode}
        participantCount={participantCount}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
      />

      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 z-30 bg-dark-card/95 backdrop-blur-sm border-b border-white/10 p-2 flex items-center space-x-2 animate-in slide-in-from-top duration-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchBar(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
          <button
            onClick={() => { setIsSearchOpen(false); setSearchBar(''); }}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-w-0">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth space-y-4"
      >
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            {searchQuery ? (
               <>
                 <Search className="w-12 h-12 opacity-20" />
                 <p>No results found for "{searchQuery}"</p>
               </>
            ) : (
               <EmptyState />
            )}
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.type === 'system' ? 'items-center' : (msg.sender === nickname ? 'items-end' : 'items-start')}`}
            >
              {msg.type === 'system' ? (
                <p className="text-xs text-gray-500 font-medium py-2 px-4 bg-white/5 rounded-full uppercase tracking-widest">
                  {msg.text}
                </p>
              ) : (
                <div className={`max-w-[80%] space-y-1 flex flex-col ${msg.sender === nickname ? 'items-end' : 'items-start'}`}>
                  {msg.sender !== nickname && (
                    <p className="text-xs font-bold text-accent px-1">
                      {msg.sender}
                    </p>
                  )}
                  {msg.sender === nickname && (
                    <p className="text-xs font-bold text-accent px-1">
                      You
                    </p>
                  )}
                  <div className="relative group/msg">
                    <div className={`px-4 py-2 rounded-2xl transition-all ${msg.sender === nickname ? 'bg-accent text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none'} ${searchQuery && msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ? 'ring-2 ring-accent ring-offset-2 ring-offset-dark' : ''}`}>
                      {msg.type === 'file' && msg.file ? (
                        <div className="space-y-2 min-w-[200px] max-w-[300px]">
                          {msg.file.type.startsWith('image/') ? (
                            <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                              <FileImage fileId={msg.file.fileId} alt={msg.file.name} />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg border border-white/10">
                              <FileText className="w-8 h-8 text-accent shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate break-all">{msg.file.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{msg.file.type.split('/')[1] || 'FILE'}</p>
                              </div>
                              <button
                                onClick={() => handleDownload(msg.file.fileId, msg.file.name)}
                                className="p-2 hover:bg-white/10 rounded-full text-accent transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      )}
                    </div>

                    {/* Reaction trigger button */}
                    <button
                      onClick={() => setReactionPickerMessageId(reactionPickerMessageId === msg.id ? null : msg.id)}
                      className={`absolute top-0 ${msg.sender === nickname ? 'right-0 -translate-x-full' : 'left-0 translate-x-full'} p-1 bg-dark-card/80 backdrop-blur-sm border border-white/10 rounded-full shadow-lg text-gray-400 hover:text-white transition-all opacity-0 group-hover/msg:opacity-100 z-10 scale-90 hover:scale-100`}
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>

                    {/* Reaction picker */}
                    {reactionPickerMessageId === msg.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setReactionPickerMessageId(null)}
                        />
                        <div className={`absolute top-0 ${msg.sender === nickname ? 'right-full mr-10' : 'left-full ml-10'} flex items-center bg-dark-card border border-white/10 rounded-full p-1 shadow-2xl z-50 animate-in fade-in zoom-in duration-200`}>
                          {['👍', '❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => {
                                sendReaction(msg.id, emoji);
                                setReactionPickerMessageId(null);
                              }}
                              className="p-1 hover:bg-white/5 rounded-full transition-transform hover:scale-125 text-base"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Reaction display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-1 ${msg.sender === nickname ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => users.length > 0 && (
                          <button
                            key={emoji}
                            onClick={() => sendReaction(msg.id, emoji)}
                            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${users.includes(nickname) ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                          >
                            <span>{emoji}</span>
                            <span>{users.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-600 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))
          )}
          {typers && typers.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 italic animate-pulse">
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              <p>{typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} typing...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

      <ChatInput onSend={sendMessage} disabled={isPrivacyMode} onTyping={setTyping} onUpload={uploadFile} />
      </div>

      {!shouldAutoScroll && unreadCount > 0 && (
        <button
          onClick={() => {
            setShouldAutoScroll(true);
            setUnreadCount(0);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-bounce flex items-center space-x-2 z-20"
        >
          <span>{unreadCount} New {unreadCount === 1 ? 'Message' : 'Messages'}</span>
        </button>
      )}


      <ParticipantsPanel
        participants={participants}
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
      />
      </div>
    </div>
  );
};

export default Room;
