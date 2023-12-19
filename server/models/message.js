
const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const messageSchema = new Schema =({
    author : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        content: {type: string},
        date: {type: Date, default: Date.now},
        type: {type: String}

        
    }

})

module.exports = mongoose.model("Message", messageSchema)


