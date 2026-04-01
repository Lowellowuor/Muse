import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './store/useUserStore';

// Layout
import Layout from './components/layout/Layout';

// Auth pages
import Landing from './pages/auth/Landing';
import Auth from './pages/auth/Auth';

// App pages
import Dashboard from './pages/app/Dashboard';
import Rooms from './pages/app/Rooms';
import RoomDetail from './pages/app/RoomDetail';
import Journal from './pages/app/Journal';
import JournalEntry from './pages/app/JournalEntry';
import Threads from './pages/app/Threads';
import ThreadDetail from './pages/app/ThreadDetail';
import Connections from './pages/app/Connections';
import Community from './pages/app/Community';
import Settings from './pages/app/Settings';
import Create from './pages/app/Create';
import Mirror from './pages/app/Mirror';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { user } = useUserStore();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes with Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:id" element={<JournalEntry />} />
          <Route path="/threads" element={<Threads />} />
          <Route path="/threads/:id" element={<ThreadDetail />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<Create />} />
          <Route path="/mirror" element={<Mirror />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;