import mongoose from 'mongoose';
var Schema = mongoose.Schema;

interface FundsITF {
    'date': Date,
    'amount': number,
    'description': string,
    'id': mongoose.Schema.Types.ObjectId
}

var funds = new Schema<FundsITF>({
    'date': Date,
    'amount': Number,
    'description': String,
    'id': Schema.Types.ObjectId,
});

export default mongoose.models.Funds || mongoose.model('Funds', funds);
