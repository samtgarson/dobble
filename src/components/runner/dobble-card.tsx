import cn from 'classnames/bind'
import { motion, Variants } from 'framer-motion'
import React, { CSSProperties, FunctionComponent, useMemo } from 'react'
import styles from '~/styles/components/dobble-card.module.scss'
import { Card } from '~/types/game'
import { fi } from '~/util'
import { DobbleIcon } from './dobble-icon'

const cx = cn.bind(styles)

type DobbleCardProps = {
  card: Card
  handleChoice?: (index: number) => Promise<boolean>
  faceUp?: boolean
  small?: boolean
  backText?: string
  rotate?: number
}

const variants = (faceUp: boolean, small?: boolean): Variants => ({
  initial: {
    opacity: faceUp ? 0 : 1,
    rotateY: 45
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transition: { delay: small ? 0.2 : 0 }
  },
  exit: {
    opacity: faceUp ? 0 : 1,
    rotateY: 180
  }
})

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceUp = false, small, backText, handleChoice, rotate: rotateZ = 0 }) => {
  const prefix = useMemo(() => card.join('-'), [card])

  return (
    <motion.div
      key={prefix}
      variants={variants(faceUp, small)}
      initial='initial'
      animate={ faceUp ? 'animate' : 'initial' }
      exit='exit'
      className={cx('card-wrapper', { small }) }
      transition={{ type: 'tween', ease: 'easeInOut' }}
    >
      <div style={{ '--rotateZ': `${rotateZ}deg` } as CSSProperties} className={ cx('card-front') }>
        <svg xmlns="http://www.w3.org/2000/svg"
          height="10"
          width="10"
          viewBox="0 0 10 10"
          className={styles.svg}
        >
          <circle fill="white" cx="5" cy="5" r="5" />
        </svg>
          { card.map((index, i) => (
            <DobbleIcon
              small={small}
              key={`${prefix}-${index}`}
              symbolIndex={index}
              cardIndex={i}
              handleChoice={fi(handleChoice, () => handleChoice!(index))}
            />
          )) }
        </div>
        <div className={ cx('card-back') }>
          <span>{ backText || 'Dobble!' }</span>
          <svg xmlns="http://www.w3.org/2000/svg"
            height="10"
            width="10"
            viewBox="0 0 10 10"
            className={styles.svg}
          >
            <circle fill="var(--pink)" cx="5" cy="5" r="5" />
          </svg>
        </div>
    </motion.div>
  )
}
