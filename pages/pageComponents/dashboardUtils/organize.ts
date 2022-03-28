import { currencyFormat } from 'simple-currency-format';

interface jsonMoneyLog {
    date: Date;
    amount: number;
    description: string;
    type: 'fund' | 'expense'
}

interface Options {
    'expenses'?: boolean
    'funds'?: boolean
}

export function sortMoneyLogs(funds: jsonMoneyLog[], expenses: jsonMoneyLog[], setMoneyLogs: (arg: jsonMoneyLog[]) => void, options?: Options) {
    if (funds && funds[0] == undefined && funds.length == 1) return;
    if (expenses && expenses[0] == undefined && expenses.length == 1) return;

    funds.map((fund) => fund.type = 'fund' );
    expenses.map((expense) => expense.type = 'expense' );

    let merge;

    if (options?.expenses && options?.funds) {
        merge = expenses.concat(funds);
    } else if (options?.expenses) {
        merge = expenses;
    } else if (options?.funds) {
        merge = funds;
    } else {
        return setMoneyLogs([]);
        // merge = expenses.concat(funds);
    }

    merge = merge.filter((log) => new Date().getTime() - new Date(log.date).getTime() < 2592000000);
    merge = merge.sort((log, log2) => new Date(log.date).getTime() > new Date(log2.date).getTime() ? -1 : 1 );
    setMoneyLogs(merge)
}

export function getMoneyExpended(expenses: jsonMoneyLog[], fromDaysAgo: number) {
    if (expenses[0] == undefined && expenses.length == 1) return;

    let amountCount = 0;

    let equa = 1000 * 60 * 60 * 24;

    expenses = expenses.filter((expense) => new Date().getTime() - new Date(expense.date).getTime() < equa * fromDaysAgo);

    for (let expense of expenses) { amountCount += expense.amount; }

    return currencyFormat(amountCount, 'en-US', 'USD');
}
