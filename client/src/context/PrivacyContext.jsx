import React, { createContext, useContext, useState, useEffect } from 'react';

const PrivacyContext = createContext();

export const PrivacyProvider = ({ children }) => {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  useEffect(() => {
    if (isPrivacyMode) {
      document.title = "Offline";
      const favicon = document.querySelector("link[rel*='icon']");
      if (favicon) {
        favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23222%22/></svg>";
      }
    } else {
      document.title = "StealthChat";
      const favicon = document.querySelector("link[rel*='icon']");
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    }
  }, [isPrivacyMode]);

  const togglePrivacyMode = () => setIsPrivacyMode(prev => !prev);

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, setIsPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};
