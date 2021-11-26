const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema(
{
    title: {type: String, required: true,},
    description:{type: String, required: true,},
    dateCreated:{type: String, required: true},
    complete:{type: Boolean},
    dateCompleted:{type: String},
    author:{type: String}

    //author: {type: Schema.Types.ObjectId, ref: 'User'}
}

);

module.exports = mongoose.model('ToDo', ToDoSchema);