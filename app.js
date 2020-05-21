const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

const url = "mongodb://localhost/RESTBlog";
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("mongo error");
    } else {
      console.log("db connected");
    }
  }
);

const Schema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const Blog = mongoose.model("blog", Schema);

// Blog.create({
//   title: "Mai hu don ji",
//   image:
//     "https://timesofindia.indiatimes.com/thumb/msid-69914063,width-1200,height-900,resizemode-4/.jpg",
//   content: "don ko pakrna muskil hi nhi namumkin hai",
// });

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) console.log("error happens in searching");
    else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog);
  res.redirect("/blogs");
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) console.log("blog not found");
    else res.render("show", { blog: blog });
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) console.log("blog not found in post");
    else res.render("update", { blog: blog });
  });
});
app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log("error occurs while updating");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) console.log("error occur while deleting");
    else {
      res.redirect("/blogs");
    }
  });
});

app.get("*", (req, res) => {
  res.send("Page Not Found");
});
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("server started");
});
