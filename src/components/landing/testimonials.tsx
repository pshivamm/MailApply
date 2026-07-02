import { motion } from 'framer-motion'
import { Quote } from '@/lib/icons'

const testimonials = [
  {
    quote:
      'MailApply saved me hours of time. The templates are incredibly easy to create and the tracking feature helped me follow up at the perfect moment. Landed my dream job within 2 weeks!',
    author: 'Sarah Chen',
    role: 'Frontend Engineer',
    company: 'Stripe',
    initials: 'SC',
  },
  {
    quote:
      'The one-click apply feature is a game-changer. I sent out 30 applications in one afternoon and got 8 responses. The Excel export made it so easy to keep track of everything.',
    author: 'Marcus Johnson',
    role: 'Product Designer',
    company: 'Figma',
    initials: 'MJ',
  },
  {
    quote:
      'I was skeptical at first, but after using MailApply for a month I can honestly say it transformed my job search. The analytics helped me understand what was working and what wasnt.',
    author: 'Priya Patel',
    role: 'Software Engineer',
    company: 'Google',
    initials: 'PP',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
}

export default function Testimonials() {
  return (
    <section className="relative bg-bg py-24 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Loved by job seekers everywhere
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            See what our users have to say about their experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-dark-card"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-100 dark:text-blue-900/50" />

              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                "{testimonial.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
