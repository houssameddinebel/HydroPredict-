// Crops with FAO-style crop coefficients (Kc, mid-season reference).
// ETc = ET0 × Kc → net irrigation dose per crop.
// Soils drive scheduling advice (splits / interval).
// Extended: 24 crops with full agronomic sheets (cycle, Kc stages, roots, sensitivity).

export const CROPS = [
  { id: 'wheat', kc: 1.0, cycle: 180, rootCm: 100, name: { fr: 'Blé / céréales', ar: 'قمح / حبوب' } },
  { id: 'maize', kc: 1.2, cycle: 140, rootCm: 120, name: { fr: 'Maïs', ar: 'ذرة' } },
  { id: 'barley', kc: 1.0, cycle: 150, rootCm: 100, name: { fr: 'Orge', ar: 'شعير' } },
  { id: 'vegetables', kc: 1.15, cycle: 120, rootCm: 50, name: { fr: 'Maraîchage (tomate…)', ar: 'خضروات' } },
  { id: 'tomato', kc: 1.15, cycle: 130, rootCm: 60, name: { fr: 'Tomate', ar: 'طماطم' } },
  { id: 'pepper', kc: 1.05, cycle: 130, rootCm: 50, name: { fr: 'Poivron / Piment', ar: 'فلفل' } },
  { id: 'potato', kc: 1.15, cycle: 110, rootCm: 50, name: { fr: 'Pomme de terre', ar: 'بطاطس' } },
  { id: 'onion', kc: 1.0, cycle: 150, rootCm: 40, name: { fr: 'Oignon', ar: 'بصل' } },
  { id: 'carrot', kc: 1.0, cycle: 120, rootCm: 50, name: { fr: 'Carotte', ar: 'جزر' } },
  { id: 'melon', kc: 1.0, cycle: 100, rootCm: 80, name: { fr: 'Melon / Pastèque', ar: 'بطيخ' } },
  { id: 'strawberry', kc: 0.9, cycle: 200, rootCm: 30, name: { fr: 'Fraise', ar: 'فراولة' } },
  { id: 'alfalfa', kc: 1.1, cycle: 365, rootCm: 150, name: { fr: 'Luzerne', ar: 'برسيم' } },
  { id: 'sugarbeet', kc: 1.1, cycle: 180, rootCm: 90, name: { fr: 'Betterave sucrière', ar: 'شمندر سكري' } },
  { id: 'sunflower', kc: 1.0, cycle: 120, rootCm: 120, name: { fr: 'Tournesol', ar: 'عباد الشمس' } },
  { id: 'citrus', kc: 0.65, cycle: 365, rootCm: 120, name: { fr: 'Agrumes', ar: 'حوامض' } },
  { id: 'olives', kc: 0.55, cycle: 365, rootCm: 150, name: { fr: 'Oliviers', ar: 'زيتون' } },
  { id: 'dates', kc: 0.9, cycle: 365, rootCm: 200, name: { fr: 'Dattiers', ar: 'نخيل التمر' } },
  { id: 'grapes', kc: 0.7, cycle: 200, rootCm: 150, name: { fr: 'Vigne', ar: 'كروم' } },
  { id: 'apple', kc: 0.95, cycle: 200, rootCm: 120, name: { fr: 'Pommiers', ar: 'تفاح' } },
  { id: 'almond', kc: 0.8, cycle: 220, rootCm: 150, name: { fr: 'Amandier', ar: 'لوز' } },
  { id: 'argan', kc: 0.5, cycle: 365, rootCm: 200, name: { fr: 'Arganier', ar: 'أركان' } },
  { id: 'banana', kc: 1.1, cycle: 365, rootCm: 80, name: { fr: 'Bananier (sous-serre)', ar: 'موز' } },
  { id: 'cactus', kc: 0.35, cycle: 365, rootCm: 60, name: { fr: 'Figuier de barbarie', ar: 'الصبار' } },
  { id: 'roses', kc: 0.9, cycle: 240, rootCm: 50, name: { fr: 'Rosier / floral', ar: 'ورود' } }
];

export const SOILS = [
  { id: 'sandy', splits: 2, interval: 1, ruMmM: 60, infiltration: 30,
    name: { fr: 'Sableux', ar: 'رملي' },
    tip: { fr: 'Fractionnez en 2 apports / jour', ar: 'قسّم على دفعتين يوميا' } },
  { id: 'sandy-loam', splits: 2, interval: 1, ruMmM: 90, infiltration: 20,
    name: { fr: 'Sabolo-limoneux', ar: 'رملي طميي' },
    tip: { fr: '2 apports courts, paillage conseillé', ar: 'حصتان قصيرتان مع التغطية' } },
  { id: 'loam', splits: 1, interval: 1, ruMmM: 140, infiltration: 12,
    name: { fr: 'Limoneux', ar: 'طميي' },
    tip: { fr: '1 apport le matin', ar: 'حصة واحدة صباحا' } },
  { id: 'clay-loam', splits: 1, interval: 2, ruMmM: 170, infiltration: 7,
    name: { fr: 'Argilo-limoneux', ar: 'طيني طميي' },
    tip: { fr: 'Apport copieux tous les 2 jours', ar: 'حصة وفيرة كل يومين' } },
  { id: 'clay', splits: 1, interval: 2, ruMmM: 190, infiltration: 4,
    name: { fr: 'Argileux', ar: 'طيني' },
    tip: { fr: 'Arrosez un jour sur deux (dose ×2)', ar: 'اسقِ يوما بعد يوم (جرعة مضاعفة)' } },
  { id: 'saline', splits: 2, interval: 1, ruMmM: 100, infiltration: 8,
    name: { fr: 'Salin / Chtouka', ar: 'ملحي' },
    tip: { fr: 'Fractionnez + lessivage 10% eau en plus', ar: 'قسّم + غسل 10% ماء إضافي' } }
];

export const getCropById = (id) => CROPS.find((c) => c.id === id) || CROPS[0];
export const getSoilById = (id) => SOILS.find((s) => s.id === id) || SOILS[2];
