import React, { FunctionComponent, useState } from "react"
import { Section } from "rbx"
import { motion } from "framer-motion"
import { Router } from "next/router"

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
  <Section>
    <motion.div
      className='container'
      variants={variants}
      transition={transition}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      { children }
    </motion.div>
    <style jsx global>{`
      section {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }

      .container {
        padding: 20px;
        max-width: 550px;
        border-radius: 10px;
        background: white;
        box-shadow:  20px 20px 60px #5200b8,
          -20px -20px 60px #7000fa;
      }

      @media (max-width: 400px) {
        .container {
          padding: 10px;
        }
      }
    `}</style>
  </Section>
)
