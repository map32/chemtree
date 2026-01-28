import { InputHTMLAttributes } from 'react'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className="w-full bg-navy-900 border border-navy-800 text-slate-100 placeholder:text-slate-500 rounded-md px-4 py-3 focus:outline-none focus:border-chem-yellow focus:ring-1 focus:ring-chem-yellow transition-all"
      {...props}
    />
  )
}