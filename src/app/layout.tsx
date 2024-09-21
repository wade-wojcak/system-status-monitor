import './globals.css'

/**
 * Root Layout Props Type.
 *
 * @typedef {Object} RootLayoutProps
 * @property {React.ReactNode} children - The children to be rendered.
 */
export type RootLayoutProps = {
  children: React.ReactNode
}

/**
 * Layout component for the application.
 *
 * @param {RootLayoutProps} props - An object containing the children to be rendered.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export default function RootLayout(props: RootLayoutProps): JSX.Element {
  const { children } = props

  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
