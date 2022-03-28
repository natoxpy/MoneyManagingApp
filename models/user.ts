import mongoose from 'mongoose';
var Schema = mongoose.Schema;

interface UserITF {
    name: 'main',
    avalibleBalance: number;
    secretBalance: Number;
}

var user = new Schema<UserITF>({
    name: {
        'type': String,
        'unique': true
    },
    avalibleBalance: Number,
    secretBalance: Number
});

export default mongoose.models.User || mongoose.model('User', user);
