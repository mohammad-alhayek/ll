import '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Pages — created by design phase
import SplashScreen from '@/pages/SplashScreen';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import LettersPage from '@/pages/LettersPage';
import MemoriesPage from '@/pages/MemoriesPage';
import TogetherPage from '@/pages/TogetherPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/not-found';
import AppShell from '@/components/layout/AppShell';
import AuthGate from '@/components/layout/AuthGate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/letters" component={LettersPage} />
      <Route path="/memories" component={MemoriesPage} />
      <Route path="/together" component={TogetherPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
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
              <AuthGate
                splashScreen={<SplashScreen />}
                loginPage={<LoginPage />}
              >
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
