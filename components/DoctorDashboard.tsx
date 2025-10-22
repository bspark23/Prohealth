'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Stethoscope, 
  ArrowLeft, 
  Search, 
  FileText, 
  User,
  LogOut,
  Copy,
  CheckCircle,
  Clock,
  Shield,
  Plus,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { DoctorProfile } from '@/lib/auth';
import { hederaService } from '@/lib/hedera';

interface DoctorDashboardProps {
  user: DoctorProfile;
  onLogout: () => void;
}

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchedRecord, setSearchedRecord] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  useEffect(() => {
    loadRecentRecords();
  }, []);

  const loadRecentRecords = async () => {
    try {
      // For demo, get all records from localStorage
      const allRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
      setRecentRecords(allRecords.slice(0, 10)); // Show last 10 records
    } catch (error) {
      console.error('Failed to load recent records:', error);
    }
  };

  const handleSearchRecord = async () => {
    if (!searchTransactionId.trim()) return;

    setIsSearching(true);
    try {
      const record = await hederaService.getRecordByTransactionId(searchTransactionId.trim());
      setSearchedRecord(record);
    } catch (error) {
      console.log('Record not found:', error);
      alert('Record not found. Please check the Transaction ID or ask the patient to create a consultation record first.');
      setSearchedRecord(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddDoctorNote = async () => {
    if (!searchedRecord || !doctorNotes.trim()) return;

    setIsAddingNote(true);
    try {
      const note = {
        id: `note_${Date.now()}`,
        doctorId: user.id,
        patientId: searchedRecord.patientId,
        consultationId: searchedRecord.id,
        notes: doctorNotes.trim(),
        timestamp: new Date().toISOString()
      };

      const { transactionId, hash } = await hederaService.storeDoctorNote(note);
      
      // Update the searched record with the new note
      setSearchedRecord(prev => ({
        ...prev,
        doctorNotes: [...(prev.doctorNotes || []), {
          ...note,
          transactionId,
          hash,
          doctorName: user.name,
          doctorSpecialization: user.specialization
        }]
      }));

      setDoctorNotes('');
      alert(`Doctor note added successfully! Transaction ID: ${transactionId}`);
      loadRecentRecords(); // Refresh recent records
    } catch (error) {
      alert('Failed to add doctor note. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
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
                <Stethoscope className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">Doctor Dashboard</h1>
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
                      Welcome, {user.name}
                    </h2>
                    <p className="text-gray-600">
                      {user.specialization} • {user.hospital}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      License: {user.licenseNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Secure Access</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Verified records
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Patient Records</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Recent Records</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="space-y-6">
                {/* Search Card */}
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Access Patient Record</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="transactionId">Patient's Transaction ID</Label>
                        <Input
                          id="transactionId"
                          value={searchTransactionId}
                          onChange={(e) => setSearchTransactionId(e.target.value)}
                          placeholder="Enter transaction ID..."
                          className="mt-1"
                        />
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium mb-1">Demo Transaction IDs for testing:</p>
                          <div className="space-y-1">
                            <button
                              onClick={() => setSearchTransactionId('0.0.1234567-demo1')}
                              className="block text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              0.0.1234567-demo1 (Headache & Fever)
                            </button>
                            <button
                              onClick={() => setSearchTransactionId('0.0.1234567-demo2')}
                              className="block text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              0.0.1234567-demo2 (Cough & Sore Throat)
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleSearchRecord}
                          disabled={isSearching || !searchTransactionId.trim()}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                          {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Record Display */}
                {searchedRecord && (
                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Patient Consultation Record</span>
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Record Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Patient ID</Label>
                          <p className="text-gray-900 font-mono text-sm">{searchedRecord.patientId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Consultation Date</Label>
                          <p className="text-gray-900">{formatDate(searchedRecord.timestamp)}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Symptoms</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {searchedRecord.symptoms?.map((symptom: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">AI Summary</Label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                          {searchedRecord.summary}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">AI Advice</Label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                          {searchedRecord.aiAdvice}
                        </p>
                      </div>

                      {/* Doctor Notes Section */}
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium text-gray-700">Doctor Notes</Label>
                        
                        {/* Existing Notes */}
                        {searchedRecord.doctorNotes && searchedRecord.doctorNotes.length > 0 && (
                          <div className="space-y-2 mt-2 mb-4">
                            {searchedRecord.doctorNotes.map((note: any, idx: number) => (
                              <div key={idx} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium text-green-800">
                                    {note.doctorName} • {note.doctorSpecialization}
                                  </div>
                                  <div className="text-xs text-green-600">
                                    {formatDate(note.timestamp)}
                                  </div>
                                </div>
                                <p className="text-sm text-green-700">{note.notes}</p>
                                <div className="text-xs text-green-600 mt-2">
                                  Transaction: {note.transactionId}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Note */}
                        <div className="space-y-3">
                          <Textarea
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                            placeholder="Add your medical notes here..."
                            rows={4}
                          />
                          <Button
                            onClick={handleAddDoctorNote}
                            disabled={isAddingNote || !doctorNotes.trim()}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            {isAddingNote ? (
                              'Adding Note...'
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Doctor Note
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Transaction Info */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Transaction ID</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {searchedRecord.transactionId}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(searchedRecord.transactionId)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <Label className="text-sm font-medium text-gray-700">Storage Cost</Label>
                            <p className="text-sm font-medium text-green-600 mt-1">
                              {hederaService.getEstimatedCost()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <Card className="health-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Recent Patient Records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent records found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentRecords.map((record, index) => (
                        <Card key={record.id || index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {formatDate(record.timestamp)}
                                </span>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {record.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mb-2">
                              Patient ID: <code className="bg-gray-100 px-1 rounded">{record.patientId}</code>
                            </p>
                            <p className="text-xs text-gray-500">
                              Transaction: {record.transactionId}
                            </p>
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
                    <span>Doctor Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">License Number</Label>
                      <p className="text-gray-900">{user.licenseNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Specialization</Label>
                      <p className="text-gray-900">{user.specialization}</p>
                    </div>
                    {user.hospital && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Hospital/Clinic</Label>
                        <p className="text-gray-900">{user.hospital}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Doctor ID</Label>
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