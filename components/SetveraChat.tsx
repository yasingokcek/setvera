import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessage } from '../services/setveraService';
const e = React.createElement;

const SetveraChat: React.FC = () => {
      const [messages, setMessages] = useState([
          { id: '1', role: 'assistant', content: 'Merhaba! Ben Setvera, akilli rezervasyon asistaniniz. Nasil yardimci olabilirim?', timestamp: new Date() }
            ] as ChatMessage[]);
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const endRef = useRef(null) as React.MutableRefObject;

      useEffect(() => { (endRef.current as any)?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

      const handleSend = async () => {
              if (!input.trim() || loading) return;
              const userMsg = { id: Date.now().toString(), role: 'user' as const, content: input, timestamp: new Date() };
              setMessages(p => [...p, userMsg]);
              setInput('');
              setLoading(true);
              try {
                        const res = await sendMessage(input, messages);
                        setMessages(p => [...p, { id: (Date.now()+1).toString(), role: 'assistant' as const, content: res.text, timestamp: new Date() }]);
              } catch {
                        setMessages(p => [...p, { id: (Date.now()+2).toString(), role: 'assistant' as const, content: 'Hata olustu.', timestamp: new Date() }]);
              } finally { setLoading(false); }
      };

      return e('div', { className: 'flex flex-col h-screen bg-gray-950 text-white' },
                   e('div', { className: 'p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-3' },
                           e('div', { className: 'w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold' }, 'S'),
                           e('div', null,
                                     e('h1', { className: 'font-bold text-xl' }, 'Setvera'),
                                     e('p', { className: 'text-sm text-gray-400' }, 'Akilli Rezervasyon Asistani')
                                   ),
                           e('div', { className: 'ml-auto flex items-center gap-2' },
                                     e('span', { className: 'w-2 h-2 rounded-full bg-green-400 inline-block' }),
                                     e('span', { className: 'text-xs text-gray-400' }, 'Aktif')
                                   )
                         ),
                   e('div', { className: 'flex-1 overflow-y-auto p-4 space-y-3' },
                           ...messages.map(msg =>
                                       e('div', { key: msg.id, className: msg.role === 'user' ? 'flex justify-end' : 'flex justify-start' },
                                                   e('div', { className: 'max-w-xs lg:max-w-md' },
                                                                 e('div', { className: 'rounded-2xl px-4 py-2 text-sm ' + (msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-100') },
                                                                                 msg.content
                                                                               ),
                                                                 e('p', { className: 'text-xs text-gray-500 mt-1 px-1' },
                                                                                 msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                                                                               )
                                                               )
                                                 )
                                                 ),
                           loading && e('div', { className: 'flex justify-start' },
                                                e('div', { className: 'bg-gray-800 rounded-2xl px-4 py-3 text-gray-400 text-sm' }, 'Yaziliyor...')
                                              ),
                           e('div', { ref: endRef })
                         ),
                   e('div', { className: 'p-4 bg-gray-900 border-t border-gray-800' },
                           e('div', { className: 'flex gap-2 items-end' },
                                     e('textarea', {
                                                   value: input,
                                                   onChange: (ev: any) => setInput(ev.target.value),
                                                   onKeyDown: (ev: any) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); handleSend(); } },
                                                   placeholder: 'Rezervasyon talebinizi yazin...',
                                                   rows: 1,
                                                   className: 'flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500'
                                     }),
                                     e('button', {
                                                   onClick: handleSend,
                                                   disabled: loading || !input.trim(),
                                                   className: 'px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors'
                                     }, 'Gonder')
                                   ),
                           e('p', { className: 'text-center text-xs text-gray-600 mt-2' }, 'Powered by Setvera AI — Gemini 1.5 Flash')
                         )
                 );
};

export default SetveraChat;
