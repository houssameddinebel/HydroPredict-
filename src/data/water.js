// Water resources + markets + climate normals — Souss-Massa & Morocco.
// Demo/reference values (ABHSM, ORMVA, souks). Replace with live feeds when available.

export const DAMS = [
  { id: 'youssef', name: { fr: 'Youssef Ben Tachfine', ar: 'يوسف بن تاشفين' }, capacityMm3: 303, fillPct: 28, river: 'Massa', use: { fr: 'Chtouka irrigation + eau potable', ar: 'سقي شتوكة + شرب' } },
  { id: 'aoulouz', name: { fr: 'Aoulouz (Taroudant)', ar: 'أولوز' }, capacityMm3: 89, fillPct: 35, river: 'Souss', use: { fr: 'Taroudant grande hydraulique', ar: 'تارودانت' } },
  { id: 'mokhtar', name: { fr: 'Mokhtar Soussi', ar: 'المختار السوسي' }, capacityMm3: 45, fillPct: 41, river: 'Aoulouz', use: { fr: 'Petite hydraulique', ar: 'سقي صغير' } },
  { id: 'abdelmoumen', name: { fr: 'Abdelmoumen', ar: 'عبد المومن' }, capacityMm3: 201, fillPct: 22, river: 'Isscn', use: { fr: 'Agadir eau potable', ar: 'ماء شرب أكادير' } },
  { id: 'mansour', name: { fr: 'Mansour Eddahbi (Ouarzazate)', ar: 'منصور الذهبي' }, capacityMm3: 439, fillPct: 48, river: 'Drâa', use: { fr: 'Drâa palmeraies', ar: 'واحات درعة' } }
];

export const AQUIFERS = [
  { id: 'chtouka', name: { fr: 'Nappe Chtouka-Massa', ar: 'فرشة شتوكة-ماسة' }, depthM: 45, trend: -1.5, status: 'critical',
    desc: { fr: 'Baisse ~1.5 m/an. Forages profonds, dessalement Chtouka en renfort.', ar: 'انخفاض ~1.5 م/سنة. تحلية شتوكة للدعم.' } },
  { id: 'taroudant', name: { fr: 'Nappe Taroudant-Ouled Teima', ar: 'فرشة تارودانت' }, depthM: 30, trend: -0.8, status: 'moderate',
    desc: { fr: 'Baisse 0.8 m/an. Tour d’eau + goutte-à-goutte obligatoire.', ar: 'انخفاض 0.8 م/سنة. تناوب + تنقيط إجباري.' } },
  { id: 'tiznit', name: { fr: 'Nappe Tiznit-Sidi Ifni', ar: 'فرشة تزنيت' }, depthM: 25, trend: -0.4, status: 'normal',
    desc: { fr: 'Relativement stable. Argan + cactus peu consommateurs.', ar: 'مستقرة نسبيا. أركان وصبار قليلا الاستهلاك.' } },
  { id: 'saiss', name: { fr: 'Nappe Saïss (Fès-Meknès)', ar: 'فرشة سايس' }, depthM: 60, trend: -2.0, status: 'critical',
    desc: { fr: 'Surexploitée. Quotas + recharge.', ar: 'مستنزفة. حصص + تغذية اصطناعية.' } }
];

export const MARKET_PRICES = [
  { id: 'tomato', unit: 'MAD/kg', prices: [4.5, 5.2, 6.0, 5.5, 4.8, 4.2], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Tomate (Inezgane)', ar: 'طماطم (إنزكان)' } },
  { id: 'citrus', unit: 'MAD/kg', prices: [3.0, 3.2, 3.5, 4.0, 4.5, 5.0], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Orange (Taroudant)', ar: 'برتقال (تارودانت)' } },
  { id: 'onion', unit: 'MAD/kg', prices: [2.5, 2.8, 3.0, 2.6, 2.4, 2.2], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Oignon', ar: 'بصل' } },
  { id: 'potato', unit: 'MAD/kg', prices: [3.5, 3.8, 4.2, 3.9, 3.4, 3.0], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Pomme de terre', ar: 'بطاطس' } },
  { id: 'olive-oil', unit: 'MAD/L', prices: [70, 72, 75, 78, 80, 82], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Huile d’olive', ar: 'زيت الزيتون' } },
  { id: 'dates', unit: 'MAD/kg', prices: [25, 28, 30, 32, 30, 28], months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    name: { fr: 'Dattes Mejhoul', ar: 'تمر مجهول' } }
];

// Monthly climate normals (T°C avg, rain mm) for 6 key zones — demo means 1991-2020.
export const CLIMATE_NORMALS = {
  agadir: { t: [14, 15, 17, 19, 21, 23, 25, 25, 24, 22, 18, 15], rain: [45, 35, 25, 12, 3, 0, 0, 0, 3, 20, 40, 50] },
  taroudant: { t: [13, 15, 18, 21, 24, 27, 30, 30, 28, 24, 18, 14], rain: [30, 25, 20, 10, 2, 0, 0, 0, 5, 15, 30, 35] },
  fes: { t: [10, 12, 14, 17, 21, 25, 28, 28, 25, 21, 15, 11], rain: [70, 65, 60, 50, 25, 8, 2, 3, 12, 40, 60, 75] },
  errachidia: { t: [11, 14, 18, 23, 27, 32, 35, 34, 30, 24, 17, 12], rain: [12, 10, 12, 8, 5, 3, 2, 3, 8, 12, 15, 12] },
  tanger: { t: [12, 13, 15, 17, 20, 23, 25, 26, 24, 21, 16, 13], rain: [100, 85, 70, 50, 25, 8, 2, 3, 20, 65, 95, 110] },
  dakhla: { t: [17, 18, 19, 20, 22, 23, 24, 25, 24, 23, 21, 18], rain: [5, 4, 3, 1, 0, 0, 0, 1, 2, 4, 6, 6] }
};

export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
