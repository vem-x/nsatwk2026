'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRegistration } from '@/contexts/RegistrationContext';

export default function URLRegistrationTrigger() {
  const searchParams = useSearchParams();
  const { setShowRegistrationPopup, setRegistrationSource } = useRegistration();

  useEffect(() => {
    const shouldRegister = searchParams.get('register');
    const ref = searchParams.get('ref');

    if (ref) setRegistrationSource(ref);
    if (shouldRegister === 'true') setShowRegistrationPopup(true);
  }, [searchParams, setShowRegistrationPopup, setRegistrationSource]);

  return null;
}
