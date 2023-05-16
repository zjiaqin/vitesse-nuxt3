import { useBreakpoints as _useBreakpoints, breakpointsTailwind } from '@vueuse/core'

/**
 * @description:
 * sm:640px,
 * md:768px,
 * lg:1024px,
 * xl:1280px,
 * 2xl:1536px,
 * @return {*}
 */
function useBreakpoints() {
  const breakpoints = _useBreakpoints(breakpointsTailwind)
  const sm = breakpoints.smaller('sm')
  const md = breakpoints.between('sm', 'md')
  const lg = breakpoints.between('md', 'lg')
  const xl = breakpoints.between('lg', 'xl')
  const xxl = breakpoints.between('xl', '2xl')
  const xxxl = breakpoints['2xl']
  return { sm, md, lg, xl, xxl, xxxl, breakpoints }
}

export {
  useBreakpoints,
}
