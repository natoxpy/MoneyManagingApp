import type { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/user';
import connectDB from '../../../middleware/mongoDB'

type Data = {
    balance: string
}

async function findMain() {
    return await User.findOne({ 'name': 'main' });
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let user = await findMain();

    if (user) {
        res.status(200).json({
            'balance': user?.avalibleBalance.toString()
        });
    } else {
        res.status(404);
    }
}

export default connectDB(handler);