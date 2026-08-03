import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Explore from './pages/Explore';
import SeriesDetail from './pages/SeriesDetail';
import Reader from './pages/Reader';
import Library from './pages/Library';
import History from './pages/History';
import Downloads from './pages/Downloads';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/explore" replace />} />
          <Route path="explore" element={<Explore />} />
          <Route path="library" element={<Library />} />
          <Route path="history" element={<History />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="series/:id/:slug" element={<SeriesDetail />} />
        </Route>
        {/* Reader is outside of main layout for full screen experience */}
        <Route path="/read/:linkId/:slug/:chapterId" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
