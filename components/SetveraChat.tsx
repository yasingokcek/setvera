import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Calendar, CheckCircle, Clock } from 'lucide-react';
import { ChatMessage, CreateBookingArgs } from '../types';
import { sendMessage } from '../services/setveraService';

const SetveraChat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
              id: '1',
              role: 'assistant',
              content: 'Merhaba! Ben Setvera, akilli rezervasyon asistaniniz. Restoran rezervasyonu icin size nasil yardimci olabilirim?',
              timestamp: new Date()
      }
        ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmedBookings, setConfirmedBookings] = useState<CreateBookingArgs[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
          if (!input.trim() || loading) return;

          const userMsg: ChatMessage = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: input,
                  timestamp: new Date()
          };

          setMessages(prev => [...prev, userMsg]);
          setInput('');
          setLoading(true);

          try {
                  const response = await sendMessage(input, messages);

            const assistantMsg: ChatMessage = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content: response.text,
                      timestamp: new Date(),
                      functionCall: response.functionCall ? {
                                  name: response.functionCall.name,
                                  args: response.functionCall.args,
                                  status: 'pending'
                      } : undefined
            };

            setMessages(prev => [...prev, assistantMsg]);

            if (response.functionCall) {
                      setTimeout(() => {
                                  setConfirmedBookings(prev => [...prev, response.functionCall!.args]);
                                  setMessages(prev => prev.map(m =>
                                                m.id === assistantMsg.id && m.functionCall
                                                                             ? { ...m, functionCall: { ...m.functionCall, status: 'confirmed' } }
                                                  : m
                                                                         ));
                      }, 1500);
            }
          } catch (err) {
                  setMessages(prev => [...prev, {
                            id: (Date.now() + 2).toString(),
                            role: 'assistant',
                            content: 'Bir hata olustu. Lutfen tekrar deneyin.',
                            timestamp: new Date()
                  }]);
          } finally {
                  setLoading(false);
          }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
          }
    };

    return (
          <div className="flex flex-col h-screen bg-gray-950 text-white">
            {/* Header */}
                <div className="flex items-center gap-3 p-4 bg-gray-900 border-b border-gray-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                  <Bot size={20} />
                        </div>div>
                        <div>
                                  <h1 className="font-bold text-lg">Setvera</h1>h1>
                                  <p className="text-xs text-gray-400">Akilli Rezervasyon Asistani</p>p>
                        </div>div>
                        <div className="ml-auto flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-400"></span>span>
                                  <span className="text-xs text-gray-400">Aktif</span>span>
                        </div>div>
                </div>div>
          
            {/* Confirmed Bookings Panel */}
            {confirmedBookings.length > 0 && (
                    <div className="p-3 bg-green-900/30 border-b border-green-800/50">
                              <p className="text-xs text-green-400 font-semibold mb-2 flex items-center gap-1">
                                          <CheckCircle size={12} /> {confirmedBookings.length} Onaylanan Rezervasyon
                              </p>p>
                      {confirmedBookings.map((b, i) => (
                                  <div key={i} className="text-xs text-gray-300 bg-green-900/20 rounded p-2 mb-1">
                                                <span className="font-medium">{b.customer_name}</span>span> — {b.booking_summary || 'Rezervasyon'}
                                                <span className="text-green-400 ml-2">{new Date(b.start_time).toLocaleString('tr-TR')}</span>span>
                                  </div>div>
                                ))}
                    </div>div>
                )}
          
            {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                      <Bot size={14} />
                                      </div>div>
                                  )}
                                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                                                <div className={`rounded-2xl px-4 py-3 text-sm ${
                                        msg.role === 'user'
                                          ? 'bg-purple-600 text-white rounded-tr-sm'
                                          : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                      }`}>
                                                  {msg.content}
                                                </div>div>
                                    {msg.functionCall && (
                                        <div className={`mt-2 p-3 rounded-lg border text-xs ${
                                                            msg.functionCall.status === 'confirmed'
                                                              ? 'bg-green-900/30 border-green-700 text-green-300'
                                                              : 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
                                        }`}>
                                                          <div className="flex items-center gap-2 font-semibold mb-2">
                                                            {msg.functionCall.status === 'confirmed' ? (
                                                                <><CheckCircle size={12} /> Rezervasyon Onaylandi</>>
                                                              ) : (
                                                                <><Clock size={12} className="animate-spin" /> Isleniyor...</>>
                                                              )}
                                                          </div>div>
                                                          <div className="space-y-1 text-xs opacity-80">
                                                                              <div><strong>Musteri:</strong>strong> {msg.functionCall.args.customer_name}</div>div>
                                                                              <div><strong>Ozet:</strong>strong> {msg.functionCall.args.booking_summary}</div>div>
                                                                              <div><strong>Baslangic:</strong>strong> {new Date(msg.functionCall.args.start_time).toLocaleString('tr-TR')}</div>div>
                                                                              <div><strong>Bitis:</strong>strong> {new Date(msg.functionCall.args.end_time).toLocaleString('tr-TR')}</div>div>
                                                            {msg.functionCall.args.special_notes && (
                                                                <div><strong>Not:</strong>strong> {msg.functionCall.args.special_notes}</div>div>
                                                                              )}
                                                          </div>div>
                                        </div>div>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1 px-1">
                                                  {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>p>
                                  </div>div>
                        {msg.role === 'user' && (
                                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                      <User size={14} />
                                      </div>div>
                                  )}
                      </div>div>
                    ))}
                  {loading && (
                      <div className="flex gap-3 justify-start">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                <Bot size={14} />
                                  </div>div>
                                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                                                <div className="flex gap-1">
                                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>span>
                                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>span>
                                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>span>
                                                </div>div>
                                  </div>div>
                      </div>div>
                        )}
                        <div ref={messagesEndRef} />
                </div>div>
          
            {/* Quick Suggestions */}
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                  {['Bu aksam 4 kisi', 'Yarin aksam 2 kisilik masa', 'Dogum gunu icin masa'].map(s => (
                      <button
                                    key={s}
                                    onClick={() => setInput(s)}
                                    className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors"
                                  >
                        {s}
                      </button>button>
                    ))}
                </div>div>
          
            {/* Input */}
                <div className="p-4 bg-gray-900 border-t border-gray-800">
                        <div className="flex gap-3 items-end">
                                  <textarea
                                                value={input}
                                                onChange={e => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Rezervasyon talebinizi yazin..."
                                                rows={1}
                                                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                                              />
                                  <button
                                                onClick={handleSend}
                                                disabled={loading || !input.trim()}
                                                className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                              >
                                              <Send size={16} />
                                  </button>button>
                        </div>div>
                        <p className="text-center text-xs text-gray-600 mt-2">Powered by Setvera AI — Gemini 1.5 Flash</p>p>
                </div>div>
          </div>div>
        );
};

export default SetveraChat;</></></div>
