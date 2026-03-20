import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';
import { ThemeInit } from './shared/providers/theme-init';
import { ThemeScript } from './shared/providers/theme-script';

export const metadata = {
    title: 'Smart Task Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body>
                <Providers>
                    <ThemeInit />
                    <Toaster richColors position='top-right' />
                    {children}
                </Providers>
            </body>
        </html>
    )
}