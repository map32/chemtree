import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const baseStyles = "px-6 py-2 rounded-md font-orbitron font-bold transition-all duration-200 disabled:opacity-50"
  
  const variants = {
    primary: "bg-chem-yellow text-navy-950 hover:bg-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]",
    outline: "border border-chem-yellow text-chem-yellow hover:bg-chem-yellow/10",
    ghost: "text-slate-400 hover:text-white"
  }

  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}