/* ============================================================
   BUDGETVIZ v6 — script.js
   Expense & Budget Visualizer — Vanilla JS, Chart.js, LocalStorage
   ============================================================ */
'use strict';

/* ── STORAGE KEYS ──────────────────────────────────────────── */
const LS_TX  = 'bviz6_tx';
const LS_CAT = 'bviz6_cat';
const LS_THM = 'bviz6_theme';
const LS_SRT = 'bviz6_sort';
const LS_CUR = 'bviz6_cur';

/* ── CURRENCIES — 100+ mata uang dunia + kurs ke IDR ───────── */
const CURRENCIES = {
  /* ── Asia Tenggara ── */
  IDR:{ symbol:'Rp',    name:'🇮🇩 IDR – Rupiah Indonesia',        rate:1        },
  SGD:{ symbol:'S$',    name:'🇸🇬 SGD – Dolar Singapura',         rate:11000    },
  MYR:{ symbol:'RM',    name:'🇲🇾 MYR – Ringgit Malaysia',        rate:3500     },
  THB:{ symbol:'฿',     name:'🇹🇭 THB – Baht Thailand',           rate:460      },
  PHP:{ symbol:'₱',     name:'🇵🇭 PHP – Peso Filipina',           rate:285      },
  VND:{ symbol:'₫',     name:'🇻🇳 VND – Dong Vietnam',            rate:0.64     },
  KHR:{ symbol:'៛',     name:'🇰🇭 KHR – Riel Kamboja',            rate:4.0      },
  LAK:{ symbol:'₭',     name:'🇱🇦 LAK – Kip Laos',                rate:0.77     },
  MMK:{ symbol:'K',     name:'🇲🇲 MMK – Kyat Myanmar',            rate:7.8      },
  BND:{ symbol:'B$',    name:'🇧🇳 BND – Dolar Brunei',            rate:11000    },
  /* ── Asia Timur ── */
  JPY:{ symbol:'¥',     name:'🇯🇵 JPY – Yen Jepang',              rate:100      },
  CNY:{ symbol:'¥',     name:'🇨🇳 CNY – Yuan Tiongkok',           rate:2000     },
  KRW:{ symbol:'₩',     name:'🇰🇷 KRW – Won Korea Selatan',       rate:12.1     },
  HKD:{ symbol:'HK$',   name:'🇭🇰 HKD – Dolar Hong Kong',         rate:2090     },
  TWD:{ symbol:'NT$',   name:'🇹🇼 TWD – Dolar Taiwan',            rate:510      },
  MOP:{ symbol:'P',     name:'🇲🇴 MOP – Pataca Makau',            rate:2030     },
  MNT:{ symbol:'₮',     name:'🇲🇳 MNT – Tugrik Mongolia',         rate:4.8      },
  /* ── Asia Selatan ── */
  INR:{ symbol:'₹',     name:'🇮🇳 INR – Rupee India',             rate:196      },
  PKR:{ symbol:'₨',     name:'🇵🇰 PKR – Rupee Pakistan',          rate:58       },
  BDT:{ symbol:'৳',     name:'🇧🇩 BDT – Taka Bangladesh',         rate:148      },
  LKR:{ symbol:'₨',     name:'🇱🇰 LKR – Rupee Sri Lanka',         rate:54       },
  NPR:{ symbol:'₨',     name:'🇳🇵 NPR – Rupee Nepal',             rate:122      },
  MVR:{ symbol:'Rf',    name:'🇲🇻 MVR – Rufiyaa Maladewa',        rate:1050     },
  BTN:{ symbol:'Nu',    name:'🇧🇹 BTN – Ngultrum Bhutan',         rate:196      },
  /* ── Asia Tengah ── */
  KZT:{ symbol:'₸',     name:'🇰🇿 KZT – Tenge Kazakhstan',        rate:35       },
  UZS:{ symbol:'сум',   name:'🇺🇿 UZS – Som Uzbekistan',          rate:1.3      },
  KGS:{ symbol:'с',     name:'🇰🇬 KGS – Som Kirgizstan',          rate:178      },
  TJS:{ symbol:'SM',    name:'🇹🇯 TJS – Somoni Tajikistan',        rate:1400     },
  TMT:{ symbol:'T',     name:'🇹🇲 TMT – Manat Turkmenistan',      rate:4300     },
  AFN:{ symbol:'؋',     name:'🇦🇫 AFN – Afghani Afghanistan',     rate:215      },
  /* ── Asia Barat / Timur Tengah ── */
  SAR:{ symbol:'﷼',     name:'🇸🇦 SAR – Riyal Arab Saudi',        rate:4350     },
  AED:{ symbol:'د.إ',   name:'🇦🇪 AED – Dirham UAE',              rate:4440     },
  QAR:{ symbol:'﷼',     name:'🇶🇦 QAR – Riyal Qatar',             rate:4480     },
  KWD:{ symbol:'KD',    name:'🇰🇼 KWD – Dinar Kuwait',            rate:53000    },
  BHD:{ symbol:'BD',    name:'🇧🇭 BHD – Dinar Bahrain',           rate:43300    },
  OMR:{ symbol:'﷼',     name:'🇴🇲 OMR – Riyal Oman',              rate:42400    },
  JOD:{ symbol:'JD',    name:'🇯🇴 JOD – Dinar Yordania',          rate:23000    },
  ILS:{ symbol:'₪',     name:'🇮🇱 ILS – Shekel Israel',           rate:4450     },
  TRY:{ symbol:'₺',     name:'🇹🇷 TRY – Lira Turki',              rate:500      },
  IRR:{ symbol:'﷼',     name:'🇮🇷 IRR – Rial Iran',               rate:0.36     },
  IQD:{ symbol:'ع.د',   name:'🇮🇶 IQD – Dinar Irak',              rate:11.5     },
  SYP:{ symbol:'£S',    name:'🇸🇾 SYP – Pound Suriah',            rate:1.2      },
  LBP:{ symbol:'ل.ل',   name:'🇱🇧 LBP – Pound Lebanon',           rate:0.17     },
  YER:{ symbol:'﷼',     name:'🇾🇪 YER – Rial Yaman',              rate:60       },
  /* ── Eropa ── */
  EUR:{ symbol:'€',     name:'🇪🇺 EUR – Euro',                    rate:16000    },
  GBP:{ symbol:'£',     name:'🇬🇧 GBP – Pound Sterling',          rate:19000    },
  CHF:{ symbol:'Fr',    name:'🇨🇭 CHF – Franc Swiss',             rate:18400    },
  NOK:{ symbol:'kr',    name:'🇳🇴 NOK – Krone Norwegia',          rate:1520     },
  SEK:{ symbol:'kr',    name:'🇸🇪 SEK – Krona Swedia',            rate:1530     },
  DKK:{ symbol:'kr',    name:'🇩🇰 DKK – Krone Denmark',           rate:2390     },
  ISK:{ symbol:'kr',    name:'🇮🇸 ISK – Krona Islandia',          rate:118      },
  PLN:{ symbol:'zł',    name:'🇵🇱 PLN – Zloty Polandia',          rate:4100     },
  CZK:{ symbol:'Kč',    name:'🇨🇿 CZK – Koruna Ceko',             rate:730      },
  HUF:{ symbol:'Ft',    name:'🇭🇺 HUF – Forint Hungaria',         rate:44       },
  RON:{ symbol:'lei',   name:'🇷🇴 RON – Leu Rumania',             rate:3600     },
  BGN:{ symbol:'лв',    name:'🇧🇬 BGN – Lev Bulgaria',            rate:9100     },
  HRK:{ symbol:'kn',    name:'🇭🇷 HRK – Kuna Kroasia',            rate:2350     },
  RSD:{ symbol:'din',   name:'🇷🇸 RSD – Dinar Serbia',            rate:152      },
  MKD:{ symbol:'ден',   name:'🇲🇰 MKD – Denar Makedonia',         rate:290      },
  ALL:{ symbol:'L',     name:'🇦🇱 ALL – Lek Albania',             rate:175      },
  BAM:{ symbol:'KM',    name:'🇧🇦 BAM – Mark Bosnia',             rate:9100     },
  MDL:{ symbol:'L',     name:'🇲🇩 MDL – Leu Moldova',             rate:920      },
  UAH:{ symbol:'₴',     name:'🇺🇦 UAH – Hryvnia Ukraina',         rate:395      },
  BYN:{ symbol:'Br',    name:'🇧🇾 BYN – Rubel Belarus',           rate:5000     },
  RUB:{ symbol:'₽',     name:'🇷🇺 RUB – Rubel Rusia',             rate:178      },
  GEL:{ symbol:'₾',     name:'🇬🇪 GEL – Lari Georgia',            rate:5900     },
  AMD:{ symbol:'֏',     name:'🇦🇲 AMD – Dram Armenia',            rate:42       },
  AZN:{ symbol:'₼',     name:'🇦🇿 AZN – Manat Azerbaijan',        rate:9600     },
  /* ── Amerika Utara & Tengah ── */
  USD:{ symbol:'$',     name:'🇺🇸 USD – US Dollar',               rate:15000    },
  CAD:{ symbol:'C$',    name:'🇨🇦 CAD – Dolar Kanada',            rate:12000    },
  MXN:{ symbol:'$',     name:'🇲🇽 MXN – Peso Meksiko',            rate:940      },
  GTQ:{ symbol:'Q',     name:'🇬🇹 GTQ – Quetzal Guatemala',       rate:2100     },
  HNL:{ symbol:'L',     name:'🇭🇳 HNL – Lempira Honduras',        rate:660      },
  NIO:{ symbol:'C$',    name:'🇳🇮 NIO – Cordoba Nikaragua',       rate:450      },
  CRC:{ symbol:'₡',     name:'🇨🇷 CRC – Colon Kosta Rika',        rate:30       },
  PAB:{ symbol:'B/.',   name:'🇵🇦 PAB – Balboa Panama',           rate:15000    },
  /* ── Karibia ── */
  DOP:{ symbol:'RD$',   name:'🇩🇴 DOP – Peso Dominika',           rate:280      },
  CUP:{ symbol:'$',     name:'🇨🇺 CUP – Peso Kuba',               rate:680      },
  JMD:{ symbol:'J$',    name:'🇯🇲 JMD – Dolar Jamaika',           rate:105      },
  TTD:{ symbol:'TT$',   name:'🇹🇹 TTD – Dolar Trinidad',          rate:2400     },
  BBD:{ symbol:'Bds$',  name:'🇧🇧 BBD – Dolar Barbados',          rate:8150     },
  HTG:{ symbol:'G',     name:'🇭🇹 HTG – Gourde Haiti',            rate:115      },
  /* ── Amerika Selatan ── */
  BRL:{ symbol:'R$',    name:'🇧🇷 BRL – Real Brasil',             rate:3100     },
  ARS:{ symbol:'$',     name:'🇦🇷 ARS – Peso Argentina',          rate:18       },
  CLP:{ symbol:'$',     name:'🇨🇱 CLP – Peso Chili',              rate:17.5     },
  COP:{ symbol:'$',     name:'🇨🇴 COP – Peso Kolombia',           rate:4.0      },
  PEN:{ symbol:'S/',    name:'🇵🇪 PEN – Sol Peru',                rate:4400     },
  BOB:{ symbol:'Bs',    name:'🇧🇴 BOB – Boliviano Bolivia',       rate:2360     },
  PYG:{ symbol:'₲',     name:'🇵🇾 PYG – Guarani Paraguay',        rate:2.2      },
  UYU:{ symbol:'$U',    name:'🇺🇾 UYU – Peso Uruguay',            rate:420      },
  VES:{ symbol:'Bs.S',  name:'🇻🇪 VES – Bolivar Venezuela',       rate:0.45     },
  GYD:{ symbol:'G$',    name:'🇬🇾 GYD – Dolar Guyana',            rate:72       },
  SRD:{ symbol:'$',     name:'🇸🇷 SRD – Dolar Suriname',          rate:430      },
  /* ── Oseania ── */
  AUD:{ symbol:'A$',    name:'🇦🇺 AUD – Dolar Australia',         rate:10000    },
  NZD:{ symbol:'NZ$',   name:'🇳🇿 NZD – Dolar Selandia Baru',    rate:9800     },
  FJD:{ symbol:'FJ$',   name:'🇫🇯 FJD – Dolar Fiji',              rate:7300     },
  PGK:{ symbol:'K',     name:'🇵🇬 PGK – Kina Papua Nugini',       rate:4300     },
  WST:{ symbol:'WS$',   name:'🇼🇸 WST – Tala Samoa',              rate:5900     },
  TOP:{ symbol:'T$',    name:'🇹🇴 TOP – Paʻanga Tonga',           rate:6900     },
  SBD:{ symbol:'SI$',   name:'🇸🇧 SBD – Dolar Solomon',           rate:1950     },
  VUV:{ symbol:'VT',    name:'🇻🇺 VUV – Vatu Vanuatu',            rate:137      },
  /* ── Afrika Utara ── */
  EGP:{ symbol:'E£',    name:'🇪🇬 EGP – Pound Mesir',             rate:330      },
  DZD:{ symbol:'دج',    name:'🇩🇿 DZD – Dinar Aljazair',          rate:121      },
  MAD:{ symbol:'MAD',   name:'🇲🇦 MAD – Dirham Maroko',           rate:1620     },
  TND:{ symbol:'DT',    name:'🇹🇳 TND – Dinar Tunisia',           rate:5200     },
  LYD:{ symbol:'LD',    name:'🇱🇾 LYD – Dinar Libya',             rate:3400     },
  SDG:{ symbol:'£SD',   name:'🇸🇩 SDG – Pound Sudan',             rate:26       },
  /* ── Afrika Sub-Sahara ── */
  NGN:{ symbol:'₦',     name:'🇳🇬 NGN – Naira Nigeria',           rate:10.5     },
  ZAR:{ symbol:'R',     name:'🇿🇦 ZAR – Rand Afrika Selatan',     rate:880      },
  KES:{ symbol:'KSh',   name:'🇰🇪 KES – Shilling Kenya',          rate:126      },
  GHS:{ symbol:'₵',     name:'🇬🇭 GHS – Cedi Ghana',              rate:1100     },
  ETB:{ symbol:'Br',    name:'🇪🇹 ETB – Birr Ethiopia',           rate:290      },
  TZS:{ symbol:'TSh',   name:'🇹🇿 TZS – Shilling Tanzania',       rate:6.3      },
  UGX:{ symbol:'USh',   name:'🇺🇬 UGX – Shilling Uganda',         rate:4.4      },
  ZMW:{ symbol:'ZK',    name:'🇿🇲 ZMW – Kwacha Zambia',           rate:620      },
  MWK:{ symbol:'MK',    name:'🇲🇼 MWK – Kwacha Malawi',           rate:9.0      },
  MZN:{ symbol:'MT',    name:'🇲🇿 MZN – Metical Mozambik',        rate:240      },
  BWP:{ symbol:'P',     name:'🇧🇼 BWP – Pula Botswana',           rate:1100     },
  NAD:{ symbol:'N$',    name:'🇳🇦 NAD – Dolar Namibia',           rate:880      },
  SZL:{ symbol:'L',     name:'🇸🇿 SZL – Lilangeni Eswatini',      rate:880      },
  LSL:{ symbol:'L',     name:'🇱🇸 LSL – Loti Lesotho',            rate:880      },
  RWF:{ symbol:'RF',    name:'🇷🇼 RWF – Franc Rwanda',            rate:11       },
  BIF:{ symbol:'Fr',    name:'🇧🇮 BIF – Franc Burundi',           rate:5.3      },
  DJF:{ symbol:'Fr',    name:'🇩🇯 DJF – Franc Djibouti',          rate:85       },
  SOS:{ symbol:'Sh',    name:'🇸🇴 SOS – Shilling Somalia',        rate:26       },
  MGA:{ symbol:'Ar',    name:'🇲🇬 MGA – Ariary Madagaskar',       rate:3.4      },
  SCR:{ symbol:'₨',     name:'🇸🇨 SCR – Rupee Seychelles',        rate:1100     },
  MUR:{ symbol:'₨',     name:'🇲🇺 MUR – Rupee Mauritius',         rate:340      },
  CVE:{ symbol:'$',     name:'🇨🇻 CVE – Escudo Tanjung Verde',    rate:155      },
  GMD:{ symbol:'D',     name:'🇬🇲 GMD – Dalasi Gambia',           rate:250      },
  GNF:{ symbol:'Fr',    name:'🇬🇳 GNF – Franc Guinea',            rate:1.8      },
  SLL:{ symbol:'Le',    name:'🇸🇱 SLL – Leone Sierra Leone',      rate:0.7      },
  LRD:{ symbol:'L$',    name:'🇱🇷 LRD – Dolar Liberia',           rate:80       },
  XOF:{ symbol:'CFA',   name:'🌍 XOF – Franc CFA Barat',          rate:27       },
  XAF:{ symbol:'CFA',   name:'🌍 XAF – Franc CFA Tengah',         rate:27       },
  XCD:{ symbol:'EC$',   name:'🌎 XCD – Dolar Karibia Timur',      rate:5600     },
  /* ── Lainnya ── */
  ANG:{ symbol:'ƒ',     name:'🇨🇼 ANG – Gulden Antillen',         rate:9100     },
  AWG:{ symbol:'ƒ',     name:'🇦🇼 AWG – Florin Aruba',            rate:9100     },
};

