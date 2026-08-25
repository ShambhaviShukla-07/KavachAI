import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1E293B', color: '#f1f5f9', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#22D3EE', secondary: '#030712' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } }
          }}
        />
      </SocketProvider>
    </AuthProvider>
  )
}
