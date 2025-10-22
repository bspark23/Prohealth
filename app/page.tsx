'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Stethoscope, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">PropHealth</h1>
            </div>
            <div className="text-sm text-white/80">
              Secure Healthcare Platform
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Secure Healthcare Records
            <span className="block text-blue-200">Platform</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Revolutionary healthcare platform for Africa. Store medical records securely, 
            consult with AI, and connect with doctors - all for less than $0.01 per record.
          </p>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="health-card text-center p-6">
              <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Tamper-Proof</h3>
              <p className="text-gray-600 text-sm">Secure and immutable records</p>
            </div>
            <div className="health-card text-center p-6">
              <Activity className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Smart health consultations and summaries</p>
            </div>
            <div className="health-card text-center p-6">
              <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Ultra-Secure</h3>
              <p className="text-gray-600 text-sm">End-to-end encryption and privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Choose Your Portal
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Patient Portal */}
            <Link href="/patient">
              <Card className="portal-card">
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Patient Portal</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Chat with AI health assistant, get consultation summaries, 
                    and manage your secure medical records.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI Health Consultations</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Record Storage</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Medical History Timeline</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Doctor Portal */}
            <Link href="/doctor">
              <Card className="portal-card">
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">Doctor Portal</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Access patient records with consent, add medical notes, 
                    and collaborate securely.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure Patient Access</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time Record Updates</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Immutable Medical Notes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-white" />
            <span className="text-white font-medium">PropHealth</span>
          </div>
          <p className="text-white/70 text-sm">
            Revolutionizing healthcare in Africa with secure technology
          </p>
          <p className="text-white/50 text-xs mt-2">
            Each record costs less than $0.01 to store securely
          </p>
        </div>
      </footer>
    </div>
  );
}