/* ── DEFAULT CATEGORIES ────────────────────────────────────── */
const DEFAULT_CATS = [
  'Food','Transport','Fun','Shopping','Health',
  'Education','Bills','Salary','Investment','Rent',
  'Groceries','Coffee','Restaurant','Gym','Travel',
  'Electronics','Clothing','Beauty','Charity','Insurance',
  'Savings','Freelance',
];

/* ── CATEGORY ICONS ────────────────────────────────────────── */
const CAT_ICONS = {
  'Food':'🍽️','Transport':'🚗','Fun':'🎉','Shopping':'🛍️','Health':'💊',
  'Education':'📚','Bills':'🧾','Salary':'💼','Investment':'📈','Rent':'🏠',
  'Groceries':'🛒','Coffee':'☕','Restaurant':'🍴','Gym':'💪','Travel':'✈️',
  'Electronics':'💻','Clothing':'👕','Beauty':'💄','Charity':'🤲','Insurance':'🛡️',
  'Savings':'🏦','Freelance':'💻',
  'Makan':'🍽️','Transportasi':'🚗','Hiburan':'🎉','Belanja':'🛍️',
  'Kesehatan':'💊','Pendidikan':'📚','Tagihan':'🧾','Gaji':'💼',
  'Investasi':'📈','Sewa':'🏠','Kopi':'☕','Olahraga':'💪',
  'Perjalanan':'✈️','Elektronik':'💻','Pakaian':'👕','Kecantikan':'💄',
  'Donasi':'🤲','Asuransi':'🛡️','Tabungan':'🏦','Other':'📦','Lainnya':'📦',
};

