import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './features/home/pages/Home';
import Journal from './features/journal/pages/Journal';
import Rooms from './features/rooms/pages/Rooms';
import RoomDetail from './features/rooms/pages/RoomDetail';
import Threads from './features/threads/pages/Threads';
import Insights from './features/insights/pages/Insights';
import Create from './features/create/pages/Create';
import Profile from './features/profile/pages/Profile';
import Settings from './features/settings/pages/Settings';

// Placeholder component for Quick Actions (to be implemented later)
const Actions = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">⚡</div>
      <h2 className="text-2xl font-bold text-white mb-2">Quick Actions</h2>
      <p className="text-gray-400">Coming soon...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/threads" element={<Threads />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Rooms Routes */}
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          
          {/* Additional Routes (Placeholders) */}
          <Route path="/actions" element={<Actions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;