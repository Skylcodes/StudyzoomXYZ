'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Brain, 
  Mail, 
  MapPin, 
  Phone,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Heart
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'AI Study Tools', href: '/ai-tools' },
    { name: 'Document Library', href: '/library' },
    { name: 'Study Planner', href: '/planner' },
    { name: 'Mobile App', href: '/mobile' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
    { name: 'Story', href: '/story' },
  ],
  resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Study Guides', href: '/guides' },
    { name: 'API Documentation', href: '/docs' },
    { name: 'Community', href: '/community' },
    { name: 'Webinars', href: '/webinars' },
    { name: 'Templates', href: '/templates' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-use' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'Instagram', href: '#', icon: Instagram },
]

export function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-purple-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 border-b border-slate-800/50"
        >
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h3>
            </div>
            <p className="text-slate-400 mb-8">
              Get the latest study tips, AI features, and platform updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StudyZoom
                </span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Revolutionizing education with AI-powered study tools. Transform your learning experience with intelligent flashcards, summaries, quizzes, and personalized study plans.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>San Francisco, CA 94105</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>hello@studyzoom.com</span>
                </div>
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-slate-800/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-slate-400">
              <span>© 2024 StudyZoom. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for students worldwide.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110 group"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
                  </Link>
                )
              })}
            </div>

            {/* Back to Top */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-slate-700 text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 