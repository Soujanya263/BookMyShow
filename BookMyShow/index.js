//FINISHED

require('dotenv').config();

const express=require('express');
const mongoose=require('mongoose');
const database=require("./database");

const bookModel=require('./database/book');
const publicationsModel=require('./Database/publication');
const authorModel=require('./Database/author');

const booky=express();

booky.use(express.urlencoded());
booky.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> console.log('Connection has been established'));

booky.get("/",async(req,res)=>{
    const get_all_books=await bookModel.find();
    return res.json(get_all_books);
  });

booky.get("/is/:isbn",async(req,res)=>{
  const get_book_isbn= await bookModel.findOne({book:req.params.ISBN});
  if(!get_book_isbn){
    return res.json({error:`No author found for the book ${req.params.ISBN}`});
  }
  return res.json({book:get_book_isbn});
});

booky.get("/c/:category",async(req,res)=>{
  const get_specific_book= await bookModel.findOne({category: req.params.category});
  if(!get_specific_book)
    return res.json({error:`No Book found in the category ${req.params.category}`});
});

booky.get("/lan/:language",async(req,res)=>{
  const get_book_lan= await bookModel.findOne({book:req.params.language});
  if(!get_book_lan){
    return res.json({error:`No author found for the book ${req.params.language}`});
  }
  return res.json({book:get_book_lan});
})

booky.get('/auth',async(req,res)=>{
    const get_all_author=await authorModel.find();
    return res.json(get_all_author);
})

booky.get('/auth/:id',async(req,res)=>{
    const get_author_id= await authorModel.findOne({book:req.params.id});
    if(!get_author_id){
      return res.json({error:`No author found for the book ${req.params.id}`});
    }
    return res.json({book:get_author_id});
});

booky.get('/ab/:books',async(req,res)=>{
  const get_author_books= await authorModel.findOne({book:req.params.books});
  if(!get_author_books){
    return res.json({error:`No author found for the book ${req.params.books}`});
  }
  return res.json({book:get_author_books});
});

booky.get('/p',async(req,res)=>{
    const get_all_publications=await publicationsModel.find();
    return res.json(get_all_publications);
});

booky.get('/pub/:id',async(req,res)=>{
  const get_publication_id=await publicationsModel.findOne({id:req.params.isbn});
  if(!get_publication_id)
  {return res.json({error:`No publication found on the id ${req.params.isbn}`});}
  return res.json({publication:get_publication_id});
});

booky.get('/pb/:book',async(req,res)=>{
  const get_publication_book=await publicationsModel.findOne({book:req.params.books});
  if(!get_publication_book)
  {return res.json({error:`No publication found on the id ${req.params.books}`});}
  return res.json({publication:get_publication_id});
});

//POST

booky.post('/book/new',async(req,res)=>{
  const {new_book}=req.body;
  const add_new_book=bookModel.create(new_book);
  return res.json({
    books: add_new_book,
    message: "Book added"
  });
});

booky.post('/author/new',async(req,res)=>{
    const {new_author}= req.body;
    const add_new_author= authorModel.create(new_author);
    return res.json({
      author: add_new_author,
      message:"New author has been added"
    });
});
booky.post('/publication/new',async(req,res)=>{
    const {new_publication}=req.body;
    const add_new_publication=publicationsModel.create(new_publication);
    res.json({
      publication: add_new_publication,
      message: "New publication has been added"
    });
})


booky.put("/publication/update/book/:isbn", async(req,res) => {
  const updated_book= await bookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
        title: req.body.book_title
    },
    {
      new: true
    }
  );
  return res.json({books:updated_book})
});



booky.put("/book/author/update/:isbn", async(req,res)=>{
  const updated_book= await bookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet:{
        author: req.body.new_author}

    },
    {
      new: true
    }
  );

  const updated_author= await authorModel.findOneAndUpdate(
    {
      id: req.body.new_author
    },
    {
      $addToSet: {
        author: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      books: updated_book,
      authors :updated_author,
      message: "author was added"
    }
  );
});

booky.delete("/book/delete/:isbn", async (req,res)=>{
  const updated_book_database=await bookModel.findByIdAndDelete(
    {
      ISBN: req.params.isbn
    },
  );
  return res.json({
    books:updated_book_database,
    message: "Book Deleted!!!"
  });
});


booky.listen(3000,()=>{
    console.log("server is up and running in port 3000");
});
