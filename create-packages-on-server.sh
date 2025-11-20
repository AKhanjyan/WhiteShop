#!/bin/bash

# Script to create packages files on server
# Run this on the server: bash create-packages-on-server.sh

cd /var/www/WhiteShop

echo "📦 Creating packages files..."

# Create packages/design-tokens/index.ts
mkdir -p packages/design-tokens
cat > packages/design-tokens/index.ts << 'EOF'
/**
 * Design Tokens
 * 
 * Centralized design system values.
 * DO NOT MODIFY - these are system-wide constants.
 */

// Colors - Pure colors only (NO GRADIENTS)
export const colors = {
  primary: '#000000',
  secondary: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const typography = {
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'sans-serif'],
    heading: ['system-ui', '-apple-system', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
EOF

# Create packages/ui files
mkdir -p packages/ui

cat > packages/ui/index.ts << 'EOF'
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
EOF

cat > packages/ui/Button.tsx << 'EOF'
'use client';

import React, { ButtonHTMLAttributes, forwardRef, ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', className = '', children, ...props },
    ref
  ): ReactElement {
    const baseStyles = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      outline: 'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
EOF

cat > packages/ui/Card.tsx << 'EOF'
'use client';

import React, { HTMLAttributes, forwardRef, ReactElement } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ className = '', children, ...props }, ref): ReactElement {
    return (
      <div
        ref={ref}
        className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EOF

cat > packages/ui/Input.tsx << 'EOF'
'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', ...props }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-error focus:ring-error' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);
EOF

echo "✅ Packages files created!"

