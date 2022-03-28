export async function getBalance() {

}

export async function getFundsRecords() {
    return await fetch('/api/bank/funds');
}

export async function getExpensesRecords() {
    return await fetch('/api/bank/expenses');
}