const KEYWORD_ICONS = [
  ['gym','💪'],['olahraga','💪'],['sport','💪'],['fitness','💪'],
  ['netflix','🎬'],['film','🎬'],['movie','🎬'],['bioskop','🎬'],
  ['spotify','🎵'],['musik','🎵'],['game','🎮'],['gaming','🎮'],
  ['bensin','⛽'],['bbm','⛽'],['fuel','⛽'],['pertamina','⛽'],
  ['parkir','🅿️'],['tol','🛣️'],['servis','🔧'],['bengkel','🔧'],
  ['listrik','⚡'],['electricity','⚡'],['pln','⚡'],
  ['air','💧'],['water','💧'],['internet','📶'],['wifi','📶'],
  ['gas','🔥'],['lpg','🔥'],['telepon','📞'],['pulsa','📱'],
  ['coffee','☕'],['kopi','☕'],['cafe','☕'],['starbucks','☕'],
  ['makan','🍽️'],['food','🍽️'],['restaurant','🍴'],['warung','🍽️'],
  ['nasi','🍚'],['pizza','🍕'],['burger','🍔'],['sushi','🍣'],
  ['bakso','🍜'],['mie','🍜'],['ayam','🍗'],['snack','🍿'],
  ['ojek','🛵'],['grab','🚗'],['gojek','🛵'],['taxi','🚕'],
  ['bus','🚌'],['kereta','🚆'],['pesawat','✈️'],['tiket','🎫'],
  ['belanja','🛍️'],['shopping','🛍️'],['mall','🏬'],['online','🛒'],
  ['tokopedia','🛒'],['shopee','🛒'],['lazada','🛒'],
  ['dokter','🏥'],['obat','💊'],['apotek','💊'],['vitamin','💊'],
  ['gigi','🦷'],['sekolah','🏫'],['kuliah','🎓'],['kursus','📖'],
  ['buku','📖'],['tagihan','🧾'],['bayar','🧾'],['gaji','💼'],
  ['bonus','💰'],['investasi','📈'],['saham','📈'],['crypto','🪙'],
  ['bitcoin','🪙'],['tabungan','🏦'],['nabung','🏦'],
  ['sewa','🏠'],['kos','🏠'],['kontrakan','🏠'],['rumah','🏡'],
  ['apartemen','🏢'],['dapur','🛒'],['groceries','🛒'],['supermarket','🛒'],
  ['indomaret','🏪'],['alfamart','🏪'],['pasar','🏪'],
  ['travel','✈️'],['liburan','🏖️'],['hotel','🏨'],['wisata','🗺️'],
  ['laptop','💻'],['komputer','🖥️'],['tablet','📱'],['kamera','📷'],
  ['headphone','🎧'],['baju','👕'],['clothing','👕'],['fashion','👗'],
  ['sepatu','👟'],['tas','👜'],['salon','💇'],['skincare','🧴'],
  ['makeup','💄'],['spa','🧖'],['donasi','🤲'],['charity','🤲'],
  ['sedekah','🤲'],['zakat','🤲'],['asuransi','🛡️'],['bpjs','🛡️'],
  ['freelance','💻'],['project','📋'],['desain','🎨'],
  ['hadiah','🎁'],['gift','🎁'],['pajak','📋'],['tax','📋'],
];

