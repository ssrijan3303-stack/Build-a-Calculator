import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

interface ProjectPreviewConfig {
  filename: string;
  url: string;
  brandName: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  darkBg: string;
  category: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  items: Array<{
    title: string;
    subtitle: string;
    tag: string;
    price?: string;
    rating?: string;
    iconType: string;
  }>;
  stats: Array<{ label: string; value: string }>;
}

const projects: ProjectPreviewConfig[] = [
  {
    filename: 'ecommerce.svg',
    url: 'https://bharatcart.srijantech.in',
    brandName: 'BharatCart',
    tagline: 'India\'s Premium Tech & Lifestyle Store',
    themeColor: '#0ea5e9',
    accentColor: '#38bdf8',
    darkBg: '#0b1120',
    category: 'E-Commerce Website',
    heroBadge: 'FESTIVAL OF SAVINGS • UP TO 45% OFF',
    heroHeadline: 'Next-Gen Wireless Audio & Smart Wearables',
    heroSubheadline: 'Experience studio-grade acoustic depth and all-day battery endurance. Free expedited shipping across India with instant UPI discount.',
    ctaText: 'Shop New Arrivals',
    items: [
      { title: 'Acoustic Pro X Wireless', subtitle: 'Active Noise Cancelling 42dB', tag: 'Best Seller', price: '₹2,499', rating: '4.9 ★', iconType: 'audio' },
      { title: 'Vanguard Neo Smartwatch', subtitle: '1.43" AMOLED • SpO2 • Bluetooth Calling', tag: 'Trending', price: '₹3,799', rating: '4.8 ★', iconType: 'watch' },
      { title: 'Titan Mechanical Keypad', subtitle: 'Hot-swappable RGB Custom Switches', tag: 'Pro Gear', price: '₹4,199', rating: '4.9 ★', iconType: 'keyboard' },
      { title: 'MagCharge 65W GaN Charger', subtitle: 'Ultra-compact Fast Charger (3-Port)', tag: 'Essential', price: '₹1,299', rating: '4.7 ★', iconType: 'charger' },
    ],
    stats: [
      { label: 'Active Products', value: '12,500+' },
      { label: 'Happy Customers', value: '45,000+' },
      { label: 'Delivery Cities', value: '250+' },
    ]
  },
  {
    filename: 'restaurant.svg',
    url: 'https://zaikaroyal.srijantech.in',
    brandName: 'Zaika Royal Dining',
    tagline: 'Authentic Mughlai & Awadhi Culinary Artistry',
    themeColor: '#f59e0b',
    accentColor: '#fbbf24',
    darkBg: '#180f08',
    category: 'Restaurant Website',
    heroBadge: 'MICHELIN RECOMMENDED • CHEF\'S TABLE',
    heroHeadline: 'A Royal Symphony of Flavours in Varanasi',
    heroSubheadline: 'Slow-cooked Dum Biryani, fragrant Galouti kebabs, and handcrafted clay-pot curries crafted over generations of ancestral recipes.',
    ctaText: 'Reserve Table Online',
    items: [
      { title: 'Dum Gosht Awadhi Biryani', subtitle: '24-hour marinated tender cuts in basmati', tag: 'Chef Special', price: '₹580', rating: '4.9 ★', iconType: 'food' },
      { title: 'Dal Zaika-e-Khas', subtitle: 'Slow-simmered black lentils with churned butter', tag: 'Signature', price: '₹390', rating: '4.9 ★', iconType: 'food' },
      { title: 'Paneer Tikka Angara', subtitle: 'Clay-oven smoked cottage cheese with herbs', tag: 'Starters', price: '₹420', rating: '4.8 ★', iconType: 'food' },
      { title: 'Shahi Kesar Tukda', subtitle: 'Crispy brioche soaked in saffron cardamom rabri', tag: 'Dessert', price: '₹260', rating: '5.0 ★', iconType: 'food' },
    ],
    stats: [
      { label: 'Daily Covers', value: '350+' },
      { label: 'Authentic Dishes', value: '80+' },
      { label: 'Customer Rating', value: '4.9 ★' },
    ]
  },
  {
    filename: 'gym.svg',
    url: 'https://ironfit.srijantech.in',
    brandName: 'IronFit Studio',
    tagline: 'High Performance Crossfit & Strength Arena',
    themeColor: '#ef4444',
    accentColor: '#f87171',
    darkBg: '#0f0f11',
    category: 'Gym & Fitness Website',
    heroBadge: 'STATE-OF-THE-ART EQUIPMENT • CERTIFIED COACHES',
    heroHeadline: 'Forge Your Strength. Redefine Limits.',
    heroSubheadline: '10,000 sq.ft elite training facility featuring Olympic lifting platforms, HIIT conditioning turf, biometric body scanners, and nutrition guidance.',
    ctaText: 'Claim 3-Day Free Pass',
    items: [
      { title: 'Olympic Strength Zone', subtitle: 'Eleiko calibrated plates & competition bars', tag: 'Heavy Iron', price: '₹1,800/mo', rating: '4.9 ★', iconType: 'gym' },
      { title: 'HIIT Conditioning Turf', subtitle: 'Sled pushes, battle ropes & assault bikes', tag: 'Endurance', price: '₹2,200/mo', rating: '4.8 ★', iconType: 'gym' },
      { title: 'Personal Athletic Coaching', subtitle: '1-on-1 customized biomechanics & diet', tag: 'Elite', price: '₹5,500/mo', rating: '5.0 ★', iconType: 'gym' },
      { title: 'Recovery Sauna & Ice Plunge', subtitle: 'Contrast therapy for accelerated repair', tag: 'Wellness', price: 'Included', rating: '4.9 ★', iconType: 'gym' },
    ],
    stats: [
      { label: 'Active Members', value: '1,200+' },
      { label: 'Certified Trainers', value: '18' },
      { label: 'Transformation Rate', value: '96%' },
    ]
  },
  {
    filename: 'hospital.svg',
    url: 'https://kashicare.srijantech.in',
    brandName: 'Kashi Care Hospital',
    tagline: 'Multi-Speciality Tertiary Care & Trauma Center',
    themeColor: '#10b981',
    accentColor: '#34d399',
    darkBg: '#061a14',
    category: 'Hospital Website',
    heroBadge: '24x7 EMERGENCY & CARDIAC TRAUMA CARE',
    heroHeadline: 'Compassionate Medicine, Advanced Clinical Science',
    heroSubheadline: 'NABH-accredited 250-bed hospital in Varanasi providing world-class cardiology, neurology, orthopedics, and pediatric intensive care with cashless TPA support.',
    ctaText: 'Book Doctor Appointment',
    items: [
      { title: 'Advanced Cardiology Wing', subtitle: 'Cardiac Cath Lab & non-invasive diagnostic', tag: 'NABH Accredited', price: 'OPD ₹600', rating: '4.9 ★', iconType: 'health' },
      { title: 'Joint Replacement & Spine', subtitle: 'Minimally invasive computer-navigated surgery', tag: 'Orthopedics', price: 'OPD ₹600', rating: '4.8 ★', iconType: 'health' },
      { title: 'Critical Care ICU & NICU', subtitle: 'Level-3 life support with 1:1 nurse ratio', tag: '24x7 Ready', price: 'Cashless', rating: '5.0 ★', iconType: 'health' },
      { title: 'Full Diagnostic Pathology', subtitle: 'Automated biometrics & instant online reports', tag: 'In-house Lab', price: 'Doorstep', rating: '4.9 ★', iconType: 'health' },
    ],
    stats: [
      { label: 'Specialist Doctors', value: '45+' },
      { label: 'ICU Beds', value: '40' },
      { label: 'Patients Treated', value: '150k+' },
    ]
  },
  {
    filename: 'realestate.svg',
    url: 'https://primelands.srijantech.in',
    brandName: 'PrimeLands Luxury',
    tagline: 'Villas, Gated Penthouses & Commercial Spaces',
    themeColor: '#d97706',
    accentColor: '#f59e0b',
    darkBg: '#14120f',
    category: 'Real Estate Website',
    heroBadge: 'RERA REGISTERED • EXCLUSIVE RIVERFRONT PROPERTIES',
    heroHeadline: 'Find Your Sanctuary Along the Heritage Belt',
    heroSubheadline: 'Discover bespoke 3 & 4 BHK luxury residences and green villa communities with clubhouses, infinity pools, and round-the-clock gated security in Varanasi.',
    ctaText: 'Schedule VIP Site Visit',
    items: [
      { title: 'The Grand Riverine Villas', subtitle: '4 BHK Independent Gated Luxury Villas', tag: 'Ready to Move', price: '₹1.85 Cr', rating: 'RERA Cert', iconType: 'building' },
      { title: 'Kashi Heights Penthouses', subtitle: '3 BHK Sky Residences with Panoramic Deck', tag: 'Under Constr.', price: '₹92 Lakhs', rating: 'Phase 1', iconType: 'building' },
      { title: 'Prime Square Commercial', subtitle: 'High-footfall retail storefronts & modern offices', tag: 'High ROI', price: '₹45 Lakhs', rating: 'Grade A', iconType: 'building' },
      { title: 'Green Meadows Plots', subtitle: 'Freehold residential plots in gated township', tag: 'Bank Approved', price: '₹28 Lakhs', rating: 'Clear Title', iconType: 'building' },
    ],
    stats: [
      { label: 'Units Delivered', value: '850+' },
      { label: 'Projects Completed', value: '14' },
      { label: 'Average Appreciation', value: '14.2% p.a.' },
    ]
  },
  {
    filename: 'hotel.svg',
    url: 'https://gangaheritage.srijantech.in',
    brandName: 'Ganga Heritage Residency',
    tagline: 'Boutique Riverview Suites & Modern Student PGs',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    darkBg: '#09131d',
    category: 'Hotel / PG Website',
    heroBadge: 'DIRECT GHAT VIEW • FREE HIGH-SPEED WI-FI',
    heroHeadline: 'Serene Heritage Living with Modern Comfort',
    heroSubheadline: 'Wake up to morning chants and sunset boat aartis. Clean sanitised rooms, hygienic vegetarian mess, 24/7 power backup, and dedicated study zones.',
    ctaText: 'Check Room Availability',
    items: [
      { title: 'Royal Riverview Suite', subtitle: 'Private balcony overlooking Ganga Aarti Ghats', tag: 'Hotel Deluxe', price: '₹3,499/nt', rating: '4.9 ★', iconType: 'hotel' },
      { title: 'Heritage Superior King', subtitle: 'Teakwood furniture, AC, complimentary breakfast', tag: 'Hotel Classic', price: '₹2,499/nt', rating: '4.8 ★', iconType: 'hotel' },
      { title: 'Scholar Executive PG Room', subtitle: 'Single AC room, 3 meals, laundry, fiber Wi-Fi', tag: 'PG Monthly', price: '₹8,500/mo', rating: 'Student Choice', iconType: 'hotel' },
      { title: 'Twin Sharing Scholar Pod', subtitle: 'Spacious attached bath, study desks, RO water', tag: 'PG Budget', price: '₹5,500/mo', rating: 'Safe & Secure', iconType: 'hotel' },
    ],
    stats: [
      { label: 'Hotel Rooms', value: '28' },
      { label: 'PG Residents', value: '120+' },
      { label: 'Guest Rating', value: '4.9 / 5' },
    ]
  },
  {
    filename: 'school.svg',
    url: 'https://gyanacademy.srijantech.in',
    brandName: 'Gyan Academy Portal',
    tagline: 'CBSE Affiliated K-12 Progressive Learning',
    themeColor: '#6366f1',
    accentColor: '#818cf8',
    darkBg: '#0f1124',
    category: 'School Management Portal',
    heroBadge: 'ADMISSIONS OPEN FOR SESSION 2025-26',
    heroHeadline: 'Nurturing Intellect, Ethics & Modern Creativity',
    heroSubheadline: 'Smart digital classrooms, robotics & AI innovation lab, Olympic-size athletic grounds, and real-time parent mobile notifications for attendance and report cards.',
    ctaText: 'Apply for Admission',
    items: [
      { title: 'Online Fee Payment (UPI)', subtitle: 'Instant receipt generation & term tracking', tag: 'Parent Portal', price: 'Zero Fee', rating: 'Instant', iconType: 'school' },
      { title: 'Student Attendance & GPS', subtitle: 'Live bus tracking & automated SMS check-in', tag: 'Safety First', price: 'Live App', rating: 'Realtime', iconType: 'school' },
      { title: 'STEM & Robotics Lab', subtitle: 'Hands-on coding, 3D printing & space science', tag: 'Academics', price: 'K-12', rating: 'Grade A+', iconType: 'school' },
      { title: 'Digital Exam & Report Cards', subtitle: 'Comprehensive continuous evaluation metrics', tag: 'CBSE Pattern', price: 'Cloud Synced', rating: 'Paperless', iconType: 'school' },
    ],
    stats: [
      { label: 'Students Enrolled', value: '2,400+' },
      { label: 'Faculty Members', value: '95' },
      { label: 'Board Exam Pass', value: '100%' },
    ]
  },
  {
    filename: 'travel.svg',
    url: 'https://varanasivoyages.srijantech.in',
    brandName: 'Varanasi Voyages',
    tagline: 'Spiritual Tours, Heritage Walks & Boat Safaris',
    themeColor: '#ea580c',
    accentColor: '#fb923c',
    darkBg: '#1c1009',
    category: 'Travel & Tourism Website',
    heroBadge: 'GOVERNMENT LICENSED GUIDES • ECO BOATS',
    heroHeadline: 'Immerse in the Eternal Mystique of Kashi',
    heroSubheadline: 'Handcrafted spiritual itineraries, sunrise bajra wooden boat rides, evening Dashashwamedh VIP Aarti seats, and historical temple trail excursions.',
    ctaText: 'Explore Guided Packages',
    items: [
      { title: 'Subah-e-Banaras Boat Tour', subtitle: '2-hour sunrise row through 84 historical ghats', tag: 'Top Rated', price: '₹699', rating: '4.9 ★', iconType: 'travel' },
      { title: 'VIP Ganga Aarti Deck Seat', subtitle: 'Front-row wooden bajra platform with prasad', tag: 'Exclusive', price: '₹450', rating: '5.0 ★', iconType: 'travel' },
      { title: 'Kashi Vishwanath & Alley Trail', subtitle: 'Certified heritage walk through ancient lanes', tag: 'Cultural Walk', price: '₹799', rating: '4.8 ★', iconType: 'travel' },
      { title: 'Kashi-Ayodhya-Prayag Circuit', subtitle: '3-Day private luxury sedan pilgrim journey', tag: 'Full Circuit', price: '₹6,499', rating: 'Customizable', iconType: 'travel' },
    ],
    stats: [
      { label: 'Tours Conducted', value: '8,200+' },
      { label: 'Guest Nationalities', value: '42' },
      { label: 'TripAdvisor Rating', value: '5.0 ★' },
    ]
  },
  {
    filename: 'grocery.svg',
    url: 'https://quickbazaar.srijantech.in',
    brandName: 'QuickBazaar Express',
    tagline: '15-Minute Farm Fresh Groceries & Daily Needs',
    themeColor: '#16a34a',
    accentColor: '#4ade80',
    darkBg: '#09190e',
    category: 'Grocery Delivery Website',
    heroBadge: 'LIGHTNING FAST • FREE DELIVERY OVER ₹199',
    heroHeadline: 'Farm Fresh Produce at Your Door in 15 Mins',
    heroSubheadline: 'Locally sourced organic vegetables, farm milk, bakery breads, household supplies, and pantry staples delivered with temperature-controlled speed.',
    ctaText: 'Order Fresh Groceries',
    items: [
      { title: 'Farm Fresh Vegetable Basket', subtitle: 'Tomatoes, potatoes, spinach, coriander (4kg)', tag: 'Organic', price: '₹149', rating: 'Fresh Harvest', iconType: 'grocery' },
      { title: 'Pure Dairy Cow Milk & Ghee', subtitle: 'A2 unadulterated cold-chain milk (1L + 500g)', tag: 'Pure Dairy', price: '₹340', rating: '4.9 ★', iconType: 'grocery' },
      { title: 'Organic Whole Grain Atta (5kg)', subtitle: 'Stone-ground wheat with natural bran intact', tag: 'Pantry Staple', price: '₹225', rating: '4.8 ★', iconType: 'grocery' },
      { title: 'Dry Fruits & Kashmiri Nuts Mix', subtitle: 'Almonds, cashews, raisins, walnuts (500g)', tag: 'Immunity', price: '₹499', rating: '4.9 ★', iconType: 'grocery' },
    ],
    stats: [
      { label: 'Daily Orders', value: '3,800+' },
      { label: 'Average Delivery', value: '14 Mins' },
      { label: 'Freshness Guarantee', value: '100%' },
    ]
  },
  {
    filename: 'salon.svg',
    url: 'https://auraluxe.srijantech.in',
    brandName: 'Aura Luxe Salon',
    tagline: 'Bespoke Hair, Bridal Makeup & Ayurvedic Spa',
    themeColor: '#d946ef',
    accentColor: '#f472b6',
    darkBg: '#1f0d22',
    category: 'Salon & Spa Website',
    heroBadge: 'PREMIUM DERMAT & STYLIST CARE • LUXURY SUITES',
    heroHeadline: 'Indulge in Elevated Grooming & Deep Wellness',
    heroSubheadline: 'Signature keratin therapy, botanical hair spas, bridal makeup artistry, and authentic Ayurvedic Panchakarma massages tailored for complete relaxation.',
    ctaText: 'Book Spa Slot Online',
    items: [
      { title: 'Royal Bridal Glow Artistry', subtitle: 'HD airbrush makeup, hair styling & saree drape', tag: 'Bridal Package', price: '₹14,999', rating: '5.0 ★', iconType: 'beauty' },
      { title: 'Botanical Keratin Infusion', subtitle: 'Zero formaldehyde deep smoothing protein mask', tag: 'Hair Studio', price: '₹3,499', rating: '4.9 ★', iconType: 'beauty' },
      { title: 'Ayurvedic Abhyanga Massage', subtitle: '60-min herbal warm oil stress relief therapy', tag: 'Wellness Spa', price: '₹1,899', rating: '4.9 ★', iconType: 'beauty' },
      { title: 'Oxygen Detan & Glow Facial', subtitle: 'Deep pore extraction and hyaluronic boost', tag: 'Skin Care', price: '₹1,299', rating: '4.8 ★', iconType: 'beauty' },
    ],
    stats: [
      { label: 'Bridal Transformations', value: '450+' },
      { label: 'Certified Stylists', value: '12' },
      { label: 'Client Satisfaction', value: '99.4%' },
    ]
  },
  {
    filename: 'automobile.svg',
    url: 'https://speedwheels.srijantech.in',
    brandName: 'SpeedWheels Motor Hub',
    tagline: 'Certified Pre-Owned Luxury & Multi-Brand Cars',
    themeColor: '#2563eb',
    accentColor: '#60a5fa',
    darkBg: '#0b1324',
    category: 'Car / Automobile Website',
    heroBadge: '200-POINT INSPECTION • 1-YEAR WARRANTY • EASY EMI',
    heroHeadline: 'Drive Your Dream Car with Zero Compromise',
    heroSubheadline: 'Vetted, certified SUVs, sedans, and electric vehicles with non-accidental guarantee, instant RC transfer, and customized low-interest auto loans.',
    ctaText: 'Browse 150+ Inspected Cars',
    items: [
      { title: '2023 Tata Safari Dark Edition', subtitle: 'Diesel Auto • 18,000 km • Panoramic Sunroof', tag: 'Certified Gold', price: '₹18.75 Lakh', rating: '1st Owner', iconType: 'car' },
      { title: '2022 Hyundai Creta SX(O)', subtitle: 'Petrol Auto • 24,000 km • Bose Sound System', tag: 'Hot Deal', price: '₹13.40 Lakh', rating: 'Zero Dep', iconType: 'car' },
      { title: '2021 BMW 3 Series Gran Limousine', subtitle: 'Luxury Line • 28,000 km • Fully Serviced', tag: 'Luxury Tier', price: '₹34.50 Lakh', rating: 'Verified', iconType: 'car' },
      { title: '2023 Mahindra Thar 4x4 Hardtop', subtitle: 'Diesel Manual • 14,000 km • Off-road Pack', tag: 'Adventure', price: '₹14.20 Lakh', rating: 'Mint Cond.', iconType: 'car' },
    ],
    stats: [
      { label: 'Cars in Stock', value: '150+' },
      { label: 'Quality Checkpoints', value: '200' },
      { label: 'Cars Delivered', value: '1,800+' },
    ]
  },
  {
    filename: 'event.svg',
    url: 'https://utsav.srijantech.in',
    brandName: 'Utsav Celebrations',
    tagline: 'Destination Weddings, Corporate Galas & Concerts',
    themeColor: '#8b5cf6',
    accentColor: '#a78bfa',
    darkBg: '#150d26',
    category: 'Event Management Website',
    heroBadge: 'TURNKEY EVENT PRODUCTION • CELEBRITY BOOKING',
    heroHeadline: 'Crafting Unforgettable Moments of Wonder',
    heroSubheadline: 'From royal heritage palace weddings in Varanasi to corporate leadership summits, we handle theme design, light engineering, artist curation, and guest logistics.',
    ctaText: 'Request Event Proposal',
    items: [
      { title: 'Royal Ghat Wedding Experience', subtitle: 'Floral mandap on river barge with shehnai band', tag: 'Destination', price: '₹4.5 Lakh+', rating: '5.0 ★', iconType: 'event' },
      { title: 'Corporate Annual Tech Gala', subtitle: '4K LED stage, directional audio & keynote setup', tag: 'Corporate', price: '₹2.2 Lakh+', rating: 'Enterprise', iconType: 'event' },
      { title: 'Sangeet & Sufi Night Concert', subtitle: 'Acoustic stage rigging, pyros & artist booking', tag: 'Music Fest', price: '₹1.8 Lakh+', rating: 'Spectacular', iconType: 'event' },
      { title: 'Catering & Banqueting Spread', subtitle: 'Live counters: Chaat, Pan-Asian, Continental', tag: 'Gourmet', price: '₹850/plate', rating: 'Hygiene Cert', iconType: 'event' },
    ],
    stats: [
      { label: 'Events Executed', value: '620+' },
      { label: 'Partner Venues', value: '45' },
      { label: 'Vendor Network', value: '200+' },
    ]
  }
];

