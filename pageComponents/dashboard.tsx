import React, { useEffect, useState } from 'react';
import { Grid, Group, createStyles, Skeleton, Container, Text, Paper, Center, Button, Space, Input, NumberInput, Loader, Chips, Chip } from '@mantine/core';
import { CreateMoneyLog } from './dashboardUtils'
import { useNotifications } from '@mantine/notifications';
import { postExpense, postFund } from './dashboardUtils/requests';
import { useForceUpdate, useInputState } from '@mantine/hooks';
import { getBalance, getExpensesRecords, getFundsRecords } from './dashboardUtils/getBankData';
import { currencyFormat } from 'simple-currency-format';
import { getMoneyExpended, sortMoneyLogs } from './dashboardUtils/organize';
import { useRouter } from 'next/router';
import { ArrowUpRight } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
    avalTxtPaper: {
        'borderRadius': '7px',
        'height': 'fit-content',
        'background': theme.colors.dark[4],
        'padding': '15px 30px'
    },
    moneyAval: {
        'fontSize': '30px',
        'fontWeight': 900
    },
    moneyLogsPaper: {
        'borderRadius': '7px',
        'height': 'fit-content',
        'background': theme.colors.dark[4],
        'padding': '15px 25px',
        'overflowY': 'auto',
    },
    hiddenForm: {
        height: 'fit-content',
        background: theme.colors.dark[4],
    }
}));

function Addfunds(amount: any, description: any, setAmount: any, setDescription: any, reloadData: any) {
    const notifications = useNotifications();

    return (
        <>
            <NumberInput placeholder="Total funds" min={0} value={amount} onChange={setAmount} />
            <Space h='sm' />
            <Input placeholder="funds description" onChange={setDescription} value={description} />
            <Space h='sm' />
            <Center>
                <Button onClick={() => {
                    if (amount == 0) {
                        notifications.showNotification({
                            'title': 'You try to add an funds with $0',
                            'message': 'Try again with a number heigher then $0',
                            'color': 'red',
                        });
                    } else if (description.trim() == '') {
                        notifications.showNotification({
                            'title': 'Funds with not description',
                            'message': 'The funds must have a description for the record',
                            'color': 'red',
                        });
                    } else {

                        notifications.showNotification({
                            'loading': true,
                            'title': 'Funds is been added to your account!',
                            'message': 'It can take some seconds to save the funds data'
                        })

                        postFund({
                            'amount': amount,
                            'description': description
                        })
                            .then(r => r.json())
                            .then(data => {
                                notifications.clean();
                                notifications.showNotification({
                                    'title': 'Funds added',
                                    'message': 'Funds were added to your accound logs',
                                    'color': 'green',
                                });

                                reloadData();

                                setAmount(0);
                                setDescription('');
                            })
                            .catch(r => {
                                notifications.clean();
                                notifications.showNotification({
                                    'title': 'Funds could not be save',
                                    'message': r.message,
                                    'color': 'red'
                                });
                            })
                    }
                }}>Add funds</Button>
            </Center>
        </>
    )
}

function AddExpense(amount: any, description: any, setAmount: any, setDescription: any, reloadData: any) {
    const notifications = useNotifications();

    return (
        <>
            <NumberInput placeholder="Total expense" min={0} value={amount} onChange={setAmount} />
            <Space h='sm' />
            <Input placeholder="Expense description" value={description} onChange={setDescription} />
            <Space h='sm' />
            <Center>
                <Button onClick={() => {
                    if (amount == 0) {
                        notifications.showNotification({
                            'title': 'You try to add an expense with $0',
                            'message': 'Try again with a number heigher then $0',
                            'color': 'red',
                        });
                    } else if (description.trim() == '') {
                        notifications.showNotification({
                            'title': 'Expense with not description',
                            'message': 'The expense must have a description for the record',
                            'color': 'red',
                        });
                    } else {

                        notifications.showNotification({
                            'loading': true,
                            'title': 'Expense is been added to your account!',
                            'message': 'It can take some seconds to save the expense data'
                        })

                        postExpense({
                            'amount': amount,
                            'description': description
                        })
                            .then(r => r.json())
                            .then(data => {
                                notifications.clean();
                                notifications.showNotification({
                                    'title': 'Added expense',
                                    'message': 'An expense was added to your accound logs',
                                    'color': 'green',
                                });

                                reloadData();

                                setAmount(0);
                                setDescription('');
                            })
                            .catch(r => {
                                notifications.clean();
                                notifications.showNotification({
                                    'title': 'Expense could not be save',
                                    'message': r.message,
                                    'color': 'red'
                                });
                            })
                    }
                }}>Add expense</Button>
            </Center>
        </>
    )
}

