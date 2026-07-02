import { motion } from 'framer-motion'
import {
  FileText,
  Zap,
  MailCheck,
  FileSpreadsheet,
  BarChart3,
  Smartphone,
} from '@/lib/icons'

const features = [
  {
    icon: FileText,
    title: 'Reusable Templates',
    description:
      'Create and save email templates for different job types. Stop writing the same cover letters over and over.',
  },
  {
    icon: Zap,
    title: 'One-click Apply',
    description:
      'Send applications instantly with pre-built templates. One click and your application is on its way.',
  },
  {
    icon: MailCheck,
    title: 'Email Tracking Ready',
    description:
      'Know when your emails are opened and read. Get real-time notifications when recruiters view your application.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Export Excel',
    description:
      'Download your application data as Excel files. Keep records of all your job applications organized.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track your job application metrics in real-time. Monitor response rates and optimize your approach.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description:
      'Access your templates from any device. Your applications are always available, wherever you are.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function Features() {
  return (
    <section id="features" className="relative bg-bg py-24 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to land your dream job
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Powerful tools to streamline your job application process and stand out from
            the crowd.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md hover:border-blue-100 dark:border-gray-800 dark:bg-dark-card dark:hover:border-blue-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:group-hover:bg-blue-900/50">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
