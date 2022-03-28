import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/mongoDB'
import User from '../../../models/user';
import Expenses from '../../../models/expenses';

type Data = {
    expenses?: any,
    message?: string
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let user = await User.findOne({ 'name': 'main' });;
    if (!user) { return res.status(404).json({ 'message': 'not found' }); }

    if (req.method === 'GET') {
        let expenses = await Expenses.find({ 'id': user._id });
        res.status(200).json({ 'expenses': expenses });
    } else if (req.method === 'POST') {
        const { amount, description } = req.body;

        let expense = new Expenses({
            'amount': amount,
            'description': description,
            'date': new Date(),
            'id': user._id
        });

        expense.save()
            .then((expense: any) => {

                user.avalibleBalance -= expense.amount;
                user.save();

                res.status(200).json({
                    'message': 'Expense save in database!'
                })
            })
            .catch ((error: any) => {
                res.status(500).json({
                    'message': error.message
                });
            })
    } else {
        res.status(200);
    }
}

export default connectDB(handler);