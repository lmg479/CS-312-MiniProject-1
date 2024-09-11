// constants
var express = require('express');
var app = express();
const port = 8080;
const blogPosts = [];

// setting up the ejs and url
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

// deal with blog posts
app.get('/', (req, res) => 
{
    // get the index and array of each post
    res.render('index', 
    { 
        blogPosts: blogPosts 
    });
});

// add a new post to the array
app.post('/new', (req, res) => 
{
    // get data and put it into a new post array
    const { title, content, otherInfo, name } = req.body;
    const newPost = { title, content, otherInfo, 
                        name, creationTime: new Date()};

    // push and redirect
    blogPosts.push(newPost);
    res.redirect('/');
});

// render the edit pages for posts
app.get('/edit/:id', (req, res) => 
{
    // get the exact position in the array
    const postId = req.params.id;
    const post = blogPosts[postId];
    res.render('edit', { post: post, postId: postId });
});

// update posts
app.post('/edit/:id', (req, res) => 
{
    // get the array
    const postId = req.params.id;

    // update the array with the new edits if any
    blogPosts[postId] = 
    { 
        title: req.body.title, content: req.body.content,
            otherInfo: req.body.otherInfo, name: req.body.name,
                        creationTime: blogPosts[postId].creationTime 
    };
    // redirect back to homepage
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const postId = req.params.id;

    // remove post and redirect
    delete blogPosts[postId];
    res.redirect('/');

});
// start server at the port
app.listen(port, () => {});
