import classNames from 'classnames/bind'
import { motion, Variants } from 'framer-motion'
import React, { FunctionComponent, useMemo } from 'react'
import { CSSProperties } from 'react'
import styles from '~/styles/components/dobble-card.module.scss'
import { Card } from '~/types/game'
import { fi } from '~/util'
import { DobbleIcon } from './dobble-icon'

const cx = classNames.bind(styles)

type DobbleCardProps = {
  card: Card
  handleChoice?: (index: number) => Promise<boolean>
  faceUp?: boolean
  small?: boolean
  backText?: string
  rotate?: number
}

const variants: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
}

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceUp = false, small, backText, handleChoice, rotate = 0 }) => {
  const prefix = useMemo(() => card.join('-'), [card])

  return (
    <motion.div
      key={prefix}
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={cx('card-wrapper', { small }) }
    >
      <div className={cx('dobble-card', { faceup: faceUp })} style={{ '--rotate': `${rotate}deg` } as CSSProperties}>
        <div className={ cx('card-front') }>
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
      </div>
    </motion.div>
  )
}
