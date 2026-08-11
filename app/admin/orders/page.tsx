'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { showToast } from '@/lib/toast'
import { ArrowRight, Download, Eye } from 'lucide-react'

interface Order {
  id: string; customer_name: string; customer_email: string
  amount: number; currency: string; status: string
  downloaded: boolean; created_at: string
  books: { title: string }[] | { title: string } | null
}

function getTitle(books: Order['books']): string {
  if (!books) return ''
  if (Array.isArray(books)) return books[0]?.title ?? ''
  return books.title ?? ''
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from('orders')
        .select('*, books(title)')
        .order('created_at', { ascending: false })
      setOrders((data as Order[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const total = orders.filter(o => o.status === 'completed').reduce((s, o) => s + Number(o.amount), 0)
  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })

  const exportCSV = () => {
    const rows = [['الاسم','الإيميل','الكتاب','المبلغ','الحالة','التاريخ'],
      ...orders.map(o => [o.customer_name, o.customer_email, getTitle(o.books), `${o.amount}`, o.status, fmt(o.created_at)])]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    showToast('تم تنزيل الملف')
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-gold hover:text-ember text-sm font-tajawal flex items-center gap-1 mb-2">
              <ArrowRight size={14} /> العودة
            </Link>
            <h1 className="font-aref text-3xl text-ember">الطلبات</h1>
            <p className="text-ink/50 font-tajawal text-sm mt-1">
              {orders.length} طلب · إجمالي {total} ج.م
            </p>
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30 transition-colors font-tajawal text-sm">
            <Download size={16} /> تنزيل CSV
          </button>
        </div>

        {loading ? (
          <p className="text-ink/50 font-tajawal text-center py-12">جاري التحميل...</p>
        ) : orders.length === 0 ? (
          <div className="card-lifted rounded-lg p-10 text-center">
            <p className="text-ink/50 font-tajawal">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="card-lifted rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-hairline">
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal">العميل</th>
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal hidden sm:table-cell">الكتاب</th>
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal">المبلغ</th>
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal hidden sm:table-cell">الحالة</th>
                  <th className="text-right py-3 px-4 font-tajawal text-ink/60 text-sm font-normal hidden sm:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gold-hairline/30 hover:bg-obsidian-warm/30">
                    <td className="py-3 px-4">
                      <p className="font-tajawal text-ink text-sm font-semibold">{o.customer_name}</p>
                      <p className="font-tajawal text-ink/40 text-xs">{o.customer_email}</p>
                    </td>
                    <td className="py-3 px-4 font-tajawal text-ink/70 text-sm hidden sm:table-cell">{getTitle(o.books)}</td>
                    <td className="py-3 px-4 font-tajawal text-gold text-sm font-semibold">{o.amount} {o.currency}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-tajawal ${
                        o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold/20 text-gold'
                      }`}>{o.status === 'completed' ? 'مكتمل' : 'معلق'}</span>
                      {o.downloaded && <Eye size={12} className="inline mr-2 text-ink/30" title="تم التحميل" />}
                    </td>
                    <td className="py-3 px-4 font-tajawal text-ink/40 text-xs hidden sm:table-cell">{fmt(o.created_at)}</td>
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
