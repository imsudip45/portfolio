import React, { useState, useRef, FormEvent } from 'react';
import { Mail, Github as GitHub, Linkedin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await emailjs.sendForm(
        'service_3u6x0mc',
        'template_olo5ido',
        formRef.current!,
        'vGfJwjCE4vm8PSanW'
      );
      
      setFormStatus('success');
      setFormState({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus('error');
      
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }
  };
  
  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Get In Touch</h2>
          <div className="h-0.5 w-16 bg-indigo-600 dark:bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Have a project in mind or just want to chat? Feel free to reach out!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="text-indigo-600 dark:text-indigo-400 mt-1 mr-4" size={20} />
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Email</h4>
                  <a href="mailto:sudipniroula5@gmail.com" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    sudipniroula5@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <GitHub className="text-indigo-600 dark:text-indigo-400 mt-1 mr-4" size={20} />
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">GitHub</h4>
                  <a 
                    href="https://github.com/imsudip45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    github.com/imsudip45
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Linkedin className="text-indigo-600 dark:text-indigo-400 mt-1 mr-4" size={20} />
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">LinkedIn</h4>
                  <a 
                    href="http://www.linkedin.com/in/sudipniroula45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    linkedin.com/in/sudipniroula45
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Let's Connect</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                I'm currently open to freelance opportunities and interesting projects. If you have something in mind, don't hesitate to reach out.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/imsudip45" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-full transition-colors"
                  aria-label="GitHub"
                >
                  <GitHub size={20} />
                </a>
                <a 
                  href="http://www.linkedin.com/in/sudipniroula45" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-full transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="mailto:sudipniroula5@gmail.com" 
                  className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-full transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Send Me a Message</h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-white"
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-white"
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-white resize-none"
                  disabled={formStatus === 'submitting'}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`
                  w-full px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center
                  ${formStatus === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : formStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                `}
              >
                {formStatus === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <Send size={16} className="ml-2" />
                  </>
                )}
                
                {formStatus === 'submitting' && (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                )}
                
                {formStatus === 'success' && (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Message Sent!
                  </span>
                )}
                
                {formStatus === 'error' && (
                  <span className="flex items-center">
                    Error Sending. Try Again
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;