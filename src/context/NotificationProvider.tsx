import React, { createContext, useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  // Can add methods here like sendSystemNotification etc.
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // In production, this would be the actual domain
      const wsUrl = `${protocol}//localhost:8000/ws/${user.id}`;
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Assuming data has { title, message, type }
          toast(data.message || event.data, {
             icon: data.type === 'alert' ? '🚨' : '📩',
             duration: 5000,
          });
        } catch (e) {
          // Plain text fallback
          toast(event.data, { duration: 5000 });
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
      };

      ws.onclose = () => {
        console.log('WebSocket Connection Closed');
      };

      return () => {
        ws.close();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
