import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../../middleware/mongoDB'
import User from '../../../models/user';
import Funds from '../../../models/funds';

type Data = {
    funds?: any,
    message?: string
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let user = await User.findOne({ 'name': 'main' });;
    if (!user) { return res.status(404).json({ 'message': 'not found' }); }

    if (req.method === 'GET') {
        let funds = await Funds.find({ 'id': user._id });
        return res.status(200).json({ 'funds': funds });
    } else if (req.method === 'POST') {
        const { amount, description } = req.body;

        let expense = new Funds({
            'amount': amount,
            'description': description,
            'date': new Date(),
            'id': user._id
        });

        expense.save()
            .then((fund: any) => {

                user.avalibleBalance += fund.amount;
                user.save();

                res.status(200).json({
                    'message': 'Funds save in database!'
                })
            })
            .catch ((error: any) => {
                res.status(500).json({
                    'message': error.message
                });
            })
        
    }
}

export default connectDB(handler);