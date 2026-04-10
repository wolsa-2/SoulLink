import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, FirebaseUser, onAuthStateChanged } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      if (this.state.error && this.state.error.message) {
        try {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes("insufficient permissions")) {
            errorMessage = "You don't have permission to perform this action. Please check your account status.";
          }
        } catch (e) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-brand-50">
          <h2 className="text-2xl font-serif font-bold text-brand-900 mb-4">Oops! An error occurred</h2>
          <p className="text-brand-700 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-600 text-white px-6 py-2 rounded-full hover:bg-brand-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