const HIGH_AMT_IDR = 500_000;

const CHART_COLORS = [
  '#7c3aed','#a855f7','#ec4899','#f59e0b','#10b981',
  '#3b82f6','#ef4444','#06b6d4','#84cc16','#f97316',
  '#8b5cf6','#14b8a6','#e11d48','#0ea5e9','#65a30d',
];

/* ── SMART ICON ────────────────────────────────────────────── */
function getSmartIcon(categoryName) {
  if (!categoryName) return '📦';
  const name = String(categoryName).trim();
  const exactKey = Object.keys(CAT_ICONS).find(k => k.toLowerCase() === name.toLowerCase());
  if (exactKey) return CAT_ICONS[exactKey];
  const lower = name.toLowerCase();
  for (const [kw, icon] of KEYWORD_ICONS) {
    if (lower.includes(kw)) return icon;
  }
  const letterFallback = {
    A:'🅰️',B:'🅱️',C:'🌀',D:'🔷',E:'📧',F:'🔵',G:'🟢',H:'🏠',I:'ℹ️',
    J:'🎯',K:'🔑',L:'💡',M:'📌',N:'🔔',O:'⭕',P:'📦',Q:'❓',R:'🔴',
    S:'⭐',T:'🏷️',U:'🔼',V:'✅',W:'🌊',X:'❌',Y:'💛',Z:'⚡',
  };
  return letterFallback[name.charAt(0).toUpperCase()] || '📦';
}
const catIcon = c => getSmartIcon(c);

/* ── STATE ─────────────────────────────────────────────────── */
let transactions = [], customCats = [];
let curSort = 'date', curDir = 'desc', curMonth = 'all', curCur = 'IDR';
let chart = null, toastTmr = null;

/* ── DOM CACHE ─────────────────────────────────────────────── */
const dom = {};
function cacheDom() {
  const map = {
    form:'expenseForm', itemName:'itemName', itemAmount:'itemAmount',
    itemCat:'itemCategory', nameErr:'nameError', amtErr:'amountError',
    catErr2:'categoryError', totalBal:'totalBalance', balSub:'balanceSub',
    balIdr:'balanceIdrNote', totalInc:'totalIncome', totalExp:'totalExpense',
    txCount:'txCount', txList:'transactionList', empty:'emptyState',
    monthSel:'monthFilter', monthBadge:'monthBadge', themeBtn:'themeToggle',
    themeIco:'themeIcon', newCat:'newCatInput', addCatBtn:'addCatBtn',
    catErr:'catError', catTags:'customCatTags', chartCvs:'expenseChart',
    chartEmpty:'chartEmpty', chartLeg:'chartLegend', toast:'toast',
    clearBtn:'clearAllBtn', modalOv:'modalOverlay', modalNo:'modalCancel',
    modalYes:'modalConfirm', curSel:'currencySelect', curLbl:'currencyLabel',
    amtPfx:'amountPrefix', addBtnTxt:'addBtnText', addBtn:'addBtn',
    idrPrev:'idrPreview', idrPrevTxt:'idrPreviewText',
  };
  Object.entries(map).forEach(([k, id]) => {
    dom[k] = document.getElementById(id);
    if (!dom[k]) console.warn('[BV] missing #' + id);
  });
}

