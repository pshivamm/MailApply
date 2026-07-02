import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Mail, BarChart3, FileText } from '@/lib/icons'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pb-20 pt-28 dark:bg-dark-bg sm:pt-36">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,black,transparent)]" />

      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div className="max-w-xl">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Launching your career, one email at a time
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              Send Job Applications{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Faster
              </span>{' '}
              Using Smart Email Templates
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg leading-relaxed text-gray-500 dark:text-gray-400"
            >
              Create reusable templates, track every application, and send professional
              emails in seconds.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-6 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Free templates
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Cancel anytime
              </span>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-blue-500/10 dark:border-gray-800 dark:bg-dark-card">
              <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">MailApply Dashboard</span>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Applications
                      </p>
                      <p className="text-xs text-gray-400">12 sent this week</p>
                    </div>
                  </div>
                  <div className="flex h-8 items-center gap-1 rounded-lg bg-green-50 px-2 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    +23%
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Sent', value: '48', color: 'bg-blue-500' },
                    { label: 'Opened', value: '32', color: 'bg-green-500' },
                    { label: 'Replies', value: '12', color: 'bg-purple-500' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-dark-bg"
                    >
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-1.5 rounded-full ${stat.color}`}
                          style={{ width: `${Math.random() * 60 + 20}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { company: 'Acme Corp', role: 'Frontend Developer', status: 'Sent' },
                    { company: 'TechCo', role: 'Full Stack Engineer', status: 'Opened' },
                    { company: 'StartupX', role: 'React Developer', status: 'Replied' },
                  ].map((item) => (
                    <div
                      key={item.company}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-dark-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white">
                          {item.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.role}
                          </p>
                          <p className="text-xs text-gray-400">{item.company}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 py-3 text-sm text-gray-400 dark:border-gray-700">
                  <BarChart3 className="h-4 w-4" />
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Analytics & Templates</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-gray-100 bg-blue-50/50 dark:border-gray-800 dark:bg-blue-950/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
