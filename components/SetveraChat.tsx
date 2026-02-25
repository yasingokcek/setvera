import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessage } from '../services/setveraService';
const e = React.createElement;

type Page = 'landing' | 'login' | 'chat';
type Module = 'restaurant' | 'beauty' | 'clinic';
interface Session { businessName: string; module: Module; }

/* ========== LANDING PAGE ========== */
const LandingSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
        const features = [
              { icon: 'AI', title: 'Akilli AI Asistan', desc: 'Gemini 1.5 Flash destekli asistan musteri taleplerini dogal dilde anlayip rezervasyonu tamamlar.' },
              { icon: 'CV', title: 'Otomatik Takvim', desc: 'Onaylanan her rezervasyon aninda Google Takvim e islenir. Manuel giris gerekmez.' },
              { icon: 'HZ', title: 'Anlik Yanit', desc: 'Musteriler saniyeler icinde yanit alir. Bekleme yok, kayip rezervasyon yok.' },
              { icon: 'CO', title: 'Cakisma Onleme', desc: 'Akilli kapasite yonetimi ile cift rezervasyon sorununu tamamen ortadan kaldirir.' },
              { icon: 'DL', title: 'Dogal Dil', desc: 'Musteriler istedikleri gibi yazar, asistan anlayip dogru bilgileri toplar.' },
              { icon: 'MO', title: 'Cok Modullu', desc: 'Restoran, guzellik ve klinik icin ozel moduller. Her sektore gore ozellesmis deneyim.' },
                ];
        const steps = [
              { n: '01', t: 'Musteri Yazar', d: 'Musteri rezervasyon talebini dogal dilde yazar: "Cumartesi aksami 4 kisilik masa istiyorum"' },
              { n: '02', t: 'AI Toplar ve Onaylar', d: 'Setvera eksik bilgileri kibarca sorar, detaylari ozetler ve musteriden onay alir.' },
              { n: '03', t: 'Takvime Islenir', d: 'Onay verilince rezervasyon aninda Google Takvim e eklenir ve isletme bildirim alir.' },
                ];
        return e('div', { className: 'min-h-screen bg-gray-950 text-white' },
                     e('nav', { className: 'flex items-center justify-between px-6 py-4 border-b border-gray-800' },
                             e('div', { className: 'flex items-center gap-2' },
                                       e('div', { className: 'w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm' }, 'S'),
                                       e('span', { className: 'font-bold text-lg' }, 'Setvera')
                                     ),
                             e('div', { className: 'flex items-center gap-4 text-sm text-gray-400' },
                                       e('a', { href: '#features', className: 'hover:text-white transition-colors hidden sm:block' }, 'Ozellikler'),
                                       e('a', { href: '#modules', className: 'hover:text-white transition-colors hidden sm:block' }, 'Moduller'),
                                       e('a', { href: '#how', className: 'hover:text-white transition-colors hidden sm:block' }, 'Nasil Calisir'),
                                       e('button', { onClick: onGetStarted, className: 'px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors' }, 'Giris Yap')
                                     )
                           ),
                     e('section', { className: 'flex flex-col items-center text-center px-6 py-20 max-w-4xl mx-auto' },
                             e('div', { className: 'inline-flex items-center gap-2 bg-purple-900 border border-purple-700 rounded-full px-4 py-1 text-xs text-purple-300 mb-6' },
                                       e('span', { className: 'w-2 h-2 rounded-full bg-green-400 inline-block' }),
                                       'Yapay Zeka Destekli Rezervasyon Sistemi'
                                     ),
                             e('h1', { className: 'text-4xl sm:text-5xl font-bold leading-tight mb-6' },
                                       'Rezervasyonlarinizi', e('br', null),
                                       e('span', { className: 'text-purple-400' }, 'Yapay Zeka ile Yonetin')
                                     ),
                             e('p', { className: 'text-gray-400 text-lg max-w-2xl mb-10' },
                                       'Setvera, restoran, guzellik salonu ve klinikler icin WhatsApp benzeri sohbet arayuzu ile calisarak musterilerinizin rezervasyonlarini otomatik yonetir ve Google Takvim e isler.'
                                     ),
                             e('div', { className: 'flex flex-col sm:flex-row gap-4' },
                                       e('button', { onClick: onGetStarted, className: 'px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-base font-semibold transition-colors' }, 'Hemen Baslayin'),
                                       e('a', { href: '#how', className: 'px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-xl text-base font-medium text-gray-300 hover:text-white transition-colors' }, 'Nasil Calisir?')
                                     ),
                             e('div', { className: 'mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500' },
                                       e('span', { className: 'flex items-center gap-1' }, e('span', { className: 'text-green-400' }, '✓'), ' Kurulum gerektirmez'),
                                       e('span', { className: 'flex items-center gap-1' }, e('span', { className: 'text-green-400' }, '✓'), ' 7/24 aktif asistan'),
                                       e('span', { className: 'flex items-center gap-1' }, e('span', { className: 'text-green-400' }, '✓'), ' Gemini AI destekli')
                                     )
                           ),
                     e('section', { id: 'features', className: 'py-16 px-6 bg-gray-900' },
                             e('div', { className: 'max-w-5xl mx-auto' },
                                       e('div', { className: 'text-center mb-12' },
                                                   e('h2', { className: 'text-3xl font-bold mb-2' }, 'Neden Setvera?'),
                                                   e('p', { className: 'text-gray-400' }, 'Isletmenizin ihtiyac duydugu tum ozellikleri tek platformda bulusturduk.')
                                                 ),
                                       e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-5' },
                                                   ...features.map(f => e('div', { key: f.icon, className: 'bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-purple-700 transition-colors' },
                                                                                      e('div', { className: 'w-10 h-10 rounded-xl bg-purple-900 border border-purple-700 flex items-center justify-center text-purple-300 text-xs font-bold mb-3' }, f.icon),
                                                                                      e('h3', { className: 'font-semibold text-base mb-1' }, f.title),
                                                                                      e('p', { className: 'text-gray-400 text-sm leading-relaxed' }, f.desc)
                                                                                    ))
                                                 )
                                     )
                           ),
                     e('section', { id: 'modules', className: 'py-16 px-6' },
                             e('div', { className: 'max-w-5xl mx-auto' },
                                       e('div', { className: 'text-center mb-12' },
                                                   e('h2', { className: 'text-3xl font-bold mb-2' }, 'Sektore Ozel Moduller'),
                                                   e('p', { className: 'text-gray-400' }, 'Her isletme farklidir. Setvera, sektorunuze gore ozellesir.')
                                                 ),
                                       e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-5' },
                                                   e('div', { className: 'bg-gray-900 border border-orange-800 rounded-2xl p-5' },
                                                                 e('div', { className: 'text-3xl mb-3' }, 'RS'),
                                                                 e('div', { className: 'inline-block bg-green-900 text-green-400 text-xs px-2 py-0.5 rounded-full mb-2 font-medium' }, 'AKTIF'),
                                                                 e('h3', { className: 'font-bold text-lg mb-2' }, 'Restoran Modulu'),
                                                                 e('ul', { className: 'text-gray-400 text-sm space-y-1' },
                                                                                 e('li', null, '• Kisi sayisi ve alan tercihi'),
                                                                                 e('li', null, '• 2 saatlik masa bloklama'),
                                                                                 e('li', null, '• Ozel gun ve diyet notu'),
                                                                                 e('li', null, '• 10+ kisi grup menu onerisi'),
                                                                                 e('li', null, '• No-show azaltma mesajlari')
                                                                               )
                                                               ),
                                                   e('div', { className: 'bg-gray-900 border border-pink-800 rounded-2xl p-5' },
                                                                 e('div', { className: 'text-3xl mb-3' }, 'GB'),
                                                                 e('div', { className: 'inline-block bg-yellow-900 text-yellow-400 text-xs px-2 py-0.5 rounded-full mb-2 font-medium' }, 'YAKIN ZAMANDA'),
                                                                 e('h3', { className: 'font-bold text-lg mb-2' }, 'Guzellik Modulu'),
                                                                 e('ul', { className: 'text-gray-400 text-sm space-y-1' },
                                                                                 e('li', null, '• Hizmet ve personel secimi'),
                                                                                 e('li', null, '• Sure bazli randevu yonetimi'),
                                                                                 e('li', null, '• Onceki tercih hafizasi'),
                                                                                 e('li', null, '• Hatirlatma bildirimleri'),
                                                                                 e('li', null, '• Paket onerisi zekasi')
                                                                               )
                                                               ),
                                                   e('div', { className: 'bg-gray-900 border border-blue-800 rounded-2xl p-5' },
                                                                 e('div', { className: 'text-3xl mb-3' }, 'KL'),
                                                                 e('div', { className: 'inline-block bg-yellow-900 text-yellow-400 text-xs px-2 py-0.5 rounded-full mb-2 font-medium' }, 'YAKIN ZAMANDA'),
                                                                 e('h3', { className: 'font-bold text-lg mb-2' }, 'Klinik Modulu'),
                                                                 e('ul', { className: 'text-gray-400 text-sm space-y-1' },
                                                                                 e('li', null, '• Doktor ve poliklinik secimi'),
                                                                                 e('li', null, '• Sigorta / ozel hasta yonetimi'),
                                                                                 e('li', null, '• Muayene suresi optimizasyonu'),
                                                                                 e('li', null, '• Oncelikli randevu akisi'),
                                                                                 e('li', null, '• KVKK uyumlu veri toplama')
                                                                               )
                                                               )
                                                 )
                                     )
                           ),
                     e('section', { id: 'how', className: 'py-16 px-6 bg-gray-900' },
                             e('div', { className: 'max-w-4xl mx-auto' },
                                       e('div', { className: 'text-center mb-12' },
                                                   e('h2', { className: 'text-3xl font-bold mb-2' }, 'Nasil Calisir?'),
                                                   e('p', { className: 'text-gray-400' }, 'Uc adimda rezervasyon yonetimini otomatiklestirir.')
                                                 ),
                                       e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
                                                   ...steps.map(s => e('div', { key: s.n, className: 'text-center' },
                                                                                   e('div', { className: 'w-12 h-12 rounded-2xl bg-purple-900 border border-purple-700 flex items-center justify-center text-purple-400 font-bold mx-auto mb-4' }, s.n),
                                                                                   e('h3', { className: 'font-semibold text-base mb-2' }, s.t),
                                                                                   e('p', { className: 'text-gray-400 text-sm leading-relaxed' }, s.d)
                                                                                 ))
                                                 )
                                     )
                           ),
                     e('section', { className: 'py-16 px-6' },
                             e('div', { className: 'max-w-2xl mx-auto text-center' },
                                       e('div', { className: 'bg-gray-900 border border-purple-800 rounded-3xl p-10' },
                                                   e('h2', { className: 'text-3xl font-bold mb-3' }, 'Hemen Deneyin'),
                                                   e('p', { className: 'text-gray-400 mb-6' }, 'Isletmeniz icin akilli rezervasyon asistanini simdi baslatin.'),
                                                   e('button', { onClick: onGetStarted, className: 'px-10 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-base font-semibold transition-colors' }, 'Simdi Giris Yap')
                                                 )
                                     )
                           ),
                     e('footer', { className: 'border-t border-gray-800 py-6 px-6 text-center text-sm text-gray-600' },
                             e('div', { className: 'flex items-center justify-center gap-2 mb-1' },
                                       e('div', { className: 'w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white' }, 'S'),
                                       e('span', { className: 'font-medium text-gray-500' }, 'Setvera')
                                     ),
                             e('p', null, '2026 Setvera. Akilli Rezervasyon Asistani. Gemini AI ile guclendiriliyor.')
                           )
                   );
};

