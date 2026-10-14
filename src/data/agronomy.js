// Agronomy knowledge base — FR/AR sheets for crops, pests, fertigation.
// Static reference data (FAO + Souss-Massa field practice).

export const CROP_GUIDES = [
  { id: 'tomato', kcIni: 0.6, kcMid: 1.15, kcEnd: 0.8, gddHarvest: 1300, waterMm: 500,
    stages: { fr: ['Pépinière 25j', 'Croissance 40j', 'Floraison 30j', 'Récolte 60j'], ar: ['مشتل 25ي', 'نمو 40ي', 'إزهار 30ي', 'جني 60ي'] },
    desc: { fr: 'Tomate Souss (serre + plein champ). Très sensible au stress à floraison. Goutte-à-goutte 2–4 L/h.', ar: 'طماطم سوس (بيوت + حقل). حساسة للإجهاد عند الإزهار. تنقيط 2–4 لتر/ساعة.' } },
  { id: 'citrus', kcIni: 0.6, kcMid: 0.65, kcEnd: 0.6, gddHarvest: 2500, waterMm: 800,
    stages: { fr: ['Floraison Mar-Avr', 'Nouaison', 'Grossissement', 'Maturation Oct-Jan'], ar: ['إزهار مارس-أبريل', 'عقد', 'تضخم', 'نضج أكتوبر-يناير'] },
    desc: { fr: 'Agrumes Taroudant/Berkane. Éviter excès eau en hiver (asphyxie). Pailler l’été.', ar: 'حوامض تارودانت/بركان. تجنب فائض الماء شتاء. غطِّ صيفا.' } },
  { id: 'olives', kcIni: 0.5, kcMid: 0.55, kcEnd: 0.5, gddHarvest: 2200, waterMm: 400,
    stages: { fr: ['Débourrement', 'Floraison Mai', 'Durcissement noyau', 'Véraison'], ar: ['تبرعم', 'إزهار ماي', 'تصلب النواة', 'تلون'] },
    desc: { fr: 'Olivier rustique. Stress modéré accepté sauf floraison. Taille + goutte-à-goutte.', ar: 'زيتون مقاوم. إجهاد متوسط مقبول إلا عند الإزهار.' } },
  { id: 'wheat', kcIni: 0.4, kcMid: 1.0, kcEnd: 0.4, gddHarvest: 1800, waterMm: 450,
    stages: { fr: ['Levée', 'Tallage', 'Montaison', 'Épiaison'], ar: ['إنبات', 'تفريع', 'استطالة', 'سنابل'] },
    desc: { fr: 'Blé Saïs/Chaouia. Irrigation d’appoint à montaison si pluie < 250 mm.', ar: 'قمح سايس/شاوية. سقي تكميلي عند الاستطالة إذا المطر < 250 مم.' } },
  { id: 'dates', kcIni: 0.8, kcMid: 0.9, kcEnd: 0.8, gddHarvest: 3500, waterMm: 1400,
    stages: { fr: ['Pollinisation', 'Kimri', 'Khalal', 'Tamar'], ar: ['تلقيح', 'كمري', 'خلال', 'تمر'] },
    desc: { fr: 'Palmier Drâa-Tafilalet. 150–200 L/j/arbre en été. Cuves + seguia.', ar: 'نخيل درعة-تافيلالت. 150–200 لتر/يوم/نخلة صيفا.' } },
  { id: 'potato', kcIni: 0.5, kcMid: 1.15, kcEnd: 0.75, gddHarvest: 1000, waterMm: 450,
    stages: { fr: ['Levée 20j', 'Tubérisation', 'Grossissement', 'Maturation'], ar: ['إنبات 20ي', 'تدرن', 'تضخم', 'نضج'] },
    desc: { fr: 'Pomme de terre. Sol meuble, arrêt eau 10j avant récolte.', ar: 'بطاطس. تربة خفيفة، أوقف الماء 10 أيام قبل الجني.' } },
  { id: 'maize', kcIni: 0.5, kcMid: 1.2, kcEnd: 0.6, gddHarvest: 1600, waterMm: 550,
    stages: { fr: ['Levée', '6-8 feuilles', 'Floraison', 'Remplissage grain'], ar: ['إنبات', '6-8 أوراق', 'إزهار', 'امتلاء الحب'] },
    desc: { fr: 'Maïs fourrage/luzerne en rotation. Pic besoin à floraison.', ar: 'ذرة علفية. ذروة الحاجة عند الإزهار.' } },
  { id: 'argan', kcIni: 0.4, kcMid: 0.5, kcEnd: 0.4, gddHarvest: 3000, waterMm: 200,
    stages: { fr: ['Floraison', 'Nouaison', 'Maturation 9 mois'], ar: ['إزهار', 'عقد', 'نضج 9 أشهر'] },
    desc: { fr: 'Arganier Tiznit/Essaouira. Pluvial, appoint 1er été seulement.', ar: 'أركان تزنيت/الصويرة. بعلي، سقي السنة الأولى فقط.' } }
];

