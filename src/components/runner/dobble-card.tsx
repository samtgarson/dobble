import React, { FunctionComponent, useMemo } from 'react'
import { Card } from '~/types/game'
import { fi } from '~/util'
import { DobbleIcon } from './dobble-icon'
import { motion, Variants } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from '~/styles/components/dobble-card.module.scss'

const cx = classNames.bind(styles)

type DobbleCardProps = {
  card: Card
  handleChoice?: (index: number) => Promise<boolean>
  faceup?: boolean
  size?: string
  backText?: string
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

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceup = false, size, backText, handleChoice }) => {
  const prefix = useMemo(() => card.join('-'), [card])

  return (
    <motion.div
      key={prefix}
      variants={backText ? {} : variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={cx('card-wrapper', [size]) }
    >
      <div
        className={cx('dobble-card', { faceup })}
      >
        <div className={ cx('card-front') }>
          { card.map((index, i) => (
            <DobbleIcon
              key={`${prefix}-${index}`}
              symbolIndex={index}
              cardIndex={i}
              handleChoice={fi(handleChoice, () => handleChoice!(index))}
            />
          )) }
        </div>
        <div className={ cx('card-back') }>
          <span>{ backText || 'Dobble!' }</span>
        </div>
      </div>
    </motion.div>
  )
}
