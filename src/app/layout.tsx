import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TIRAJ ENTERPRISE | Heavy-Duty Washing Machine Stands',
  description: 'Shop TIRAJ ENTERPRISE heavy-duty, adjustable and anti-vibration washing machine stands and appliance trolleys.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
