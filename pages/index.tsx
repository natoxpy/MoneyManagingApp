// import { Box, Button, Group, Paper, Container, Text, Grid, Skeleton, createStyles } from '@mantine/core'
// import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
// import { Body } from './pageComponents/body'
// import { BodyHeader } from './components/Header'
// import { NavbarMinimal } from './components/navigationBar'
// import { ThemeToggle } from './components/themeToggleBTN'
// const child = <Skeleton height={140} radius="md" animate={false} />;
// import { FooterSimple } from './components/Footer'
// import { useViewportSize } from '@mantine/hooks';
// import NavigationAndFooter from './components/navegation.tsx/nativation'
// import { Dashboard } from './pageComponents/dashboard'

// const useStyles = createStyles((theme) => ({
//     main: {
//         'marginLeft': useViewportSize().width > 1300 ? '0' : '80px',
//     },
//     footer: {
//         'marginLeft': useViewportSize().width > 1300 ? '0' : '80px',
//     },
//     nav: {
//         'position': 'fixed',
//         'height': '100vh',
//         'zIndex': '999'
//     }
// }));

// export default function Home() {
//     const { classes, cx } = useStyles();

//     return (
//         <NavigationAndFooter content={ Body } />
//     )
// }


import { Box, createStyles } from '@mantine/core'
import { NavbarMinimal } from '../components/navigationBar'
import { FooterSimple } from '../components/Footer'
import { useViewportSize } from '@mantine/hooks';
import { useState } from 'react';
import { Body } from '../pageComponents/body'
import { BrandTelegram } from 'tabler-icons-react';
import { Dashboard } from '../pageComponents/dashboard';

const useStyles = createStyles((theme) => ({
    main: {
        'marginLeft': useViewportSize().width > 1300 ? '0' : '80px',
    },
    footer: {
        'marginLeft': useViewportSize().width > 1300 ? '0' : '80px',
    },
    nav: {
        'position': 'fixed',
        'height': '100vh',
        'zIndex': '0'
    }
}));


export default function Home(props: {
    defaultStart?: 0 | 1 | 2
}) {
    const { classes, cx } = useStyles();
    // nav link selected
    const [navLink, setNavLink] = useState<Number>(props.defaultStart || 0);


    let content;

    switch (navLink) {
    case 0:
        content = <Body />
        break;
    case 1:
        content = <Dashboard />
        break;
    default:
        content = <Body />
        break;
    }

    return (
        <Box my="md">
            <div className={classes.nav}>
                <NavbarMinimal setNavLink={setNavLink} defaultStart={ props.defaultStart || 0 } />
            </div>
            <div className={classes.main}>

                {content}

            </div>
            <div className={classes.footer}>
                <FooterSimple links={[
                    {
                        'label': 'contact',
                        'link': '/contact'
                    },
                    {
                        'label': 'privacy',
                        'link': '/privacy'
                    }
                ]} />
            </div>

        </Box>
    )
}

