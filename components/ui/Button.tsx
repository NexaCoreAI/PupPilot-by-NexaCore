'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:   'bg-sage hover:bg-forest text-white shadow-sm',
  secondary: 'bg-white hover:bg-cream text-forest border border-sand shadow-sm',
  ghost:     'bg-transparent hover:bg-sand text-taupe',
  danger:    'bg-danger hover:opacity-90 text-white shadow-sm',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-md h-9',
  md: 'px-5 py-2.5 text-sm rounded-md h-12',
  lg: 'px-6 py-3 text-base rounded-lg h-12',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
export default Button
