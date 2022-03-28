import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

const connectDB = (handler: (arg0: NextApiRequest, arg1: NextApiResponse<any>) => any) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return handler(req, res);
    }
    // Use new db connection
    await mongoose.connect(process.env.uri as any);
    return handler(req, res);
};

export default connectDB;