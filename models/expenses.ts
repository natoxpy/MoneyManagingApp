import mongoose from 'mongoose';
var Schema = mongoose.Schema;

interface ExpensesITF {
    'date': Date,
    'amount': number,
    'description': string,
    'id': mongoose.Schema.Types.ObjectId
}



var expenses = new Schema<ExpensesITF>({
    'date': Date,
    'amount': Number,
    'description': String,
    'id': Schema.Types.ObjectId,
});



export default mongoose.models.Expenses || mongoose.model('Expenses', expenses);
