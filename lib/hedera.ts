// Demo Hedera service without SDK dependency
// In production, you would import and use the actual @hashgraph/sdk

export interface ConsultationRecord {
  id: string;
  patientId: string;
  timestamp: string;
  symptoms: string[];
  aiAdvice: string;
  summary: string;
  hash: string;
}

export interface DoctorNote {
  id: string;
  doctorId: string;
  patientId: string;
  consultationId: string;
  notes: string;
  timestamp: string;
  hash: string;
}

class HederaService {
  private topicId: string = '0.0.1234567'; // Mock topic ID for demo

  constructor() {
    // Demo mode - no actual Hedera client initialization
    console.log('HederaService initialized in demo mode');
    this.createDemoRecords();
  }

  private createDemoRecords() {
    if (typeof window === 'undefined') return;
    
    const existingRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
    
    // Only create demo records if none exist
    if (existingRecords.length === 0) {
      const demoRecords = [
        {
          id: 'consultation_demo_1',
          patientId: 'patient_demo',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          symptoms: ['headache', 'fever', 'tired'],
          aiAdvice: 'Based on your symptoms, it appears you may have a common cold or flu. Rest, stay hydrated, and consider over-the-counter pain relievers. If symptoms persist or worsen, please consult a healthcare provider.',
          summary: 'Patient consultation on ' + new Date(Date.now() - 86400000).toLocaleDateString() + '. Patient reported: I have been having headaches and feeling feverish for the past two days. Also feeling very tired.',
          transactionId: '0.0.1234567-demo1',
          hash: 'demo_hash_1',
          type: 'consultation'
        },
        {
          id: 'consultation_demo_2',
          patientId: 'patient_demo',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          symptoms: ['cough', 'sore throat'],
          aiAdvice: 'Your symptoms suggest a possible upper respiratory infection. Try warm salt water gargles, throat lozenges, and plenty of fluids. Monitor your symptoms and seek medical attention if they worsen.',
          summary: 'Patient consultation on ' + new Date(Date.now() - 172800000).toLocaleDateString() + '. Patient reported: I have a persistent cough and my throat is very sore.',
          transactionId: '0.0.1234567-demo2',
          hash: 'demo_hash_2',
          type: 'consultation'
        }
      ];
      
      localStorage.setItem('hedera_records', JSON.stringify(demoRecords));
      console.log('Demo consultation records created');
    }
  }

  private generateHash(data: any): string {
    // Simple hash for demo - in production use proper crypto
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private generateMockTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `0.0.${timestamp}-${random}`;
  }

  async storeConsultationRecord(record: Omit<ConsultationRecord, 'hash'>): Promise<{ transactionId: string; hash: string }> {
    try {
      const recordWithHash = {
        ...record,
        hash: this.generateHash(record)
      };

      // For demo purposes, simulate Hedera transaction
      // In production, uncomment the actual Hedera code below
      
      /*
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId!)
        .setMessage(JSON.stringify(recordWithHash));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      */

      // Mock transaction for demo
      const mockTransactionId = this.generateMockTransactionId();
      
      // Store in localStorage for demo
      if (typeof window !== 'undefined') {
        const existingRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
        existingRecords.push({
          ...recordWithHash,
          transactionId: mockTransactionId,
          type: 'consultation'
        });
        localStorage.setItem('hedera_records', JSON.stringify(existingRecords));
      }

      return {
        transactionId: mockTransactionId,
        hash: recordWithHash.hash
      };
    } catch (error) {
      console.error('Failed to store consultation record:', error);
      throw new Error('Failed to store record on blockchain');
    }
  }

  async storeDoctorNote(note: Omit<DoctorNote, 'hash'>): Promise<{ transactionId: string; hash: string }> {
    try {
      const noteWithHash = {
        ...note,
        hash: this.generateHash(note)
      };

      // Mock transaction for demo
      const mockTransactionId = this.generateMockTransactionId();
      
      // Store in localStorage for demo
      if (typeof window !== 'undefined') {
        const existingRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
        existingRecords.push({
          ...noteWithHash,
          transactionId: mockTransactionId,
          type: 'doctor_note'
        });
        localStorage.setItem('hedera_records', JSON.stringify(existingRecords));
      }

      return {
        transactionId: mockTransactionId,
        hash: noteWithHash.hash
      };
    } catch (error) {
      console.error('Failed to store doctor note:', error);
      throw new Error('Failed to store note on blockchain');
    }
  }

  async getRecordByTransactionId(transactionId: string): Promise<any> {
    try {
      // For demo, retrieve from localStorage
      if (typeof window === 'undefined') {
        throw new Error('Record not found');
      }
      
      const existingRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
      const record = existingRecords.find((r: any) => r.transactionId === transactionId);
      
      if (!record) {
        throw new Error('Record not found');
      }

      return record;
    } catch (error) {
      console.error('Failed to retrieve record:', error);
      throw new Error('Failed to retrieve record from blockchain');
    }
  }

  async getPatientRecords(patientId: string): Promise<any[]> {
    try {
      // For demo, retrieve from localStorage
      if (typeof window === 'undefined') {
        return [];
      }
      
      const existingRecords = JSON.parse(localStorage.getItem('hedera_records') || '[]');
      return existingRecords.filter((r: any) => r.patientId === patientId);
    } catch (error) {
      console.error('Failed to retrieve patient records:', error);
      return [];
    }
  }

  async verifyRecordIntegrity(record: any): Promise<boolean> {
    try {
      const { hash, ...recordData } = record;
      const calculatedHash = this.generateHash(recordData);
      return hash === calculatedHash;
    } catch (error) {
      console.error('Failed to verify record integrity:', error);
      return false;
    }
  }

  getEstimatedCost(): string {
    return '$0.0001'; // Hedera's low transaction cost
  }
}

export const hederaService = new HederaService();