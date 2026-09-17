import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { createEnquiry } from '../services/db';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactPageProps {
  settings: WebsiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('New Project Consultation');
  const [message, setMessage] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const enq = await createEnquiry({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: phone.trim(),
        service_id: 'general',
        service_name: subject,
        budget_range: 'Flexible',
        project_description: message.trim(),
        preferred_contact_method: preferredMethod,
      });

      setSubmittedId(enq.enquiry_number);
      try {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to transmit message.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight mt-2">
          Connect with SrijanTech in Varanasi
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Whether you need a full enterprise web application, high-converting e-commerce, or
          strategic technical guidance, founder Srijan Singh is available for consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white font-['Outfit']">Direct Contact Details</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Location & Office:</strong>
                  <span>Varanasi, Uttar Pradesh, India</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Physical &amp; Remote Service</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Phone / WhatsApp:</strong>
                  <a href="tel:+917269068483" className="hover:text-cyan-400 transition-colors">
                    +91 7269068483
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Primary Email:</strong>
                  <a
                    href="mailto:mystoreorder0004@gmail.com"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    mystoreorder0004@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Working Hours (IST):</strong>
                  <span>Monday – Saturday: 9:00 AM – 7:00 PM</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Emergency support available for ongoing clients</p>
                </div>
              </div>
            </div>

            {/* Instant Actions */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/917269068483"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </a>
              <a
                href="tel:+917269068483"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Direct Call</span>
              </a>
            </div>
          </div>

          {/* Varanasi Local Map Aesthetic Representation */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                Varanasi Technology Hub
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">25.3176° N, 82.9739° E</span>
            </div>
            <p className="leading-relaxed">
              Serving Varanasi, Uttar Pradesh, and clients worldwide with modern web architecture.
              In-person discovery meetings in Varanasi available by appointment.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">Send an Instant Message</h3>
            <p className="text-xs text-slate-400 mb-6">
              Fill out this form and we'll reply directly to your email or WhatsApp within a few hours.
            </p>

            {submittedId ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white font-['Outfit']">Thank You!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your message has been logged under reference{' '}
                  <strong className="text-cyan-400 font-mono">{submittedId}</strong>. Srijan Singh will review
                  your requirements promptly.
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="mt-4 px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amit Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amit@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7269068483"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. E-Commerce Website for Shop"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Message / Requirements <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like to build, timeline, or any specific questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preferred Response Method
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'phone', label: 'Call', icon: Phone },
                      { id: 'email', label: 'Email', icon: Mail },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSel = preferredMethod === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreferredMethod(item.id as typeof preferredMethod)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-medium transition-all ${
                            isSel
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message Directly</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
