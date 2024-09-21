import {
  MdCheckCircleOutline,
  MdClose,
  MdErrorOutline,
  MdOutlineMonitorHeart,
} from 'react-icons/md'
import { MergeClassNames } from '../../util'

/**
 * Icon Type.
 *
 * @typedef {string} IconType
 * Possible values are:
 * - 'error': An error icon.
 * - 'check': A check icon.
 * - 'close': A close icon.
 * - 'monitor': A monitor icon.
 */
export type IconType = 'error' | 'check' | 'close' | 'monitor'

/**
 * Icon Props Type.
 *
 * @typedef {Object} IconProps
 * @property {IconType} type - The type of the icon.
 * @property {string} [label] - The label of the icon.
 * @property {string} [className] - The class name of the icon.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export type IconProps = {
  type: IconType
  label?: string
  className?: string
}

export const Icon = (props: IconProps) => {
  const { type, label, className } = props

  const iconClassName = MergeClassNames('h-6 w-6', className)

  switch (type) {
    case 'error':
      return (
        <MdErrorOutline
          className={MergeClassNames(iconClassName, 'text-red-600')}
          {...(typeof label === undefined ? { 'aria-hidden': true } : { title: label })}
        />
      )
    case 'check':
      return (
        <MdCheckCircleOutline
          className={MergeClassNames(iconClassName, 'text-green-700')}
          {...(typeof label === undefined ? { 'aria-hidden': true } : { title: label })}
        />
      )
    case 'close':
      return (
        <MdClose
          className={iconClassName}
          {...(typeof label === undefined ? { 'aria-hidden': true } : { title: label })}
        />
      )
    case 'monitor':
      return (
        <MdOutlineMonitorHeart
          className={MergeClassNames(iconClassName, 'text-green-700')}
          {...(typeof label === undefined ? { 'aria-hidden': true } : { title: label })}
        />
      )
    default:
      return null
  }
}
