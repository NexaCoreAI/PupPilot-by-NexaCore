import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-charcoal-700">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 placeholder-charcoal-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] transition-all ${error ? 'border-[#E8705A] focus:ring-[#E8705A]/30' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#E8705A]">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
export default Input
