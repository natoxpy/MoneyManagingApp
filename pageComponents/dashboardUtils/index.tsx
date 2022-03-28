import { Text, Paper, createStyles, Group, ThemeIcon } from '@mantine/core';
import format from 'date-fns/format';
import { currencyFormat } from 'simple-currency-format';
import { ArrowDownRight, ArrowUpRight } from 'tabler-icons-react';

interface Properties {
    datetime: Date;
    description: string;
    amount: number;
    type: 'fund' | 'expense'
}

function arrowUp() {
    return (
        <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ 'color': theme.colors.green[6] })}
            size={32}
            radius="md"
        >
            <ArrowUpRight size={18} />
        </ThemeIcon>
    )
}

function arrowDown() {
    return (
        <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ 'color': theme.colors.red[6] })}
            size={32}
            radius="md"
        >
            <ArrowDownRight size={18} />
        </ThemeIcon>
    )
}

export function CreateMoneyLog(properties: Properties, key: Number) {
    let time = format(new Date(properties.datetime), 'hh:mmaaaaa\'m\'').toUpperCase();
    let date = format(new Date(properties.datetime), 'MM/dd');
    let amount = currencyFormat(properties.amount, 'en-US', 'USD');

    return (
        <Paper sx={(theme) => ({
            'background': theme.colors.dark[5],
            'height': 'fit-content',
            'padding': '15px 25px',
        })} key={key.toString()}>
            <Group spacing={10}>
                <Text size='sm'>{time}</Text>
                <Text size='sm'>{date}</Text>
            </Group>
            <Group>
                <Text color='white' sx={(theme) => ({
                    'fontSize': '18px',
                    'fontWeight': 700,
                    'opacity': 0.7,
                    'fontFamily': ''
                })}>{amount}</Text>
                {
                    properties.type === 'fund' ? arrowUp() :
                        ( properties.type === 'expense' ) ? arrowDown() : <></>
                }
            </Group>
            <Group>
                <Text> {properties.description} </Text>
            </Group>
        </Paper>
    )
}