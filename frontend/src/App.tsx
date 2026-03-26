import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import DiaryDetail from './pages/DiaryDetail';
import WriteDiary from './pages/WriteDiary';
import BatchImport from './pages/BatchImport';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  console.log('App component loaded');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<DiaryDetail />} />
          <Route
            path="write"
            element={
              <ProtectedRoute>
                <WriteDiary />
              </ProtectedRoute>
            }
          />
          <Route
            path="batch-import"
            element={
              <ProtectedRoute>
                <BatchImport />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

