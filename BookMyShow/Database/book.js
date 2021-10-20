const mongoose = require('mongoose');

const bookSchema= mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage: Number,
        author: [Number],
        publications: [Number],
        category: [String]
      }
);

const bookModel=mongoose.model('Books',bookSchema);

module.exports=bookModel;
