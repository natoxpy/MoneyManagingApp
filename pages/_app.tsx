/* eslint-disable react/no-unescaped-entities */
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useRouter } from 'next/router';
import Home from '.';



export default function App(props: AppProps) {
    // console.log(props);

    const { Component, pageProps } = props;
    // hook will return either 'dark' or 'light' on client
    // and always 'light' during ssr as window.matchMedia is not available
    // const preferredColorScheme = useColorScheme();

    const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <Head>
                    <title>Page title</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Head>

                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{ colorScheme }} >
                    <NotificationsProvider>
                        <Component {...pageProps} />
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}

