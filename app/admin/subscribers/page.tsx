'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Download, Trash2, ArrowRight } from 'lucide-react'
import type { Subscriber } from '@/types/supabase'

export default function SubscribersPage() {
  const [subs, setSubs]       = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('subscribers')
        .select('id,email,created_at')
        .order('created_at', { ascending: false })
      setSubs((data as Subscriber[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا المشترك؟')) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from('subscribers').delete().eq('id', id)
    setSubs((prev) => prev.filter((s) => s.id !== id))
  }

  const handleExport = () => {
    const rows  = [['البريد الإلكتروني', 'تاريخ الاشتراك'], ...subs.map((s) => [s.email, fmt(s.created_at)])]
    const csv   = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob  = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link  = document.createElement('a')
    link.href   = URL.createObjectURL(blob)
    link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG')

  return (
    <div className="min-h-screen bg-obsidian p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-blood">المشتركون</h1>
            <p className="text-ink/40 font-tajawal text-sm mt-1">إجمالي: {subs.length}</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded bg-blood/20 border border-blood text-blood hover:bg-blood/30 transition-colors font-tajawal text-sm">
            <Download size={16} /> تنزيل CSV
          </button>
        </div>

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : subs.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal">لا يوجد مشتركون بعد</p>
          </div>
        ) : (
          <div className="card-lifted rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-hairline">
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal">البريد الإلكتروني</th>
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal">تاريخ الاشتراك</th>
                  <th className="py-3 px-4 w-12" />
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-gold-hairline/30 hover:bg-obsidian-lighter/30 transition-colors">
                    <td className="py-3 px-4 font-tajawal text-ink text-sm">{s.email}</td>
                    <td className="py-3 px-4 font-tajawal text-ink/50 text-sm">{fmt(s.created_at)}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded hover:bg-obsidian-lighter text-blood hover:text-blood/70 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
