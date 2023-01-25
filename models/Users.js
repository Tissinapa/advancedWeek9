const mongoose = require("mongoose")

const Schema = mongoose.Schema;

let usersSchema = new Schema({
    email: {type: String},
    password: {type: String}
})

module.exports = mongoose.model("users", usersSchema)
