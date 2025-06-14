
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Home, Users, Trophy, Calendar, Newspaper, ShoppingBag, Shield, Settings, BarChart3, Phone, Mail, MapPin } from "lucide-react";

const ArabicDocumentationPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="text-center mb-8 no-print">
        <h1 className="text-4xl font-bold text-fmf-green mb-4">
          تطبيق الدوري الممتاز الموريتاني
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          دليل شامل ومفصل لجميع جوانب التطبيق
        </p>
        <Button onClick={handlePrint} className="bg-fmf-green hover:bg-fmf-green/90">
          <Download className="w-4 h-4 ml-2" />
          تحميل PDF
        </Button>
      </div>

      {/* فهرس المحتويات */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 ml-2" />
            فهرس المحتويات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>1. نظرة عامة على التطبيق</p>
              <p>2. البنية التقنية</p>
              <p>3. الصفحات الرئيسية</p>
              <p>4. نظام المستخدمين</p>
              <p>5. إدارة المباريات</p>
              <p>6. الفرق واللاعبون</p>
            </div>
            <div className="space-y-2">
              <p>7. الأخبار والمحتوى</p>
              <p>8. المتجر الإلكتروني</p>
              <p>9. البيانات والإحصائيات</p>
              <p>10. لوحة الإدارة</p>
              <p>11. الأمان والحماية</p>
              <p>12. دليل الاستخدام</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. نظرة عامة على التطبيق */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. نظرة عامة على التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-fmf-green">الهدف من التطبيق</h3>
            <p className="text-sm leading-relaxed">
              تطبيق الدوري الممتاز الموريتاني هو منصة رقمية شاملة مصممة خصيصاً للاتحاد الموريتاني لكرة القدم (FMF). 
              يهدف التطبيق إلى توفير تجربة متكاملة لمتابعة أخبار الكرة الموريتانية، النتائج، الإحصائيات، وكل ما يتعلق بالدوري الممتاز.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-fmf-green">الجمهور المستهدف</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">محبو كرة القدم</h4>
                <ul className="text-sm space-y-1">
                  <li>• متابعة المباريات والنتائج</li>
                  <li>• قراءة الأخبار الرياضية</li>
                  <li>• مشاهدة الإحصائيات</li>
                  <li>• متابعة الترتيب</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">المشترون</h4>
                <ul className="text-sm space-y-1">
                  <li>• شراء المنتجات الرسمية</li>
                  <li>• القمصان والإكسسوارات</li>
                  <li>• السلع التذكارية</li>
                  <li>• منتجات الاتحاد</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-2">الإداريون</h4>
                <ul className="text-sm space-y-1">
                  <li>• إدارة المباريات</li>
                  <li>• نشر الأخبار</li>
                  <li>• إدارة الفرق واللاعبين</li>
                  <li>• مراقبة النظام</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-fmf-green">الميزات الرئيسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm space-y-2">
                <li>• <strong>المتابعة المباشرة:</strong> نتائج المباريات لحظة بلحظة</li>
                <li>• <strong>الأخبار:</strong> آخر أخبار الكرة الموريتانية</li>
                <li>• <strong>الإحصائيات:</strong> بيانات شاملة للاعبين والفرق</li>
                <li>• <strong>الترتيب:</strong> جدول الدوري محدث</li>
              </ul>
              <ul className="text-sm space-y-2">
                <li>• <strong>المتجر:</strong> منتجات رسمية معتمدة</li>
                <li>• <strong>الكؤوس:</strong> متابعة البطولات</li>
                <li>• <strong>التفاعل:</strong> تعليقات وردود أفعال</li>
                <li>• <strong>الإدارة:</strong> لوحة تحكم شاملة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. البنية التقنية */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. البنية التقنية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-fmf-green">التقنيات المستخدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-blue-600">الواجهة الأمامية (Frontend)</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="text-sm space-y-2">
                    <li>• <strong>React 18:</strong> إطار العمل الأساسي</li>
                    <li>• <strong>TypeScript:</strong> للأمان في الكود</li>
                    <li>• <strong>Vite:</strong> أداة البناء السريعة</li>
                    <li>• <strong>Tailwind CSS:</strong> للتصميم</li>
                    <li>• <strong>shadcn/ui:</strong> مكونات جاهزة</li>
                    <li>• <strong>React Router:</strong> للتنقل</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-green-600">الخلفية والخدمات (Backend)</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Supabase:</strong> منصة الخدمات الخلفية</li>
                    <li>• <strong>PostgreSQL:</strong> قاعدة البيانات</li>
                    <li>• <strong>Real-time:</strong> التحديث المباشر</li>
                    <li>• <strong>Authentication:</strong> نظام المصادقة</li>
                    <li>• <strong>Storage:</strong> تخزين الملفات</li>
                    <li>• <strong>Edge Functions:</strong> وظائف مخصصة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-fmf-green">إدارة الحالة والبيانات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-600 mb-2">TanStack Query</h4>
                <p className="text-sm">إدارة التخزين المؤقت ومزامنة البيانات مع الخادم</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-orange-600 mb-2">Context API</h4>
                <p className="text-sm">إدارة الحالة العامة والمصادقة</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-600 mb-2">Local State</h4>
                <p className="text-sm">حالة المكونات المحلية</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. الصفحات الرئيسية */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 ml-2" />
            3. الصفحات الرئيسية وشرحها
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* الصفحة الرئيسية */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">الصفحة الرئيسية (HomePage.tsx)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-600">المحتويات والعناصر</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>شعار الاتحاد:</strong> في أعلى الصفحة</li>
                  <li>• <strong>أزرار التنقل السريع:</strong> للصفحات المهمة</li>
                  <li>• <strong>المباريات الأخيرة:</strong> النتائج الحديثة</li>
                  <li>• <strong>الأخبار العاجلة:</strong> آخر 3 أخبار</li>
                  <li>• <strong>إعلانات ترويجية:</strong> للمتجر والفعاليات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-600">الوظائف التفاعلية</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>التنقل السريع:</strong> وصول مباشر للأقسام</li>
                  <li>• <strong>البحث:</strong> البحث في المحتوى</li>
                  <li>• <strong>التحديث التلقائي:</strong> للنتائج والأخبار</li>
                  <li>• <strong>الروابط التفاعلية:</strong> للصفحات الفرعية</li>
                </ul>
              </div>
            </div>
          </div>

          {/* صفحة الفرق */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">صفحة الفرق (TeamsPage.tsx & TeamPage.tsx)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-600">صفحة قائمة الفرق</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>شبكة الفرق:</strong> عرض جميع الأندية</li>
                  <li>• <strong>شعارات الفرق:</strong> صور عالية الجودة</li>
                  <li>• <strong>معلومات أساسية:</strong> الاسم، سنة التأسيس</li>
                  <li>• <strong>البحث والفلترة:</strong> للعثور على فريق محدد</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-600">صفحة الفريق الفردية</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>معلومات الفريق:</strong> تاريخ، ملعب، مدرب</li>
                  <li>• <strong>قائمة اللاعبين:</strong> العدد، المركز، العمر</li>
                  <li>• <strong>الإحصائيات:</strong> أداء الفريق</li>
                  <li>• <strong>المباريات الأخيرة:</strong> النتائج والمواعيد</li>
                  <li>• <strong>الإنجازات:</strong> الألقاب والجوائز</li>
                </ul>
              </div>
            </div>
          </div>

          {/* صفحة الترتيب */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">صفحة الترتيب (StandingsPage.tsx)</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-yellow-700">جدول الدوري الشامل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm space-y-2">
                  <li>• <strong>الترتيب:</strong> موقع كل فريق</li>
                  <li>• <strong>النقاط:</strong> مجموع النقاط المحرزة</li>
                  <li>• <strong>المباريات:</strong> عدد المباريات الملعوبة</li>
                  <li>• <strong>الانتصارات:</strong> عدد المباريات المكسوبة</li>
                </ul>
                <ul className="text-sm space-y-2">
                  <li>• <strong>التعادلات:</strong> المباريات المتعادلة</li>
                  <li>• <strong>الهزائم:</strong> المباريات المخسورة</li>
                  <li>• <strong>الأهداف:</strong> المسجلة والمستقبلة</li>
                  <li>• <strong>فارق الأهداف:</strong> الفرق في الأهداف</li>
                </ul>
              </div>
            </div>
          </div>

          {/* صفحة الأخبار */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">صفحة الأخبار (NewsPage.tsx & NewsDetailPage.tsx)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-purple-600">صفحة قائمة الأخبار</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>تصنيف الأخبار:</strong> رياضة، أندية، دولي</li>
                  <li>• <strong>الأخبار العاجلة:</strong> آخر المستجدات</li>
                  <li>• <strong>البحث:</strong> في المقالات</li>
                  <li>• <strong>التصفح:</strong> حسب التاريخ والفئة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-indigo-600">صفحة الخبر الفردي</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>المحتوى الكامل:</strong> نص المقال</li>
                  <li>• <strong>الصور والفيديو:</strong> محتوى مرئي</li>
                  <li>• <strong>التعليقات:</strong> آراء المستخدمين</li>
                  <li>• <strong>المشاركة:</strong> على وسائل التواصل</li>
                  <li>• <strong>أخبار ذات صلة:</strong> مقالات مشابهة</li>
                </ul>
              </div>
            </div>
          </div>

          {/* صفحة المتجر */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">صفحة المتجر (ShopPage.tsx)</h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-red-700">المتجر الرسمي</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">المنتجات</h5>
                  <ul className="text-xs space-y-1">
                    <li>• قمصان رسمية</li>
                    <li>• إكسسوارات</li>
                    <li>• سلع تذكارية</li>
                    <li>• معدات رياضية</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2">الوظائف</h5>
                  <ul className="text-xs space-y-1">
                    <li>• البحث والفلترة</li>
                    <li>• سلة التسوق</li>
                    <li>• الدفع الآمن</li>
                    <li>• تتبع الطلبات</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2">المزايا</h5>
                  <ul className="text-xs space-y-1">
                    <li>• تصنيف حسب الفئة</li>
                    <li>• تقييمات المنتجات</li>
                    <li>• عروض خاصة</li>
                    <li>• ضمان الجودة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* صفحة الكأس */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">صفحة الكأس (CupPage.tsx)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-amber-600">كأس رئيس الجمهورية</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>الجدول الزمني:</strong> مواعيد المباريات</li>
                  <li>• <strong>شجرة البطولة:</strong> مسار الفرق</li>
                  <li>• <strong>النتائج:</strong> نتائج كل دور</li>
                  <li>• <strong>الإحصائيات:</strong> أرقام البطولة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-teal-600">معلومات البطولة</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>تاريخ البطولة:</strong> نبذة تاريخية</li>
                  <li>• <strong>الأبطال السابقون:</strong> قائمة الفائزين</li>
                  <li>• <strong>القواعد والأنظمة:</strong> قوانين البطولة</li>
                  <li>• <strong>الجوائز:</strong> المكافآت المالية</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. نظام المستخدمين */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 ml-2" />
            4. نظام المستخدمين والمصادقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">أنواع المستخدمين</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-3">المستخدم العادي</h4>
                <ul className="text-sm space-y-2">
                  <li>• تصفح المحتوى</li>
                  <li>• قراءة الأخبار</li>
                  <li>• التعليق على المقالات</li>
                  <li>• الشراء من المتجر</li>
                  <li>• حفظ المفضلات</li>
                  <li>• إدارة الملف الشخصي</li>
                </ul>
              </div>
              <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-700 mb-3">مشرف مساعد</h4>
                <ul className="text-sm space-y-2">
                  <li>• إدارة الأخبار</li>
                  <li>• مراجعة التعليقات</li>
                  <li>• تحديث النتائج</li>
                  <li>• إدارة المحتوى</li>
                  <li>• مراقبة التفاعل</li>
                  <li>• إرسال الإشعارات</li>
                </ul>
              </div>
              <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-3">المشرف الرئيسي</h4>
                <ul className="text-sm space-y-2">
                  <li>• إدارة كاملة للنظام</li>
                  <li>• إدارة المستخدمين</li>
                  <li>• إعدادات التطبيق</li>
                  <li>• إدارة قاعدة البيانات</li>
                  <li>• تعيين الصلاحيات</li>
                  <li>• مراقبة الأمان</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">نظام المصادقة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-purple-600">طرق الدخول</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>البريد الإلكتروني:</strong> الطريقة الأساسية</li>
                  <li>• <strong>كلمة المرور:</strong> حماية قوية</li>
                  <li>• <strong>تذكر الدخول:</strong> لسهولة الوصول</li>
                  <li>• <strong>استعادة كلمة المرور:</strong> عبر البريد</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-indigo-600">الأمان والحماية</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>تشفير البيانات:</strong> حماية المعلومات</li>
                  <li>• <strong>جلسات آمنة:</strong> رموز مؤقتة</li>
                  <li>• <strong>فحص الصلاحيات:</strong> قبل كل عملية</li>
                  <li>• <strong>سجل النشاطات:</strong> تتبع العمليات</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. إدارة المباريات */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 ml-2" />
            5. نظام إدارة المباريات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">دورة حياة المباراة</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h4 className="font-medium text-gray-700 mb-2">مجدولة</h4>
                <p className="text-sm">المباراة محددة الموعد ولم تبدأ بعد</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <h4 className="font-medium text-yellow-700 mb-2">جارية</h4>
                <p className="text-sm">المباراة قيد التنفيذ مع العد التنازلي</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <h4 className="font-medium text-green-700 mb-2">منتهية</h4>
                <p className="text-sm">المباراة انتهت والنتيجة مؤكدة</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <h4 className="font-medium text-red-700 mb-2">ملغاة</h4>
                <p className="text-sm">المباراة ألغيت لظروف طارئة</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">الميزات المتقدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-blue-600">المتابعة المباشرة</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>النتيجة الحية:</strong> تحديث فوري للأهداف</li>
                  <li>• <strong>الوقت الجاري:</strong> عداد الدقائق والثواني</li>
                  <li>• <strong>الأحداث:</strong> أهداف، بطاقات، تبديلات</li>
                  <li>• <strong>الإحصائيات:</strong> حيازة، تسديدات، مخالفات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-green-600">أدوات الإدارة</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>مؤقت المباراة:</strong> تحكم كامل بالوقت</li>
                  <li>• <strong>إضافة الأحداث:</strong> تسجيل لحظي</li>
                  <li>• <strong>تعديل النتيجة:</strong> تصحيح الأخطاء</li>
                  <li>• <strong>إنهاء المباراة:</strong> تأكيد النتيجة</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">تفاصيل المباراة</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">المعلومات الأساسية</h4>
                  <ul className="text-sm space-y-1">
                    <li>• الفريق المضيف والضيف</li>
                    <li>• التاريخ والوقت</li>
                    <li>• اسم الملعب</li>
                    <li>• الجولة أو المرحلة</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">التشكيلات</h4>
                  <ul className="text-sm space-y-1">
                    <li>• التشكيل الأساسي</li>
                    <li>• لاعبو الاحتياط</li>
                    <li>• المدرب والجهاز الفني</li>
                    <li>• طريقة اللعب</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">الإحصائيات</h4>
                  <ul className="text-sm space-y-1">
                    <li>• نسبة الحيازة</li>
                    <li>• عدد التسديدات</li>
                    <li>• البطاقات الصفراء والحمراء</li>
                    <li>• ركلات الزاوية والرميات</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. المتجر الإلكتروني */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="w-5 h-5 ml-2" />
            6. المتجر الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">فئات المنتجات</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-red-700 mb-2">الملابس</h4>
                <ul className="text-sm space-y-1">
                  <li>• قمصان رسمية</li>
                  <li>• شورتات</li>
                  <li>• جوارب</li>
                  <li>• سترات</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-blue-700 mb-2">الإكسسوارات</h4>
                <ul className="text-sm space-y-1">
                  <li>• قبعات</li>
                  <li>• أوشحة</li>
                  <li>• حقائب</li>
                  <li>• مفاتيح</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-green-700 mb-2">المعدات</h4>
                <ul className="text-sm space-y-1">
                  <li>• كرات القدم</li>
                  <li>• حراس المرمى</li>
                  <li>• أحذية</li>
                  <li>• واقيات</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-yellow-700 mb-2">التذكارات</h4>
                <ul className="text-sm space-y-1">
                  <li>• أكواب</li>
                  <li>• إطارات</li>
                  <li>• ملصقات</li>
                  <li>• مجسمات</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">نظام التسوق</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-purple-600">تجربة المستخدم</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>البحث السريع:</strong> عن المنتجات</li>
                  <li>• <strong>الفلترة:</strong> حسب الفئة والسعر</li>
                  <li>• <strong>سلة التسوق:</strong> حفظ المنتجات</li>
                  <li>• <strong>المفضلة:</strong> قائمة الأمنيات</li>
                  <li>• <strong>المراجعات:</strong> تقييمات المشترين</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-indigo-600">الدفع والشحن</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>طرق الدفع:</strong> Bankily، تحويل بنكي</li>
                  <li>• <strong>الفوترة:</strong> إصدار فواتير رسمية</li>
                  <li>• <strong>الشحن:</strong> توصيل للمنزل</li>
                  <li>• <strong>تتبع الطلب:</strong> حالة الشحن</li>
                  <li>• <strong>الإرجاع:</strong> سياسة استرداد</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. لوحة الإدارة */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 ml-2" />
            7. لوحة الإدارة (AdminDashboard.tsx)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">وحدات الإدارة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-3">إدارة المباريات</h4>
                <ul className="text-sm space-y-1">
                  <li>• إضافة مباريات جديدة</li>
                  <li>• تعديل المواعيد</li>
                  <li>• تشغيل مؤقت المباراة</li>
                  <li>• تسجيل الأحداث</li>
                  <li>• تأكيد النتائج</li>
                </ul>
              </div>
              <div className="border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 mb-3">إدارة الفرق</h4>
                <ul className="text-sm space-y-1">
                  <li>• إضافة فرق جديدة</li>
                  <li>• تحديث الشعارات</li>
                  <li>• معلومات الأندية</li>
                  <li>• إدارة الملاعب</li>
                  <li>• تحديث المدربين</li>
                </ul>
              </div>
              <div className="border border-purple-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-700 mb-3">إدارة اللاعبين</h4>
                <ul className="text-sm space-y-1">
                  <li>• إضافة لاعبين جدد</li>
                  <li>• تحديث الإحصائيات</li>
                  <li>• انتقالات اللاعبين</li>
                  <li>• صور اللاعبين</li>
                  <li>• أرقام القمصان</li>
                </ul>
              </div>
              <div className="border border-red-200 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-3">إدارة الأخبار</h4>
                <ul className="text-sm space-y-1">
                  <li>• كتابة مقالات جديدة</li>
                  <li>• رفع الصور والفيديو</li>
                  <li>• نشر الأخبار العاجلة</li>
                  <li>• مراجعة التعليقات</li>
                  <li>• أرشفة المحتوى</li>
                </ul>
              </div>
              <div className="border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-700 mb-3">إدارة المتجر</h4>
                <ul className="text-sm space-y-1">
                  <li>• إضافة منتجات جديدة</li>
                  <li>• تحديث الأسعار</li>
                  <li>• إدارة المخزون</li>
                  <li>• معالجة الطلبات</li>
                  <li>• تقارير المبيعات</li>
                </ul>
              </div>
              <div className="border border-teal-200 p-4 rounded-lg">
                <h4 className="font-medium text-teal-700 mb-3">إدارة المستخدمين</h4>
                <ul className="text-sm space-y-1">
                  <li>• عرض قائمة المستخدمين</li>
                  <li>• تعديل الصلاحيات</li>
                  <li>• حظر المستخدمين</li>
                  <li>• سجل النشاطات</li>
                  <li>• إحصائيات الاستخدام</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">أدوات المراقبة والتحليل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-orange-600">التقارير والإحصائيات</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>إحصائيات الزوار:</strong> عدد المستخدمين</li>
                  <li>• <strong>أكثر المحتويات مشاهدة:</strong> الأخبار والصفحات</li>
                  <li>• <strong>تقارير المبيعات:</strong> أداء المتجر</li>
                  <li>• <strong>نشاط المستخدمين:</strong> التفاعل والتعليقات</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-cyan-600">أدوات الصيانة</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>نسخ احتياطية:</strong> حفظ البيانات</li>
                  <li>• <strong>تنظيف قاعدة البيانات:</strong> حذف البيانات القديمة</li>
                  <li>• <strong>تحديث النظام:</strong> ترقية التطبيق</li>
                  <li>• <strong>فحص الأخطاء:</strong> مراقبة الأداء</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. قاعدة البيانات */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>8. هيكل قاعدة البيانات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">الجداول الرئيسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-blue-600">البيانات الرياضية</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">teams (الفرق)</h5>
                    <p className="text-xs">أسماء الفرق، الشعارات، تاريخ التأسيس، المدربين</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">players (اللاعبون)</h5>
                    <p className="text-xs">أسماء اللاعبين، المراكز، الأعمار، الإحصائيات</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">matches (المباريات)</h5>
                    <p className="text-xs">مواعيد المباريات، النتائج، الحالة، الملاعب</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">standings (الترتيب)</h5>
                    <p className="text-xs">نقاط الفرق، المباريات، الانتصارات، الهزائم</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-green-600">المحتوى والتجارة</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">news (الأخبار)</h5>
                    <p className="text-xs">المقالات، الكاتب، تاريخ النشر، الفئات</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">products (المنتجات)</h5>
                    <p className="text-xs">أسماء المنتجات، الأسعار، الصور، التوفر</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">orders (الطلبات)</h5>
                    <p className="text-xs">طلبات الشراء، حالة التوصيل، طرق الدفع</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-medium text-sm mb-1">profiles (الملفات الشخصية)</h5>
                    <p className="text-xs">معلومات المستخدمين، الأدوار، التفضيلات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">الأمان وحماية البيانات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-red-200 p-4 rounded-lg">
                <h4 className="font-medium text-red-700 mb-2">Row Level Security</h4>
                <p className="text-sm">كل مستخدم يرى البيانات المسموح له بها فقط</p>
              </div>
              <div className="border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-700 mb-2">التشفير</h4>
                <p className="text-sm">جميع البيانات محمية بتشفير قوي</p>
              </div>
              <div className="border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">النسخ الاحتياطي</h4>
                <p className="text-sm">نسخ تلقائية منتظمة لحماية البيانات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. دليل الاستخدام */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>9. دليل الاستخدام التفصيلي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* للمستخدمين العاديين */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">للمستخدمين العاديين</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-blue-600">التنقل في التطبيق</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">1. الوصول للمحتوى</h5>
                    <p className="text-xs">استخدم الأزرار الملونة في الصفحة الرئيسية للوصول السريع</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">2. البحث</h5>
                    <p className="text-xs">استخدم صندوق البحث للعثور على فريق أو لاعب محدد</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">3. المتابعة المباشرة</h5>
                    <p className="text-xs">تابع النتائج والأحداث في الوقت الفعلي</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-green-600">التفاعل والمشاركة</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">1. إنشاء حساب</h5>
                    <p className="text-xs">سجل حساب جديد للحصول على جميع المميزات</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">2. التعليقات</h5>
                    <p className="text-xs">شارك آرائك في الأخبار والمقالات</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm mb-1">3. التسوق</h5>
                    <p className="text-xs">اشتر المنتجات الرسمية من المتجر</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* للإداريين */}
          <div>
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">للإداريين</h3>
            <div>
              <h4 className="font-medium mb-4 text-red-600">خطوات إدارة مباراة مباشرة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 1: الدخول</h5>
                    <p className="text-xs">سجل الدخول بحساب المشرف واضغط على زر الإدارة</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 2: اختيار المباراة</h5>
                    <p className="text-xs">انتقل إلى "إدارة المباريات" واختر المباراة المطلوبة</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 3: بدء المؤقت</h5>
                    <p className="text-xs">اضغط "بدء المباراة" لتشغيل العداد الزمني</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 4: تسجيل الأحداث</h5>
                    <p className="text-xs">أضف الأهداف والبطاقات والتبديلات فور حدوثها</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 5: الشوط الثاني</h5>
                    <p className="text-xs">انتقل للشوط الثاني عند انتهاء الأول</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 6: إنهاء المباراة</h5>
                    <p className="text-xs">اضغط "إنهاء المباراة" وأكد النتيجة النهائية</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 7: المراجعة</h5>
                    <p className="text-xs">راجع جميع البيانات وتأكد من صحتها</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-r-4 border-red-500">
                    <h5 className="font-medium text-sm mb-1">الخطوة 8: النشر</h5>
                    <p className="text-xs">انشر النتائج النهائية للجمهور</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 10. الأمان والأداء */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>10. الأمان والأداء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">إجراءات الأمان</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-red-600">حماية البيانات</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>تشفير البيانات:</strong> جميع المعلومات مشفرة</li>
                  <li>• <strong>كلمات مرور قوية:</strong> متطلبات أمان صارمة</li>
                  <li>• <strong>جلسات آمنة:</strong> انتهاء تلقائي للجلسات</li>
                  <li>• <strong>مراقبة النشاط:</strong> تتبع العمليات المشبوهة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-blue-600">حماية الموقع</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>HTTPS:</strong> اتصال آمن دائماً</li>
                  <li>• <strong>جدار حماية:</strong> منع الهجمات</li>
                  <li>• <strong>نسخ احتياطية:</strong> حفظ البيانات بانتظام</li>
                  <li>• <strong>تحديثات أمنية:</strong> ترقية مستمرة</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-fmf-green">تحسين الأداء</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">التحميل السريع</h4>
                <ul className="text-sm space-y-1">
                  <li>• ضغط الصور</li>
                  <li>• تحميل تدريجي</li>
                  <li>• ذاكرة تخزين مؤقت</li>
                </ul>
              </div>
              <div className="border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">الاستجابة</h4>
                <ul className="text-sm space-y-1">
                  <li>• تصميم متجاوب</li>
                  <li>• تحسين للموبايل</li>
                  <li>• سرعة التفاعل</li>
                </ul>
              </div>
              <div className="border border-purple-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-700 mb-2">الخادم</h4>
                <ul className="text-sm space-y-1">
                  <li>• خوادم سريعة</li>
                  <li>• توزيع الأحمال</li>
                  <li>• مراقبة الأداء</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>معلومات الاتصال والدعم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium mb-2">البريد الإلكتروني</h4>
              <p className="text-sm text-gray-600">info@fmf-mauritanie.org</p>
            </div>
            <div className="text-center p-4">
              <Phone className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium mb-2">الهاتف</h4>
              <p className="text-sm text-gray-600">+222 4574 5000</p>
            </div>
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <h4 className="font-medium mb-2">العنوان</h4>
              <p className="text-sm text-gray-600">نواكشوط، موريتانيا</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التذييل */}
      <div className="text-center text-sm text-gray-600 mt-8 border-t pt-6">
        <p className="mb-2">© 2024 الاتحاد الموريتاني لكرة القدم - الدوري الممتاز الموريتاني</p>
        <p>وثائق شاملة ومفصلة لتطبيق الدوري الممتاز - الإصدار 1.0</p>
      </div>
    </div>
  );
};

export default ArabicDocumentationPage;
