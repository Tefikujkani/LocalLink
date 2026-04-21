import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion';
import { MessageSquare, Send, X, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { businessService } from '../services/businessService';
import { cn } from '../utils/cn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your LocalLink AI Assistant. How can I help you grow your business today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await businessService.askAI(userMsg.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 z-50 cursor-pointer"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">LocalLink AI</h3>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                    m.role === 'user' ? "bg-slate-800 border-slate-700" : "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm leading-relaxed",
                    m.role === 'user' ? "bg-slate-800 text-white rounded-tr-none" : "bg-slate-800/30 text-slate-300 border border-slate-800/50 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded-xl rounded-tl-none border border-slate-800/50">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 text-center">AI generated content may contain errors. Please verify details.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
