interface BadgeProps {
  children: React.ReactNode
  variant?: 'sage' | 'coral' | 'sky' | 'amber' | 'success' | 'sand'
  className?: string
}

const variants = {
  sage:    'bg-sage/15 text-forest',
  coral:   'bg-coral/15 text-coral',
  sky:     'bg-sky/20 text-sky',
  amber:   'bg-amber/20 text-amber',
  success: 'bg-success/15 text-success',
  sand:    'bg-sand text-taupe',
}

export default function Badge({ children, variant = 'sage', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
