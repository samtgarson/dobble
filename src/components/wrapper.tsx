import { motion } from "framer-motion"
import { Section } from "rbx"
import React, { FunctionComponent } from "react"
import cn from 'classnames'
import styles from 'src/styles/components/wrapper.module.scss'

const variants = {
  hidden: { opacity: 0, y: 5, scale: 0.98 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  exit: { opacity: 0, y: 5, scale: 0.98 }
}

const transition = {
  type: 'spring',
  duration: 0.2
}

export const Wrapper: FunctionComponent = ({ children }) => (
  <Section className={styles.section}>
    <motion.div
      className={cn('container', styles.container)}
      variants={variants}
      transition={transition}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      { children }
    </motion.div>
  </Section>
)