function generateSvg(cfg: ProjectPreviewConfig): string {
  const {
    url,
    brandName,
    tagline,
    themeColor,
    accentColor,
    darkBg,
    category,
    heroBadge,
    heroHeadline,
    heroSubheadline,
    ctaText,
    items,
    stats
  } = cfg;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${darkBg}" />
      <stop offset="60%" stop-color="#0b1120" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${themeColor}" />
      <stop offset="100%" stop-color="${accentColor}" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="heroCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${themeColor}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.04" />
    </linearGradient>

    <!-- Subtle Grid Pattern -->
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.25"/>
    </pattern>

    <!-- Drop Shadows -->
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>

  <!-- ================= BROWSER CHROME CONTAINER ================= -->
  <rect x="0" y="0" width="1200" height="750" fill="#030712" />

  <!-- Window Border Frame -->
  <rect x="8" y="8" width="1184" height="734" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />

  <!-- Browser Header Bar -->
  <path d="M 8 24 Q 8 8 24 8 L 1176 8 Q 1192 8 1192 24 L 1192 68 L 8 68 Z" fill="#0b1324" />

  <!-- macOS Window Controls -->
  <circle cx="36" cy="38" r="6" fill="#ef4444" />
  <circle cx="56" cy="38" r="6" fill="#f59e0b" />
  <circle cx="76" cy="38" r="6" fill="#10b981" />

  <!-- Navigation Arrows -->
  <path d="M 110 38 L 118 31 M 110 38 L 118 45" stroke="#64748b" stroke-width="2" stroke-linecap="round" />
  <path d="M 132 38 L 124 31 M 132 38 L 124 45" stroke="#475569" stroke-width="2" stroke-linecap="round" />
  <path d="M 152 38 A 6 6 0 1 1 152 34" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" />

  <!-- URL Address Bar -->
  <rect x="180" y="22" width="680" height="32" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
  <!-- Lock Icon -->
  <path d="M 198 38 L 208 38 L 208 44 L 198 44 Z" fill="#10b981" />
  <path d="M 200 38 L 200 35 A 3 3 0 0 1 206 35 L 206 38" fill="none" stroke="#10b981" stroke-width="1.5" />
  <!-- URL Text -->
  <text x="218" y="43" fill="#cbd5e1" font-size="13" font-weight="500" class="font-mono">${url}</text>
  <!-- Security Badge -->
  <rect x="800" y="27" width="50" height="22" rx="4" fill="#059669" fill-opacity="0.2" />
  <text x="825" y="42" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle" class="font-sans">SSL</text>

  <!-- Browser Actions (Right) -->
  <rect x="880" y="27" width="130" height="22" rx="6" fill="#1e293b" stroke="#334155" stroke-width="0.75" />
  <text x="945" y="42" fill="#94a3b8" font-size="11" font-weight="500" text-anchor="middle" class="font-sans">Built by SrijanTech</text>
  <circle cx="1030" cy="38" r="8" fill="${themeColor}" fill-opacity="0.3" />
  <circle cx="1030" cy="38" r="4" fill="${themeColor}" />
  <rect x="1055" y="32" width="22" height="12" rx="2" fill="#334155" />
  <rect x="1085" y="30" width="80" height="16" rx="4" fill="${themeColor}" />
  <text x="1125" y="42" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle" class="font-sans">LIVE DEMO</text>

  <!-- Divider -->
  <line x1="8" y1="68" x2="1192" y2="68" stroke="#1e293b" stroke-width="1" />

  <!-- ================= WEBSITE CANVAS AREA ================= -->
  <g transform="translate(8, 68)">
    <!-- Webpage Body Background -->
    <rect x="0" y="0" width="1184" height="674" fill="url(#bgGrad)" />
    <rect x="0" y="0" width="1184" height="674" fill="url(#gridPattern)" />

    <!-- Webpage Top Navbar -->
    <rect x="0" y="0" width="1184" height="64" fill="#090e1a" fill-opacity="0.85" />
    <line x1="0" y1="64" x2="1184" y2="64" stroke="#1e293b" stroke-width="1" />

    <!-- Website Logo / Brand -->
    <circle cx="48" cy="32" r="14" fill="${themeColor}" />
    <path d="M 42 32 L 47 37 L 55 27" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <text x="74" y="37" fill="#ffffff" font-size="20" font-weight="800" class="font-sans">${brandName}</text>

    <!-- Nav Links -->
    <text x="320" y="37" fill="#ffffff" font-size="13" font-weight="600" class="font-sans">Home</text>
    <line x1="320" y1="46" x2="355" y2="46" stroke="${themeColor}" stroke-width="2" />
    <text x="390" y="37" fill="#94a3b8" font-size="13" font-weight="500" class="font-sans">Catalog</text>
    <text x="470" y="37" fill="#94a3b8" font-size="13" font-weight="500" class="font-sans">Features</text>
    <text x="560" y="37" fill="#94a3b8" font-size="13" font-weight="500" class="font-sans">Pricing</text>
    <text x="640" y="37" fill="#94a3b8" font-size="13" font-weight="500" class="font-sans">Contact</text>

    <!-- Search / Cart / Action Buttons in Nav -->
    <rect x="740" y="18" width="220" height="28" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="760" y="36" fill="#64748b" font-size="12" class="font-sans">🔍 Search items, services...</text>

    <rect x="980" y="16" width="90" height="32" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="1025" y="36" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle" class="font-sans">Sign In</text>

    <rect x="1080" y="16" width="70" height="32" rx="6" fill="url(#primaryGrad)" />
    <text x="1115" y="36" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" class="font-sans">Cart (2)</text>

    <!-- ================= HERO SHOWCASE SECTION ================= -->
    <g transform="translate(36, 88)">
      <!-- Ambient Glow Behind Hero -->
      <circle cx="400" cy="120" r="160" fill="${themeColor}" fill-opacity="0.12" filter="url(#shadow)" />
      
      <!-- Hero Content Card -->
      <rect x="0" y="0" width="1112" height="230" rx="16" fill="url(#heroCardGrad)" stroke="${themeColor}" stroke-width="1.5" stroke-opacity="0.4" />

      <!-- Top Badge -->
      <rect x="28" y="24" width="280" height="26" rx="13" fill="${themeColor}" fill-opacity="0.2" stroke="${themeColor}" stroke-width="1" stroke-opacity="0.6" />
      <circle cx="42" cy="37" r="4" fill="${accentColor}" />
      <text x="54" y="41" fill="${accentColor}" font-size="11" font-weight="800" class="font-sans">${heroBadge}</text>

      <!-- Category Label -->
      <rect x="960" y="24" width="124" height="26" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
      <text x="1022" y="41" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle" class="font-sans">${category}</text>

      <!-- Big Headline -->
      <text x="28" y="94" fill="#ffffff" font-size="32" font-weight="900" letter-spacing="-0.5" class="font-sans">${heroHeadline}</text>

      <!-- Subtitle Description -->
      <text x="28" y="130" fill="#94a3b8" font-size="14" font-weight="400" class="font-sans">${heroSubheadline.slice(0, 105)}</text>
      <text x="28" y="152" fill="#94a3b8" font-size="14" font-weight="400" class="font-sans">${heroSubheadline.slice(105, 210)}</text>

      <!-- Hero Call-to-Actions -->
      <rect x="28" y="174" width="180" height="38" rx="8" fill="url(#primaryGrad)" />
      <text x="118" y="198" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle" class="font-sans">${ctaText} →</text>

      <rect x="220" y="174" width="140" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <text x="290" y="198" fill="#e2e8f0" font-size="13" font-weight="600" text-anchor="middle" class="font-sans">Learn More</text>

      <!-- Live Metric Badges on Hero Right -->
      <g transform="translate(720, 76)">
        <rect x="0" y="0" width="364" height="126" rx="12" fill="#090e1a" fill-opacity="0.8" stroke="#1e293b" stroke-width="1" />
        <text x="20" y="28" fill="#64748b" font-size="11" font-weight="700" class="font-sans">PLATFORM PERFORMANCE</text>
        
        <!-- Stats Row -->
        <g transform="translate(20, 44)">
          ${stats.map((s, i) => `
            <g transform="translate(${i * 110}, 0)">
              <text x="0" y="24" fill="#ffffff" font-size="22" font-weight="900" class="font-sans">${s.value}</text>
              <text x="0" y="42" fill="#94a3b8" font-size="11" class="font-sans">${s.label}</text>
            </g>
          `).join('')}
        </g>

        <!-- UPI Direct Settlement Pill -->
        <rect x="20" y="94" width="324" height="22" rx="4" fill="#10b981" fill-opacity="0.15" />
        <text x="30" y="109" fill="#34d399" font-size="10" font-weight="700" class="font-sans">⚡ Instant UPI Enabled • 100% Secure Checkout</text>
      </g>
    </g>

    <!-- ================= FEATURED CATALOG / PRODUCTS SECTION ================= -->
    <g transform="translate(36, 336)">
      <!-- Section Header -->
      <text x="0" y="24" fill="#ffffff" font-size="20" font-weight="800" class="font-sans">Featured Offerings &amp; Catalog</text>
      <text x="280" y="24" fill="#64748b" font-size="13" class="font-sans">• Live Interactive Prototype Preview</text>

      <!-- 4 Product/Service Cards Grid -->
      <g transform="translate(0, 42)">
        ${items.map((item, idx) => {
          const xOffset = idx * 285;
          return `
          <g transform="translate(${xOffset}, 0)">
            <!-- Card Base -->
            <rect x="0" y="0" width="265" height="230" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.2" />

            <!-- Card Thumbnail Banner Graphic -->
            <rect x="10" y="10" width="245" height="100" rx="10" fill="#090e1a" />
            <circle cx="132" cy="60" r="32" fill="${themeColor}" fill-opacity="0.15" />
            
            <!-- Tech Illustration in Card Thumbnail -->
            <rect x="82" y="35" width="100" height="50" rx="6" fill="#1e293b" stroke="${themeColor}" stroke-width="1.5" />
            <line x1="92" y1="48" x2="172" y2="48" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" />
            <line x1="92" y1="60" x2="145" y2="60" stroke="#64748b" stroke-width="2" stroke-linecap="round" />
            <line x1="92" y1="72" x2="160" y2="72" stroke="#475569" stroke-width="2" stroke-linecap="round" />
            <circle cx="166" cy="66" r="6" fill="${themeColor}" />

            <!-- Tag Badge -->
            <rect x="18" y="18" width="80" height="18" rx="4" fill="${themeColor}" fill-opacity="0.25" />
            <text x="58" y="31" fill="${accentColor}" font-size="9" font-weight="800" text-anchor="middle" class="font-sans">${item.tag}</text>

            ${item.rating ? `
            <!-- Rating Badge -->
            <rect x="195" y="18" width="50" height="18" rx="4" fill="#0f172a" stroke="#334155" stroke-width="0.75" />
            <text x="220" y="31" fill="#facc15" font-size="9" font-weight="700" text-anchor="middle" class="font-sans">${item.rating}</text>
            ` : ''}

            <!-- Card Info -->
            <text x="14" y="132" fill="#ffffff" font-size="14" font-weight="700" class="font-sans">${item.title}</text>
            <text x="14" y="150" fill="#94a3b8" font-size="11" class="font-sans">${item.subtitle.slice(0, 34)}</text>

            <!-- Price / Action Footer -->
            <line x1="14" y1="172" x2="251" y2="172" stroke="#1e293b" stroke-width="1" />
            
            ${item.price ? `
            <text x="14" y="202" fill="#38bdf8" font-size="16" font-weight="900" class="font-mono">${item.price}</text>
            ` : `
            <text x="14" y="202" fill="#38bdf8" font-size="14" font-weight="700" class="font-sans">Explore →</text>
            `}

            <!-- Add / Select Mini Button -->
            <rect x="175" y="184" width="76" height="28" rx="6" fill="${themeColor}" />
            <text x="213" y="202" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" class="font-sans">Select</text>
          </g>
          `;
        }).join('')}
      </g>
    </g>

    <!-- Bottom Bar Notification -->
    <rect x="36" y="625" width="1112" height="34" rx="8" fill="#090e1a" stroke="#1e293b" stroke-width="1" />
    <text x="56" y="647" fill="#64748b" font-size="12" class="font-sans">🌐 SrijanTech Digital Solutions • Live Prototype Concept Model • Powered by React, Vite &amp; Tailwind CSS</text>
    <text x="1120" y="647" fill="#38bdf8" font-size="12" font-weight="600" text-anchor="end" class="font-sans">Interactive Demo Mode</text>
  </g>
</svg>`;
}

for (const p of projects) {
  const svgContent = generateSvg(p);
  const filePath = path.join(outDir, p.filename);
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`Generated preview: ${filePath} (${svgContent.length} bytes)`);
}

console.log('All 12 project preview SVGs successfully generated.');
