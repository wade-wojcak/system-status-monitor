import { MergeClassNames } from '../../util'

/**
 * Card Props Type.
 *
 * @typedef {Object} CardProps
 * @property {string} title - The title of the card.
 * @property {React.ReactNode} children - The children to be rendered in the card.
 * @property {string} [className] - Additional class names to be added to the card.
 */
export type CardProps = {
  title: string
  children: React.ReactNode
  className?: string
}

/**
 * Component for displaying a card.
 * The card consists of a header and a body. Any children passed to the component will be rendered inside the body.
 *
 * @param {CardProps} props - An object containing the title, children, and class name.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const Card = (props: CardProps) => {
  const { title, children, className } = props

  return (
    <div className={MergeClassNames('card-container flex w-full flex-col', className)}>
      <div className='flex w-full flex-col bg-slate-600 px-5 py-2.5 text-white'>
        <h2 className='text-lg font-bold'>{title}</h2>
      </div>
      <div className='flex w-full flex-col'>{children}</div>
    </div>
  )
}
