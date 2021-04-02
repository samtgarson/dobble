import classNames from 'classnames/bind'
import { motion, Variants } from 'framer-motion'
import React, { FunctionComponent, useMemo } from 'react'
import styles from '~/styles/components/dobble-card.module.scss'
import { Card } from '~/types/game'
import { fi } from '~/util'
import { DobbleIcon } from './dobble-icon'

const cx = classNames.bind(styles)

type DobbleCardProps = {
  card: Card
  handleChoice?: (index: number) => Promise<boolean>
  faceUp?: boolean
  size?: string
  backText?: string
  hideForNew?: boolean
}

const variants: Variants = {
  initial: {
    rotateY: '180deg',
    opacity: 0
  },
  animate: {
    opacity: 1,
    rotateY: '0deg'
  },
  exit: {
    rotateY: '180deg',
    opacity: 0
  }
}

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceUp = false, size, backText, handleChoice }) => {
  const prefix = useMemo(() => card.join('-'), [card])

  return (
    <motion.div
      key={prefix}
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={cx('card-wrapper', [size]) }
    >
      <div className={cx('dobble-card', { faceup: faceUp })}>
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
              small={size === 'small'}
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
