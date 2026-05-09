import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { getChatResponse } from '../services/aiService';
import { cn } from '../store/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Nomoshkar! I am your Dashar Bazar assistant. How can I help you discover premium products today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getChatResponse(userMessage, history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.div 
        drag
        dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 200, bottom: 0 }}
        dragElastic={0.1}
        className="fixed bottom-28 right-6 sm:bottom-8 sm:right-8 flex flex-col gap-4 z-[100] touch-none"
      >
        <a
          href="https://wa.me/8801876357998"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-[#25D366] text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </a>

        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-orange-500 text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-4rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white dark:bg-slate-950 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">Dashar Bazar Bot</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">AI Powered assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-3",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center",
                    m.role === 'user' ? "bg-slate-200 dark:bg-slate-700" : "bg-orange-100 dark:bg-orange-950/30 text-orange-500"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-[24px] text-sm font-bold leading-relaxed shadow-sm",
                    m.role === 'user' 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-[24px] rounded-tl-none italic text-slate-400 text-sm font-bold">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-white dark:bg-slate-800 rounded-3xl pl-6 pr-14 py-4 border-2 border-transparent focus:border-orange-500 outline-none font-bold text-sm transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-center font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 text-orange-500" />
                Powered by Gemini AI
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
