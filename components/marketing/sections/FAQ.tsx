'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/Badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "How does the AI-powered learning system work?",
    answer: (
      <>
        <p>Our AI system uses <strong className="text-blue-400">advanced machine learning</strong> to adapt to your learning style and pace. It analyzes your responses, identifies knowledge gaps, and creates personalized study paths that help you master complex subjects efficiently.</p>
        <p className="mt-3 bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500">
          <span className="font-medium">Start learning now</span> - our AI will adapt to your needs from day one!
        </p>
      </>
    )
  },
  {
    question: "What makes our platform different from traditional study methods?",
    answer: (
      <>
        <p>Unlike traditional methods, we combine <strong className="text-blue-400">AI-driven personalization</strong> with proven learning techniques. Our system tracks your progress in real-time, adjusts difficulty dynamically, and provides instant feedback to ensure optimal learning outcomes.</p>
      </>
    )
  },
  {
    question: "Can I use this for any subject or course?",
    answer: (
      <>
        <p>Yes! Our platform supports <strong className="text-blue-400">all academic subjects</strong> and professional topics. Whether you&apos;re studying calculus, biology, computer science, or preparing for standardized tests, our AI adapts to provide relevant content and exercises.</p>
        <p className="mt-2">Plus, you can easily import your own study materials to enhance your learning experience.</p>
      </>
    )
  },
  {
    question: "Is my academic data private and secure?",
    answer: (
      <>
        <p>Absolutely. We use <strong className="text-blue-400">bank-level encryption</strong> to protect your data. Your study materials, progress, and personal information are completely private and never shared with third parties.</p>
        <p className="mt-2 text-sm text-gray-400">You have full control over your data and can export or delete it anytime.</p>
      </>
    )
  },
  {
    question: "What's included in the free version vs. pro?",
    answer: (
      <>
        <p>The free version includes core AI-powered learning features with reasonable usage limits. <strong className="text-blue-400">Pro subscribers</strong> get unlimited access to advanced features, priority support, and exclusive study resources.</p>
        <p className="mt-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-3 rounded-lg border border-white/10">
          <span className="font-medium">Join thousands of successful students</span> who have upgraded to Pro to maximize their academic potential!
        </p>
      </>
    )
  }
];

export function FAQ(): React.JSX.Element {
  return (
    <section className="w-full py-24 relative bg-gradient-to-b from-gray-950/80 to-black overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-1/4 left-0 w-1/2 h-full bg-purple-600/5 blur-[150px] rounded-full opacity-50" />
      <div className="absolute -bottom-1/4 right-0 w-1/2 h-full bg-blue-600/5 blur-[150px] rounded-full opacity-50" />

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="mb-6 bg-black/30 border-blue-500/30 text-blue-400 backdrop-blur-md text-sm px-4 py-1.5 rounded-full shadow-lg animate-pulse hover:animate-none transition-all"
          >
            ❓ Got Questions? We&apos;ve Got Answers
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-white">Common </span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Everything you need to know about supercharging your study sessions. Can&apos;t find what you&apos;re looking for? Our support team is just a click away.
          </p>
        </motion.div>

        {/* FAQ Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className={cn(
                    "border-b border-white/10 transition-colors hover:border-blue-500/30",
                    index === 0 && "border-t hover:border-t-blue-500/30",
                    "group"
                  )}
                >
                  <AccordionTrigger className="group-has-[.active]:text-blue-400 text-left text-lg font-medium py-6 text-white hover:text-blue-400 transition-all">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-400 opacity-0 group-has-[.active]:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
} 