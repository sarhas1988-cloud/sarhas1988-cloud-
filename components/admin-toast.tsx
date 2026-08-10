'use client'

import { useState, useEffect, useCallback } from 'react'
import { onToast } from '@/lib/toast'
import { Check, X } from 'lucide-react'

export function AdminToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [visible, setVisible] = useState(false)

  const handleToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setVisible(true)
    setTimeout(() => setVisible(false), 2500)
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    return onToast(handleToast)
  }, [handleToast])

  if (!toast) return null

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl font-tajawal text-sm font-semibold ${
        toast.type === 'success'
          ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700/50'
          : 'bg-red-900/90 text-red-100 border border-red-700/50'
      }`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <Check size={14} className="text-white" /> : <X size={14} className="text-white" />}
        </span>
        {toast.message}
      </div>
    </div>
  )
}
