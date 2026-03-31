'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemeToggle from '@/components/theme/ThemeToggle';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }

    apiClient
      .get(`/users/verify-email?token=${token}`)
      .then((res) => {
        setMessage(res.data.message);
        setStatus('success');
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || 'Verification failed. The link may have expired.',
        );
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="card text-center py-10">
        {status === 'loading' && (
          <>
            <LoadingSpinner size="lg" />
            <p className="text-secondary mt-4">Verifying your email…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-bold mb-2">Email Verified</h1>
            <p className="text-secondary mb-6">{message}</p>
            <Link href="/login" className="btn-primary inline-block">
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-secondary mb-6">{message}</p>
            <Link href="/register" className="btn-secondary inline-block">
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="card text-center py-10">
              <LoadingSpinner size="lg" />
              <p className="text-secondary mt-4">Verifying your email…</p>
            </div>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