export const PESTS = [
  { id: 'mildew', crop: 'tomato', tMin: 12, tMax: 26, rhMin: 80,
    name: { fr: 'Mildiou / Oïdium', ar: 'البياض الزغبي/الدقيقي' },
    advice: { fr: 'Aérez, traitez cuivre/soufre, évitez aspersion le soir.', ar: 'هوِّ، عالج بالنحاس/الكبريت، تجنب الرش مساء.' } },
  { id: 'aphids', crop: 'vegetables', tMin: 15, tMax: 30, rhMin: 40,
    name: { fr: 'Pucerons', ar: 'المن' },
    advice: { fr: 'Pièges jaunes, savon noir, auxiliaires.', ar: 'مصائد صفراء، صابون أسود.' } },
  { id: 'tuta', crop: 'tomato', tMin: 20, tMax: 35, rhMin: 30,
    name: { fr: 'Tuta absoluta', ar: 'توتا أبسولوتا' },
    advice: { fr: 'Pièges phéromones, filets, destruction feuilles minées.', ar: 'مصائد فرمونية، شباك، إتلاف الأوراق.' } },
  { id: 'rust', crop: 'wheat', tMin: 10, tMax: 25, rhMin: 75,
    name: { fr: 'Rouille du blé', ar: 'صدأ القمح' },
    advice: { fr: 'Variétés résistantes, fongicide à épiaison.', ar: 'أصناف مقاومة، مبيد عند السنابل.' } },
  { id: 'medfly', crop: 'citrus', tMin: 18, tMax: 32, rhMin: 40,
    name: { fr: 'Mouche méditerranéenne', ar: 'ذبابة المتوسط' },
    advice: { fr: 'Pièges cératite, ramassage fruits tombés.', ar: 'مصائد، جمع الثمار المتساقطة.' } },
  { id: 'bayoud', crop: 'dates', tMin: 20, tMax: 35, rhMin: 30,
    name: { fr: 'Bayoud du palmier', ar: 'البيوض' },
    advice: { fr: 'Variétés résistantes, quarantaine rejets.', ar: 'أصناف مقاومة، حجر صحي للفسائل.' } }
];

export const FERTILIZERS = [
  { id: 'npk-tomato', crop: 'tomato',
    plan: { fr: 'N 180 – P 80 – K 250 kg/ha. Fertigation 2×/sem. Stop N à véraison.', ar: 'N 180 – P 80 – K 250 كغ/هـ. تسميد بالتنقيط 2×/أسبوع.' } },
  { id: 'npk-citrus', crop: 'citrus',
    plan: { fr: 'N 200 – P 60 – K 180 kg/ha/an en 4 apports (Fév, Mai, Juil, Sep).', ar: 'N 200 – P 60 – K 180 كغ/هـ/سنة على 4 دفعات.' } },
  { id: 'npk-wheat', crop: 'wheat',
    plan: { fr: 'N 120 (2×), P 60 au semis, K 40. Urée à tallage + montaison.', ar: 'N 120 (2×)، P 60 عند البذر، K 40.' } },
  { id: 'npk-potato', crop: 'potato',
    plan: { fr: 'N 150 – P 100 – K 200. Fumure organique 20 T/ha avant plantation.', ar: 'N 150 – P 100 – K 200. سماد عضوي 20 طن/هـ قبل الزرع.' } }
];

export const getCropGuide = (id) => CROP_GUIDES.find((g) => g.id === id) || null;
export const getPestsForCrop = (cropId) => PESTS.filter((p) => p.crop === cropId || p.crop === 'vegetables');
export const getFertilizer = (cropId) => FERTILIZERS.find((f) => f.crop === cropId) || null;
