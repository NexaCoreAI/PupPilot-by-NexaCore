import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-forest">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-md border border-sand bg-white text-charcoal placeholder-taupe text-base focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all h-12 ${error ? 'border-danger focus:ring-danger/30' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
export default Input
