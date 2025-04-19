import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { render } from "ejs";

const app = express();
const port = 4000;
const API_URL = "http://localhost:3000";
// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});
app.get("/new", (req, res) => {
  res.render("new.ejs");
});
app.get("/edit/:id",(req, res)=>{
  const heading = "Edit Post";
  const submit = "Update Post";
  const id = parseInt(req.params.id);
  const foundId = posts.find(post => post.id === id);
  if(foundId){
    const updateId ={
      id: foundId.id,
      title: foundId.title,
      content: foundId.content,
      author: foundId.author,
      date: foundId.date,
    }
    res.render("modify.ejs", { heading, submit, updateId });
  }else{
    res.status(404).send("Post not found");
  }

})
//CHALLENGE 2: GET a specific post by id
app.get("/:id", (req, res) =>{
  const id = parseInt(req.params.id);
  const foundId = posts.find(post => post.id === id);
  if(!foundId){
    return res.status(404).send("Post not found");
  }
  res.json(foundId);
})
//CHALLENGE 3: POST a new post
app.post("/posts", (req, res) => {
  try {
    const newPost = {
      id: ++lastId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      date: new Date().toISOString(),
    };
    posts.push(newPost);
    res.render("index.ejs", { posts });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Internal Server Error");
  }
})
//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.post("/edit/post/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const foundId = posts.find(post => post.id === id);
  if(!foundId){
    return res.status(404).send("Post not found");
  }
  foundId.title = req.body.title;
  foundId.content = req.body.content;
  foundId.author = req.body.author;
  foundId.date = new Date().toISOString();
  res.render("index.ejs", { posts });
})
//CHALLENGE 5: DELETE a specific post by providing the post id.
app.get("/delete/:id", (req, res)=>{
  const id = parseInt(req.params.id);
  const foundIndex = posts.findIndex(post => post.id === id);
  if(foundIndex !== -1){
    posts.splice(foundIndex, 1);
  }
  res.render("index.ejs", { posts });
})
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
