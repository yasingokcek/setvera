import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessage } from '../services/setveraService';
const e = React.createElement;

type Page = 'landing' | 'auth' | 'dashboard';
type AuthTab = 'login' | 'register';
type DashTab = 'chat' | 'reservations' | 'customers' | 'settings';
type Module = 'restaurant' | 'beauty' | 'clinic' | 'other';

interface Session {
  businessName: string;
  module: Module;
  email: string;
  plan: 'demo' | 'starter' | 'pro';
}

interface Reservation {
  id: string;
  customer: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  area: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  note: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  lastVisit: string;
}

const DEMO_RESERVATIONS: Reservation[] = [
  { id: '1', customer: 'Ahmet Yilmaz', phone: '0532 111 2233', date: '2026-02-26', time: '19:00', guests: 4, area: 'Teras', status: 'confirmed', note: 'Dogum gunu' },
  { id: '2', customer: 'Fatma Kaya', phone: '0543 222 3344', date: '2026-02-26', time: '20:30', guests: 2, area: 'Ic mekan', status: 'confirmed', note: '' },
  { id: '3', customer: 'Mehmet Demir', phone: '0555 333 4455', date: '2026-02-27', time: '13:00', guests: 6, area: 'VIP', status: 'pending', note: 'Is yemegi' },
  { id: '4', customer: 'Ayse Sahin', phone: '0507 444 5566', date: '2026-02-27', time: '21:00', guests: 8, area: 'Bahce', status: 'pending', note: 'Evlilik teklifi surpriz' },
  { id: '5', customer: 'Can Ozturk', phone: '0541 555 6677', date: '2026-02-28', time: '12:30', guests: 3, area: 'Cam kenari', status: 'cancelled', note: '' },
];

const DEMO_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ahmet Yilmaz', phone: '0532 111 2233', email: 'ahmet@email.com', totalVisits: 8, lastVisit: '2026-02-26' },
  { id: '2', name: 'Fatma Kaya', phone: '0543 222 3344', email: 'fatma@email.com', totalVisits: 5, lastVisit: '2026-02-26' },
  { id: '3', name: 'Mehmet Demir', phone: '0555 333 4455', email: 'mehmet@email.com', totalVisits: 12, lastVisit: '2026-02-20' },
  { id: '4', name: 'Ayse Sahin', phone: '0507 444 5566', email: 'ayse@email.com', totalVisits: 3, lastVisit: '2026-02-15' },
  { id: '5', name: 'Can Ozturk', phone: '0541 555 6677', email: 'can@email.com', totalVisits: 1, lastVisit: '2026-02-10' },
];

