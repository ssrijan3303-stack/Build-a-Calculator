import React from 'react';
import { Shield, FileText, RefreshCw, MapPin, Mail, Phone } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'refund';
  onNavigate: (tab: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Tab switchers */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('privacy-policy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'privacy'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => onNavigate('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'terms'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => onNavigate('refund-policy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold ${
            type === 'refund'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          Refund & Cancellation Policy
        </button>
      </div>

      {type === 'privacy' && (
        <article className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs uppercase font-bold text-cyan-400">Legal Compliance</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <p>
            At <strong className="text-white">SrijanTech</strong>, accessible from our digital platform and services,
            one of our main priorities is the privacy of our visitors and clients. This Privacy Policy document outlines
            the types of information collected and recorded by SrijanTech (founded by Srijan Singh, Varanasi, UP) and how we use it.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">1. Information We Collect</h3>
          <p>
            We collect information when you fill out an inquiry form, initiate an Indian UPI payment, request an invoice,
            or communicate with us directly via WhatsApp or email. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Name, phone number, and WhatsApp number</li>
            <li>Email address</li>
            <li>Billing address and Indian state of supply for Tax Invoicing</li>
            <li>Project specifications, design documents, and technical requirements</li>
            <li>UPI transaction IDs (UTR) and payment reference details</li>
          </ul>

          <h3 className="text-base font-bold text-white font-['Outfit']">2. How We Use Your Information</h3>
          <p>We use the collected information for:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Delivering, maintaining, and developing customized software products</li>
            <li>Issuing official tax invoices and recording payment reconciliations</li>
            <li>Sending milestone progress updates via email or WhatsApp</li>
            <li>Responding to customer support tickets and maintenance queries</li>
          </ul>

          <h3 className="text-base font-bold text-white font-['Outfit']">3. Data Security & Confidentiality</h3>
          <p>
            SrijanTech strictly respects intellectual property and non-disclosure standards. We never sell,
            lease, or trade your personal or project data to third-party marketing entities.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">4. Contacting the Grievance Officer</h3>
          <p>
            If you have questions regarding this privacy policy, please contact:
            <br />
            <strong className="text-white">Srijan Singh</strong> (Founder, SrijanTech)
            <br />
            Varanasi, Uttar Pradesh, India
            <br />
            Phone: +91 7269068483
            <br />
            Email: mystoreorder0004@gmail.com
          </p>
        </article>
      )}

      {type === 'terms' && (
        <article className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs uppercase font-bold text-cyan-400">Legal Terms</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Terms & Conditions
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Effective Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <p>
            These terms govern the engagement between you ("Client") and <strong className="text-white">SrijanTech</strong>
            ("Service Provider"), founded by Srijan Singh, having operations based in Varanasi, Uttar Pradesh, India.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">1. Scope of Work & Milestone Approvals</h3>
          <p>
            Each software development assignment is initiated based on a written project scope and technical proposal.
            Work commences upon verification of the initial project advance (typically 30% - 50% depending on plan).
            Client review and feedback checkpoints will be provided at critical milestones.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">2. Payment Terms</h3>
          <p>
            All prices are denominated in Indian Rupees (INR). Payments are accepted via UPI (7269068483@ptyes) or direct
            electronic bank transfer. Balance amounts become payable upon project completion and demonstration prior to
            handover of production credentials and code repositories.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">3. Code Ownership & Intellectual Property</h3>
          <p>
            Upon 100% receipt of all contracted fees, all bespoke source code, database architecture, and custom assets
            are assigned to the client. SrijanTech reserves the right to showcase non-confidential project concepts in
            portfolios.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">4. Governing Law</h3>
          <p>
            These terms are governed by and construed in accordance with the laws of India. Any disputes arising out
            of or related to our services shall be subject to the exclusive jurisdiction of the courts of Varanasi, Uttar Pradesh.
          </p>
        </article>
      )}

      {type === 'refund' && (
        <article className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs uppercase font-bold text-cyan-400">Policies</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Refund & Cancellation Policy
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Clear & Transparent Standards
            </p>
          </div>

          <p>
            At <strong className="text-white">SrijanTech</strong>, we are dedicated to providing the highest quality
            custom web engineering and digital solutions. Due to the customized nature of bespoke software programming,
            our refund standards are defined as follows:
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">1. Advance Payments</h3>
          <p>
            Project advances cover initial research, architectural blueprint drafting, infrastructure provisioning,
            and dedicated development team allocation. If a cancellation request is submitted within 24 hours of
            payment prior to technical work commencing, a full refund less processing fees will be provided.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">2. Milestone Cancellations</h3>
          <p>
            If a project is discontinued during active development, completed milestones are billed at agreed pro-rata
            rates, and remaining unspent advance funds will be refunded to the originating UPI account within 5–7 business days.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">3. Maintenance Retainers</h3>
          <p>
            Monthly website maintenance and support subscriptions may be cancelled with 15 days written notice before
            the next billing cycle.
          </p>

          <h3 className="text-base font-bold text-white font-['Outfit']">4. Requesting a Refund</h3>
          <p>
            To initiate a refund request, submit your invoice number and transaction reference (UTR) to
            <a href="mailto:mystoreorder0004@gmail.com" className="text-cyan-400 font-semibold ml-1">
              mystoreorder0004@gmail.com
            </a>{' '}
            or message Srijan Singh directly on WhatsApp at{' '}
            <a href="tel:+917269068483" className="text-cyan-400 font-semibold">
              +91 7269068483
            </a>.
          </p>
        </article>
      )}
    </div>
  );
};
