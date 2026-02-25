import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SetveraChat from './components/SetveraChat';

export type Page = 'landing' | 'login' | 'chat';

export interface UserSession {
      businessName: string;
      module: 'restaurant' | 'beauty' | 'clinic';
}

const App: React.FC = () => {
      const [page, setPage] = useState<Page>('landing');
      const [session, setSession] = useState<UserSession | null>(null);

      const handleLogin = (data: UserSession) => {
              setSession(data);
              setPage('chat');
      };

      const handleLogout = () => {
              setSession(null);
              setPage('landing');
      };

      if (page === 'landing') {
              return <LandingPage onGetStarted={() => setPage('login')} />;
      }

      if (page === 'login') {
              return <LoginPage onLogin={handleLogin} onBack={() => setPage('landing')} />;
      }

      return <SetveraChat session={session!} onLogout={handleLogout} />;
};

export default App;
