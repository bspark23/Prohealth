export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  type: 'patient' | 'doctor';
  createdAt: string;
}

export interface PatientProfile extends User {
  type: 'patient';
  dateOfBirth?: string;
  emergencyContact?: string;
}

export interface DoctorProfile extends User {
  type: 'doctor';
  licenseNumber: string;
  specialization: string;
  hospital?: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'prophealth_auth';
  private readonly USERS_KEY = 'prophealth_users';

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  async registerPatient(data: {
    email: string;
    phone?: string;
    name: string;
    password: string;
    dateOfBirth?: string;
    emergencyContact?: string;
  }): Promise<PatientProfile> {
    const users = this.getStoredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const user: PatientProfile = {
      id: this.generateUserId(),
      email: data.email,
      phone: data.phone,
      name: data.name,
      type: 'patient',
      dateOfBirth: data.dateOfBirth,
      emergencyContact: data.emergencyContact,
      createdAt: new Date().toISOString()
    };

    // Store user with hashed password
    users.push({
      ...user,
      passwordHash: this.hashPassword(data.password)
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
    
    // Auto-login after registration
    this.setCurrentUser(user);
    
    return user;
  }

  async registerDoctor(data: {
    email: string;
    name: string;
    password: string;
    licenseNumber: string;
    specialization: string;
    hospital?: string;
  }): Promise<DoctorProfile> {
    const users = this.getStoredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    const user: DoctorProfile = {
      id: this.generateUserId(),
      email: data.email,
      name: data.name,
      type: 'doctor',
      licenseNumber: data.licenseNumber,
      specialization: data.specialization,
      hospital: data.hospital,
      createdAt: new Date().toISOString()
    };

    // Store user with hashed password
    users.push({
      ...user,
      passwordHash: this.hashPassword(data.password)
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
    
    // Auto-login after registration
    this.setCurrentUser(user);
    
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const users = this.getStoredUsers();
    const hashedPassword = this.hashPassword(password);
    
    const user = users.find(u => u.email === email && u.passwordHash === hashedPassword);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password hash before returning
    const { passwordHash, ...userWithoutPassword } = user;
    
    this.setCurrentUser(userWithoutPassword);
    
    return userWithoutPassword;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isPatient(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'patient';
  }

  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'doctor';
  }

  private setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  private getStoredUsers(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Demo users for testing
  createDemoUsers(): void {
    if (typeof window === 'undefined') return;
    
    const demoUsers = [
      {
        id: 'patient_demo',
        email: 'patient@demo.com',
        name: 'John Doe',
        type: 'patient',
        phone: '+234-800-123-4567',
        dateOfBirth: '1990-01-01',
        emergencyContact: '+234-800-987-6543',
        createdAt: new Date().toISOString(),
        passwordHash: this.hashPassword('demo123')
      },
      {
        id: 'doctor_demo',
        email: 'doctor@demo.com',
        name: 'Dr. Sarah Johnson',
        type: 'doctor',
        licenseNumber: 'MD-12345',
        specialization: 'General Medicine',
        hospital: 'Lagos General Hospital',
        createdAt: new Date().toISOString(),
        passwordHash: this.hashPassword('demo123')
      }
    ];

    const existingUsers = this.getStoredUsers();
    const newUsers = demoUsers.filter(demo => 
      !existingUsers.find(existing => existing.email === demo.email)
    );

    if (newUsers.length > 0) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([...existingUsers, ...newUsers]));
    }
  }
}

export const authService = new AuthService();