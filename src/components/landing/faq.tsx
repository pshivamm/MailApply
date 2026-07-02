import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What is MailApply and how does it work?',
    answer:
      'MailApply is a job application management platform that lets you create reusable email templates, send applications with one click, and track everything from a single dashboard. Simply create an account, build your templates, and start applying to jobs instantly.',
  },
  {
    question: 'Is there a free plan available?',
    answer:
      'Yes! We offer a free plan that includes 3 email templates and up to 10 applications per month. No credit card is required to get started. You can upgrade to Pro at any time when you need more.',
  },
  {
    question: 'Can I track when my emails are opened?',
    answer:
      'Yes, email tracking is available on Pro and Enterprise plans. You will receive real-time notifications when a recruiter opens your email, allowing you to follow up at the perfect moment.',
  },
  {
    question: 'Can I export my application data?',
    answer:
      'Absolutely! Pro and Enterprise users can export all their application data as Excel files. This includes application dates, companies, positions, status, and response rates.',
  },
  {
    question: 'What kind of templates can I create?',
    answer:
      'You can create templates for cover letters, follow-up emails, thank-you notes, and any other job-related correspondence. Each template supports placeholders for personalization like company name, position, and recruiter name.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-bg py-24 dark:bg-dark-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Everything you need to know about MailApply.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={index === faqs.length - 1 ? 'border-b-0' : ''}
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
