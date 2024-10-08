// imports
import express from "express";
import bodyParser from "body-parser";
<<<<<<< HEAD

// constants
=======
import pkg from 'pg'; 
import session from 'express-session';
import flash from 'connect-flash';

// constants
const { Pool } = pkg; 
>>>>>>> 41128ce (Initial commit with project files)
const app = express();
const port = 8080
const current_date = new Date();

<<<<<<< HEAD
// create the empty array
var blogPosts = [];
=======
// get the session and flash
app.use(session(
{
    secret: 'cs312', resave: false, saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => 
{
    res.locals.messages = req.flash();
    next();
});

// get the database information
const pool = new Pool
({
    user: 'postgres', host: 'localhost', database: 'BlogDB',       
    password: '333964-Rf', port: 5432,               
});
>>>>>>> 41128ce (Initial commit with project files)

// setting up the ejs and url
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

// deal with blog posts
<<<<<<< HEAD
app.get('/', (req, res) => 
{
    // access html script
=======
app.get('/', async(req, res) => 
{
    // get the userid
    const userid = req.session.userid;

    // check if user is logged in
    if (!userid) 
    {
        req.flash('error', 'Please log in to view your posts.');
        return res.redirect('/login');
    }

    // get the blog posts for specific user
    const result = await pool.query
            ('SELECT * FROM blogs WHERE userid = $1', [userid]);
    const blogPosts = result.rows;
>>>>>>> 41128ce (Initial commit with project files)
    res.render('index.ejs', { blogPosts });
});

// add a new post to the array
<<<<<<< HEAD
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

=======
app.post('/create-form', async (req, res) => 
{
    // get the information from user
    const { title, content, name } = req.body;
    const creationTime = current_date;
    const userid = req.session.userid;

    // have user log in if not already
    if (!userid) 
    {
        req.flash('error', 'Please log in to create a blog post.');
        return res.redirect('/login');
    }

    // insert information into the database
    await pool.query
    (
        'INSERT INTO blogs (creator_name, title, body, date_created, userid) VALUES ($1, $2, $3, $4, $5)',
        [name, title, content, creationTime, userid]
    );

    // go back to homepage
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const postId = req.params.id;
    const userid = req.session.userid;
    const result = await pool.query
    (
        'SELECT * FROM blogs WHERE blog_id = $1 AND userid = $2', 
        [postId, userid]
    );
    const post = result.rows[0];
    res.render('edit.ejs', { post, postId });
});

// handle the edit 
app.post('/edit/:id', async (req, res) => 
{
    // get the information from the user and blog post
    const postId = req.params.id;
    const { title, content, name } = req.body;
    const userid = req.session.userid;

    // add information to database
    await pool.query
    (
        'UPDATE blogs SET title = $1, body = $2, creator_name = $3 WHERE blog_id = $4 AND userid = $5',
        [title, content, name, postId, userid]
    );

    //go back to homepage
    res.redirect('/');
});

// deal with deletes
app.post('/delete/:id', async (req, res) =>
{
    // get the exact post number
    const postId = req.params.id;
    const userid = req.session.userid;

    // Delete the post from the database
    await pool.query
    (
        'DELETE FROM blogs WHERE blog_id = $1 AND userid = $2', 
        [postId, userid]
    );

    // go back to homepage
    res.redirect('/');
});

// logging in
app.get('/login', (req, res) => 
{
    res.render('login.ejs');
});
app.post('/login', async (req, res) => 
{
    // get the username and password from user
    const { username, password } = req.body;

    // get the user from the database
    const result = await pool.query
    (
        'SELECT * FROM users WHERE name = $1 AND password = $2', 
        [username, password]
    );

    // make sure username and password exists
    if (result.rows.length > 0) 
    {
        // if it does then we log it into the session
        req.session.userid = result.rows[0].userid;

        // go to homepage
        res.redirect('/');
    } 
    else 
    {
        // Makes user try again if not valid
        req.flash('error', 'Invalid Username or Password. Please try again.');
        res.redirect('/login');
    }
});

// creating user
app.get('/create-profile', (req, res) => 
{
    res.render('create-profile.ejs'); 
});
app.post('/create-profile', async (req, res) => 
{
    // get the name and password from html page
    const { username, password } = req.body;

    // add users name and password to the database 
    await pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [username, password]);

    // go back to homepage
    res.redirect('/login');
>>>>>>> 41128ce (Initial commit with project files)
});

// start server at the port
app.listen(port, () => 
<<<<<<< HEAD
    {
        console.log(`Server is running on port ${port}.`);
    });
=======
{
    console.log(`Server is running on port ${port}.`);
});
>>>>>>> 41128ce (Initial commit with project files)

