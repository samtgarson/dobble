import * as React from 'react'
import { Title, Level } from 'rbx'

type DobbleTitleProps = {
  text: string
}

export const DobbleTitle: React.FC<DobbleTitleProps> = ({ text, children }) => (
  <>
    <Level breakpoint="mobile">
      <Level.Item align='left'><Title size={3}>{ text }</Title></Level.Item>
      <Level.Item align='right'>
        { children }
      </Level.Item>
    </Level>
    <style jsx>{`
      @media (max-width: 400px) {
        :global(.title.is-3) {
          font-size: 1em;
        }
      }
    `}</style>
  </>
)
