import React, { useState } from 'react';
import { createEnquiry } from '../services/db';
import { Service } from '../types';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  FileUp,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  preselectedServiceId?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  services,
  preselectedServiceId,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [serviceId, setServiceId] = useState(preselectedServiceId || (services[0]?.id ?? ''));
  const [budget, setBudget] = useState('₹25,000 - ₹50,000');
  const [description, setDescription] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  const [preferredTime, setPreferredTime] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedEnquiryNumber, setSubmittedEnquiryNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMessage('Please fill in all mandatory fields (Name, Email, Phone, and Project Description).');
      return;
    }

    setLoading(true);
    try {
      const selectedService = services.find((s) => s.id === serviceId);
      const enq = await createEnquiry({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        service_id: serviceId,
        service_name: selectedService?.title || 'General Web Development',
        budget_range: budget,
        project_description: description.trim(),
        preferred_contact_method: preferredMethod,
        preferred_time: preferredTime || undefined,
        attachment_url: attachmentName ? `uploaded/${attachmentName}` : undefined,
      });

      setSubmittedEnquiryNumber(enq.enquiry_number);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while submitting your enquiry.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedEnquiryNumber(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">Start a Project with SrijanTech</h3>
            <p className="text-xs text-slate-400">Direct consultation with founder Srijan Singh in Varanasi</p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedEnquiryNumber ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white font-['Outfit']">Enquiry Received Successfully!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for considering SrijanTech. Your project inquiry has been logged into our
                system. Srijan Singh will personally review your requirements and reach out within 24 hours.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 inline-block font-mono text-sm text-cyan-400">
                Enquiry Reference: <strong>{submittedEnquiryNumber}</strong>
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <a
                  href={`https://wa.me/917269068483?text=${encodeURIComponent(
                    `Hello Srijan, I just submitted project enquiry ${submittedEnquiryNumber}. Can we discuss?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp Now
                </a>
                <button
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
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
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Leave empty if same as phone"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Service Required</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} (From ₹{s.base_price.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000 (Starter Website)</option>
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Professional Web App)</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (E-Commerce / Custom)</option>
                    <option value="₹1,00,000+">₹1,00,000+ (Enterprise SaaS / Complex)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Description & Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about what you want to build, key features, reference websites, or deadlines..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preferred Contact Channel
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

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Attach Specification / Mockup (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950 cursor-pointer text-xs text-slate-400 transition-colors">
                    <FileUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{attachmentName || 'Click to select PDF or image'}</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Location: Varanasi, UP • No spam policy
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Project Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
