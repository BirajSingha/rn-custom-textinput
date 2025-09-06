import React, { createContext, useContext } from 'react';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    error: string;
    background: string;
    text: string;
    placeholder: string;
    border: string;
    focusedBorder: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: number;
  fontSize: {
    small: number;
    medium: number;
    large: number;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    error: '#EF4444',
    background: '#FFFFFF',
    text: '#111827',
    placeholder: '#9CA3AF',
    border: '#D1D5DB',
    focusedBorder: '#3B82F6',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: 8,
  fontSize: {
    small: 14,
    medium: 16,
    large: 18,
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode; 
  theme?: Partial<Theme> 
}> = ({ children, theme }) => {
  const mergedTheme = { ...defaultTheme, ...theme };
  
  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};