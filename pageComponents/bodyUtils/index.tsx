import { Group, Paper, Text } from '@mantine/core';

export function createExpendLog(key: Number) {
    return (
        <Paper key={key.toString()} sx={(theme) => ({
            'background': theme.colors.dark[5],
            'padding': '15px 25px'
        })}>
            <Group spacing={10}>
                <Text size='sm'>11:44AM</Text>
                <Text size='sm'>3/27</Text>
            </Group>
            <Text color='white' sx={(theme) => ({
                'fontSize': '18px',
                'fontWeight': 700,
                'opacity': 0.7,
            })}>$20.00</Text>
            <Text>
                Bought 20$ Apple Store gift card
            </Text>
        </Paper>)

}
