import {
  Service,
  PricingPlan,
  Project,
  Testimonial,
  BlogPost,
  Faq,
  WebsiteSettings,
} from '../types';

export const initialSettings: WebsiteSettings = {
  company_name: 'SrijanTech',
  tagline: 'Turning Ideas Into Powerful Digital Experiences.',
  founder_name: 'Srijan Singh',
  founder_role: 'Founder & Developer — SrijanTech',
  founder_bio:
    'Srijan Singh is the founder of SrijanTech, focused on creating modern, practical and reliable digital solutions. SrijanTech combines thoughtful design, modern technology and real-world functionality to help businesses and individuals build a stronger digital presence.',
  founder_photo_url: '/images/founder/srijan-singh-founder.jpg',
  vision:
    'To build world-class digital software and high-performing websites that empower businesses to scale with modern technological clarity and architectural resilience.',
  mission:
    'Deliver clean, maintainable, and high-impact digital products through transparent collaboration, cutting-edge web frameworks, and customer-first service.',
  phone: '7269068483',
  whatsapp: '7269068483',
  email: 'mystoreorder0004@gmail.com',
  upi_id: '7269068483@ptyes',
  upi_qr_url: '',
  location: 'Varanasi, Uttar Pradesh, India',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  social_links: [
    { platform: 'LinkedIn', url: '', is_active: false },
    { platform: 'GitHub', url: '', is_active: false },
    { platform: 'Twitter / X', url: '', is_active: false },
    { platform: 'Instagram', url: '', is_active: false },
  ],
  seo_title: 'SrijanTech - Digital Solutions & Web Engineering | Varanasi',
  seo_description:
    'SrijanTech provides modern web development, custom software engineering, e-commerce, and digital solutions founded by Srijan Singh in Varanasi, Uttar Pradesh.',
  meta_keywords:
    'SrijanTech, Web Development Varanasi, Srijan Singh, Software Company Varanasi, E-Commerce Development',
  payment_gateway_provider: 'razorpay',
  payment_gateway_key: '',
  payment_gateway_configured: false,
  whatsapp_configured: false,
  email_configured: false,
};

export const defaultSettings = initialSettings;

