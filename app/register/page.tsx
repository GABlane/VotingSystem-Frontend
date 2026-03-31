'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { usersApi } from '@/lib/api/users';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await usersApi.register(email, password);
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background relative">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="card text-center py-10">
            <p className="text-5xl mb-4">📬</p>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-secondary mb-6">
              We sent a verification link to <strong>{email}</strong>.
              Click the link in the email to activate your account.
            </p>
            <Link href="/login" className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-secondary mb-8">
            Register to vote. Each account gets 5 votes to spend across projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Min. 8 characters"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-card text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-secondary mt-6 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-secondary mt-3 text-center">
            <Link href="/" className="underline">
              Back to projects
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
