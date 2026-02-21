import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DestinationPage } from './pages/DestinationPage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { RecommendationPage } from './pages/RecommendationPage';
import { SavedPage } from './pages/SavedPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransportPage } from './pages/TransportPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/transport/:from/:to" element={<TransportPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/destination/:city" element={<DestinationPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