/* ── UTILS ─────────────────────────────────────────────────── */
function numFmt(n) {
  return Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
/** Kembalikan { sym, num } agar bisa dirender terpisah */
function fmtParts(n, curCode) {
  const c = CURRENCIES[curCode || curCur] || CURRENCIES.IDR;
  return {
    sym: (n < 0 ? '-' : '') + c.symbol,
    num: numFmt(n),
  };
}
/** Format string biasa (untuk toast, badge, dll) */
function fmt(n, curCode) {
  const p = fmtParts(n, curCode);
  return p.sym + '\u00a0' + p.num;
}
function fmtIDR(n) {
  return 'Rp\u00a0' + numFmt(n);
}
/** HTML dengan simbol dan angka dalam span terpisah — tidak pernah tertindih */
function fmtHtml(n, curCode) {
  const p = fmtParts(n, curCode);
  return '<span class="amt-sym">' + esc(p.sym) + '</span>' +
         '<span class="amt-num">' + p.num + '</span>';
}
function fmtIDRHtml(n) {
  return '<span class="amt-sym">Rp</span>' +
         '<span class="amt-num">' + numFmt(n) + '</span>';
}
// Konversi amount (dalam curCur) ke IDR
function toIDR(amount) {
  const rate = (CURRENCIES[curCur] || CURRENCIES.IDR).rate;
  return Math.round(amount * rate);
}
// Konversi IDR ke curCur untuk display
function fromIDR(amountIDR) {
  const rate = (CURRENCIES[curCur] || CURRENCIES.IDR).rate;
  return rate === 1 ? amountIDR : amountIDR / rate;
}
const isNonIDR = () => curCur !== 'IDR';
function parseAmt(s) { return parseInt(String(s).replace(/\./g, ''), 10) || 0; }
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const fmtDate = iso => new Date(iso).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
const monthKey = iso => { const d = new Date(iso); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'); };
const monthLbl = k => { const [y,m] = k.split('-'); return new Date(+y,+m-1,1).toLocaleDateString('id-ID',{month:'long',year:'numeric'}); };
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const selType = () => { const el = document.querySelector('input[name="txType"]:checked'); return el ? el.value : 'expense'; };

/* ── TOAST ─────────────────────────────────────────────────── */
function toast(msg) {
  clearTimeout(toastTmr);
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  toastTmr = setTimeout(() => dom.toast.classList.remove('show'), 2800);
}

/* ── STORAGE ───────────────────────────────────────────────── */
const saveTx  = () => { try { localStorage.setItem(LS_TX,  JSON.stringify(transactions)); } catch(e) {} };
const saveCat = () => { try { localStorage.setItem(LS_CAT, JSON.stringify(customCats));   } catch(e) {} };
const saveSrt = () => { try { localStorage.setItem(LS_SRT, JSON.stringify({sort:curSort,dir:curDir})); } catch(e) {} };

function loadData() {
  try { transactions = JSON.parse(localStorage.getItem(LS_TX))  || []; } catch(e) { transactions = []; }
  try { customCats   = JSON.parse(localStorage.getItem(LS_CAT)) || []; } catch(e) { customCats = []; }
  try {
    const s = JSON.parse(localStorage.getItem(LS_SRT));
    if (s) { curSort = s.sort || 'date'; curDir = s.dir || 'desc'; }
  } catch(e) {}
  try { curCur = localStorage.getItem(LS_CUR) || 'IDR'; } catch(e) { curCur = 'IDR'; }
}

/* ── CURRENCY PICKER ───────────────────────────────────────── */

/** Parse nama mata uang menjadi bagian: flag, code, nama negara */
function parseCurName(name) {
  // Format: "🇮🇩 IDR – Rupiah Indonesia"
  const m = name.match(/^(\S+)\s+([A-Z]+)\s+[–-]\s+(.+)$/);
  if (m) return { flag: m[1], code: m[2], label: m[3] };
  return { flag: '🌐', code: name, label: name };
}

let curPickerOpen = false;

function buildCurrencyDropdown() {
  // Isi hidden select (untuk kompatibilitas)
  dom.curSel.innerHTML = '';
  Object.entries(CURRENCIES).forEach(([code, c]) => {
    const o = document.createElement('option');
    o.value = code; o.textContent = c.name;
    dom.curSel.appendChild(o);
  });
  // Render list custom picker
  renderCurList('');
}

function renderCurList(query) {
  const list   = document.getElementById('curList');
  const noRes  = document.getElementById('curNoResult');
  if (!list) return;

  const q = query.trim().toLowerCase();
  const entries = Object.entries(CURRENCIES);
  const filtered = q
    ? entries.filter(([code, c]) =>
        code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
      )
    : entries;

  list.innerHTML = '';
  if (!filtered.length) {
    noRes.hidden = false; return;
  }
  noRes.hidden = true;

  filtered.forEach(([code, c]) => {
    const p  = parseCurName(c.name);
    const li = document.createElement('li');
    li.className = 'cur-list-item' + (code === curCur ? ' selected' : '');
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', code === curCur ? 'true' : 'false');
    li.dataset.code = code;
    li.innerHTML =
      '<span class="cur-item-flag">' + p.flag + '</span>' +
      '<span class="cur-item-code">' + code + '</span>' +
      '<span class="cur-item-name">' + esc(p.label) + '</span>' +
      '<span class="cur-item-sym">' + esc(c.symbol) + '</span>';
    list.appendChild(li);
  });
}

function openCurPicker() {
  const trigger  = document.getElementById('curTrigger');
  const dropdown = document.getElementById('curDropdown');
  const input    = document.getElementById('curSearchInput');
  if (!trigger || !dropdown) return;
  curPickerOpen = true;
  trigger.classList.add('open');
  trigger.setAttribute('aria-expanded', 'true');
  dropdown.hidden = false;
  // Scroll ke item terpilih
  setTimeout(() => {
    const sel = dropdown.querySelector('.cur-list-item.selected');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
    if (input) input.focus();
  }, 50);
}

function closeCurPicker() {
  const trigger  = document.getElementById('curTrigger');
  const dropdown = document.getElementById('curDropdown');
  const input    = document.getElementById('curSearchInput');
  if (!trigger || !dropdown) return;
  curPickerOpen = false;
  trigger.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  dropdown.hidden = true;
  if (input) { input.value = ''; renderCurList(''); }
  const clearBtn = document.getElementById('curSearchClear');
  if (clearBtn) clearBtn.hidden = true;
}

function applyCurrency(code) {
  if (!CURRENCIES[code]) code = 'IDR';
  curCur = code;
  try { localStorage.setItem(LS_CUR, code); } catch(e) {}
  const sym = CURRENCIES[code].symbol;
  dom.curLbl.textContent = sym;
  dom.amtPfx.textContent = sym;
  dom.curSel.value = code;
  // Update trigger label
  const lbl = document.getElementById('curTriggerLabel');
  if (lbl) lbl.textContent = code;
  // Refresh selected state di list
  document.querySelectorAll('.cur-list-item').forEach(li => {
    const isSelected = li.dataset.code === code;
    li.classList.toggle('selected', isSelected);
    li.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });
  updateIdrPreview();
}

function initCurPicker() {
  const trigger   = document.getElementById('curTrigger');
  const dropdown  = document.getElementById('curDropdown');
  const searchInp = document.getElementById('curSearchInput');
  const clearBtn  = document.getElementById('curSearchClear');
  const list      = document.getElementById('curList');
  if (!trigger || !dropdown || !searchInp || !list) return;

  // Toggle buka/tutup
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    curPickerOpen ? closeCurPicker() : openCurPicker();
  });

  // Search input
  searchInp.addEventListener('input', function() {
    const q = this.value;
    clearBtn.hidden = !q;
    renderCurList(q);
  });

  // Clear search
  clearBtn.addEventListener('click', () => {
    searchInp.value = '';
    clearBtn.hidden = true;
    renderCurList('');
    searchInp.focus();
  });

  // Pilih mata uang dari list
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.cur-list-item');
    if (!item) return;
    applyCurrency(item.dataset.code);
    closeCurPicker();
    renderAll();
    toast('💱 Mata uang diubah ke ' + item.dataset.code);
  });

  // Keyboard navigation
  searchInp.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCurPicker(); trigger.focus(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = list.querySelector('.cur-list-item');
      if (first) first.focus();
    }
  });
  list.addEventListener('keydown', (e) => {
    const items = [...list.querySelectorAll('.cur-list-item')];
    const idx   = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[idx + 1]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); idx > 0 ? items[idx - 1].focus() : searchInp.focus(); }
    if (e.key === 'Enter' && idx >= 0) { items[idx].click(); }
    if (e.key === 'Escape') { closeCurPicker(); trigger.focus(); }
  });
  // Buat item list bisa difokus
  list.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.cur-list-item');
    if (item) item.setAttribute('tabindex', '0');
  });

  // Tutup saat klik di luar
  document.addEventListener('click', (e) => {
    if (curPickerOpen && !document.getElementById('curPicker').contains(e.target)) {
      closeCurPicker();
    }
  });
}

