// imports
import express from "express";
import bodyParser from "body-parser";

// constants
const app = express();
const port = 8080
const current_date = new Date();

// create the empty array
var blogPosts = [];

// setting up the ejs and url
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

// deal with blog posts
app.get('/', (req, res) => 
{
    // access html script
    res.render('index.ejs', { blogPosts });
});

// add a new post to the array
app.post('/create-form', (req, res) => 
{
    // get data of each of the contents of new post
    var title = req.body.title, content = req.body.content;
    var otherInfo = req.body.otherInfo, name = req.body.name;

    // put each of the variables into the array
    var newPost = { title, content, otherInfo, 
                        name, creationTime: current_date};

    // add the new post to the next array
    blogPosts[blogPosts.length] = newPost;

    // redirect back to homepage
    res.redirect('/');
});

// render the edit pages for posts
app.get('/edit/:id', (req, res) => 
{
    // get the new elemets of the array
    var postId = req.params.id;

    // get the index of each blog post 
    var post = blogPosts[postId];

    // get the information from the edit section of the html
    res.render('edit', { post, postId });
});

// update posts
app.post('/edit/:id', (req, res) => 
{
    // get the array
    var postId = req.params.id;

    // update the array with the new edits if any
    blogPosts[postId] = 
    { 
        // update title or keep the old title
        title: req.body.title || blogPosts[postId].title,
        content: req.body.content || blogPosts[postId].content,
        otherInfo: req.body.otherInfo || blogPosts[postId].otherInfo,
        name: req.body.name || blogPosts[postId].name,
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
app.listen(port, () => 
    {
        console.log(`Server is running on port ${port}.`);
    });

