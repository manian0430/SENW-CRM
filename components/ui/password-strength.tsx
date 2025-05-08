import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (password: string): { score: number; message: string } => {
    if (!password) return { score: 0, message: '' };
    
    let score = 0;
    const messages: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      messages.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      messages.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      messages.push('One lowercase letter');
    }

    // Number or special character check
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 25;
    } else {
      messages.push('One number or special character');
    }

    return {
      score,
      message: messages.length > 0 ? `Add ${messages.join(', ')}` : 'Strong password'
    };
  };

  const { score, message } = calculateStrength(password);

  const getColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <Progress value={score} className={getColor(score)} />
      {password && (
        <p className={`text-sm ${score >= 75 ? 'text-green-600' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
} 