/* ========== LOGIN PAGE ========== */
const LoginSection: React.FC<{ onLogin: (s: Session) => void; onBack: () => void }> = ({ onLogin, onBack }) => {
        const [businessName, setBusinessName] = useState('');
        const [password, setPassword] = useState('');
        const [module, setModule] = useState<Module>('restaurant');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (ev: React.FormEvent) => {
                  ev.preventDefault();
                  if (!businessName.trim()) { setError('Isletme adi gereklidir.'); return; }
                  if (!password.trim()) { setError('Sifre gereklidir.'); return; }
                  setLoading(true);
                  await new Promise(r => setTimeout(r, 800));
                  setLoading(false);
                  onLogin({ businessName: businessName.trim(), module });
        };

        const moduleOptions: { value: Module; label: string; badge: string; color: string }[] = [
              { value: 'restaurant', label: 'Restoran', badge: 'AKTIF', color: 'border-orange-700 bg-orange-900' },
              { value: 'beauty', label: 'Guzellik Salonu', badge: 'YAKINDA', color: 'border-pink-800 bg-pink-900' },
              { value: 'clinic', label: 'Klinik', badge: 'YAKINDA', color: 'border-blue-800 bg-blue-900' },
                ];

        return e('div', { className: 'min-h-screen bg-gray-950 text-white flex flex-col' },
                     e('nav', { className: 'flex items-center justify-between px-6 py-4 border-b border-gray-800' },
                             e('div', { className: 'flex items-center gap-2' },
                                       e('div', { className: 'w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm' }, 'S'),
                                       e('span', { className: 'font-bold text-lg' }, 'Setvera')
                                     ),
                             e('button', { onClick: onBack, className: 'text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1' }, '← Ana Sayfa')
                           ),
                     e('div', { className: 'flex-1 flex items-center justify-center px-4 py-12' },
                             e('div', { className: 'w-full max-w-md' },
                                       e('div', { className: 'text-center mb-8' },
                                                   e('h1', { className: 'text-3xl font-bold mb-2' }, 'Isletme Girisi'),
                                                   e('p', { className: 'text-gray-400' }, 'Rezervasyon asistaniniza erisim saglayin.')
                                                 ),
                                       e('form', { onSubmit: handleSubmit, className: 'bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4' },
                                                   e('div', null,
                                                                 e('label', { className: 'block text-sm text-gray-400 mb-1' }, 'Isletme Adi'),
                                                                 e('input', {
                                                                                     type: 'text',
                                                                                     value: businessName,
                                                                                     onChange: (ev: React.ChangeEvent<HTMLInputElement>) => setBusinessName(ev.target.value),
                                                                                     placeholder: 'Ornek: Lezzet Restoran',
                                                                                     className: 'w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-600',
                                                                 })
                                                               ),
                                                   e('div', null,
                                                                 e('label', { className: 'block text-sm text-gray-400 mb-1' }, 'Sifre'),
                                                                 e('input', {
                                                                                     type: 'password',
                                                                                     value: password,
                                                                                     onChange: (ev: React.ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value),
                                                                                     placeholder: '••••••••',
                                                                                     className: 'w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-600',
                                                                 })
                                                               ),
                                                   e('div', null,
                                                                 e('label', { className: 'block text-sm text-gray-400 mb-2' }, 'Isletme Turu'),
                                                                 e('div', { className: 'grid grid-cols-3 gap-2' },
                                                                                 ...moduleOptions.map(opt => e('button', {
                                                                                                       key: opt.value,
                                                                                                       type: 'button',
                                                                                                       onClick: () => setModule(opt.value),
                                                                                                       className: `rounded-xl p-3 border text-center text-xs font-medium transition-all ${module === opt.value ? opt.color + ' text-white' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'}`,
                                                                                       },
                                                                                                                               e('div', { className: 'font-semibold mb-0.5' }, opt.label),
                                                                                                                               e('div', { className: 'text-xs opacity-70' }, opt.badge)
                                                                                                                             ))
                                                                               )
                                                               ),
                                                   error && e('div', { className: 'text-red-400 text-sm bg-red-900 border border-red-800 rounded-lg px-3 py-2' }, error),
                                                   e('button', {
                                                                     type: 'submit',
                                                                     disabled: loading,
                                                                     className: 'w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors',
                                                   }, loading ? 'Giris Yapiliyor...' : 'Giris Yap'),
                                                   e('p', { className: 'text-center text-xs text-gray-600' }, 'Demo icin herhangi bir isim ve sifre girebilirsiniz.')
                                                 )
                                     )
                           )
                   );
};