/* ── IDR PREVIEW (live saat mengetik) ──────────────────────── */
function updateIdrPreview() {
  if (!isNonIDR()) { dom.idrPrev.hidden = true; return; }
  const raw = parseAmt(dom.itemAmount.value);
  if (!raw) { dom.idrPrev.hidden = true; return; }
  dom.idrPrevTxt.textContent = '≈ ' + fmtIDR(toIDR(raw));
  dom.idrPrev.hidden = false;
}

/* ── THEME ─────────────────────────────────────────────────── */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  dom.themeIco.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  try { localStorage.setItem(LS_THM, t); } catch(e) {}
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
  renderChart();
}

/* ── INPUT MASK (format titik ribuan) ──────────────────────── */
function initMask() {
  dom.itemAmount.addEventListener('input', function() {
    const pos = this.selectionStart;
    const before = this.value.length;
    const raw = this.value.replace(/\D/g, '');
    const formatted = raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    this.value = formatted;
    const diff = formatted.length - before;
    const newPos = Math.max(0, pos + diff);
    try { this.setSelectionRange(newPos, newPos); } catch(e) {}
    updateIdrPreview();
  });
}

/* ── TYPE TOGGLE ───────────────────────────────────────────── */
function syncType() {
  const t = selType();
  const eL = document.querySelector('label[for="typeExpense"]');
  const iL = document.querySelector('label[for="typeIncome"]');
  if (!eL || !iL) return;
  if (t === 'expense') {
    eL.className = 'type-btn type-btn--expense sel-expense';
    iL.className = 'type-btn type-btn--income';
  } else {
    eL.className = 'type-btn type-btn--expense';
    iL.className = 'type-btn type-btn--income sel-income';
  }
  dom.addBtnTxt.textContent = t === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
  dom.addBtn.classList.toggle('income-mode', t === 'income');
}

/* ── CATEGORY ──────────────────────────────────────────────── */
function rebuildCatDrop() {
  const all = [...DEFAULT_CATS, ...customCats];
  const cur = dom.itemCat.value;
  dom.itemCat.innerHTML = '<option value="">-- Pilih Kategori --</option>';
  all.forEach(c => {
    const o = document.createElement('option');
    o.value = c;
    o.textContent = catIcon(c) + ' ' + c;
    dom.itemCat.appendChild(o);
  });
  if (all.includes(cur)) dom.itemCat.value = cur;
}

function renderCatTags() {
  dom.catTags.innerHTML = '';
  customCats.forEach(c => {
    const t = document.createElement('span');
    t.className = 'cat-tag';
    t.innerHTML = catIcon(c) + ' ' + esc(c) +
      '<button data-cat="' + esc(c) + '" title="Hapus kategori" aria-label="Hapus kategori ' + esc(c) + '">' +
      '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';
    dom.catTags.appendChild(t);
  });
}

function addCat() {
  const v = dom.newCat.value.trim();
  dom.catErr.textContent = '';
  if (!v) { dom.catErr.textContent = 'Nama tidak boleh kosong.'; dom.newCat.focus(); return; }
  if (v.length > 30) { dom.catErr.textContent = 'Maks 30 karakter.'; return; }
  const all = [...DEFAULT_CATS, ...customCats];
  if (all.some(c => c.toLowerCase() === v.toLowerCase())) {
    dom.catErr.textContent = 'Kategori sudah ada.'; dom.newCat.focus(); return;
  }
  customCats.push(v);
  saveCat(); rebuildCatDrop(); renderCatTags();
  dom.newCat.value = '';
  toast('✅ Kategori "' + v + '" ditambahkan');
}

function removeCat(c) {
  const used = transactions.some(t => t.category === c);
  customCats = customCats.filter(x => x !== c);
  saveCat(); rebuildCatDrop(); renderCatTags();
  toast('🗑️ "' + c + '" dihapus' + (used ? ' (transaksi lama tetap ada)' : ''));
}

/* ── MONTH FILTER ──────────────────────────────────────────── */
function rebuildMonths() {
  const months = [...new Set(transactions.map(t => monthKey(t.date)))].sort().reverse();
  const prev = dom.monthSel.value;
  dom.monthSel.innerHTML = '<option value="all">Semua Bulan</option>';
  months.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = monthLbl(m);
    dom.monthSel.appendChild(o);
  });
  if (months.includes(prev)) { dom.monthSel.value = prev; curMonth = prev; }
  else { dom.monthSel.value = 'all'; curMonth = 'all'; }
}

const getFiltered = () => curMonth === 'all'
  ? transactions
  : transactions.filter(t => monthKey(t.date) === curMonth);

function updateBadge() {
  if (curMonth === 'all') { dom.monthBadge.hidden = true; return; }
  const f = getFiltered();
  // Badge dihitung dalam IDR (amountInIDR tersimpan), lalu konversi ke curCur
  const incIDR = f.filter(t => t.type === 'income').reduce((s, t) => s + (t.amountInIDR || t.amount), 0);
  const expIDR = f.filter(t => t.type !== 'income').reduce((s, t) => s + (t.amountInIDR || t.amount), 0);
  const netIDR = incIDR - expIDR;
  const netDisplay = curCur === 'IDR' ? netIDR : netIDR / CURRENCIES[curCur].rate;
  dom.monthBadge.textContent = monthLbl(curMonth) + ': ' + (netIDR >= 0 ? '+' : '') + fmt(netDisplay);
  dom.monthBadge.hidden = false;
}

