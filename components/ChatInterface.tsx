'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PatientProfile } from '@/lib/auth';
import { hederaService } from '@/lib/hedera';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  user: PatientProfile;
  onConsultationComplete: (record: any) => void;
}

export default function ChatInterface({ user, onConsultationComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name}! I'm your AI health assistant. I'm here to help you with health-related questions and concerns. Please describe your symptoms or health concerns, and I'll provide guidance and create a secure consultation record for you.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStoringRecord, setIsStoringRecord] = useState(false);
  const [lastConsultationId, setLastConsultationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateConsultationSummary = (messages: Message[]): {
    symptoms: string[];
    summary: string;
    aiAdvice: string;
  } => {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    const assistantMessages = messages.filter(m => m.role === 'assistant').map(m => m.content);
    
    // Extract potential symptoms from user messages
    const symptoms = userMessages
      .join(' ')
      .toLowerCase()
      .split(/[,.\s]+/)
      .filter(word => 
        ['headache', 'fever', 'cough', 'pain', 'tired', 'nausea', 'dizzy', 'sore', 'ache', 'hurt'].some(symptom => 
          word.includes(symptom)
        )
      )
      .slice(0, 5);

    const summary = `Patient consultation on ${new Date().toLocaleDateString()}. Patient reported: ${userMessages.join('. ')}`;
    const aiAdvice = assistantMessages[assistantMessages.length - 1] || 'General health guidance provided.';

    return {
      symptoms: symptoms.length > 0 ? symptoms : ['general consultation'],
      summary,
      aiAdvice
    };
  };

  const storeConsultationRecord = async () => {
    if (messages.length < 3) return; // Need at least greeting + user message + AI response

    setIsStoringRecord(true);
    try {
      const consultationData = generateConsultationSummary(messages);
      
      const record = {
        id: `consultation_${Date.now()}`,
        patientId: user.id,
        timestamp: new Date().toISOString(),
        symptoms: consultationData.symptoms,
        aiAdvice: consultationData.aiAdvice,
        summary: consultationData.summary
      };

      const { transactionId, hash } = await hederaService.storeConsultationRecord(record);
      
      const recordWithTransaction = {
        ...record,
        transactionId,
        hash,
        type: 'consultation'
      };

      setLastConsultationId(transactionId);
      onConsultationComplete(recordWithTransaction);

      // Add system message about record creation
      const systemMessage: Message = {
        id: `system_${Date.now()}`,
        role: 'assistant',
        content: `✅ Your consultation has been securely stored!\n\n📋 **Consultation Summary:**\n${consultationData.summary}\n\n🔗 **Transaction ID:** ${transactionId}\n💰 **Storage Cost:** ${hederaService.getEstimatedCost()}\n\n🔒 This record is now immutable and tamper-proof. You can share the Transaction ID with your doctor for secure access.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Failed to store consultation record:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: '❌ Sorry, there was an issue storing your consultation record. Your conversation is still saved locally. Please try again later.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStoringRecord(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Card */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <span>AI Health Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              {lastConsultationId && (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Stored on Blockchain</span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or health concerns..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="health-button"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Card */}
      {messages.length > 3 && !lastConsultationId && (
        <Card className="health-card border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Save Consultation Record</h4>
                  <p className="text-sm text-gray-600">
                    Store this consultation securely on blockchain for {hederaService.getEstimatedCost()}
                  </p>
                </div>
              </div>
              <Button
                onClick={storeConsultationRecord}
                disabled={isStoringRecord}
                className="health-button"
              >
                {isStoringRecord ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Storing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Store Record
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="health-card bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Important Notice</p>
              <p className="text-blue-700">
                This AI assistant provides general health information and is not a substitute for professional medical advice. 
                Always consult with a qualified healthcare provider for medical concerns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}