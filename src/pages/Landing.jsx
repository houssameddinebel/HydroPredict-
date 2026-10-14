import React, { useState } from 'react';
import {
  Globe, Sun, Moon, ArrowRight, MapPin, CalendarDays, Droplets,
  TriangleAlert, PiggyBank, History, Languages, Menu, X, Tractor
} from 'lucide-react';
import Logo from '../components/Logo';
import { REGIONS } from '../data/regions';
import { t } from '../i18n/translations';

// Public landing page — inline bilingual copy (marketing layer).
const L = {
  fr: {
    navFeat: 'Fonctionnalités', navCover: 'Couverture', navPrice: 'Tarifs', navFaq: 'FAQ',
    openApp: 'Ouvrir le dashboard',
    badge: 'Conçu pour les agriculteurs marocains',
    heroA: 'Irriguez intelligent,',
    heroB: 'récoltez davantage.',
    heroSub: 'HydroPredict transforme les prévisions météo et la science agronomique en un plan d’irrigation simple, jour par jour — pour chaque ville du Maroc, en français et en arabe.',
    ctaPlans: 'Voir les offres',
    stats: [
      ['39', 'Villes couvertes'], ['24', 'Cultures'], ['12', 'Sections data'], ['7', 'Jours de prévision']
    ],
    mockDose: 'Dose conseillée', mockToday: "Aujourd'hui · Agadir",
    featTitle: 'Une plateforme complète pour piloter votre eau',
    featSub: 'De la parcelle au bilan de campagne, tout est calculé pour vous.',
    feats: [
      ['Prévisions 7 jours hyper-locales', 'Température, pluie, ET₀, vent, humidité du sol — sans capteur, sans clé API.'],
      ['Doses ETc par culture', '12 cultures avec coefficients FAO, ajustées à votre sol et votre surface.'],
      ['Alertes gel, vent, mildiou', 'Des avertissements concrets : quand irriguer, quand traiter, quand attendre.'],
      ['Économies eau & dirhams', 'Chaque semaine comparée à un arrosage fixe, en m³ et en MAD.'],
      ['Historique & statistiques', 'Toutes vos semaines archivées en base, avec courbes et bilans.'],
      ['100 % bilingue FR / AR', 'Interface complète en français et en arabe, avec sens de lecture adapté.'],
      ['Carte + comparateur multi-zones', '39 villes cliquables, comparateur 2-4 zones en live, tableau heure par heure 48h.'],
      ['Eau, sols, marché & exploitation', 'Barrages, nappes, bilan hydrique, 24 fiches cultures, coûts MAD, parcelles et journal.']
    ],
    coverTitle: 'Tout le Maroc, 39 villes',
    coverSub: 'Du Rif au Sahara, sélectionnez votre commune et recevez instantanément sa météo et son plan d’eau.',
    stepsTitle: 'Simple comme 1, 2, 3',
    steps: [
      ['Choisissez votre ville', '39 communes dans les 12 régions du Royaume.'],
      ['Décrivez votre parcelle', 'Culture, sol, surface, prix de l’eau.'],
      ['Suivez le plan', 'Dose, créneau, bulletin imprimable chaque semaine.']
    ],
    testiTitle: 'Ils pilotent leur eau avec HydroPredict',
    testis: [
      ['« On a réduit nos apports de 30 % sur la tomate sans perdre en rendement. »', 'Coopérative Al Amal — Taroudant'],
      ['« Les alertes gel nous ont sauvé les agrumes deux nuits de suite. »', 'Youssef E. — Berkane'],
      ['« Enfin un outil qui parle notre langue et connaît nos sols. »', 'Fatima Z. — Errachidia']
    ],
    priceTitle: 'Des offres pour chaque exploitation',
    tiers: [
      { name: 'Fellah', price: '0 MAD', per: 'gratuit', cta: 'Commencer', perks: ['1 parcelle', 'Prévisions 7 jours', 'Alertes essentielles'] },
      { name: 'Coopérative', price: '499 MAD', per: '/ mois', cta: 'Choisir', hot: true, perks: ['20 parcelles', 'Historique & statistiques', 'Bulletins imprimables', 'Support FR / AR'] },
      { name: 'Agri-entreprise', price: 'Sur devis', per: '', cta: 'Contacter', perks: ['Parcelles illimitées', 'API & capteurs sol', 'Formation terrain', 'Support dédié'] }
    ],
    faqTitle: 'Questions fréquentes',
    faqs: [
      ['Faut-il un capteur dans mon champ ?', 'Non. HydroPredict utilise les modèles météo Open-Meteo et l’humidité du sol estimée par satellite. Ajoutez vos capteurs plus tard si vous le souhaitez.'],
      ['Mes données sont-elles conservées ?', 'Oui : vos zones, prévisions et bilans sont archivés dans votre base MySQL et restent votre propriété.'],
      ['L’outil parle-t-il arabe ?', 'Entièrement — interface, alertes et bulletins, avec lecture de droite à gauche.'],
      ['Comment sont calculées les doses ?', 'Méthode FAO : ETc = ET₀ × Kc de votre culture, moins la pluie efficace, convertie en m³ selon votre surface.']
    ],
    finalT: 'Prêt à économiser chaque goutte ?',
    finalS: 'Rejoignez les agriculteurs qui irriguent avec précision.',
    footerR: 'Tous droits réservés.'
  },
  ar: {
    navFeat: 'المميزات', navCover: 'التغطية', navPrice: 'الأسعار', navFaq: 'الأسئلة الشائعة',
    openApp: 'افتح لوحة القيادة',
    badge: 'مصمم للفلاحين المغاربة',
    heroA: 'اسقِ بذكاء،',
    heroB: 'واحصد أكثر.',
    heroSub: 'هيدرو بريديكت يحوّل توقعات الطقس والعلم الزراعي إلى برنامج سقي بسيط يوم بيوم — لكل مدن المغرب، بالعربية والفرنسية.',
    ctaPlans: 'شاهد العروض',
    stats: [
      ['39', 'مدن مغطاة'], ['24', 'محاصيل'], ['12', 'قسما غنيا'], ['7', 'أيام التوقعات']
    ],
    mockDose: 'الجرعة الموصى بها', mockToday: 'اليوم · أكادير',
    featTitle: 'منصة كاملة لتدبير الماء',
    featSub: 'من الحقل إلى حصيلة الموسم، كل شيء محسوب من أجلك.',
    feats: [
      ['توقعات 7 أيام محلية دقيقة', 'الحرارة، المطر، التبخر، الرياح، رطوبة التربة — بدون حساس ولا مفتاح.'],
      ['جرعات حسب المحصول', '12 محصولا بمعاملات الفاو، مضبوطة حسب تربتك ومساحتك.'],
      ['تنبيهات الصقيع والرياح والبياض', 'تحذيرات عملية: متى تسقي، متى تعالج، متى تنتظر.'],
      ['توفير الماء والدرهم', 'كل أسبوع يقارن مع السقي الثابت، بالمتر المكعب وبالدرهم.'],
      ['السجل والإحصائيات', 'كل أسابيعك مؤرشفة في القاعدة مع رسوم وحصائل.'],
      ['ثنائي اللغة عربي / فرنسي', 'واجهة كاملة بالعربية والفرنسية مع اتجاه قراءة مناسب.'],
      ['خريطة + مقارن المناطق', '39 مدينة قابلة للنقر، مقارن 2-4 مناطق مباشر، جدول ساعة بساعة.'],
      ['الماء والتربة والسوق والضيعة', 'سدود، فرشات، ميزان مائي، 24 بطاقة محصول، تكاليف بالدرهم، حقول ودفتر.']
    ],
    coverTitle: 'المغرب كله، 39 مدينة',
    coverSub: 'من الريف إلى الصحراء، اختر جماعتك واستلم طقسها وبرنامجها المائي فورا.',
    stepsTitle: 'سهل: 1، 2، 3',
    steps: [
      ['اختر مدينتك', '39 جماعة في جهات المملكة الـ12.'],
      ['صف حقلك', 'المحصول، التربة، المساحة، ثمن الماء.'],
      ['اتبع البرنامج', 'الجرعة، الفترة، نشرة قابلة للطبع كل أسبوع.']
    ],
    testiTitle: 'يدبرون ماءهم مع هيدرو بريديكت',
    testis: [
      ['«خفضنا السقي بـ30% في الطماطم دون فقدان المحصول.»', 'تعاونية الأمل — تارودانت'],
      ['«تنبيهات الصقيع أنقذت الحوامض ليلتين متتاليتين.»', 'يوسف — بركان'],
      ['«أخيرا أداة تتكلم لغتنا وتعرف تربتنا.»', 'فاطمة — الرشيدية']
    ],
    priceTitle: 'عروض لكل ضيعة',
    tiers: [
      { name: 'فلاح', price: '0 درهم', per: 'مجاني', cta: 'ابدأ', perks: ['حقل واحد', 'توقعات 7 أيام', 'تنبيهات أساسية'] },
      { name: 'تعاونية', price: '499 درهم', per: '/ شهر', cta: 'اختر', hot: true, perks: ['20 حقلا', 'السجل والإحصائيات', 'نشرات قابلة للطبع', 'دعم عربي / فرنسي'] },
      { name: 'مقاولة فلاحية', price: 'حسب الطلب', per: '', cta: 'اتصل', perks: ['حقول غير محدودة', 'API وحساسات التربة', 'تكوين ميداني', 'دعم مخصص'] }
    ],
    faqTitle: 'الأسئلة الشائعة',
    faqs: [
      ['هل أحتاج حساسا في حقلي؟', 'لا. يستعمل هيدرو بريديكت نماذج Open-Meteo ورطوبة التربة المقدرة بالأقمار الاصطناعية. يمكنك إضافة حساساتك لاحقا.'],
      ['هل بياناتي محفوظة؟', 'نعم: مناطقك وتوقعاتك وحصائلك مؤرشفة في قاعدة MySQL الخاصة بك وتبقى ملكك.'],
      ['هل الأداة تتكلم العربية؟', 'كليا — الواجهة والتنبيهات والنشرات، مع قراءة من اليمين لليسار.'],
      ['كيف تحسب الجرعات؟', 'طريقة الفاو: الاحتياج = التبخر × معامل محصولك، ناقص المطر الفعال، محولا للمتر المكعب حسب مساحتك.']
    ],
    finalT: 'مستعد لتوفير كل قطرة؟',
    finalS: 'انضم للفلاحين الذين يسقون بدقة.',
    footerR: 'جميع الحقوق محفوظة.'
  }
};

