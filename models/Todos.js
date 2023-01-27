const mongoose = require("mongoose")

const Schema = mongoose.Schema;

let todosSchema = new Schema({
    user: {type: String},
    items: {type: [String]}
})

module.exports = mongoose.model("todo", todosSchema)