
interface Props {
    description: string;
    amount: Number
}

export async function postExpense({ amount, description }: Props) {
    return await fetch('/api/bank/expenses', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'amount': amount,
            'description': description
        })
    });
}

export async function postFund({ amount, description }: Props) {
    return await fetch('/api/bank/funds', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'amount': amount,
            'description': description
        })
    });
}