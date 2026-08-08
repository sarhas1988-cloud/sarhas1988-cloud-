import Link from 'next/link'

export const metadata = {
  title: 'سياسة الخصوصية — السيد الريس',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <h1 className="font-aref text-4xl sm:text-5xl text-ink mb-3">سياسة الخصوصية</h1>
          <p className="text-ink/50 font-tajawal text-sm">آخر تحديث: أغسطس ٢٠٢٦</p>
        </div>

        <div className="card-lifted rounded-xl p-6 sm:p-8 space-y-6 text-ink/70 font-tajawal text-sm leading-relaxed">
          <section>
            <h2 className="font-aref text-xl text-ink mb-2">ما البيانات التي نجمعها</h2>
            <p>عند استخدامك للموقع، قد نجمع البيانات التالية:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>البريد الإلكتروني (عند الاشتراك في القائمة البريدية)</li>
              <li>الاسم والبريد الإلكتروني والرسالة (عند التواصل عبر نموذج الاتصال)</li>
              <li>الاسم والتقييم والتعليق (عند إضافة تقييم لكتاب)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-aref text-xl text-ink mb-2">كيف نستخدم بياناتك</h2>
            <ul className="list-disc list-inside space-y-1 pr-2">
              <li>إرسال إشعارات بالإصدارات الجديدة (للمشتركين في القائمة البريدية)</li>
              <li>الرد على استفساراتك (رسائل التواصل)</li>
              <li>عرض تقييمات القرّاء على صفحات الكتب (بعد المراجعة والاعتماد)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-aref text-xl text-ink mb-2">مشاركة البيانات</h2>
            <p>لا نبيع أو نشارك بياناتك الشخصية مع أطراف خارجية. بياناتك مخزّنة بشكل آمن على خوادم Supabase المشفّرة.</p>
          </section>

          <section>
            <h2 className="font-aref text-xl text-ink mb-2">حقوقك</h2>
            <p>يمكنك في أي وقت:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>إلغاء الاشتراك في القائمة البريدية</li>
              <li>طلب حذف بياناتك بالتواصل معنا عبر صفحة <Link href="/contact" className="text-ember hover:text-gold">التواصل</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="font-aref text-xl text-ink mb-2">ملفات الارتباط (Cookies)</h2>
            <p>نستخدم ملفات ارتباط أساسية فقط لتشغيل الموقع (مثل جلسة تسجيل الدخول للمسؤول). لا نستخدم ملفات ارتباط إعلانية أو تتبّعية.</p>
          </section>

          <section>
            <h2 className="font-aref text-xl text-ink mb-2">تواصل معنا</h2>
            <p>لأي استفسار حول سياسة الخصوصية، تواصل معنا عبر <Link href="/contact" className="text-ember hover:text-gold">صفحة التواصل</Link>.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
