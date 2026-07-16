import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

import SplashScreen from '@/pages/SplashScreen';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import LettersPage from '@/pages/LettersPage';
import CreateLetterPage from '@/pages/CreateLetterPage';
import LetterDetailPage from '@/pages/LetterDetailPage';
import MemoriesPage from '@/pages/MemoriesPage';
import TogetherPage from '@/pages/TogetherPage';
import RemindersPage from '@/pages/RemindersPage';
import SettingsPage from '@/pages/SettingsPage';
import AppShell from '@/components/layout/AppShell';
import AuthGate from '@/components/layout/AuthGate';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/letters" component={LettersPage} />
      <Route path="/letters/new" component={CreateLetterPage} />
      <Route path="/letters/:id" component={LetterDetailPage} />
      <Route path="/memories" component={MemoriesPage} />
      <Route path="/together" component={TogetherPage} />
      <Route path="/reminders" component={RemindersPage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <AuthGate splashScreen={<SplashScreen />} loginPage={<LoginPage />}>
                <AppShell>
                  <AppRoutes />
                </AppShell>
              </AuthGate>
            </WouterRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
