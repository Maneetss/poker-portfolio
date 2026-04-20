import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import Showdown from './Showdown';
import './Contact.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [ref, inView] = useInView(0.1);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear error on edit
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim())                          next.name    = 'Please enter your name.';
    if (!form.email.trim())                         next.email   = 'Please enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim()))     next.email   = 'Please enter a valid email address.';
    if (!form.message.trim())                       next.message = 'Please enter a message.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      // Focus first error field
      const first = Object.keys(next)[0];
      const el = document.getElementById(`cf-${first}`);
      if (el) el.focus();
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:Maneetshah9190@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 600);
  };

  const isValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <section id="contact" className="contact felt-bg">
      <div className="section-wrap">
        <motion.div
          ref={ref}
          className="contact__inner"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">§ 05</p>
          <div className="suit-divider"><span aria-hidden="true">♣</span></div>

          <h2 className="contact__heading">Cash Out</h2>
          <p className="section-sub">Get in touch</p>
          <p className="contact__sub">
            Ready to deal me in? Let's build something worth betting on.
          </p>

          {/* Poker hand reveal */}
          <Showdown />

          {/* Links card */}
          <div className="contact__card">
            <div className="contact__card-top">
              <span className="contact__card-suit" aria-hidden="true">♠</span>
              <span className="contact__card-label">Open for Opportunities</span>
              <span className="contact__card-suit contact__card-suit--red" aria-hidden="true">♥</span>
            </div>

            <div className="contact__links">
              <a
                href="mailto:Maneetshah9190@gmail.com"
                className="contact__link"
                aria-label="Send email to Maneet Shah"
              >
                <div className="contact__link-icon" aria-hidden="true"><MailIcon /></div>
                <div className="contact__link-info">
                  <span className="contact__link-label">Email</span>
                  <span className="contact__link-value">Maneetshah9190@gmail.com</span>
                </div>
                <ArrowIcon />
              </a>

              <div className="contact__divider" aria-hidden="true" />

              <a
                href="https://linkedin.com/in/maneetshah"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__link"
                aria-label="Visit Maneet Shah's LinkedIn profile"
              >
                <div className="contact__link-icon" aria-hidden="true"><LinkedInIcon /></div>
                <div className="contact__link-info">
                  <span className="contact__link-label">LinkedIn</span>
                  <span className="contact__link-value">linkedin.com/in/maneetshah</span>
                </div>
                <ArrowIcon />
              </a>

              <div className="contact__divider" aria-hidden="true" />

              <a
                href="https://github.com/Maneetss"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__link"
                aria-label="Visit Maneet Shah's GitHub profile"
              >
                <div className="contact__link-icon" aria-hidden="true"><GitHubIcon /></div>
                <div className="contact__link-info">
                  <span className="contact__link-label">GitHub</span>
                  <span className="contact__link-value">github.com/Maneetss</span>
                </div>
                <ArrowIcon />
              </a>
            </div>

            <div className="contact__card-bottom">
              <span className="contact__card-suit contact__card-suit--red" aria-hidden="true">♦</span>
              <span className="contact__card-motto">
                "In code as in poker — patience and precision win the big pots."
              </span>
              <span className="contact__card-suit" aria-hidden="true">♣</span>
            </div>
          </div>

          {/* Contact form */}
          <div className="contact__form-wrap">
            <div className="contact__form-header">
              <span aria-hidden="true">♠</span>
              <span className="contact__form-title">Send a Message</span>
              <span aria-hidden="true">♠</span>
            </div>

            {sent ? (
              <div className="contact__sent" role="status">
                <span aria-hidden="true">♣</span>
                Message dealt. Opening your email client…
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className={`contact__field${errors.name ? ' contact__field--error' : ''}`}>
                  <label htmlFor="cf-name" className="contact__field-label">Name</label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name…"
                    className="contact__input"
                    value={form.name}
                    onChange={handleChange}
                    aria-describedby={errors.name ? 'cf-name-error' : undefined}
                    aria-invalid={errors.name ? 'true' : undefined}
                    required
                  />
                  {errors.name && (
                    <span id="cf-name-error" className="contact__field-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={`contact__field${errors.email ? ' contact__field--error' : ''}`}>
                  <label htmlFor="cf-email" className="contact__field-label">Email</label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com…"
                    spellCheck={false}
                    className="contact__input"
                    value={form.email}
                    onChange={handleChange}
                    aria-describedby={errors.email ? 'cf-email-error' : undefined}
                    aria-invalid={errors.email ? 'true' : undefined}
                    required
                  />
                  {errors.email && (
                    <span id="cf-email-error" className="contact__field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={`contact__field${errors.message ? ' contact__field--error' : ''}`}>
                  <label htmlFor="cf-message" className="contact__field-label">Message</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    autoComplete="off"
                    placeholder="What are you building?…"
                    className="contact__input contact__textarea"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    aria-describedby={errors.message ? 'cf-message-error' : undefined}
                    aria-invalid={errors.message ? 'true' : undefined}
                    required
                  />
                  {errors.message && (
                    <span id="cf-message-error" className="contact__field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary contact__submit${(!isValid || submitting) ? ' contact__submit--disabled' : ''}`}
                  disabled={!isValid || submitting}
                  aria-disabled={!isValid || submitting}
                  aria-label="Send contact message"
                >
                  {submitting ? (
                    <><span className="contact__spinner" aria-hidden="true" /> Sending…</>
                  ) : (
                    <><span aria-hidden="true">♦</span> Deal Me In</>
                  )}
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </div>

      {/* Footer */}
      <footer className="contact__footer">
        <div className="contact__footer-inner">
          <span className="contact__footer-suits" aria-hidden="true">♠ ♥ ♦ ♣</span>
          <span className="contact__footer-copy">
            © 2026 Maneet Shah · Built with React + Framer Motion
          </span>
          <span className="contact__footer-suits" aria-hidden="true">♣ ♦ ♥ ♠</span>
        </div>
      </footer>
    </section>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 7l-10 7L2 7"/>
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact__arrow" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
