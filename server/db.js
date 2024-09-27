const mongoose = require('mongoose')
function Connection() {
    const mongoURI = "mongodb+srv://codex903:x68qSEwqBhM3bNv6@cluster0.hkdmx.mongodb.net/"

    mongoose.connect(mongoURI, { dbName: 'chat-server-db' })
    .then(() => console.log("connected"))
    .catch(err => console.log(err))
}

module.exports = Connection