'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ArrowLeft, User, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import { authService, PatientProfile } from '@/lib/auth';
import PatientDashboard from '@/components/PatientDashboard';

export default function PatientPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Create demo users on first load
    authService.createDemoUsers();
    
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.type === 'patient') {
      setUser(currentUser as PatientProfile);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const user = await authService.login(email, password);
      if (user.type !== 'patient') {
        throw new Error('Please use the Doctor Portal for doctor accounts');
      }
      setUser(user as PatientProfile);
      setIsAuthenticated(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const user = await authService.registerPatient({
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        name: formData.get('name') as string,
        password,
        dateOfBirth: formData.get('dateOfBirth') as string,
        emergencyContact: formData.get('emergencyContact') as string,
      });
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <PatientDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Patient Portal</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Forms */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="health-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="patient@demo.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="demo123"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full health-button">
                      Login
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                      <p>Demo credentials:</p>
                      <p>Email: patient@demo.com</p>
                      <p>Password: demo123</p>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+234-800-123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        type="tel"
                        placeholder="+234-800-987-6543"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full health-button">
                      Register
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}