/* ===== LANDING PAGE ===== */
const LandingSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const stats = [
    { n: '2.400+', l: 'Aktif Isletme' },
    { n: '98%', l: 'Musteri Memnuniyeti' },
    { n: '47K+', l: 'Rezervasyon/Ay' },
    { n: '3 dk', l: 'Kurulum Suresi' },
  ];
  const features = [
    { icon: 'AI', col: 'from-purple-600 to-purple-800', title: 'Gemini AI Asistan', desc: 'Musterilerinizle dogal dilde konusan, rezervasyon detaylarini eksiksiz toplayan akilli asistan.' },
    { icon: 'TK', col: 'from-blue-600 to-blue-800', title: 'Google Takvim Entegrasyonu', desc: 'Onaylanan her rezervasyon aninda Google Takvim e islenir. Hicbir rezervasyon kacmaz.' },
    { icon: 'WP', col: 'from-green-600 to-green-800', title: 'WhatsApp & Web Chat', desc: 'Musterileriniz hangi kanaldan yazarsa yazsin, Setvera her yerden rezervasyon alir.' },
    { icon: 'RA', col: 'from-orange-600 to-orange-800', title: 'Akilli Raporlama', desc: 'Doluluk orani, populer saatler, musteri sadakati gibi metrikleri gercek zamanli takip edin.' },
    { icon: 'NO', col: 'from-pink-600 to-pink-800', title: 'No-Show Onleme', desc: 'Otomatik hatirlatma mesajlari ile no-show oranini yuzde 70 azaltin.' },
    { icon: 'MP', col: 'from-cyan-600 to-cyan-800', title: 'Cok Sektorlu', desc: 'Restoran, guzellik merkezi, klinik ve daha fazlasi icin ozel modullere sahip tek platform.' },
  ];
  const testimonials = [
    { name: 'Mehmet Yilmaz', biz: 'Lezzet Restoran, Istanbul', text: 'Setvera ile no-show sorunumuz yuzde 80 azaldi. Masalarimin dolu olmasini artik bir asistan hallediyor.', stars: 5 },
    { name: 'Zeynep Kara', biz: 'Ella Beauty Center, Ankara', text: 'Randevu defterini kapatip Setvera ya gectim. Hic pismanlik yasamadim. Musterilerim cok memnun.', stars: 5 },
    { name: 'Dr. Ali Demir', biz: 'Saglik Klinigi, Izmir', text: 'Hasta randevularimizi yonetmek artik cok kolay. KVKK uyumu ve guvenlik ozellikleri de mukemmel.', stars: 5 },
  ];
  const plans = [
    { name: 'Starter', price: '490', period: 'ay', color: 'border-gray-700', badge: '', features: ['500 rezervasyon/ay', 'Web Chat', 'Google Takvim', 'Email destek'] },
    { name: 'Pro', price: '990', period: 'ay', color: 'border-purple-600', badge: 'EN POPULER', features: ['Sinirsiz rezervasyon', 'WhatsApp entegrasyonu', 'Gelismis raporlar', 'Oncelikli destek', 'Coklu lokasyon'] },
    { name: 'Enterprise', price: 'Ozel', period: '', color: 'border-gray-700', badge: '', features: ['Her seyin sinirsiz', 'Ozel AI egitimi', 'API erisimi', '7/24 destek', 'SLA garantisi'] },
  ];

  return e('div', { className: 'min-h-screen bg-gray-950 text-white' },
    e('nav', { className: 'sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950' },
      e('div', { className: 'flex items-center gap-2' },
        e('div', { className: 'w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm' }, 'S'),
        e('span', { className: 'font-bold text-lg' }, 'Setvera')
      ),
      e('div', { className: 'hidden md:flex items-center gap-6 text-sm text-gray-400' },
        e('a', { href: '#features', className: 'hover:text-white transition-colors' }, 'Ozellikler'),
        e('a', { href: '#sectors', className: 'hover:text-white transition-colors' }, 'Sektorler'),
        e('a', { href: '#pricing', className: 'hover:text-white transition-colors' }, 'Fiyatlar'),
        e('a', { href: '#testimonials', className: 'hover:text-white transition-colors' }, 'Yorumlar')
      ),
      e('div', { className: 'flex items-center gap-3' },
        e('button', { onClick: onGetStarted, className: 'text-sm text-gray-400 hover:text-white transition-colors px-3 py-2' }, 'Giris Yap'),
        e('button', { onClick: onGetStarted, className: 'px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors' }, 'Ucretsiz Dene')
      )
    ),
    e('section', { className: 'px-6 py-20 text-center' },
      e('div', { className: 'max-w-4xl mx-auto' },
        e('div', { className: 'inline-flex items-center gap-2 bg-purple-900 border border-purple-700 rounded-full px-4 py-1.5 text-xs text-purple-300 mb-8' },
          e('span', { className: 'w-2 h-2 rounded-full bg-green-400 inline-block' }),
          'Yapay Zeka Destekli Rezervasyon Platformu — Gemini 1.5 Flash'
        ),
        e('h1', { className: 'text-5xl md:text-6xl font-black leading-tight mb-6' },
          'Rezervasyonlarini', e('br', null),
          e('span', { className: 'text-purple-400' }, 'AI ile Otomatiklestir')
        ),
        e('p', { className: 'text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed' },
          'Restoranlar, guzellik merkezleri ve klinikler icin 7/24 calisan yapay zeka asistani. Musterilerle konusuyor, rezervasyon aliyor, takvime isliyor.'
        ),
        e('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center mb-14' },
          e('button', { onClick: onGetStarted, className: 'px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-base font-bold transition-colors shadow-lg shadow-purple-900' }, '14 Gun Ucretsiz Dene'),
          e('a', { href: '#features', className: 'px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-xl text-base font-medium text-gray-300 hover:text-white transition-colors' }, 'Nasil Calisir?')
        ),
        e('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto' },
          ...stats.map(s => e('div', { key: s.n, className: 'text-center' },
            e('div', { className: 'text-2xl font-black text-white mb-1' }, s.n),
            e('div', { className: 'text-xs text-gray-500' }, s.l)
          ))
        )
      )
    ),
    e('section', { id: 'features', className: 'py-20 px-6 bg-gray-900' },
      e('div', { className: 'max-w-6xl mx-auto' },
        e('div', { className: 'text-center mb-14' },
          e('h2', { className: 'text-3xl md:text-4xl font-black mb-4' }, 'Neden Setvera?'),
          e('p', { className: 'text-gray-400 max-w-xl mx-auto' }, 'Tek platformda ihtiyaciniz olan her sey. Kurulum yok, teknik bilgi gerekmez.')
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
          ...features.map(f => e('div', { key: f.icon, className: 'bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-purple-700 transition-all' },
            e('div', { className: 'w-12 h-12 rounded-xl bg-gradient-to-br ' + f.col + ' flex items-center justify-center text-white text-sm font-black mb-4' }, f.icon),
            e('h3', { className: 'font-bold text-lg mb-2' }, f.title),
            e('p', { className: 'text-gray-400 text-sm leading-relaxed' }, f.desc)
          ))
        )
      )
    ),
    e('section', { id: 'sectors', className: 'py-20 px-6' },
      e('div', { className: 'max-w-6xl mx-auto' },
        e('div', { className: 'text-center mb-14' },
          e('h2', { className: 'text-3xl md:text-4xl font-black mb-4' }, 'Sektorunuze Ozel Cozum'),
          e('p', { className: 'text-gray-400 max-w-xl mx-auto' }, 'Her isletme tipine gore ozellesmis akilli moduller.')
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          e('div', { className: 'relative bg-gradient-to-br from-orange-900 to-red-950 border border-orange-800 rounded-3xl p-8' },
            e('div', { className: 'absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold' }, 'AKTIF'),
            e('div', { className: 'text-4xl font-black mb-3 text-orange-300' }, 'Restoran'),
            e('p', { className: 'text-orange-200 text-sm mb-4' }, 'Masa rezervasyonu, kapasite yonetimi, dogum gunu organizasyonu ve no-show onleme.'),
            e('ul', { className: 'text-orange-300 text-sm space-y-1.5' },
              e('li', null, '✓ Masa ve kapasite yonetimi'),
              e('li', null, '✓ 2 saatlik bloklama sistemi'),
              e('li', null, '✓ Alan tercihi (teras, ic, VIP)'),
              e('li', null, '✓ Grup menu onerisi 10+ kisi'),
              e('li', null, '✓ No-show SMS hatirlatma')
            )
          ),
          e('div', { className: 'relative bg-gradient-to-br from-pink-900 to-purple-950 border border-pink-800 rounded-3xl p-8' },
            e('div', { className: 'absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold' }, 'BETA'),
            e('div', { className: 'text-4xl font-black mb-3 text-pink-300' }, 'Guzellik Merkezi'),
            e('p', { className: 'text-pink-200 text-sm mb-4' }, 'Personel ve hizmet bazli randevu, onceki tercih hafizasi, paket onerisi.'),
            e('ul', { className: 'text-pink-300 text-sm space-y-1.5' },
              e('li', null, '✓ Personel ve hizmet secimi'),
              e('li', null, '✓ Sure bazli slot yonetimi'),
              e('li', null, '✓ Musteri tercih hafizasi'),
              e('li', null, '✓ Paket urun onerisi'),
              e('li', null, '✓ Online odeme entegrasyonu')
            )
          ),
          e('div', { className: 'relative bg-gradient-to-br from-blue-900 to-cyan-950 border border-blue-800 rounded-3xl p-8' },
            e('div', { className: 'absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold' }, 'BETA'),
            e('div', { className: 'text-4xl font-black mb-3 text-blue-300' }, 'Klinik & Saglik'),
            e('p', { className: 'text-blue-200 text-sm mb-4' }, 'Doktor ve uzmanlik bazli randevu, sigorta yonetimi, KVKK uyumlu veri.'),
            e('ul', { className: 'text-blue-300 text-sm space-y-1.5' },
              e('li', null, '✓ Doktor ve Uzman secimi'),
              e('li', null, '✓ Sigorta ve ozel hasta'),
              e('li', null, '✓ KVKK uyumlu sistem'),
              e('li', null, '✓ Hasta gecmisi takibi'),
              e('li', null, '✓ Oncelikli randevu akisi')
            )
          ),
          e('div', { className: 'relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-3xl p-8' },
            e('div', { className: 'text-4xl font-black mb-3 text-gray-300' }, 'Diger Isletmeler'),
            e('p', { className: 'text-gray-300 text-sm mb-4' }, 'Spor salonu, hotel, tur sirketi, hukuk burosu ve daha fazlasi icin ozellestirilir.'),
            e('ul', { className: 'text-gray-400 text-sm space-y-1.5' },
              e('li', null, '✓ Tamamen ozellestirilebilir'),
              e('li', null, '✓ Ozel AI egitimi'),
              e('li', null, '✓ API entegrasyonu'),
              e('li', null, '✓ Beyaz etiket secenegi'),
              e('li', null, '✓ Kurumsal destek')
            )
          )
        )
      )
    ),
    e('section', { id: 'testimonials', className: 'py-20 px-6 bg-gray-900' },
      e('div', { className: 'max-w-6xl mx-auto' },
        e('div', { className: 'text-center mb-14' },
          e('h2', { className: 'text-3xl md:text-4xl font-black mb-4' }, 'Musterilerimiz Ne Diyor?'),
          e('p', { className: 'text-gray-400' }, '2.400 den fazla isletme Setvera ya guvendiriyor.')
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          ...testimonials.map(t => e('div', { key: t.name, className: 'bg-gray-800 border border-gray-700 rounded-2xl p-6' },
            e('div', { className: 'flex gap-1 mb-3' }, ...Array(t.stars).fill(null).map((_, i) => e('span', { key: i, className: 'text-yellow-400 text-sm' }, 'X'))),
            e('p', { className: 'text-gray-300 text-sm leading-relaxed mb-4 italic' }, t.text),
            e('div', null,
              e('div', { className: 'font-semibold text-sm' }, t.name),
              e('div', { className: 'text-gray-500 text-xs' }, t.biz)
            )
          ))
        )
      )
    ),
    e('section', { id: 'pricing', className: 'py-20 px-6' },
      e('div', { className: 'max-w-5xl mx-auto' },
        e('div', { className: 'text-center mb-14' },
          e('h2', { className: 'text-3xl md:text-4xl font-black mb-4' }, 'Seffaf Fiyatlandirma'),
          e('p', { className: 'text-gray-400' }, 'Gizli ucret yok. Istediginiz zaman iptal.')
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          ...plans.map(p => e('div', { key: p.name, className: 'relative border ' + p.color + ' rounded-2xl p-6 bg-gray-900' + (p.badge ? ' ring-1 ring-purple-600' : '') },
            p.badge ? e('div', { className: 'absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full font-bold' }, p.badge) : null,
            e('h3', { className: 'font-black text-xl mb-1' }, p.name),
            e('div', { className: 'flex items-end gap-1 mb-4' },
              e('span', { className: 'text-4xl font-black' }, p.price === 'Ozel' ? 'Ozel' : '₺' + p.price),
              p.period ? e('span', { className: 'text-gray-400 text-sm mb-1' }, '/' + p.period) : null
            ),
            e('ul', { className: 'text-gray-400 text-sm space-y-2 mb-6' },
              ...p.features.map(f => e('li', { key: f, className: 'flex items-center gap-2' }, e('span', { className: 'text-green-400' }, '✓'), f))
            ),
            e('button', { onClick: onGetStarted, className: 'w-full py-3 rounded-xl text-sm font-bold transition-colors ' + (p.badge ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white') }, p.price === 'Ozel' ? 'Bize Ulasin' : 'Baslayin')
          ))
        )
      )
    ),
    e('section', { className: 'py-20 px-6 bg-gray-900' },
      e('div', { className: 'max-w-3xl mx-auto text-center' },
        e('h2', { className: 'text-4xl font-black mb-4' }, 'Hemen Baslayin'),
        e('p', { className: 'text-gray-400 mb-8 text-lg' }, 'Kredi karti gerekmez. 14 gun ucretsiz kullanin.'),
        e('button', { onClick: onGetStarted, className: 'px-12 py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl text-lg font-black transition-colors shadow-2xl shadow-purple-900' }, 'Ucretsiz Hesap Olustur')
      )
    ),
    e('footer', { className: 'border-t border-gray-800 py-10 px-6' },
      e('div', { className: 'max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4' },
        e('div', { className: 'flex items-center gap-2' },
          e('div', { className: 'w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold' }, 'S'),
          e('span', { className: 'font-bold text-gray-400' }, 'Setvera')
        ),
        e('p', { className: 'text-gray-600 text-sm' }, '2026 Setvera. Tum haklar saklidir. Gemini AI ile guclendiriliyor.'),
        e('div', { className: 'flex gap-4 text-sm text-gray-600' },
          e('a', { href: '#', className: 'hover:text-gray-400' }, 'Gizlilik'),
          e('a', { href: '#', className: 'hover:text-gray-400' }, 'Kullanim Sartlari'),
          e('a', { href: '#', className: 'hover:text-gray-400' }, 'Destek')
        )
      )
    )
  );
};

/* ========== AUTH SECTION ========== */
const AuthSection: React.FC<{ onLogin: (s: Session) => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const e = React.createElement;
  const [tab, setTab] = React.useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = React.useState({ username: '', password: '' });
  const [regData, setRegData] = React.useState({ name: '', email: '', phone: '', sector: 'Restoran', password: '', confirmPassword: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    setError('');
    if (!loginData.username || !loginData.password) { setError('Kullanıcı adı ve şifre gerekli.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (loginData.username === 'admin' && loginData.password === 'ceku') {
        onLogin({ userId: 'admin-001', businessName: 'Demo İşletme', sector: 'Restoran', email: 'admin@setvera.com', token: 'demo-token' });
      } else {
        const found = DEMO_USERS.find(u => u.username === loginData.username && u.password === loginData.password);
        if (found) {
          onLogin({ userId: found.id, businessName: found.businessName, sector: found.sector, email: found.email, token: 'user-token-' + found.id });
        } else {
          setError('Geçersiz kullanıcı adı veya şifre.');
        }
      }
    }, 800);
  };

  const handleRegister = () => {
    setError('');
    if (!regData.name || !regData.email || !regData.password) { setError('Lütfen tüm zorunlu alanları doldurun.'); return; }
    if (regData.password !== regData.confirmPassword) { setError('Şifreler eşleşmiyor.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ userId: 'new-' + Date.now(), businessName: regData.name, sector: regData.sector, email: regData.email, token: 'new-token' });
    }, 800);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ userId: 'google-001', businessName: 'Google İşletme', sector: 'Diğer', email: 'user@gmail.com', token: 'google-token' });
    }, 1000);
  };

  const sectors = ['Restoran', 'Güzellik Merkezi', 'Klinik', 'Diğer'];

  return e('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4' },
    e('div', { className: 'w-full max-w-md' },
      e('div', { className: 'text-center mb-8' },
        e('button', { onClick: onBack, className: 'text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center gap-1 mx-auto' },
          e('span', null, '←'), e('span', null, 'Ana Sayfaya Dön')
        ),
        e('div', { className: 'flex items-center justify-center gap-3 mb-2' },
          e('div', { className: 'w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center' },
            e('span', { className: 'text-white font-bold text-xl' }, 'S')
          ),
          e('h1', { className: 'text-3xl font-bold text-white' }, 'Setvera')
        ),
        e('p', { className: 'text-blue-300 text-sm' }, 'Yapay Zeka Destekli İşletme Asistanı')
      ),
      e('div', { className: 'bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl' },
        e('div', { className: 'flex' },
          e('button', {
            onClick: () => { setTab('login'); setError(''); },
            className: 'flex-1 py-4 text-sm font-semibold transition-all ' + (tab === 'login' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')
          }, 'Giriş Yap'),
          e('button', {
            onClick: () => { setTab('register'); setError(''); },
            className: 'flex-1 py-4 text-sm font-semibold transition-all ' + (tab === 'register' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')
          }, 'Üye Ol')
        ),
        e('div', { className: 'p-6' },
          tab === 'login' ? e('div', { className: 'space-y-4' },
            e('div', { className: 'bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-sm' },
              e('div', { className: 'text-blue-300 font-semibold mb-1' }, '🎯 Demo Giriş'),
              e('div', { className: 'text-blue-200 text-xs' }, 'Kullanıcı adı: ', e('strong', null, 'admin'), '  |  Şifre: ', e('strong', null, 'ceku'))
            ),
            e('button', {
              onClick: handleGoogleLogin,
              disabled: loading,
              className: 'w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50'
            },
              e('span', { className: 'text-xl' }, '🔵'),
              e('span', null, 'Google ile Giriş Yap')
            ),
            e('div', { className: 'flex items-center gap-3 text-gray-500 text-xs' },
              e('div', { className: 'flex-1 h-px bg-white/10' }),
              e('span', null, 'veya'),
              e('div', { className: 'flex-1 h-px bg-white/10' })
            ),
            e('input', {
              type: 'text',
              placeholder: 'Kullanıcı Adı',
              value: loginData.username,
              onChange: (ev: any) => setLoginData({ ...loginData, username: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            e('input', {
              type: 'password',
              placeholder: 'Şifre',
              value: loginData.password,
              onChange: (ev: any) => setLoginData({ ...loginData, password: ev.target.value }),
              onKeyPress: (ev: any) => ev.key === 'Enter' && handleLogin(),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            error ? e('div', { className: 'bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm' }, error) : null,
            e('button', {
              onClick: handleLogin,
              disabled: loading,
              className: 'w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2'
            },
              loading ? e('span', null, '⏳ Giriş Yapılıyor...') : e('span', null, 'Giriş Yap →')
            ),
            e('div', { className: 'text-center text-gray-500 text-xs' },
              e('a', { href: '#', className: 'text-blue-400 hover:text-blue-300' }, 'Şifremi Unuttum')
            )
          ) : e('div', { className: 'space-y-4' },
            e('input', {
              type: 'text',
              placeholder: 'İşletme Adı *',
              value: regData.name,
              onChange: (ev: any) => setRegData({ ...regData, name: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            e('input', {
              type: 'email',
              placeholder: 'E-posta Adresi *',
              value: regData.email,
              onChange: (ev: any) => setRegData({ ...regData, email: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            e('input', {
              type: 'tel',
              placeholder: 'Telefon Numarası',
              value: regData.phone,
              onChange: (ev: any) => setRegData({ ...regData, phone: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            e('select', {
              value: regData.sector,
              onChange: (ev: any) => setRegData({ ...regData, sector: ev.target.value }),
              className: 'w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all'
            },
              sectors.map(s => e('option', { key: s, value: s }, s))
            ),
            e('input', {
              type: 'password',
              placeholder: 'Şifre *',
              value: regData.password,
              onChange: (ev: any) => setRegData({ ...regData, password: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            e('input', {
              type: 'password',
              placeholder: 'Şifre Tekrar *',
              value: regData.confirmPassword,
              onChange: (ev: any) => setRegData({ ...regData, confirmPassword: ev.target.value }),
              className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all'
            }),
            error ? e('div', { className: 'bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm' }, error) : null,
            e('button', {
              onClick: handleRegister,
              disabled: loading,
              className: 'w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50'
            },
              loading ? '⏳ Hesap Oluşturuluyor...' : 'Üye Ol →'
            ),
            e('div', { className: 'text-center' },
              e('button', {
                onClick: handleGoogleLogin,
                disabled: loading,
                className: 'flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 w-full mt-2'
              },
                e('span', { className: 'text-xl' }, '🔵'),
                e('span', null, 'Google ile Üye Ol')
              )
            )
          )
        )
      )
    )
  );
};


/* ========== DASHBOARD SECTION ========== */
const DashboardSection: React.FC<{ session: Session; onLogout: () => void }> = ({ session, onLogout }) => {
  const e = React.createElement;
  const [activeTab, setActiveTab] = React.useState<'chat' | 'reservations' | 'customers' | 'settings' | 'stats'>('stats');
  const [messages, setMessages] = React.useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba ' + session.businessName + '! Ben Setvera AI asistanınızım. Rezervasyonlar, müşteri sorguları veya işletmeniz hakkında her konuda yardımcı olabilirim.', timestamp: new Date() }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [reservations, setReservations] = React.useState<Reservation[]>(DEMO_RESERVATIONS);
  const [customers] = React.useState<Customer[]>(DEMO_CUSTOMERS);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const systemPrompt = 'Sen Setvera yapay zeka asistanısın. ' + session.businessName + ' adlı ' + session.sector + ' işletmesine yardım ediyorsun. Türkçe yanıt ver. Rezervasyon yönetimi, müşteri ilişkileri ve işletme operasyonları konularında uzmanlaşmışsın.';
      const result = await model.generateContent(systemPrompt + '\n\nKullanıcı: ' + currentInput);
      const response = result.response.text();
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Üzgünüm, şu an AI servisine bağlanamıyorum. Lütfen daha sonra tekrar deneyin ya da doğrudan iletişime geçin.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const updateReservationStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const navItems = [
    { id: 'stats', label: 'Genel Bakış', icon: '📊' },
    { id: 'chat', label: 'AI Asistan', icon: '🤖' },
    { id: 'reservations', label: 'Rezervasyonlar', icon: '📅' },
    { id: 'customers', label: 'Müşteriler', icon: '👥' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
  ];

  const statsData = [
    { label: 'Toplam Rezervasyon', value: reservations.length.toString(), icon: '📅', color: 'blue' },
    { label: 'Onaylı', value: reservations.filter(r => r.status === 'confirmed').toString() !== '[object Object]' ? reservations.filter(r => r.status === 'confirmed').length.toString() : '0', icon: '✅', color: 'green' },
    { label: 'Bekleyen', value: reservations.filter(r => r.status === 'pending').length.toString(), icon: '⏳', color: 'yellow' },
    { label: 'Müşteri Sayısı', value: customers.length.toString(), icon: '👥', color: 'purple' },
  ];

  return e('div', { className: 'flex h-screen bg-slate-900 text-white overflow-hidden' },
    // Sidebar
    e('div', { className: 'transition-all duration-300 ' + (sidebarOpen ? 'w-64' : 'w-16') + ' bg-slate-800 border-r border-white/10 flex flex-col' },
      e('div', { className: 'p-4 border-b border-white/10 flex items-center gap-3' },
        e('div', { className: 'w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0' },
          e('span', { className: 'text-white font-bold' }, 'S')
        ),
        sidebarOpen && e('div', { className: 'overflow-hidden' },
          e('div', { className: 'text-white font-bold text-sm truncate' }, session.businessName),
          e('div', { className: 'text-gray-400 text-xs truncate' }, session.sector)
        )
      ),
      e('nav', { className: 'flex-1 p-2' },
        navItems.map(item =>
          e('button', {
            key: item.id,
            onClick: () => setActiveTab(item.id as any),
            className: 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-left ' + (activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white')
          },
            e('span', { className: 'text-lg flex-shrink-0' }, item.icon),
            sidebarOpen && e('span', { className: 'text-sm font-medium' }, item.label)
          )
        )
      ),
      e('div', { className: 'p-2 border-t border-white/10' },
        e('button', {
          onClick: onLogout,
          className: 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all'
        },
          e('span', { className: 'text-lg flex-shrink-0' }, '🚪'),
          sidebarOpen && e('span', { className: 'text-sm font-medium' }, 'Çıkış Yap')
        )
      )
    ),
    // Main content
    e('div', { className: 'flex-1 flex flex-col overflow-hidden' },
      // Header
      e('div', { className: 'bg-slate-800/50 border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0' },
        e('div', { className: 'flex items-center gap-4' },
          e('button', { onClick: () => setSidebarOpen(!sidebarOpen), className: 'text-gray-400 hover:text-white transition-colors' }, sidebarOpen ? '◀' : '▶'),
          e('h2', { className: 'text-lg font-semibold' }, navItems.find(n => n.id === activeTab)?.label || 'Dashboard')
        ),
        e('div', { className: 'flex items-center gap-3' },
          e('div', { className: 'text-right hidden sm:block' },
            e('div', { className: 'text-sm font-medium text-white' }, session.businessName),
            e('div', { className: 'text-xs text-gray-400' }, session.email)
          ),
          e('div', { className: 'w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold' },
            session.businessName.charAt(0).toUpperCase()
          )
        )
      ),
      // Tab content
      e('div', { className: 'flex-1 overflow-y-auto' },
        // STATS TAB
        activeTab === 'stats' && e('div', { className: 'p-6' },
          e('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6' },
            statsData.map((stat, i) =>
              e('div', { key: i, className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
                e('div', { className: 'flex items-center justify-between mb-2' },
                  e('span', { className: 'text-2xl' }, stat.icon),
                  e('span', { className: 'text-2xl font-bold text-white' }, stat.value)
                ),
                e('div', { className: 'text-gray-400 text-sm' }, stat.label)
              )
            )
          ),
          e('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' },
            e('div', { className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
              e('h3', { className: 'text-white font-semibold mb-3' }, '📅 Son Rezervasyonlar'),
              reservations.slice(0, 4).map(r =>
                e('div', { key: r.id, className: 'flex items-center justify-between py-2 border-b border-white/5 last:border-0' },
                  e('div', null,
                    e('div', { className: 'text-sm font-medium text-white' }, r.customerName),
                    e('div', { className: 'text-xs text-gray-400' }, r.date + ' ' + r.time)
                  ),
                  e('span', {
                    className: 'text-xs px-2 py-1 rounded-full ' + (r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')
                  }, r.status === 'confirmed' ? 'Onaylı' : r.status === 'pending' ? 'Bekliyor' : 'İptal')
                )
              )
            ),
            e('div', { className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
              e('h3', { className: 'text-white font-semibold mb-3' }, '💡 AI Asistan Önerileri'),
              e('div', { className: 'space-y-2' },
                e('div', { className: 'bg-blue-500/10 rounded-xl p-3 text-sm text-blue-300' }, '🎯 Bu hafta 3 bekleyen rezervasyonunuz var. Hızlıca onaylayın!'),
                e('div', { className: 'bg-green-500/10 rounded-xl p-3 text-sm text-green-300' }, '📈 Geçen aya göre müşteri sayınız %15 arttı.'),
                e('div', { className: 'bg-purple-500/10 rounded-xl p-3 text-sm text-purple-300' }, '💬 AI asistanınızla müşteri sorularını otomatik yanıtlayın.')
              )
            )
          )
        ),
        // CHAT TAB
        activeTab === 'chat' && e('div', { className: 'flex flex-col h-full' },
          e('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4' },
            messages.map(msg =>
              e('div', { key: msg.id, className: 'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start') },
                e('div', { className: 'max-w-xs lg:max-w-2xl' },
                  msg.role === 'assistant' && e('div', { className: 'flex items-center gap-2 mb-1' },
                    e('div', { className: 'w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs' }, 'AI'),
                    e('span', { className: 'text-xs text-gray-400' }, 'Setvera AI')
                  ),
                  e('div', {
                    className: 'px-4 py-3 rounded-2xl text-sm leading-relaxed ' + (msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-slate-700 text-gray-100 rounded-bl-md')
                  }, msg.content)
                )
              )
            ),
            loading && e('div', { className: 'flex justify-start' },
              e('div', { className: 'bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md text-sm text-gray-400' }, '✍️ Yazıyor...')
            ),
            e('div', { ref: messagesEndRef })
          ),
          e('div', { className: 'p-4 border-t border-white/10 bg-slate-800/50' },
            e('div', { className: 'flex gap-3' },
              e('input', {
                type: 'text',
                value: input,
                onChange: (ev: any) => setInput(ev.target.value),
                onKeyPress: (ev: any) => ev.key === 'Enter' && handleSend(),
                placeholder: 'Mesajınızı yazın... (örn: Yarınki rezervasyonlar neler?)',
                className: 'flex-1 bg-slate-700 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm'
              }),
              e('button', {
                onClick: handleSend,
                disabled: loading || !input.trim(),
                className: 'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2'
              }, 'Gönder')
            )
          )
        ),
        // RESERVATIONS TAB
        activeTab === 'reservations' && e('div', { className: 'p-6' },
          e('div', { className: 'flex items-center justify-between mb-4' },
            e('h3', { className: 'text-lg font-semibold' }, 'Tüm Rezervasyonlar'),
            e('div', { className: 'flex gap-2' },
              ['Tümü', 'Bekleyen', 'Onaylı', 'İptal'].map(f =>
                e('button', { key: f, className: 'text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 transition-all' }, f)
              )
            )
          ),
          e('div', { className: 'space-y-3' },
            reservations.map(r =>
              e('div', { key: r.id, className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
                e('div', { className: 'flex items-start justify-between' },
                  e('div', { className: 'flex-1' },
                    e('div', { className: 'flex items-center gap-3 mb-2' },
                      e('div', { className: 'w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold' },
                        r.customerName.charAt(0)
                      ),
                      e('div', null,
                        e('div', { className: 'font-semibold text-white' }, r.customerName),
                        e('div', { className: 'text-gray-400 text-sm' }, r.phone)
                      )
                    ),
                    e('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm' },
                      e('div', null, e('span', { className: 'text-gray-400' }, '📅 '), e('span', { className: 'text-white' }, r.date)),
                      e('div', null, e('span', { className: 'text-gray-400' }, '🕐 '), e('span', { className: 'text-white' }, r.time)),
                      e('div', null, e('span', { className: 'text-gray-400' }, '👤 '), e('span', { className: 'text-white' }, r.guests + ' kişi')),
                      e('div', null, e('span', { className: 'text-gray-400' }, '📋 '), e('span', { className: 'text-white' }, r.service))
                    ),
                    r.notes && e('div', { className: 'mt-2 text-sm text-gray-400 bg-white/5 rounded-lg px-3 py-2' }, '💬 ' + r.notes)
                  ),
                  e('div', { className: 'flex flex-col items-end gap-2 ml-4' },
                    e('span', {
                      className: 'text-xs px-3 py-1 rounded-full ' + (r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')
                    }, r.status === 'confirmed' ? '✅ Onaylı' : r.status === 'pending' ? '⏳ Bekliyor' : '❌ İptal'),
                    r.status === 'pending' && e('div', { className: 'flex gap-2' },
                      e('button', {
                        onClick: () => updateReservationStatus(r.id, 'confirmed'),
                        className: 'text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg transition-all'
                      }, 'Onayla'),
                      e('button', {
                        onClick: () => updateReservationStatus(r.id, 'cancelled'),
                        className: 'text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-all'
                      }, 'İptal')
                    )
                  )
                )
              )
            )
          )
        ),
        // CUSTOMERS TAB
        activeTab === 'customers' && e('div', { className: 'p-6' },
          e('div', { className: 'flex items-center justify-between mb-4' },
            e('h3', { className: 'text-lg font-semibold' }, 'Müşteriler'),
            e('input', { type: 'text', placeholder: '🔍 Müşteri ara...', className: 'bg-slate-700 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm w-64' })
          ),
          e('div', { className: 'grid gap-3' },
            customers.map(c =>
              e('div', { key: c.id, className: 'bg-slate-800 rounded-2xl p-4 border border-white/10 flex items-center justify-between' },
                e('div', { className: 'flex items-center gap-4' },
                  e('div', { className: 'w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-lg' },
                    c.name.charAt(0)
                  ),
                  e('div', null,
                    e('div', { className: 'font-semibold text-white' }, c.name),
                    e('div', { className: 'text-gray-400 text-sm' }, c.email),
                    e('div', { className: 'text-gray-400 text-sm' }, c.phone)
                  )
                ),
                e('div', { className: 'text-right' },
                  e('div', { className: 'text-white font-semibold' }, c.totalVisits + ' ziyaret'),
                  e('div', { className: 'text-gray-400 text-sm' }, 'Son: ' + c.lastVisit),
                  e('div', { className: 'text-yellow-400 text-sm' }, '★'.repeat(c.rating))
                )
              )
            )
          )
        ),
        // SETTINGS TAB
        activeTab === 'settings' && e('div', { className: 'p-6 max-w-2xl' },
          e('div', { className: 'space-y-4' },
            e('div', { className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
              e('h3', { className: 'text-white font-semibold mb-4' }, '🏢 İşletme Bilgileri'),
              e('div', { className: 'space-y-3' },
                [
                  { label: 'İşletme Adı', value: session.businessName },
                  { label: 'Sektör', value: session.sector },
                  { label: 'E-posta', value: session.email },
                ].map((field, i) =>
                  e('div', { key: i },
                    e('label', { className: 'text-gray-400 text-sm block mb-1' }, field.label),
                    e('input', {
                      defaultValue: field.value,
                      className: 'w-full bg-slate-700 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all'
                    })
                  )
                )
              )
            ),
            e('div', { className: 'bg-slate-800 rounded-2xl p-4 border border-white/10' },
              e('h3', { className: 'text-white font-semibold mb-4' }, '🔔 Bildirim Ayarları'),
              e('div', { className: 'space-y-3' },
                [
                  { label: 'Yeni rezervasyonlarda e-posta gönder', checked: true },
                  { label: 'Müşteri mesajlarında bildirim al', checked: true },
                  { label: 'Haftalık rapor e-postası', checked: false },
                ].map((setting, i) =>
                  e('label', { key: i, className: 'flex items-center gap-3 cursor-pointer' },
                    e('input', { type: 'checkbox', defaultChecked: setting.checked, className: 'w-4 h-4 accent-blue-600' }),
                    e('span', { className: 'text-gray-300 text-sm' }, setting.label)
                  )
                )
              )
            ),
            e('button', { className: 'bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all' }, 'Ayarları Kaydet')
          )
        )
      )
    )
  );
};


/* ========== MAIN COMPONENT ========== */
const SetveraChat: React.FC = () => {
  const e = React.createElement;
  const [page, setPage] = React.useState<Page>('landing');
  const [session, setSession] = React.useState<Session | null>(null);

  const handleLogin = (s: Session) => {
    setSession(s);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    setPage('landing');
  };

  if (page === 'landing') return e(LandingSection, { onGetStarted: () => setPage('auth') });
  if (page === 'auth') return e(AuthSection, { onLogin: handleLogin, onBack: () => setPage('landing') });
  if (page === 'dashboard' && session) return e(DashboardSection, { session, onLogout: handleLogout });
  return e(LandingSection, { onGetStarted: () => setPage('auth') });
};

export default SetveraChat;
