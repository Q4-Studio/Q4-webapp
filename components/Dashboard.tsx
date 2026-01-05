import React, { useState, useEffect } from 'react';
import { getSession, onAuthStateChange } from '../lib/supabase';
import DashboardArticles from './DashboardArticles';
import DashboardEditor from './DashboardEditor';
import { BlogPost } from '../types/blog';

interface DashboardProps {
  onLogout: () => void;
}

type View = 'list' | 'create' | 'edit';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen to auth changes
    const { data: authListener } = onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        onLogout();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [onLogout]);

  const handleCreateNew = () => {
    setEditingPost(null);
    setCurrentView('create');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setEditingPost(null);
    setCurrentView('list');
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="relative w-full min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    onLogout();
    return null;
  }

  // Render current view
  return (
    <>
      {currentView === 'list' && (
        <DashboardArticles
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onLogout={onLogout}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <DashboardEditor
          post={editingPost}
          onBack={handleBackToList}
          onSave={handleBackToList}
        />
      )}
    </>
  );
};

export default Dashboard;
