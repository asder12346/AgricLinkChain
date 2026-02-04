import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }

      // Redirect based on role
      switch (role) {
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'buyer':
          navigate('/buyer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          // No role yet, redirect to onboarding
          navigate('/onboarding');
      }
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
