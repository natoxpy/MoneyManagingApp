import React, { useState } from 'react';
import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Group, Text } from '@mantine/core';
import {
    Icon as TablerIcon,
    Home2,
    Gauge,
    DeviceDesktopAnalytics,
    Dashboard,
    Fingerprint,
    CalendarStats,
    User,
    Settings,
    Logout,
    SwitchHorizontal,
} from 'tabler-icons-react';
import logo from '../public/logo/CashManaging-logos_white.png';
import Image from 'next/image';
import { useMediaQuery, useOs, useViewportSize } from '@mantine/hooks';
import { collectAssets } from 'next/dist/build/webpack/plugins/middleware-plugin';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: (['windows', 'linux', 'macos', 'undetermined'].includes(useOs())) ?
                (theme.colorScheme === 'dark' ? theme.colors.dark[5] :
                    theme.colors.gray[0]) : 'transparent',
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
            color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7],
        },
    },
    bottomBtns: {

    }
}));

interface NavbarLinkProps {
    icon: TablerIcon;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {

    const { classes, cx } = useStyles();
    return (
        <UnstyledButton onClick={onClick} onTouchStart={onClick} className={cx(classes.link, { [classes.active]: active })}>
            <Icon />
        </UnstyledButton>
        // <Tooltip label={label} position="right" withArrow transitionDuration={0}>

    // </Tooltip>
    );
}

const mockdata = [
    { icon: Home2, label: 'Home', url: '/home' },
    { icon: Gauge, label: 'Dashboard', url: '/dashboard' },
    // { icon: DeviceDesktopAnalytics, label: 'Analytics' },
    // { icon: CalendarStats, label: 'Releases' },
    // { icon: User, label: 'Account' },
    // { icon: Fingerprint, label: 'Security' },
    // { icon: Settings, label: 'Settings' },
];

interface Props {
    setNavLink: (idx: Number) => void;
    defaultStart: 0 | 1 | 2
}

export function NavbarMinimal({ setNavLink, defaultStart }: Props) {
    const [active, setActive] = useState(defaultStart || 0);
    const matches = useMediaQuery('(max-width: 700px)');
    const router = useRouter();

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                if (link && link.url) {
                    router.push(link.url, undefined, { 'shallow': true });
                }
                setActive(index);
                setNavLink(index);
            }}
        />
    ));

    return (
        <>
            <Navbar sx={(theme) => ({
                'height': '100vh',
                'overflowY': 'auto'
            })} width={{ base: 80 }} p="md">
                <Center>
                    <Image src={logo} alt="logo" width='150' height='150' />
                </Center>
                <Navbar.Section grow mt={50}>
                    <Group direction="column" align="center" spacing={0}>
                        {links}
                    </Group>
                </Navbar.Section>
                <Navbar.Section sx={(theme) => ({
                    'paddingBottom': matches ? '100px' : '0px',
                })}>
                    <Group direction="column" align="center" spacing={0} >
                        <NavbarLink icon={SwitchHorizontal} label="Change account" />
                        <NavbarLink icon={Logout} label="Logout" />
                    </Group>
                </Navbar.Section>
            </Navbar>
        </>
    );
}