/* ── SORT ──────────────────────────────────────────────────── */
function sorted(list) {
  const cp = [...list], d = curDir === 'asc' ? 1 : -1;
  switch (curSort) {
    case 'name':     return cp.sort((a,b) => d * a.name.localeCompare(b.name, 'id'));
    case 'amount':   return cp.sort((a,b) => d * ((a.amountInIDR||a.amount) - (b.amountInIDR||b.amount)));
    case 'category': return cp.sort((a,b) => d * a.category.localeCompare(b.category, 'id'));
    default:         return cp.sort((a,b) => d * (new Date(b.date) - new Date(a.date)));
  }
}

function syncSortBtns() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    const active = btn.dataset.sort === curSort;
    btn.classList.toggle('active', active);
    let ico = btn.querySelector('.dir-icon');
    if (!ico) {
      ico = document.createElement('i');
      ico.className = 'fa-solid fa-arrow-up dir-icon';
      ico.setAttribute('aria-hidden', 'true');
      btn.appendChild(ico);
    }
    ico.style.display = active ? 'inline-block' : 'none';
    ico.style.transform = (active && curDir === 'desc') ? 'rotate(180deg)' : 'rotate(0deg)';
    ico.style.transition = 'transform .25s ease';
  });
}

/* ── RENDER BALANCE ────────────────────────────────────────── */
function renderBalance() {
  const f = getFiltered();
  // Semua kalkulasi dalam IDR (amountInIDR)
  const incIDR = f.filter(t => t.type === 'income').reduce((s, t) => s + (t.amountInIDR || t.amount), 0);
  const expIDR = f.filter(t => t.type !== 'income').reduce((s, t) => s + (t.amountInIDR || t.amount), 0);
  const netIDR = incIDR - expIDR;

  // Konversi ke mata uang pilihan untuk display
  const rate = CURRENCIES[curCur].rate;
  const netDisplay = curCur === 'IDR' ? netIDR : netIDR / rate;
  const incDisplay = curCur === 'IDR' ? incIDR : incIDR / rate;
  const expDisplay = curCur === 'IDR' ? expIDR : expIDR / rate;

  dom.totalBal.textContent = fmt(netDisplay);
  dom.totalBal.classList.toggle('negative', netIDR < 0);
  dom.balSub.textContent = netIDR >= 0 ? 'Saldo positif ✓' : 'Defisit — pengeluaran melebihi pemasukan';

  if (isNonIDR()) {
    dom.balIdr.textContent = '≈ ' + fmtIDR(netIDR);
    dom.balIdr.hidden = false;
  } else {
    dom.balIdr.hidden = true;
  }

  // Gunakan innerHTML agar simbol dan angka terpisah di stats
  dom.totalInc.innerHTML = fmtHtml(incDisplay);
  dom.totalExp.innerHTML = fmtHtml(expDisplay);
  dom.txCount.textContent  = f.length;

  dom.totalBal.classList.remove('pop');
  void dom.totalBal.offsetWidth;
  dom.totalBal.classList.add('pop');

  dom.clearBtn.style.display = transactions.length > 0 ? 'flex' : 'none';
}

/* ── RENDER TRANSACTIONS ───────────────────────────────────── */
function renderTx() {
  const list = sorted(getFiltered());
  dom.txList.innerHTML = '';

  if (!list.length) {
    dom.empty.classList.add('visible');
    dom.empty.setAttribute('aria-hidden', 'false');
    return;
  }
  dom.empty.classList.remove('visible');
  dom.empty.setAttribute('aria-hidden', 'true');

  const frag = document.createDocumentFragment();
  list.forEach(tx => {
    const isInc    = tx.type === 'income';
    const txCur    = tx.currency || 'IDR';
    const txCurObj = CURRENCIES[txCur] || CURRENCIES.IDR;
    const amtInIDR = tx.amountInIDR || tx.amount;
    const isHigh   = !isInc && amtInIDR > HIGH_AMT_IDR;

    const item = document.createElement('div');
    item.className = 'tx-item' +
      (isInc ? ' tx-income' : ' tx-expense') +
      (isHigh ? ' high-amt' : '');
    item.dataset.id = tx.id;
    item.setAttribute('role', 'listitem');

    const warnHtml = isHigh
      ? '<i class="fa-solid fa-triangle-exclamation warn-i" title="Pengeluaran besar" aria-hidden="true"></i>'
      : '';
    const sign      = isInc ? '+' : '-';
    const amtClass  = isInc ? 'income' : 'expense';
    const badgeTxt  = isInc ? '➕ Pemasukan' : '➖ Pengeluaran';
    const iconClass = isInc ? 'ic-income' : 'ic-expense';

    // Nominal: simbol dan angka dalam span terpisah agar tidak tertindih
    const amtHtml =
      '<span class="tx-amount ' + amtClass + '">' +
        '<span class="amt-sign">' + sign + '</span>' +
        '<span class="amt-sym">' + esc(txCurObj.symbol) + '</span>' +
        '<span class="amt-num">' + numFmt(tx.amount) + '</span>' +
      '</span>';

    // Baris IDR di bawah nominal (hanya jika mata uang transaksi bukan IDR)
    const idrRow = txCur !== 'IDR'
      ? '<div class="tx-idr">' +
          '<span class="amt-sym">≈ Rp</span>' +
          '<span class="amt-num">' + numFmt(amtInIDR) + '</span>' +
        '</div>'
      : '';

    item.innerHTML =
      '<div class="tx-icon ' + iconClass + '" aria-hidden="true">' + catIcon(tx.category) + '</div>' +
      '<div class="tx-body">' +
        '<div class="tx-name">' + esc(tx.name) + warnHtml + '</div>' +
        '<div class="tx-meta">' +
          '<span class="tx-cat">' + esc(tx.category) + '</span>' +
          '<span class="tx-badge ' + amtClass + '">' + badgeTxt + '</span>' +
          '<span class="tx-date">' + fmtDate(tx.date) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="tx-amount-col">' +
        amtHtml +
        idrRow +
        '<button class="btn-del" data-id="' + tx.id + '" title="Hapus transaksi" aria-label="Hapus ' + esc(tx.name) + '">' +
          '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>' +
        '</button>' +
      '</div>';

    frag.appendChild(item);
  });
  dom.txList.appendChild(frag);
}

