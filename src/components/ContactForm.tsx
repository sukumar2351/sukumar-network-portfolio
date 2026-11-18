import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { profile } from '../data/profile';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactForm: React.FC = () => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedDemo, setSubmittedDemo] = useState<boolean>(false);

  const validate = (data: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!data.email.trim() || !EMAIL_PATTERN.test(data.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!data.subject.trim() || data.subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a short subject line.';
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message (at least 10 characters).';
    }
    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submittedDemo) setSubmittedDemo(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmittedDemo(true);
    }
  };

  return (
    <div className="cr-card p-6 sm:p-8">
      <div className="mb-6 border-b border-[#351010] pb-4">
        <div className="font-mono text-xs tracking-[0.18em] text-[#FF101A] uppercase">
          DIRECT MESSAGE
        </div>
        <h3 className="mt-1 font-display text-2xl font-bold text-white">
          Send a Message
        </h3>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block font-mono text-[11px] tracking-[0.14em] text-white uppercase"
            >
              Name <span className="text-[#FF101A]">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'error-name' : undefined}
              className="w-full border border-[#351010] bg-[#080808] px-3.5 py-3 text-sm text-white placeholder:text-[#B8B8B8]/55 focus:border-[#FF101A] focus:outline-none"
            />
            {errors.name && (
              <p
                id="error-name"
                className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[#FF101A]"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block font-mono text-[11px] tracking-[0.14em] text-white uppercase"
            >
              Email <span className="text-[#FF101A]">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'error-email' : undefined}
              className="w-full border border-[#351010] bg-[#080808] px-3.5 py-3 text-sm text-white placeholder:text-[#B8B8B8]/55 focus:border-[#FF101A] focus:outline-none"
            />
            {errors.email && (
              <p
                id="error-email"
                className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[#FF101A]"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="mb-1.5 block font-mono text-[11px] tracking-[0.14em] text-white uppercase"
          >
            Subject <span className="text-[#FF101A]">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            placeholder="e.g. Network Engineer Opportunity"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'error-subject' : undefined}
            className="w-full border border-[#351010] bg-[#080808] px-3.5 py-3 text-sm text-white placeholder:text-[#B8B8B8]/55 focus:border-[#FF101A] focus:outline-none"
          />
          {errors.subject && (
            <p
              id="error-subject"
              className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[#FF101A]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block font-mono text-[11px] tracking-[0.14em] text-white uppercase"
          >
            Message <span className="text-[#FF101A]">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            placeholder="Share opportunity details, technical discussions, or questions..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'error-message' : undefined}
            className="w-full resize-y border border-[#351010] bg-[#080808] px-3.5 py-3 text-sm text-white placeholder:text-[#B8B8B8]/55 focus:border-[#FF101A] focus:outline-none"
          />
          {errors.message && (
            <p
              id="error-message"
              className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[#FF101A]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2.5 bg-[#FF101A] px-7 py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#E60012] sm:w-auto"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Send Message</span>
        </button>

        {submittedDemo && (
          <div
            role="status"
            aria-live="polite"
            className="border border-[#FF101A] bg-[#650000]/25 p-4 text-xs leading-relaxed text-white"
          >
            <div className="flex items-center gap-2 font-mono font-semibold text-[#FF101A]">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>DEMO MODE — FORM VALIDATED (NO EMAIL SENT)</span>
            </div>
            <p className="mt-2 text-[#B8B8B8]">
              Your message passed validation. No backend or email service is configured yet, so
              no email was sent.
              {profile.contact.email
                ? ` You can contact ${profile.name} directly at ${profile.contact.email}.`
                : ` Configure an email endpoint or add your email inside src/data/profile.ts for live delivery.`}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
