import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaComments } from 'react-icons/fa';
import { sendChatMessage } from '../../services/aiApi';

const QUICK_REPLIES = ['Check-in time?', 'Room types?', 'Cancellation policy?', 'Pool & Spa?'];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your LuxuryStay AI assistant 🏨 How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await sendChatMessage(msg);
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-[340px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          style={{ maxHeight: '520px' }}>

          {/* Header */}
          <div className="bg-primary-900 px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">LuxuryStay Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <p className="text-slate-400 text-xs">AI-Powered · Always Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <FaTimes className="text-white text-xs" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <FaRobot className="text-white text-xs" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.from === 'user'
                    ? 'bg-primary-900 text-white rounded-br-sm'
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-white text-xs" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex gap-2 flex-wrap bg-white border-t border-slate-100">
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs bg-slate-100 hover:bg-primary-900 hover:text-white text-slate-600 px-3 py-1.5 rounded-full transition-all duration-200">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about the hotel..."
              className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all"
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="w-9 h-9 bg-primary-900 hover:bg-primary-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all active:scale-95">
              <FaPaperPlane className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-14 h-14 bg-primary-900 hover:bg-primary-800 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 hover:scale-105"
      >
        {isOpen
          ? <FaTimes className="text-lg" />
          : <div className="relative"><FaComments className="text-xl" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-900" /></div>
        }
      </button>
    </div>
  );
};

export default Chatbot;