/* ========== CHAT PAGE ========== */
const ChatSection: React.FC<{ session: Session; onLogout: () => void }> = ({ session, onLogout }) => {
        const [messages, setMessages] = useState<ChatMessage[]>([
              { id: '1', role: 'assistant', content: `Merhaba! Ben Setvera, ${session.businessName} icin akilli rezervasyon asistaniniz. Size nasil yardimci olabilirim?`, timestamp: new Date() }
                ] as ChatMessage[]);
        const [input, setInput] = useState('');
        const [loading, setLoading] = useState(false);
        const endRef = useRef(null) as React.MutableRefObject<any>;

        useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

        const handleSend = async () => {
                  if (!input.trim() || loading) return;
                  const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
                  setMessages(prev => [...prev, userMsg]);
                  setInput('');
                  setLoading(true);
                  try {
                              const res = await sendMessage(input, messages);
                              setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.text, timestamp: new Date() } as ChatMessage]);
                  } catch {
                              setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Hata olustu. Lutfen tekrar deneyin.', timestamp: new Date() } as ChatMessage]);
                  } finally {
                              setLoading(false);
                  }
        };

        const moduleName = session.module === 'restaurant' ? 'Restoran' : session.module === 'beauty' ? 'Guzellik' : 'Klinik';

        return e('div', { className: 'flex flex-col h-screen bg-gray-950 text-white' },
                     e('div', { className: 'p-3 bg-gray-900 border-b border-gray-800 flex items-center gap-3' },
                             e('button', { onClick: onLogout, className: 'text-gray-500 hover:text-white text-xs mr-1 transition-colors' }, '←'),
                             e('div', { className: 'w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm' }, 'S'),
                             e('div', null,
                                       e('h1', { className: 'font-bold text-base' }, 'Setvera'),
                                       e('p', { className: 'text-xs text-gray-400' }, session.businessName + ' • ' + moduleName + ' Modulu')
                                     ),
                             e('div', { className: 'ml-auto flex items-center gap-1.5' },
                                       e('span', { className: 'w-2 h-2 rounded-full bg-green-400 inline-block' }),
                                       e('span', { className: 'text-xs text-gray-400' }, 'Aktif')
                                     )
                           ),
                     e('div', { className: 'flex-1 overflow-y-auto p-4 space-y-3' },
                             ...messages.map(msg => e('div', { key: msg.id, className: msg.role === 'user' ? 'flex justify-end' : 'flex justify-start' },
                                                              e('div', { className: 'max-w-xs lg:max-w-md' },
                                                                          e('div', { className: 'rounded-2xl px-4 py-2 text-sm ' + (msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-100') }, msg.content),
                                                                          e('p', { className: 'text-xs text-gray-500 mt-1 px-1' }, msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))
                                                                        )
                                                            )),
                             loading && e('div', { className: 'flex justify-start' },
                                                  e('div', { className: 'bg-gray-800 rounded-2xl px-4 py-3 text-gray-400 text-sm' }, 'Yaziliyor...')
                                                ),
                             e('div', { ref: endRef })
                           ),
                     e('div', { className: 'p-4 bg-gray-900 border-t border-gray-800' },
                             e('div', { className: 'flex gap-2 items-end' },
                                       e('textarea', {
                                                       value: input,
                                                       onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => setInput(ev.target.value),
                                                       onKeyDown: (ev: React.KeyboardEvent) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); handleSend(); }},
                                                       placeholder: 'Rezervasyon talebinizi yazin...',
                                                       rows: 1,
                                                       className: 'flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-600',
                                       }),
                                       e('button', { onClick: handleSend, disabled: loading || !input.trim(), className: 'px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors' }, 'Gonder')
                                     ),
                             e('p', { className: 'text-center text-xs text-gray-600 mt-2' }, 'Powered by Setvera AI — Gemini 1.5 Flash')
                           )
                   );
};

/* ========== MAIN COMPONENT ========== */
const SetveraChat: React.FC = () => {
        const [page, setPage] = useState<Page>('landing');
        const [session, setSession] = useState<Session | null>(null);

        if (page === 'landing') return e(LandingSection, { onGetStarted: () => setPage('login') });
        if (page === 'login') return e(LoginSection, {
                  onLogin: (s: Session) => { setSession(s); setPage('chat'); },
                  onBack: () => setPage('landing'),
        });
        return e(ChatSection, { session: session!, onLogout: () => { setSession(null); setPage('landing'); } });
};

export default SetveraChat;
