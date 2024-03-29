import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { Section } from 'rbx'
import { FunctionComponent } from 'react'
import styles from 'src/styles/components/wrapper.module.scss'

const variants = {
  hidden: { opacity: 0, y: 5, scale: 0.98 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  exit: { opacity: 0, y: 5, scale: 0.98 }
}

const transition = {
  type: 'spring',
  duration: 0.4
}

export const Wrapper: FunctionComponent<{
  children: React.ReactNode
  className?: string
  featured?: boolean
}> = ({ children, className, featured }) => (
  <AnimatePresence>
    <Section
      className={cn(styles.section, className, { [styles.featured]: featured })}
    >
      <motion.div
        layout
        className={cn('container', styles.container)}
        variants={variants}
        transition={transition}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {children}
      </motion.div>
    </Section>
  </AnimatePresence>
)
