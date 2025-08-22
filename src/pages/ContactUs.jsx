import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Send, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import Header from '../components/custom/Header';

const FloatingLabelInput = ({ id, label, type = 'text', value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 pt-6 pb-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-300"
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none ${
          isFloating 
            ? 'top-2 text-xs text-teal-600 font-medium' 
            : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const InfoCard = ({ icon, title, content, href }) => (
  <motion.div
    className="flex items-start gap-4"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
  >
    <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      {href ? (
        <a href={href} className="text-gray-600 hover:text-teal-500 transition-colors">
          {content}
        </a>
      ) : (
        <p className="text-gray-600">{content}</p>
      )}
    </div>
  </motion.div>
);

const SocialLink = ({ icon, href, 'aria-label': ariaLabel }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="text-gray-500 hover:text-teal-500 transition-colors"
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );

function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ status: 'loading', message: '' });
    
    try {
      const response = await fetch('https://formspree.io/f/mpwrnyqd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setFormState({ status: 'success', message: 'Thank you! Your message has been sent.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setFormState({ status: 'error', message: 'There was an issue sending your message. Please try again later.' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl shadow-gray-300/30 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
        {/* Left Side: Info */}
        <motion.div
          className="p-8 sm:p-12 bg-gray-100/50 flex flex-col justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-2">Get in Touch</motion.h1>
            <motion.p variants={itemVariants} className="text-gray-600 mb-10 text-lg">Collaborate to Innovate and Create Something Extraordinary.</motion.p>
            
            <motion.div className="space-y-8" variants={containerVariants}>
              <InfoCard icon={<Mail size={22} />} title="Email" content="abhishekgujjar2200@gmail.com" href="mailto:abhishekgujjar2200@gmail.com" />
              <InfoCard icon={<Phone size={22} />} title="Phone" content="+91 9306765863" />
            </motion.div>
          </div>

          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-6 mt-12">
              <SocialLink icon={<Linkedin size={28} />} href="https://www.linkedin.com/in/abhishekgujjar008/" aria-label="LinkedIn Profile" />
              <SocialLink icon={<Github size={28} />} href="https://github.com/abhishekpgrm" aria-label="GitHub Profile" />
            </motion.div>

          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          className="p-8 sm:p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingLabelInput id="name" label="Your Name" value={formData.name} onChange={handleInputChange} />
            <FloatingLabelInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />
            <FloatingLabelInput id="subject" label="Subject" value={formData.subject} onChange={handleInputChange} />
            <div className="relative">
              <textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 pt-6 pb-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-300"
                placeholder=" "
                required
              ></textarea>
              <label 
                htmlFor="message" 
                className={`absolute left-4 transition-all duration-300 ease-in-out pointer-events-none ${
                  formData.message 
                    ? 'top-2 text-xs text-teal-600 font-medium' 
                    : 'top-4 text-base text-gray-500'
                }`}
              >
                Your Message
              </label>
            </div>
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={formState.status === 'loading'}
                className="w-full bg-teal-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {formState.status === 'loading' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader size={20} /></motion.div>}
                {formState.status !== 'loading' && <Send size={20} />}
                {formState.status === 'loading' ? 'Sending...' : 'Send Message'}
              </motion.button>
            </div>
          </form>
          {formState.status === 'success' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg">
              <CheckCircle size={20} /> {formState.message}
            </motion.div>
          )}
          {formState.status === 'error' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-lg">
              <AlertTriangle size={20} /> {formState.message}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

export default ContactUsPage;
