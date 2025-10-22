'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  ArrowLeft, 
  MessageCircle, 
  FileText, 
  Clock, 
  Shield,
  User,
  LogOut,
  Copy,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { PatientProfile } from '@/lib/auth';
import { hederaService } from '@/lib/hedera';
import ChatInterface from '@/components/ChatInterface';

interface PatientDashboardProps {
  user: PatientProfile;
  onLogout: () => void;
}

export default function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [consultationRecords, setConsultationRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsultationRecords();
  }, [user.id]);

  const loadConsultationRecords = async () => {
    try {
      const records = await hederaService.getPatientRecords(user.id);
      setConsultationRecords(records.filter(r => r.type === 'consultation'));
    } catch (error) {
      console.error('Failed to load consultation records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConsultation = (record: any) => {
    setConsultationRecords(prev => [record, ...prev]);
    setActiveTab('records');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">Patient Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white hover:text-red-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="health-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Welcome back, {user.name}!
                    </h2>
                    <p className="text-gray-600">
                      Your health records are securely stored
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Secure</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Records cost: {hederaService.getEstimatedCost()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>AI Consultation</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Medical Records</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ChatInterface 
                user={user} 
                onConsultationComplete={handleNewConsultation}
              />
            </TabsContent>

            <TabsContent value="records">
              <Card className="health-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Your Medical Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading records...</p>
                    </div>
                  ) : consultationRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No consultation records yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Start a chat with our AI to create your first record
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {consultationRecords.map((record, index) => (
                        <Card key={record.id || index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(record.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-600">Verified</span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-800 mb-2">Symptoms</h4>
                              <div className="flex flex-wrap gap-2">
                                {record.symptoms?.map((symptom: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <h4 className="font-medium text-gray-800 mb-2">AI Summary</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {record.summary}
                              </p>
                            </div>

                            <div className="border-t pt-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-500">Transaction ID</p>
                                  <div className="flex items-center space-x-2">
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {record.transactionId}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(record.transactionId)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">Storage Cost</p>
                                  <p className="text-xs font-medium text-green-600">
                                    {hederaService.getEstimatedCost()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="health-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    )}
                    {user.dateOfBirth && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="text-gray-900">{user.dateOfBirth}</p>
                      </div>
                    )}
                    {user.emergencyContact && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                        <p className="text-gray-900">{user.emergencyContact}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Patient ID</label>
                      <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}