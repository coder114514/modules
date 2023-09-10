/**
 * The module `rune` provides functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices (r,g,b,a), a transformation matrix for rendering the Rune and a (could be empty) list of its sub-Runes.
 * @module rune
 * @author Hou Ruomu
 */
export {
  anaglyph,
  animate_anaglyph,
  animate_rune,
  beside,
  beside_frac,
  black,
  blank,
  blue,
  brown,
  circle,
  color,
  corner,
  flip_horiz,
  flip_vert,
  from_url,
  green,
  heart,
  hollusion,
  hollusion_magnitude,
  indigo,
  make_cross,
  nova,
  orange,
  overlay,
  overlay_frac,
  pentagram,
  pink,
  purple,
  quarter_turn_left,
  quarter_turn_right,
  random_color,
  rcross,
  red,
  repeat_pattern,
  ribbon,
  rotate,
  sail,
  scale,
  scale_independent,
  show,
  square,
  stack,
  stackn,
  stack_frac,
  translate,
  triangle,
  turn_upside_down,
  white,
  yellow,
} from './functions';
