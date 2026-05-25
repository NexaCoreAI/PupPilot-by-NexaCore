import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export default function Card({ hover, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card p-5 ${hover ? 'hover:shadow-card-hover cursor-pointer transition-shadow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
