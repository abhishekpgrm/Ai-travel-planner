import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Send, Loader, CheckCircle, AlertTriangle, MessageCircle, MapPin, Clock, Heart } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 text-sm font-bold text-purple-700 mb-8">
            <MessageCircle className="w-5 h-5" />
            Let's Connect
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
            Get in <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Have questions about your travel plans? Want to collaborate on something amazing? 
            I'd love to hear from you!
          </p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left Side: Info */}
          <motion.div
            className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col justify-between relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-50 -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full blur-2xl opacity-50 translate-y-12 -translate-x-12" />
            
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="mb-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Let's Create Something Amazing</h2>
                <p className="text-gray-600 text-lg leading-relaxed">Whether you have questions about travel planning or want to collaborate on innovative projects, I'm here to help make it happen.</p>
              </motion.div>
              
              <motion.div className="space-y-6" variants={containerVariants}>
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Email Me</h3>
                      <a href="mailto:abhishekgujjar2200@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                        abhishekgujjar2200@gmail.com
                      </a>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Call Me</h3>
                      <p className="text-blue-600 font-semibold">+91 9306765863</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
                      <p className="text-teal-600 font-semibold">Within 24 hours</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <div className="relative z-10">
              <motion.div variants={itemVariants} className="mt-12">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Connect with me</h3>
                <div className="flex items-center gap-4">
                  <motion.a
                    href="https://www.linkedin.com/in/abhishekgujjar008/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/abhishekpgrm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-6 h-6" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            className="p-6 sm:p-8 lg:p-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-3">Send a Message</h2>
              <p className="text-gray-600">Fill out the form below and I'll get back to you as soon as possible.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 placeholder-gray-400"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 placeholder-gray-400"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 placeholder-gray-400"
                  placeholder="Subject"
                  required
                />
              </div>
              
              <div className="relative">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 placeholder-gray-400 resize-none"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={formState.status === 'loading'}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  whileHover={{ scale: formState.status === 'loading' ? 1 : 1.02, y: formState.status === 'loading' ? 0 : -2 }}
                  whileTap={{ scale: formState.status === 'loading' ? 1 : 0.98 }}
                >
                  {formState.status === 'loading' ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Loader className="w-6 h-6" />
                      </motion.div>
                      <span className="text-lg">Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span className="text-lg">Send Message</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                      />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            
            {formState.status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-6 flex items-center gap-3 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200"
              >
                <CheckCircle className="w-6 h-6" /> 
                <span className="font-semibold">{formState.message}</span>
              </motion.div>
            )}
            
            {formState.status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-6 flex items-center gap-3 text-red-700 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-2xl border border-red-200"
              >
                <AlertTriangle className="w-6 h-6" /> 
                <span className="font-semibold">{formState.message}</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactUsPage;
