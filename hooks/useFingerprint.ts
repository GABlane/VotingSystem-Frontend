'use client';

import { useEffect, useState, useRef } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const agentRef = useRef<any>(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        // Try to load FingerprintJS
        if (!agentRef.current) {
          agentRef.current = await FingerprintJS.load();
        }

        const result = await agentRef.current.get();
        setFingerprint(result.visitorId);
        setIsLoading(false);
      } catch (error) {
        // Fallback: Use localStorage UUID if FingerprintJS fails
        console.warn('FingerprintJS failed, using localStorage fallback:', error);

        let deviceId = localStorage.getItem('vote_device_id');
        if (!deviceId) {
          // Generate a simple UUID
          deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
          localStorage.setItem('vote_device_id', deviceId);
        }

        setFingerprint(deviceId);
        setIsLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, isLoading };
};
