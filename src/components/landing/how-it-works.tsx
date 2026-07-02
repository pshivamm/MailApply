import { motion } from 'framer-motion'
import { UserPlus, FileText, Send, BarChart3 } from '@/lib/icons'

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create Account',
    description:
      'Sign up for free in under a minute. No credit card required to get started.',
  },
  {
    number: 2,
    icon: FileText,
    title: 'Create Templates',
    description:
      'Build beautiful email templates with our editor. Add placeholders for personalization.',
  },
  {
    number: 3,
    icon: Send,
    title: 'Apply Jobs',
    description:
      'Select a template, fill in the details, and send your application with one click.',
  },
  {
    number: 4,
    icon: BarChart3,
    title: 'Track Everything',
    description:
      'Monitor opens, replies, and manage your applications from a single dashboard.',
  },
]

export default function HowItWorks() {
  return (
    <section id="templates" className="relative bg-white py-24 dark:bg-dark-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Send applications in 4 simple steps
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            From signup to sent, get your applications out the door in minutes.
          </p>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute left-50 -translate-x-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className={`relative flex flex-col gap-4 lg:flex-row lg:items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="hidden lg:block flex-1" />
                <div className="relative z-10 flex flex-col items-center lg:items-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/20">
                    <step.icon className="h-7 w-7" />
                    <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs font-bold dark:border-dark-card">
                      {step.number}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark-card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
