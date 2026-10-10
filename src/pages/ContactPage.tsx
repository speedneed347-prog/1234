import React, { useState } from 'react';
import { api } from '../api/client.ts';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitContact({
        name,
        email,
        subject: subject || 'General Feedback',
        message,
      });

      setSuccess(res.message || 'Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-[#0798FF] uppercase tracking-wider block">
          🐾 Support &amp; Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202B49] font-display">Get in Touch</h1>
        <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
          Have an idea for a fun question pack, cat sticker mascots, or friendship feedback? Drop us a note!
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-white shadow-xl space-y-6">
        {success && (
          <div className="p-4 rounded-2xl bg-[#e6faf2] border-2 border-[#55D9AD] text-[#059669] text-xs font-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#55D9AD]" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-[#FFE4EF] border-2 border-[#FF5793] text-[#FF5793] text-xs font-black">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1">
                Your Name <span className="text-[#FF5793]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Carter"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1">
                Email Address <span className="text-[#FF5793]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Question idea / Platform feedback"
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#202B49] uppercase tracking-wider block mb-1">
              Your Message <span className="text-[#FF5793]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what is on your mind..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#DFE8F2] text-xs font-bold text-[#202B49] outline-none focus:border-[#0798FF] focus:ring-2 focus:ring-[#59B9EF]/30"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_3px_0_#006fc5] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all ${
              loading ? 'bg-slate-300 cursor-wait' : 'bg-[#0798FF] hover:bg-[#0086e6]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
