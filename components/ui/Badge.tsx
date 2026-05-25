interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'coral' | 'green' | 'gray'
  className?: string
}

const variants = {
  blue:  'bg-[#EBF5FF] text-[#3D7FBF]',
  coral: 'bg-[#FFF0ED] text-[#D45A44]',
  green: 'bg-[#EDFFF5] text-[#2D8A5A]',
  gray:  'bg-charcoal-100 text-charcoal-500',
}

export default function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
