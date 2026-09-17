import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { ProjectModal } from './components/ProjectModal';
import { ProjectDemoModal } from './components/ProjectDemoModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DemoPage } from './pages/DemoPage';
import { ProcessSection } from './components/ProcessSection';
import { PricingPage } from './pages/PricingPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FaqPage } from './pages/FaqPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { PaymentPage } from './pages/PaymentPage';
import { LegalPages } from './pages/LegalPages';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Services & Types
import {
  getWebsiteSettings,
  getServices,
  getProjects,
  getPricingPlans,
  getTestimonials,
  getFaqs,
  getBlogPosts,
} from './services/db';
import { getCurrentUser, logoutUser } from './services/auth';
import {
  WebsiteSettings,
  Service,
  Project,
  PricingPlan,
  Testimonial,
  Faq,
  BlogPost,
  UserProfile,
} from './types';
import { defaultSettings } from './data/defaultData';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());

  // Modals & Contextual Navigation
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [activeDemoProject, setActiveDemoProject] = useState<Project | null>(null);

  // Payment navigation presets
  const [paymentPreset, setPaymentPreset] = useState<{
    amount: number;
    note: string;
    planName?: string;
  }>({
    amount: 5000,
    note: 'SrijanTech Web Engineering Advance',
  });

  useEffect(() => {
    // Initial data fetch
    const initData = async () => {
      const [s, srv, prj, prc, tst, fq, blg] = await Promise.all([
        getWebsiteSettings(),
        getServices(),
        getProjects(),
        getPricingPlans(),
        getTestimonials(),
        getFaqs(),
        getBlogPosts(),
      ]);

      setSettings(s);
      setServices(srv);
      setProjects(prj);
      setPricing(prc);
      setTestimonials(tst);
      setFaqs(fq);
      setPosts(blg);
    };

    initData();

    // Handle hash on initial load
    const hash = window.location.hash.replace('#', '');
    if (hash && isValidTab(hash)) {
      setCurrentTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && isValidTab(newHash)) {
        setCurrentTab(newHash);
      }
    };

    const handleAuthEvent = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('auth_change', handleAuthEvent);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('auth_change', handleAuthEvent);
    };
  }, []);

  const isValidTab = (tab: string) => {
    return [
      'home',
      'about',
      'services',
      'projects',
      'demo',
      'process',
      'pricing',
      'testimonials',
      'faq',
      'blog',
      'contact',
      'payment',
      'privacy-policy',
      'terms',
      'refund-policy',
      'customer-auth',
      'customer-dashboard',
      'admin-login',
      'admin-dashboard',
    ].includes(tab);
  };

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setEnquiryModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.price_type === 'custom_quote') {
      handleOpenEnquiry();
      return;
    }
    const advanceAmount = Math.round((plan.price * plan.advance_percentage) / 100);
    setPaymentPreset({
      amount: advanceAmount,
      note: `${plan.name} Advance (${plan.advance_percentage}%)`,
      planName: plan.name,
    });
    navigateTo('payment');
  };

  const handleSelectProjectFromConcept = (projectTitle: string) => {
    handleOpenEnquiry();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            services={services}
            projects={projects}
            pricing={pricing}
            testimonials={testimonials}
            faqs={faqs}
            settings={settings}
            onNavigate={navigateTo}
            onOpenEnquiry={handleOpenEnquiry}
            onSelectProject={(p) => setActiveProjectModal(p)}
            onOpenDemo={(p) => setActiveDemoProject(p)}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={navigateTo}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        )}

        {currentTab === 'services' && (
          <ServicesPage
            services={services}
            onOpenEnquiry={handleOpenEnquiry}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsPage
            projects={projects}
            onSelectProject={(p) => setActiveProjectModal(p)}
            onOpenDemo={(p) => setActiveDemoProject(p)}
            onOpenEnquiry={(title) => handleOpenEnquiry()}
          />
        )}

        {currentTab === 'demo' && (
          <DemoPage
            projects={projects}
            onSelectProject={(p) => setActiveProjectModal(p)}
            onOpenDemo={(p) => setActiveDemoProject(p)}
            onOpenEnquiry={(title) => handleOpenEnquiry()}
          />
        )}

        {currentTab === 'process' && (
          <div className="pt-20 sm:pt-24 pb-16">
            <ProcessSection onOpenEnquiry={() => handleOpenEnquiry()} />
          </div>
        )}

        {currentTab === 'pricing' && (
          <PricingPage
            pricing={pricing}
            onSelectPlan={handleSelectPlan}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        )}

        {currentTab === 'testimonials' && (
          <TestimonialsPage
            testimonials={testimonials}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        )}

        {currentTab === 'faq' && (
          <FaqPage faqs={faqs} onOpenEnquiry={() => handleOpenEnquiry()} />
        )}

        {currentTab === 'blog' && (
          <BlogPage posts={posts} onOpenEnquiry={() => handleOpenEnquiry()} />
        )}

        {currentTab === 'contact' && <ContactPage settings={settings} />}

        {currentTab === 'payment' && (
          <PaymentPage
            initialAmount={paymentPreset.amount}
            initialNote={paymentPreset.note}
            initialPlanName={paymentPreset.planName}
          />
        )}

        {currentTab === 'privacy-policy' && (
          <LegalPages type="privacy" onNavigate={navigateTo} />
        )}

        {currentTab === 'terms' && (
          <LegalPages type="terms" onNavigate={navigateTo} />
        )}

        {currentTab === 'refund-policy' && (
          <LegalPages type="refund" onNavigate={navigateTo} />
        )}

        {currentTab === 'customer-auth' && (
          <CustomerAuthPage
            onSuccess={(user) => {
              setCurrentUser(user);
              navigateTo('customer-dashboard');
            }}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'customer-dashboard' && (
          <CustomerDashboardPage
            user={
              currentUser || {
                id: 'guest',
                email: 'customer@example.com',
                full_name: 'Customer',
                role: 'customer',
                created_at: new Date().toISOString(),
              }
            }
            onNavigateToPayment={(amt, note) => {
              setPaymentPreset({
                amount: amt || 5000,
                note: note || 'Milestone Payment',
              });
              navigateTo('payment');
            }}
            onLogout={async () => {
              await logoutUser();
              setCurrentUser(null);
              navigateTo('customer-auth');
            }}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'admin-login' && (
          <AdminLoginPage
            onSuccess={(user) => {
              setCurrentUser(user);
              navigateTo('admin-dashboard');
            }}
            onNavigate={navigateTo}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage
            adminUser={
              currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')
                ? currentUser
                : {
                    id: 'admin_ss',
                    email: 'mystoreorder0004@gmail.com',
                    full_name: 'Srijan Singh',
                    role: 'admin',
                    phone: '7269068483',
                    created_at: new Date().toISOString(),
                  }
            }
            onLogout={async () => {
              await logoutUser();
              setCurrentUser(null);
              navigateTo('home');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        services={services}
        preselectedServiceId={selectedServiceId}
      />

      <ProjectModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        onStartSimilarProject={handleSelectProjectFromConcept}
      />

      <ProjectDemoModal
        project={activeDemoProject}
        onClose={() => setActiveDemoProject(null)}
        onStartProject={handleSelectProjectFromConcept}
      />

      {/* Persistent Floating WhatsApp Quick Button */}
      <a
        href="https://wa.me/917269068483?text=Hello%20Srijan%2C%20I%20would%20like%20to%20discuss%20a%20web%20project%20with%20SrijanTech."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp with Srijan Singh"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          Chat with Srijan Singh
        </span>
      </a>

      {/* Footer */}
      <Footer settings={settings} onNavigate={navigateTo} />
    </div>
  );
}