function ExtraInput(form: string, amount: any, description: any, setAmount: any, setDescription: any, reloadData: any) {
    const { classes } = useStyles();

    let formToRender = (form == 'funds') ? Addfunds(amount, description, setAmount, setDescription, reloadData) :
        AddExpense(amount, description, setAmount, setDescription, reloadData);

    return <Paper className={classes.hiddenForm} sx={(theme) => ({
        'padding': '10px 15px',
        'display': form == 'hidden' ? 'none' : 'block',
        // 'visibility': form == 'hidden' ? 'hidden' : 'visible',
    })}>
        {formToRender}
    </Paper>
}

export function Dashboard() {
    const { classes } = useStyles();
    const [hiddenForm, setHiddenForm] = useState('hidden');
    const [amount, setAmount] = useInputState(0);
    const [description, setDescription] = useInputState('');

    const [balance, setBalance] = useState('');
    const [ expendedPast30days, setExpendedPast30days ] = useState('');

    const [expenses, setExpenses] = useState<Array<any>>([undefined]);
    const [funds, setFunds] = useState<Array<any>>([undefined]);
    const [moneyLogs, setMoneyLogs] = useState<Array<any>>([undefined])

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
                    setExpenses(data.expenses);
                };
            });
        getBankInfo('/funds')
            .then(data => {
                if (isMounted) setFunds(data.funds);
            });
        return () => { isMounted = false }
    }, []);

    const [ getLogFunds, setGetLogFunds ] = useState(true);
    const [ getLogExpenses, setGetLogExpenses ] = useState(true);

    useEffect(() => {
        sortMoneyLogs(funds, expenses, setMoneyLogs, { 
            'funds': getLogFunds,
            'expenses': getLogExpenses
        });
        setExpendedPast30days(getMoneyExpended(expenses, 30) || '');
    }, [expenses, funds, getLogExpenses, getLogFunds]);

    let reloadLogs = () => {
        getBankInfo('/expenses')
            .then(data => {
                setExpenses(data.expenses);
                getBankInfo().then(data => { setBalance(currencyFormat(data.balance, 'en-US', 'USD')); })
            });
        getBankInfo('/funds')
            .then(data => {
                setFunds(data.funds);
            });
    }

    return (
        <Container my="sm">
            <Grid>
                <Grid.Col xs={4}>
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
                        <Space h='sm' />
                        <Group>
                            <Button
                                onClick={() => hiddenForm == 'funds' ? setHiddenForm('hidden') : setHiddenForm('funds')}
                            >Add funds</Button>
                            <Button
                                onClick={() => hiddenForm == 'expense' ? setHiddenForm('hidden') : setHiddenForm('expense')}
                                color='red'
                            >Add expense</Button>
                        </Group>

                    </Paper>
                    <Space h='sm' />
                    {ExtraInput(hiddenForm, amount, description, setAmount, setDescription, reloadLogs)}
                </Grid.Col>

                <Grid.Col xs={8}>
                    <Paper className={classes.moneyLogsPaper}>
                        <Group>
                            <Text>Logs over the past 30 days</Text>
                            {/* <Button size='sm' onClick={() => {
                                reloadLogs();
                            }}>
                                Reload
                            </Button> */}

                            <Chips multiple={true} defaultValue={['funds', 'expenses']} onChange={(e) => {
                                setGetLogFunds(e.includes('funds') ? true : false);
                                setGetLogExpenses(e.includes('expenses') ? true : false);
                            }}>
                                <Chip value="funds"> Funds </Chip>
                                <Chip value="expenses"> Expenses </Chip>
                            </Chips>

                        </Group>
                        <Space h='sm' />
                        <Group direction="column" grow>
                            {
                                moneyLogs[0] == undefined ? (
                                    moneyLogs.length == 1 ? <Loader /> : <Text size='lg'>No logs in the last 15 days</Text>
                                ) : (
                                    moneyLogs.map((log, idx) =>
                                        CreateMoneyLog({
                                            'amount': log.amount,
                                            'datetime': log.date,
                                            'description': log.description,
                                            'type': log.type
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