export const defaultServices: Service[] = [
  {
    id: 'srv-1',
    slug: 'website-development',
    title: 'Web Development',
    short_description:
      'High-performance, beautifully responsive websites engineered for speed, clean UX, and search engine dominance.',
    detailed_description:
      'We design and develop bespoke corporate websites, marketing platforms, and interactive portals tailored to your brand identity. Built using modern frontend architectures with full responsiveness, micro-animations, and technical SEO baked into every page.',
    icon: 'Globe',
    base_price: 9999,
    features: [
      'Responsive Mobile-First Architecture',
      'Ultra-Fast Loading Speeds (<1s Core Web Vitals)',
      'Advanced On-Page Technical SEO & Meta Tags',
      'Custom Content Management Integration',
      'Contact Forms & Instant WhatsApp Routing',
      'SSL Security & HTTPS Hardening',
    ],
    is_active: true,
    display_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-2',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    short_description:
      'Cross-platform iOS and Android mobile apps with fluid gestures, offline support, and native API integration.',
    detailed_description:
      'Turn your service into a pocket-friendly experience with modern React Native and Progressive Web App architectures. Optimized for seamless performance on budget to flagship smartphones with instant push notifications.',
    icon: 'Smartphone',
    base_price: 29999,
    features: [
      'Cross-Platform iOS & Android Codebase',
      'Progressive Web App (PWA) Offline Functionality',
      'Push Notification Triggers & Alerts',
      'Biometric / Fingerprint Authentication Flow',
      'App Store & Play Store Deployment Prep',
      'Zero-Latency Fluid Micro-Interactions',
    ],
    is_active: true,
    display_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-3',
    slug: 'ai-solutions',
    title: 'AI Solutions',
    short_description:
      'Practical, high-impact AI features: intelligent search, conversational agents, automated data parsing, and smart workflows.',
    detailed_description:
      'Integrate genuine, reliable AI capabilities into your business workflows. From customer support triage bots to smart document summarizers and dynamic recommendation systems powered by state-of-the-art LLM APIs.',
    icon: 'Sparkles',
    base_price: 19999,
    features: [
      'Conversational AI Chatbots & Support Assistants',
      'Natural Language Product Search & Recommendations',
      'Automated Document & Invoice Data Extraction',
      'Prompt Engineering & Resilient API Fallbacks',
      'Private Context Grounding & Vector Search',
      'Strict Rate-Limiting & Cost Monitoring',
    ],
    is_active: true,
    display_order: 3,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-4',
    slug: 'cybersecurity',
    title: 'Cybersecurity & Audits',
    short_description:
      'Security-conscious code architecture, penetration testing, SSL hardening, and data protection practices.',
    detailed_description:
      'Protect your customer data and financial transactions with security-first web engineering. We conduct vulnerability assessments, implement Content Security Policies (CSP), encrypt sensitive payloads, and prevent OWASP Top 10 exploits.',
    icon: 'ShieldCheck',
    base_price: 14999,
    features: [
      'OWASP Top 10 Vulnerability Mitigation',
      'Strict Content Security Policy (CSP) & CORS Setup',
      'SQL Injection & XSS Attack Neutralization',
      'Encrypted Session & Cookie Hardening',
      'Automated Security Patching & Health Alerts',
      'Comprehensive Security Audit Reports',
    ],
    is_active: true,
    display_order: 4,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-5',
    slug: 'custom-software',
    title: 'Custom Software & Portals',
    short_description:
      'Scalable cloud-based SaaS, custom CRM workflows, ERP modules, and data-driven internal web applications.',
    detailed_description:
      'From custom operations tools to multi-tenant business dashboards, we engineer custom software that solves exact operational bottlenecks. Built on robust TypeScript, PostgreSQL, and role-based access control.',
    icon: 'Layers',
    base_price: 34999,
    features: [
      'Single Page Apps (SPA) & Cloud Architecture',
      'PostgreSQL & Cloud Database Schemas',
      'Role-Based Access Control (RBAC) & Permissions',
      'RESTful & Webhook API Integrations',
      'Interactive Analytical Dashboards & Charts',
      'Automated Offsite Backups & Telemetry',
    ],
    is_active: true,
    display_order: 5,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'srv-6',
    slug: 'digital-products-ecommerce',
    title: 'Digital Products & E-Commerce',
    short_description:
      'High-conversion online stores with seamless Indian UPI, cart sync, inventory management, and automated GST billing.',
    detailed_description:
      'Turn casual traffic into active revenue with fast product catalogs, streamlined checkout, locked UPI payment QR flows, and automated tax invoicing compliant with Indian business standards.',
    icon: 'ShoppingCart',
    base_price: 24999,
    features: [
      'Multi-Category Catalog with Real-Time Stock',
      'Instant UPI (QR & Apps) & Card Gateway Setup',
      'Automated GST Invoicing & Order Tracking',
      'Customer Accounts, Wishlists & Order History',
      'Promotional Coupon & Discount Management',
      'Admin Inventory & Sales Analytics',
    ],
    is_active: true,
    display_order: 6,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const defaultProjects: Project[] = [
  {
    id: 'prj-1',
    title: 'E-Commerce Website',
    slug: 'ecommerce-website',
    category: 'E-Commerce',
    description:
      'High-conversion online shopping storefront with intelligent product filters, instant UPI QR code checkout, cart sync, and automated GST invoice billing.',
    detailed_case_study:
      'Designed to demonstrate a high-conversion retail shopping experience with instant catalog filtering, dynamic UPI amount locking, inventory management, and automated customer order notifications.',
    thumbnail_url: '/assets/projects/ecommerce.webp',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'UPI Payment Gateway'],
    features: [
      'Instant Search & Faceted Category Filtering',
      'Dynamic UPI QR Code with Locked Payable Amount',
      'Shopping Cart & Persistent Checkout State',
      'Downloadable PDF Order Receipts & Invoices',
    ],
    demo_url: '#demo-ecommerce',
    is_demo: true,
    status: 'completed',
    estimated_cost: 39999,
    paid_amount: 39999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-2',
    title: 'Restaurant Website',
    slug: 'restaurant-website',
    category: 'Food & Hospitality',
    description:
      'Atmospheric fine-dining culinary web platform with interactive digital menu, table reservation booking engine, chef specials, and online ordering.',
    detailed_case_study:
      'Engineered for premium restaurants and cafes to showcase signature Awadhi & Mughlai menus, manage real-time table reservations, take takeout orders, and accept direct customer UPI payments.',
    thumbnail_url: '/assets/projects/restaurant.webp',
    technologies: ['React', 'Tailwind CSS', 'Vite', 'Table Booking Engine', 'UPI API'],
    features: [
      'Digital Interactive Menu with High-Res Imagery',
      'Real-Time Table Booking & Time Slot Selector',
      'Online Takeaway Order & WhatsApp Order Dispatch',
      'Customer Reviews & Social Proof Gallery',
    ],
    demo_url: '#demo-restaurant',
    is_demo: true,
    status: 'completed',
    estimated_cost: 24999,
    paid_amount: 24999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-3',
    title: 'Gym & Fitness Website',
    slug: 'gym-fitness-website',
    category: 'Health & Fitness',
    description:
      'High-energy fitness studio website with membership plan subscriptions, workout class schedules, trainer rosters, and free trial pass booking.',
    detailed_case_study:
      'Built for modern gyms, CrossFit arenas, and yoga studios to drive new member conversions, automate recurring membership payments via UPI, and showcase transformation stories.',
    thumbnail_url: '/assets/projects/gym.webp',
    technologies: ['React', 'Tailwind CSS', 'Motion', 'Member Portal', 'Calendar Sync'],
    features: [
      'Interactive Membership Pricing Matrix & Online Signup',
      'Weekly Workout Class Timetable & Slot Booking',
      'Certified Trainer Profiles & Personal Coaching Funnel',
      'Instant 3-Day Free Trial Pass Lead Generation',
    ],
    demo_url: '#demo-gym',
    is_demo: true,
    status: 'completed',
    estimated_cost: 27999,
    paid_amount: 27999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-4',
    title: 'Hospital Website',
    slug: 'hospital-website',
    category: 'Healthcare & Medical',
    description:
      'Comprehensive multi-speciality tertiary care medical portal with online doctor appointment booking, OPD schedules, department catalogs, and emergency hotline.',
    detailed_case_study:
      'NABH-compliant hospital web platform designed for Varanasi patients with intuitive doctor appointment scheduling, emergency 24/7 hotline integration, cashless insurance TPA information, and lab report lookup.',
    thumbnail_url: '/assets/projects/hospital.webp',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Appointment Scheduler', 'PostgreSQL'],
    features: [
      'Department-Wise Doctor Finder & Live OPD Scheduling',
      'Online Patient Appointment Booking with SMS Confirmations',
      '24/7 Emergency & Ambulance Quick-Dial Hotline',
      'Cashless TPA & Health Insurance Guide',
    ],
    demo_url: '#demo-hospital',
    is_demo: true,
    status: 'completed',
    estimated_cost: 48999,
    paid_amount: 48999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-5',
    title: 'Real Estate Website',
    slug: 'real-estate-website',
    category: 'Real Estate & Property',
    description:
      'Luxury property showcase platform with interactive property search filters (BHK, location, budget), virtual floor plan previews, and VIP site visit scheduling.',
    detailed_case_study:
      'RERA-focused real estate portal built for builders and agencies in Varanasi, featuring riverfront villas, residential apartments, commercial offices, and instant brochure downloads.',
    thumbnail_url: '/assets/projects/realestate.webp',
    technologies: ['React', 'Tailwind CSS', 'Property Filter Engine', 'Map Integration', 'Lead CRM'],
    features: [
      'Dynamic Multi-Parameter Property Search & BHK Filters',
      'Interactive Floor Plans, Specifications & High-Res Galleries',
      'VIP Site Visit Scheduler with WhatsApp Calendar Sync',
      'EMI Mortgage Calculator & Stamp Duty Estimator',
    ],
    demo_url: '#demo-realestate',
    is_demo: true,
    status: 'completed',
    estimated_cost: 34999,
    paid_amount: 34999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-6',
    title: 'Hotel / PG Website',
    slug: 'hotel-pg-website',
    category: 'Hospitality & Accommodation',
    description:
      'Boutique riverside hotel & student PG residency portal with date-picker room reservations, room type comparison, amenities list, and instant UPI deposit.',
    detailed_case_study:
      'Created for boutique hotels, guest houses, and student PGs in Varanasi to manage live room availability, collect advance booking deposits via UPI, and display guest testimonials.',
    thumbnail_url: '/assets/projects/hotel.webp',
    technologies: ['React', 'Tailwind CSS', 'Booking Date Engine', 'UPI Gateway', 'Supabase'],
    features: [
      'Live Check-In / Check-Out Date Availability Picker',
      'Room & Bed Type Selector (Single, Twin, Deluxe AC)',
      'Amenities Breakdown (Mess, Wi-Fi, Power Backup, RO)',
      'Instant UPI Token Advance Booking Confirmation',
    ],
    demo_url: '#demo-hotel',
    is_demo: true,
    status: 'completed',
    estimated_cost: 32999,
    paid_amount: 32999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-7',
    title: 'School Management Portal',
    slug: 'school-management-portal',
    category: 'Education Portal',
    description:
      'Integrated K-12 academic portal for student admission applications, online term fee payments with instant UPI receipts, attendance records, and report cards.',
    detailed_case_study:
      'A comprehensive institutional portal concept that automates admissions, digital fee collection with automated parent receipts, student attendance tracking, and school event calendar notifications.',
    thumbnail_url: '/assets/projects/school.webp',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'UPI Payment API'],
    features: [
      'Online Student Admission Application Workflow',
      'Paperless School Fee Payment with Instant UPI Receipts',
      'Live Academic Notice Board & Examination Ticker',
      'Parent Portal for Attendance & Report Card Download',
    ],
    demo_url: '#demo-school',
    is_demo: true,
    status: 'completed',
    estimated_cost: 49999,
    paid_amount: 49999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-8',
    title: 'Travel & Tourism Website',
    slug: 'travel-tourism-website',
    category: 'Travel & Tourism',
    description:
      'Immersive travel and spiritual pilgrimage website with sunrise boat tour bookings, heritage alley walks, multi-day Kashi packages, and custom itinerary builder.',
    detailed_case_study:
      'Engineered for Varanasi tour operators and guides to showcase spiritual tours, evening Ganga Aarti VIP seating, Kashi-Ayodhya packages, and enable instant tourist bookings.',
    thumbnail_url: '/assets/projects/travel.webp',
    technologies: ['React', 'Tailwind CSS', 'Tour Booking Engine', 'Multi-Currency', 'WhatsApp API'],
    features: [
      'Sunrise Boat Tour & VIP Ganga Aarti Reservation System',
      'Handcrafted Spiritual Itinerary Builder & Custom Package Request',
      'Government Licensed Guide Profiles & Verified Reviews',
      'Instant WhatsApp Booking & Travel Advisory Guide',
    ],
    demo_url: '#demo-travel',
    is_demo: true,
    status: 'completed',
    estimated_cost: 29999,
    paid_amount: 29999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-9',
    title: 'Grocery Delivery Website',
    slug: 'grocery-delivery-website',
    category: 'Quick Commerce & Grocery',
    description:
      'Hyperlocal 15-minute grocery delivery storefront with fresh farm produce catalog, real-time inventory counts, express checkout, and live order tracking.',
    detailed_case_study:
      'Fast quick-commerce web app built for local grocery merchants to accept orders, manage category catalogs (fresh produce, dairy, staples), and fulfill deliveries within 15 minutes.',
    thumbnail_url: '/assets/projects/grocery.webp',
    technologies: ['React', 'Tailwind CSS', 'IndexedDB', 'UPI QR Checkout', 'Order Dispatch'],
    features: [
      'Rapid Search & Category Navigation (Vegetables, Dairy, Staples)',
      'Floating Cart Bar with Real-Time Minimum Order Thresholds',
      'Pincode Delivery Check & Estimated Dispatch Time',
      'One-Click Instant UPI Settlement & WhatsApp Notifications',
    ],
    demo_url: '#demo-grocery',
    is_demo: true,
    status: 'completed',
    estimated_cost: 36999,
    paid_amount: 36999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-10',
    title: 'Salon & Spa Website',
    slug: 'salon-spa-website',
    category: 'Beauty & Wellness',
    description:
      'Elegant luxury beauty salon and Ayurvedic wellness spa website with service menu, stylist selection, appointment calendar booking, and bridal packages.',
    detailed_case_study:
      'Boutique salon platform designed for luxury grooming, keratin hair treatments, bridal makeup packages, and Ayurvedic therapies with friction-free online slot reservations.',
    thumbnail_url: '/assets/projects/salon.webp',
    technologies: ['React', 'Tailwind CSS', 'Appointment Booking Engine', 'Service Catalog'],
    features: [
      'Comprehensive Service Catalog with Transparent Pricing',
      'Online Time Slot Calendar & Preferred Stylist Selection',
      'Bridal Makeup Portfolio Gallery & Consultation Request',
      'Automated Appointment Reminders via WhatsApp',
    ],
    demo_url: '#demo-salon',
    is_demo: true,
    status: 'completed',
    estimated_cost: 25999,
    paid_amount: 25999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-11',
    title: 'Car / Automobile Website',
    slug: 'car-automobile-website',
    category: 'Automobile & Vehicles',
    description:
      'Multi-brand pre-owned and certified automobile dealership portal with vehicle specification filters, 200-point inspection checklists, and test drive booking.',
    detailed_case_study:
      'Automobile marketplace platform designed for car dealerships to showcase inspected inventory, calculate monthly vehicle EMIs, schedule test drives, and capture buyer enquiries.',
    thumbnail_url: '/assets/projects/automobile.webp',
    technologies: ['React', 'Tailwind CSS', 'EMI Calculator', 'Vehicle Inventory Engine'],
    features: [
      'Multi-Parameter Vehicle Filter (Brand, Fuel, Transmission, Budget)',
      '200-Point Inspection Badge & Transparent Vehicle History',
      'Interactive Car Loan EMI & Down-Payment Calculator',
      'Doorstep Test Drive Booking & RC Transfer Status',
    ],
    demo_url: '#demo-automobile',
    is_demo: true,
    status: 'completed',
    estimated_cost: 35999,
    paid_amount: 35999,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prj-12',
    title: 'Event Management Website',
    slug: 'event-management-website',
    category: 'Event & Wedding Planning',
    description:
      'Turnkey event production & royal destination wedding planning web platform with theme portfolio, venue curation, budget estimator, and artist bookings.',
    detailed_case_study:
      'Bespoke event planning portal created for wedding planners and corporate event agencies in Varanasi, featuring ghat wedding showcases, lighting design, catering menus, and custom quotation requests.',
    thumbnail_url: '/assets/projects/event.webp',
    technologies: ['React', 'Tailwind CSS', 'Event Cost Estimator', 'Portfolio Gallery', 'Motion'],
    features: [
      'High-Resolution Destination Wedding & Gala Showcase Gallery',
      'Interactive Event Budget & Guest Count Estimation Tool',
      'Turnkey Vendor Coordination & Artist Booking System',
      'Direct Consultation Request Form & WhatsApp Meeting Link',
    ],
    demo_url: '#demo-event',
    is_demo: true,
    status: 'completed',
    estimated_cost: 31999,
    paid_amount: 31999,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'price-1',
    name: 'Landing Page',
    slug: 'landing-page',
    price_type: 'starting',
    price: 4999,
    advance_percentage: 50,
    badge: 'Fast Launch',
    short_description:
      'High-impact single-page website focused on lead generation, conversion, and fast mobile loading.',
    features: [
      'Single High-Converting Responsive Page',
      'Hero Section with Call-To-Action (CTA)',
      'Lead Capture Form & Instant WhatsApp Link',
      'Mobile & Tablet Responsive Layout',
      'Basic On-Page SEO & Fast Loading',
      'SSL Certificate Guidance & Domain Setup',
    ],
    is_popular: false,
    is_active: true,
    display_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-2',
    name: 'Business Website',
    slug: 'business-website',
    price_type: 'starting',
    price: 9999,
    advance_percentage: 50,
    badge: 'Popular for Small Business',
    short_description:
      'Multi-page professional corporate presence designed for local businesses, clinics, schools, and firms.',
    features: [
      'Up to 5 Custom Responsive Pages',
      'Home, About, Services, Contact & Portfolio',
      'Contact Forms & Google Maps Embed',
      'Direct WhatsApp Inquiry Integration',
      'Technical SEO Optimization & Google Indexing',
      '1 Month Post-Launch Maintenance Support',
    ],
    is_popular: true,
    is_active: true,
    display_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-3',
    name: 'Professional Website',
    slug: 'professional-website',
    price_type: 'starting',
    price: 19999,
    advance_percentage: 50,
    badge: 'Complete Business Solution',
    short_description:
      'Comprehensive high-performance website with dynamic content sections, catalog showcase, and advanced UX.',
    features: [
      'Up to 10 Pages or Dynamic Single-Page App',
      'Interactive Product/Service Catalog',
      'Dynamic UPI QR Payment Integration',
      'Admin Content Management Capability',
      'Performance Optimization (<1s Core Web Vitals)',
      '3 Months Technical Maintenance & Backups',
    ],
    is_popular: false,
    is_active: true,
    display_order: 3,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-4',
    name: 'Web Application',
    slug: 'web-application',
    price_type: 'custom_quote',
    price: 34999,
    advance_percentage: 40,
    badge: 'Custom Architecture',
    short_description:
      'Custom cloud application, SaaS platform, internal booking/CRM portal, or multi-role system.',
    features: [
      'Custom Database Schema & PostgreSQL / Cloud DB',
      'Customer & Admin Authentication (RBAC)',
      'Workflow Automation & Third-Party APIs',
      'Interactive Analytics & Custom Dashboards',
      'Secure Sessions & Data Encryption',
      'Dedicated Engineering Milestones & SLA',
    ],
    is_popular: false,
    is_active: true,
    display_order: 4,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-5',
    name: 'Mobile App',
    slug: 'mobile-app',
    price_type: 'custom_quote',
    price: 39999,
    advance_percentage: 40,
    badge: 'Cross-Platform',
    short_description:
      'Modern iOS and Android applications or Progressive Web Apps engineered for fast mobile performance.',
    features: [
      'Cross-Platform iOS & Android React Native Code',
      'Progressive Web App (PWA) Offline Functionality',
      'Push Notifications & User Alerts',
      'Biometric & OTP Login Integration',
      'App Store & Play Store Deployment Prep',
      'Ongoing OS Compatibility Updates',
    ],
    is_popular: false,
    is_active: true,
    display_order: 5,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-6',
    name: 'AI Integration',
    slug: 'ai-integration',
    price_type: 'custom_quote',
    price: 24999,
    advance_percentage: 40,
    badge: 'Smart Automation',
    short_description:
      'Intelligent AI capabilities: conversational agents, semantic document parsing, and automated workflows.',
    features: [
      'Trained AI Support & Inquiry Chatbots',
      'Natural Language Search & Recommendations',
      'Document Parsing & Automated Summarization',
      'Secure Server-Side API Proxying & Rate Limiting',
      'Private Knowledge Grounding',
      'Testing, Evaluation & Continuous Tuning',
    ],
    is_popular: false,
    is_active: true,
    display_order: 6,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'price-7',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    price_type: 'custom_quote',
    price: 19999,
    advance_percentage: 50,
    badge: 'Protection & Audit',
    short_description:
      'Security-conscious architecture, penetration testing, vulnerability remediation, and SSL hardening.',
    features: [
      'OWASP Top 10 Vulnerability Assessment',
      'CSP, CORS & Secure Header Hardening',
      'SQL Injection & XSS Attack Neutralization',
      'Encrypted Session & Cookie Hardening',
      'Automated Vulnerability Scanning',
      'Audit Report & Remediation Roadmap',
    ],
    is_popular: false,
    is_active: true,
    display_order: 7,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    client_name: 'Aditya Verma',
    client_role: 'Operations Director',
    company_name: 'Verma Logistics & Retail',
    project_title: 'Enterprise Billing & Web Suite',
    rating: 5,
    feedback:
      'SrijanTech delivered our retail software with remarkable precision. The direct UPI payment reconciliation and fast receipt generation simplified our daily operations immediately. Transparent communication throughout.',
    is_demo: true,
    is_active: true,
    display_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 't-2',
    client_name: 'Pooja Srivastava',
    client_role: 'Principal',
    company_name: 'Gyan Academy Varanasi',
    project_title: 'School Portal & Fee System',
    rating: 5,
    feedback:
      'Working with Srijan Singh was a seamless experience. The student fee collection and report card portal works flawlessly on both smartphones and desktops. Highly recommended for digital projects in Varanasi.',
    is_demo: true,
    is_active: true,
    display_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 't-3',
    client_name: 'Rajesh Mishra',
    client_role: 'Founder',
    company_name: 'Kashi Handloom Heritage',
    project_title: 'E-Commerce Storefront',
    rating: 5,
    feedback:
      'The e-commerce store built by SrijanTech helped us take our local Varanasi craft to buyers across India. The checkout is rapid, UPI payments are instant, and the admin panel makes inventory updates very easy.',
    is_demo: true,
    is_active: true,
    display_order: 3,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const defaultFaqs: Faq[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Where is SrijanTech located and who runs it?',
    answer:
      'SrijanTech is an independent technology and software engineering company based in Varanasi, Uttar Pradesh, India, founded and led by Srijan Singh.',
    display_order: 1,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'faq-2',
    category: 'Process & Timeline',
    question: 'How long does it take to develop a website or web application?',
    answer:
      'A standard business website typically takes 7 to 14 business days. Custom web applications, e-commerce stores, and portals usually take 3 to 6 weeks depending on the complexity of workflows, payment integrations, and custom database structures.',
    display_order: 2,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'faq-3',
    category: 'Payments',
    question: 'What payment methods do you accept and how does the advance work?',
    answer:
      'We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM to 7269068483@ptyes), Net Banking, and Debit/Credit Cards. Typically, projects begin with an advance payment (usually 50%), with the remainder due upon milestone delivery or final project deployment.',
    display_order: 3,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'faq-4',
    category: 'Technology',
    question: 'What technology stack do you use?',
    answer:
      'We specialize in modern, high-performance web stacks: React, TypeScript, Vite, Tailwind CSS on the frontend, and Node.js/Express with Supabase (PostgreSQL), Redis, and robust cloud APIs on the backend.',
    display_order: 4,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'faq-5',
    category: 'Support',
    question: 'Do you provide post-launch maintenance and technical support?',
    answer:
      'Yes. Every project includes complimentary post-launch support. In addition, we provide ongoing monthly maintenance contracts covering regular backups, uptime monitoring, security patching, and content updates.',
    display_order: 5,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'faq-6',
    category: 'Invoicing & GST',
    question: 'Will I receive an official invoice and payment receipt?',
    answer:
      'Yes. An official digital invoice with full line-item details, project references, tax breakdown, and payment status is generated for every transaction and accessible from your Customer Dashboard.',
    display_order: 6,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Why Every Varanasi Business Needs a Modern, Fast Website in 2025',
    slug: 'modern-website-varanasi-business-growth',
    excerpt:
      'Explore how fast-loading web engineering, clean mobile design, and local SEO transform traditional retail and service businesses into digital market leaders.',
    content: `In today's digital landscape, customers search on their mobile phones before making any buying decision. For businesses in Varanasi—from heritage textile artisans and hospitality providers to educational institutions and healthcare practices—having an outdated or sluggish website means losing valuable leads daily.

### The Problem with Template Builders
Many businesses start with bloated website builders that take 6 to 10 seconds to load on mobile connections. Studies show that over 53% of mobile visitors abandon a site if it takes longer than 3 seconds.

### The Modern Engineering Difference
At SrijanTech, we engineer websites using modern React and TypeScript compiled with Vite. This ensures:
1. Sub-second initial page render
2. High Google Core Web Vitals rankings
3. Native mobile responsiveness across every screen resolution
4. Seamless integration with WhatsApp and UPI payments

Investing in clean digital architecture is not an expense—it is your highest-yielding 24/7 business asset.`,
    cover_image: '',
    author_name: 'Srijan Singh',
    category: 'Web Engineering',
    tags: ['Web Development', 'Varanasi', 'Performance', 'SEO'],
    read_time_minutes: 4,
    is_published: true,
    published_at: '2025-01-10T10:00:00Z',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'post-2',
    title: 'Implementing Seamless UPI Payments & QR Workflows for Indian Web Apps',
    slug: 'implementing-seamless-upi-payments-web-apps',
    excerpt:
      'A technical overview of creating instant, reliable UPI checkout experiences with dynamic QR generation and webhook verification.',
    content: `Unified Payments Interface (UPI) has revolutionized commerce in India. In 2024 alone, UPI processed billions of transactions every month. For web applications, providing a frictionless UPI flow is essential.

### Intent Flow vs. Dynamic QR
On mobile devices, users prefer deep-linking directly into payment apps like Google Pay, PhonePe, or Paytm via UPI Intent URLs:
\`upi://pay?pa=7269068483@ptyes&pn=SrijanTech&am=5000&cu=INR\`

On desktop screens, generating an SVG QR code encoding the exact transaction order reference allows the customer to scan with their smartphone camera effortlessly.

### Server-Side Webhook Verification
Never rely on frontend triggers alone to record payment status. In production architecture:
1. The backend provisions an order record
2. The payment gateway verifies the cryptographic signature or webhook event
3. The database updates transaction status atomically
4. Confirmation notifications are dispatched via email and WhatsApp automatically.`,
    cover_image: '',
    author_name: 'Srijan Singh',
    category: 'Fintech & Payments',
    tags: ['UPI', 'Payments', 'Architecture', 'FinTech'],
    read_time_minutes: 5,
    is_published: true,
    published_at: '2025-01-05T12:00:00Z',
    created_at: '2025-01-05T12:00:00Z',
  },
];
