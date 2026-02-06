import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ShoppingBag, ArrowLeft, Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { AppRole } from '@/lib/types';
import { cn } from '@/lib/utils';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();

  const [selectedRole, setSelectedRole] = useState<AppRole | null>(
    (searchParams.get('role') as AppRole) || null
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, selectedRole);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to verify your account.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://theaseanmagazine.asean.org/files/media/2025/04/issue43-21-1.jpg"
          alt="Agriculture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Leaf className="w-6 h-6" />
              <span className="font-bold text-xl">AgricLinkChain</span>
            </Link>
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold mb-4 color-white">Grow with Confidence.</h2>
            <p className="text-white/80 max-w-md">Whether you are buying or selling, we provide the tools you need to succeed.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {!selectedRole ? (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Join AgricLinkChain</h1>
                <p className="text-gray-500 mt-2">Choose how you want to participate in the marketplace.</p>
              </div>

              <div className="grid gap-4">
                <div
                  className="group cursor-pointer border rounded-2xl p-6 hover:border-green-600 hover:bg-green-50/50 transition-all duration-300"
                  onClick={() => setSelectedRole('farmer')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <Leaf className="w-6 h-6 text-green-700 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">I'm a Farmer</h3>
                      <p className="text-sm text-gray-500">List produce, manage harvest, and connect with buyers.</p>
                    </div>
                  </div>
                </div>

                <div
                  className="group cursor-pointer border rounded-2xl p-6 hover:border-orange-600 hover:bg-orange-50/50 transition-all duration-300"
                  onClick={() => setSelectedRole('buyer')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <ShoppingBag className="w-6 h-6 text-orange-700 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">I'm a Buyer</h3>
                      <p className="text-sm text-gray-500">Source fresh produce directly from verified farmers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <button
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Change role
              </button>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    selectedRole === 'farmer' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {selectedRole === 'farmer' ? <Leaf className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900">Create {selectedRole === 'farmer' ? 'Farmer' : 'Buyer'} Account</h1>
                </div>
                <p className="text-gray-500">Fill in your details to get started.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-12 rounded-full text-lg font-medium mt-4",
                    selectedRole === 'farmer'
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-500 hover:bg-orange-600"
                  )}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </div>
          )}

          <div className="text-center text-sm pt-4">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-green-600 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
