import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export default function Card({ hover, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-sand shadow-card p-5 ${hover ? 'hover:shadow-card-lg cursor-pointer transition-shadow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
