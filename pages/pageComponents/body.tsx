import React, { useEffect, useRef, useState } from 'react';
import { Grid, Group, createStyles, Skeleton, Container, Text, Paper, Center, Loader } from '@mantine/core';
import { createExpendLog } from './bodyUtils';
import { CreateMoneyLog } from './dashboardUtils';
import { currencyFormat } from 'simple-currency-format';
import { useDidUpdate } from '@mantine/hooks';
import { getExpensesRecords } from './dashboardUtils/getBankData';
import format from 'date-fns/format';
import { getMoneyExpended, sortMoneyLogs } from './dashboardUtils/organize';

const useStyles = createStyles((theme) => ({
    avalTxtPaper: {
        'borderRadius': '7px',
        'height': 'fit-content',
        'background': theme.colors.dark[4],
        'padding': '15px 25px',
        'overflowY': 'auto',

    },
    moneyAval: {
        'fontSize': '30px',
        'fontWeight': 900,
        // 'fontFamily': '\'Roboto\', sans-serif'

    },
    expensesLogsPaper: {
        'background': theme.colors.dark[4],
        'height': 'fit-content',
        'padding': '15px 25px',
    }
}));


export function Body() {
    const { classes } = useStyles();

    const [balance, setBalance] = useState('');
    const [expenses, setExpenses] = useState<Array<any>>([undefined]);
    const [expendedPast30days, setExpendedPast30days] = useState('');

    let getBankInfo = async (url: string = '') => {
        let response = await fetch('/api/bank' + url)
        return await response.json();
    }

    useEffect(() => {
        let isMounted = true;
        getBankInfo().then(data => { if (isMounted) setBalance(currencyFormat(data.balance, 'en-US', 'USD')); })
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        let isMounted = true;
        getBankInfo('/expenses')
            .then(data => {
                if (isMounted) {
                    sortMoneyLogs([], data.expenses || [], setExpenses, {
                        'funds': false,
                        'expenses': true
                    })
                };
            });
        return () => { isMounted = false }
    }, []);

    useEffect(() => {
        setExpendedPast30days(getMoneyExpended(expenses, 30) || '');
    }, [ expenses ])

    return (
        <Container my="sm">
            <Grid>
                <Grid.Col xs={3}>
                    <Paper className={classes.avalTxtPaper}>
                        <Group>
                            <Text size='sm'>Avalible Balance</Text>
                        </Group>
                        <Group position='apart'>
                            <Text weight={700} className={classes.moneyAval}>
                                {balance == '' ? <Loader /> : balance}
                            </Text>
                        </Group>
                        <Group>
                            <Text size='sm'>Expended past 30 days</Text>
                        </Group>
                        <Group>
                            <Text sx={(theme) => ({
                                'fontSize': '20px',
                            })} className={classes.moneyAval}>
                                {expendedPast30days == '' ? <Loader /> : expendedPast30days}
                            </Text>
                        </Group>
                    </Paper>
                </Grid.Col>
                <Grid.Col xs={9}>
                    <Paper className={classes.expensesLogsPaper} >
                        <Group sx={(theme) => ({
                            'marginBottom': '10px'
                        })}>
                            <Text>Expenses over the past 15 days</Text>
                        </Group>
                        <Group>
                            {
                                expenses[0] == undefined ? (
                                    expenses.length == 1 ? <Loader /> : <Text size='lg'>No expenses in the last 15 days</Text>
                                ) : (
                                    expenses.map((expense, idx) =>
                                        CreateMoneyLog({
                                            'amount': expense.amount,
                                            'datetime': expense.date,
                                            'description': expense.description,
                                            'type': 'expense'
                                        }, idx))
                                )
                            }
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
