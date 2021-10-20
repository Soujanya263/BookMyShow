const mongoose = require('mongoose');

const publicationSchema=mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const publicationsModel= mongoose.model('publications',publicationSchema);

module.exports=publicationsModel;