/* ── RENDER CHART ──────────────────────────────────────────── */
function renderChart() {
  const expenses = getFiltered().filter(t => t.type !== 'income');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#a5a3d4' : '#4c4a7a';

  // Destroy existing chart
  if (chart) { try { chart.destroy(); } catch(e) {} chart = null; }

  if (!expenses.length) {
    dom.chartEmpty.classList.remove('hidden');
    dom.chartLeg.innerHTML = '';
    return;
  }
  dom.chartEmpty.classList.add('hidden');

  // Aggregate by category (in IDR)
  const catMap = {};
  expenses.forEach(t => {
    const idr = t.amountInIDR || t.amount;
    catMap[t.category] = (catMap[t.category] || 0) + idr;
  });
  const labels = Object.keys(catMap);
  const data   = Object.values(catMap);
  const colors = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  const ctx = dom.chartCvs.getContext('2d');
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const val = ctx.parsed;
              const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
              const pct = total ? ((val/total)*100).toFixed(1) : 0;
              return ' ' + fmtIDR(val) + ' (' + pct + '%)';
            },
          },
          backgroundColor: isDark ? 'rgba(30,27,75,0.95)' : 'rgba(255,255,255,0.95)',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.2)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      animation: { animateRotate: true, duration: 600 },
    },
  });

  // Custom legend
  dom.chartLeg.innerHTML = '';
  labels.forEach((lbl, i) => {
    const li = document.createElement('div');
    li.className = 'legend-item';
    li.innerHTML =
      '<span class="legend-dot" style="background:' + colors[i] + '"></span>' +
      esc(catIcon(lbl)) + ' ' + esc(lbl);
    dom.chartLeg.appendChild(li);
  });
}

/* ── FULL RENDER (semua komponen) ──────────────────────────── */
function renderAll() {
  renderBalance();
  renderTx();
  renderChart();
  updateBadge();
  syncSortBtns();
}

/* ── FORM VALIDATION ───────────────────────────────────────── */
function clearErrors() {
  dom.nameErr.textContent = '';
  dom.amtErr.textContent  = '';
  dom.catErr2.textContent = '';
  dom.itemName.classList.remove('error');
  dom.itemAmount.classList.remove('error');
  dom.itemCat.classList.remove('error');
}

function validateForm() {
  clearErrors();
  let valid = true;
  const name = dom.itemName.value.trim();
  const amt  = parseAmt(dom.itemAmount.value);
  const cat  = dom.itemCat.value;

  if (!name) {
    dom.nameErr.textContent = 'Nama item wajib diisi.';
    dom.itemName.classList.add('error');
    valid = false;
  }
  if (!amt || amt <= 0) {
    dom.amtErr.textContent = 'Jumlah harus lebih dari 0.';
    dom.itemAmount.classList.add('error');
    valid = false;
  }
  if (!cat) {
    dom.catErr2.textContent = 'Pilih kategori terlebih dahulu.';
    dom.itemCat.classList.add('error');
    valid = false;
  }
  return valid;
}

/* ── ADD TRANSACTION ───────────────────────────────────────── */
function addTransaction(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const name   = dom.itemName.value.trim();
  const amount = parseAmt(dom.itemAmount.value);
  const cat    = dom.itemCat.value;
  const type   = selType();
  const amtInIDR = toIDR(amount);

  const tx = {
    id:         genId(),
    name,
    amount,           // nilai asli dalam mata uang saat input
    currency:   curCur,
    amountInIDR: amtInIDR,
    category:   cat,
    type,
    date:       new Date().toISOString(),
  };

  transactions.unshift(tx);
  saveTx();
  rebuildMonths();
  renderAll();

  // Reset form
  dom.itemName.value   = '';
  dom.itemAmount.value = '';
  dom.itemCat.value    = '';
  dom.idrPrev.hidden   = true;
  clearErrors();

  const sign = type === 'income' ? '+' : '-';
  const sym  = CURRENCIES[curCur].symbol;
  toast((type === 'income' ? '✅' : '💸') + ' ' + name + ' ' + sign + sym + '\u00a0' + numFmt(amount) + ' ditambahkan');
}

/* ── DELETE TRANSACTION ────────────────────────────────────── */
function deleteTransaction(id) {
  const item = dom.txList.querySelector('[data-id="' + id + '"]');
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      transactions = transactions.filter(t => t.id !== id);
      saveTx();
      rebuildMonths();
      renderAll();
      toast('🗑️ Transaksi dihapus');
    }, 350);
  } else {
    transactions = transactions.filter(t => t.id !== id);
    saveTx();
    rebuildMonths();
    renderAll();
  }
}

/* ── CLEAR ALL ─────────────────────────────────────────────── */
function clearAll() {
  transactions = [];
  saveTx();
  rebuildMonths();
  curMonth = 'all';
  dom.monthSel.value = 'all';
  renderAll();
  toast('🗑️ Semua transaksi dihapus');
}

/* ── EVENT LISTENERS ───────────────────────────────────────── */
function initEvents() {
  // Form submit
  dom.form.addEventListener('submit', addTransaction);

  // Type toggle
  document.querySelectorAll('input[name="txType"]').forEach(r => {
    r.addEventListener('change', syncType);
  });

  // Currency change (hidden select — fallback, tidak dipakai langsung)
  // Picker custom dihandle oleh initCurPicker()

  // Theme toggle
  dom.themeBtn.addEventListener('click', toggleTheme);

  // Month filter
  dom.monthSel.addEventListener('change', function() {
    curMonth = this.value;
    renderAll();
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const s = this.dataset.sort;
      if (curSort === s) {
        curDir = curDir === 'asc' ? 'desc' : 'asc';
      } else {
        curSort = s;
        curDir = s === 'date' ? 'desc' : 'asc';
      }
      saveSrt();
      renderTx();
      syncSortBtns();
    });
  });

  // Delete transaction (event delegation)
  dom.txList.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-del');
    if (btn && btn.dataset.id) deleteTransaction(btn.dataset.id);
  });

  // Add custom category
  dom.addCatBtn.addEventListener('click', addCat);
  dom.newCat.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addCat(); }
  });

  // Remove custom category (event delegation)
  dom.catTags.addEventListener('click', function(e) {
    const btn = e.target.closest('button[data-cat]');
    if (btn) removeCat(btn.dataset.cat);
  });

  // Clear all button → open modal
  dom.clearBtn.addEventListener('click', () => {
    dom.modalOv.classList.add('open');
    dom.modalYes.focus();
  });

  // Modal cancel
  dom.modalNo.addEventListener('click', () => dom.modalOv.classList.remove('open'));

  // Modal confirm
  dom.modalYes.addEventListener('click', () => {
    dom.modalOv.classList.remove('open');
    clearAll();
  });

  // Close modal on overlay click
  dom.modalOv.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });

  // Close modal on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dom.modalOv.classList.contains('open')) {
      dom.modalOv.classList.remove('open');
    }
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
function init() {
  cacheDom();
  loadData();

  // Apply saved theme
  const savedTheme = localStorage.getItem(LS_THM) || 'light';
  applyTheme(savedTheme);

  // Build currency dropdown & apply saved currency
  buildCurrencyDropdown();
  applyCurrency(curCur);
  initCurPicker();

  // Build category dropdown & tags
  rebuildCatDrop();
  renderCatTags();

  // Build month filter
  rebuildMonths();

  // Sync type toggle UI
  syncType();

  // Init input mask
  initMask();

  // Attach all events
  initEvents();

  // Initial render
  renderAll();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
