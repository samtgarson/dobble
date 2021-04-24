import { motion } from "framer-motion"
import React, { FC } from "react"


type ListItemProps = {
  id: string
  content: string
  label?: string
}

export const ListItem: FC<ListItemProps> = ({ id, content, label }) => (
  <motion.li
    className="is-flex is-justify-content-space-between is-align-items-center mb-3"
    layout
    layoutId={id}
  >
    <span>{ content }</span>
    <span>{ label }</span>
  </motion.li>
)