const FEAT_ICONS = [CalendarDays, Droplets, TriangleAlert, PiggyBank, History, Languages];

export default function Landing({ lang, dark, onToggleLang, onToggleTheme, onEnter }) {
  const c = L[lang] || L.fr;
  const [menu, setMenu] = useState(false);
  const admins = [...new Map(REGIONS.map((r) => [r.admin.fr, r.admin])).values()];

  const nav = [
    [c.navFeat, '#features'], [c.navCover, '#coverage'], [c.navFaq, '#faq']
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-slate-950/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Logo size={34} />
            <div className="leading-tight">
              <div className="font-extrabold">HydroPredict</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">hydro-predict.ma</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-emerald-500 transition">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleTheme} className="p-2 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition dark:border-slate-700 dark:text-slate-300">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onToggleLang} className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-full border border-slate-200 hover:border-emerald-400 transition dark:border-slate-700">
              <Globe size={15} />{t(lang, 'language')}
            </button>
            <button onClick={onEnter} className="hidden sm:flex items-center gap-1.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full transition">
              {c.openApp}<ArrowRight size={15} className="rtl-flip" />
            </button>
            <button onClick={() => setMenu(!menu)} className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menu && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col gap-2 text-sm font-semibold">
            {nav.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="py-1.5">{label}</a>
            ))}
            <button onClick={onEnter} className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold">
              {c.openApp}<ArrowRight size={15} className="rtl-flip" />
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fadeIn">
            <span className="inline-block text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
              {c.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
              {c.heroA}<br />
              <span className="text-emerald-500">{c.heroB}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-lg">{c.heroSub}</p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <button onClick={onEnter} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-900/30">
                {c.openApp}<ArrowRight size={17} className="rtl-flip" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-8 max-w-lg">
              {c.stats.map(([v, label]) => (
                <div key={label} className="bg-white border border-slate-200 rounded-2xl p-3 text-center dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-extrabold text-emerald-500 tabular-nums">{v}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CSS dashboard mockup */}
          <div className="relative animate-float hidden lg:block" dir="ltr">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl shadow-emerald-950/50 max-w-md ms-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{c.mockToday}</span>
                <span className="text-[11px] font-bold bg-green-500/20 text-green-300 px-2.5 py-0.5 rounded-full">● Normal</span>
              </div>
              <div className="text-slate-300 text-xs">{c.mockDose}</div>
              <div className="text-white text-4xl font-extrabold tabular-nums">4.2 <span className="text-base">mm</span></div>
              <div className="flex items-end gap-1.5 h-24 mt-4">
                {[35, 55, 20, 70, 45, 85, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 tabular-nums">
                {['12', '13', '14', '15', '16', '17', '18'].map((d) => <span key={d}>{d}/10</span>)}
              </div>
            </div>
            <div className="absolute -bottom-5 -start-2 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
              <Droplets size={18} className="text-sky-400" />
              <div className="text-xs"><strong className="text-white tabular-nums">-777 m³</strong><br /><span className="text-slate-400">/ semaine</span></div>
            </div>
            <div className="absolute -top-4 end-6 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2">
              <TriangleAlert size={16} className="text-orange-400" />
              <span className="text-xs text-slate-300">Gel · 06:00</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">{c.featTitle}</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mt-2">{c.featSub}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {c.feats.map(([ft, fd], i) => {
            const Icon = FEAT_ICONS[i % FEAT_ICONS.length];
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-lg transition dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-600">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 dark:bg-emerald-950 dark:text-emerald-400">
                  <Icon size={22} />
                </div>
                <div className="font-bold mb-1">{ft}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{fd}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Coverage ── */}
      <section id="coverage" className="bg-emerald-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center">{c.coverTitle}</h2>
          <p className="text-center text-emerald-200 mt-2 max-w-2xl mx-auto">{c.coverSub}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {admins.map((a) => (
              <span key={a.fr} className="flex items-center gap-1.5 text-sm bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
                <MapPin size={13} className="text-emerald-300" />{a[lang]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">{c.stepsTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {c.steps.map(([st, sd], i) => (
            <div key={i} className="relative bg-white border border-slate-200 rounded-2xl p-6 text-center dark:bg-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg">{i + 1}</div>
              <div className="font-bold mt-3 flex items-center justify-center gap-2">
                {i === 0 && <MapPin size={16} className="text-emerald-500" />}
                {i === 1 && <Tractor size={16} className="text-emerald-500" />}
                {i === 2 && <CalendarDays size={16} className="text-emerald-500" />}
                {st}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sd}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">{c.testiTitle}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {c.testis.map(([q, who], i) => (
            <figure key={i} className="bg-white border border-slate-200 rounded-2xl p-5 dark:bg-slate-900 dark:border-slate-800">
              <div className="text-emerald-500 text-2xl font-bold">“</div>
              <blockquote className="text-sm leading-relaxed">{q}</blockquote>
              <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-bold">{who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">{c.faqTitle}</h2>
        <div className="flex flex-col gap-2 mt-6">
          {c.faqs.map(([q, a]) => (
            <details key={q} className="bg-white border border-slate-200 rounded-xl px-4 py-3 dark:bg-slate-900 dark:border-slate-800">
              <summary className="font-bold text-sm cursor-pointer">{q}</summary>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA + footer ── */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold">{c.finalT}</h2>
          <p className="text-emerald-100 mt-2">{c.finalS}</p>
          <button onClick={onEnter} className="mt-6 inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition">
            {c.openApp}<ArrowRight size={17} className="rtl-flip" />
          </button>
        </div>
      </section>
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size={30} />
            <div className="leading-tight">
              <div className="font-extrabold text-white">HydroPredict</div>
              <div className="text-[11px]">hydro-predict.ma · Agadir, Maroc</div>
            </div>
          </div>
          <div className="text-xs">© 2026 HydroPredict · {c.footerR}</div>
        </div>
      </footer>
    </div>
  );
}
