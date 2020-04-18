/* import React, { FunctionComponent, useEffect, useMemo, useState } from "react" */
/* import { useThrottle } from '@react-hook/throttle' */

/* type MicesProps = { */
/*   code: string */
/*   name: string */
/* } */

/* type Position = { */
/*   name: string */
/*   x: number */
/*   y: number */
/* } */

/* type Size = { */
/*   w: number */
/*   h: number */
/* } */

/* const Mices: FunctionComponent<MicesProps> = ({ code, name }) => { */
/*   const [positions, updatePosition] = useState<{ [id: string]: Position | undefined }>({}) */
/*   const [{ w, h }, setSize] = useThrottle<Size>({ w: 1, h: 1 }, 30, true) */
/*   const [{ x, y }, setPosition] = useThrottle<Position>({ x: 1, y: 1, name }, 30, true) */

/*   useEffect(() => { */
/*     updatePosition({ x: x/w, y: y/h, name }) */
/*   }, [x, y, w, h]) */

/*   useEffect(() => { */
/*     if (typeof window === 'undefined') return */

/*     const _setSize = () => setSize({ w: window.innerWidth, h: window.innerHeight }) */
/*     const _setPosition = ({ pageX: x, pageY: y }: MouseEvent) => setPosition({ x, y, name }) */
/*     window.addEventListener('resize', _setSize) */
/*     window.addEventListener('mousemove', _setPosition) */
/*     _setSize() */
/*     return () => { */
/*       window.removeEventListener('resize', _setSize) */
/*       window.removeEventListener('mousemove', _setPosition) */
/*     } */
/*   }, []) */

/*   const players = useMemo(() => */
/*     Object.values(positions).filter<Position>((p): p is Position => Boolean(p.x && p.y)), */
/*     [positions]) */

/*   return ( */
/* <> */
/*     {players.map(({ x: mx, y: my, name }) => ( */
/*       <span */
/*         key={name} */
/*         style={{ transform: `translate3d(${mx * w}px, ${my * h}px, 0)` }} */
/*       >{name} */
/*       </span> */
/*     ) */
/*     )} */
/*     <style jsx>{` */
/*       span { */
/*         position: fixed; */
/*         left: 0; */
/*         top: 0; */
/*         transition: transform 10ms; */
/*       } */
/*     `} */
/*     </style> */
/* </> */
/* ) */
/* } */

/* export default Mices */
