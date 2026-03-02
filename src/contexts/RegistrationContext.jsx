'use client';

import { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [registrationSource, setRegistrationSource] = useState(null);

  return (
    <RegistrationContext.Provider value={{ showRegistrationPopup, setShowRegistrationPopup, registrationSource, setRegistrationSource }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
}
