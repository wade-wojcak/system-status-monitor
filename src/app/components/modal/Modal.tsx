import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useRef } from 'react'
import { MdClose } from 'react-icons/md'
import { MergeClassNames } from '../../util'

/**
 * Modal Props Type.
 *
 * @typedef {Object} ModalProps
 * @property {string} [headerText] - The header text of the modal.
 * @property {string} [panelClasses] - The class names of the modal panel.
 * @property {boolean} isOpen - Whether the modal is open or not.
 * @property {() => void} handleClose - A function to close the modal.
 * @property {React.ReactNode} children - The children to be rendered in the modal.
 */
export type ModalProps = {
  headerText?: string
  panelClasses?: string
  isOpen: boolean
  handleClose: () => void
  children: React.ReactNode
}

/**
 * Component for displaying a modal.
 * The modal is a dialog box that can be opened and closed. Any children passed to the component will be rendered inside the modal.
 * Utilizes the @headlessui/react libary for rendering and transitioning the modal.
 *
 * @param {ModalProps} props - An object containing the header text, panel classes, isOpen state, handleClose function, and children.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export const Modal = (props: ModalProps) => {
  const { headerText, panelClasses, isOpen, handleClose, children } = props

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-[9999]'
          onClose={handleClose}
          initialFocus={closeButtonRef}
        >
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-white/50' />
          </TransitionChild>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-200'
                enterFrom='transform opacity-0 translate-y-10'
                enterTo='transform opacity-100 translate-y-0'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-90'
              >
                <DialogPanel
                  className={MergeClassNames('card-container w-full overflow-hidden', panelClasses)}
                >
                  <div
                    className={MergeClassNames(
                      'flex w-full flex-row items-center bg-black px-5 py-2.5',
                      headerText ? 'justify-between' : 'justify-end',
                    )}
                  >
                    {headerText && <p className='font-semibold text-white'>{headerText}</p>}
                    <button
                      className='flex flex-col items-center justify-center'
                      ref={closeButtonRef}
                      onClick={handleClose}
                    >
                      <MdClose className='h-6 w-6 cursor-pointer text-white' aria-hidden='true' />
                      <div className='sr-only'>Close</div>
                    </button>
                  </div>

                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
