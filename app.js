
const render = require('./lib/render');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');

const Koa = require('koa');
const app = module.exports = new Koa();

// "database"

// const posts = [];

// assign Database Name
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';

const dbName = 'mytest';
var client, db, userTable
// var posts
//const db = client.db(dbName)


// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

// route definitions

router.get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

app.use(router.routes());

/**
 * Post listing.
 */

async function list(ctx) {
// Add a New commane line
var posts = await userTable.find({}).toArray()
//var docs = await userTable.find().count()
console.log('DB docs = %j', posts)
// test display array  OK
 for(var i = 0 ; i < posts.length ; i++) {
  console.log("array title = " , posts[i].title)
}

  await ctx.render('list', { posts: posts });
}

/**
 * Show creation form.
 */

async function add(ctx) {
  await ctx.render('new');
}

/**
 * Show post :id.
 */

async function show(ctx) {
  const id = ctx.params.id;
  const oId = new mongodb.ObjectID(id)
  const posts = await userTable.find({_id: oId}).toArray() // posts[id];
  if (!posts) ctx.throw(404, 'invalid post id');
  await ctx.render('show', { post: posts[0] });
}

/**
 * Create a post.
 */

async function create(ctx) {
  const post = ctx.request.body;
  // const id = posts.push(post) - 1;
  post.created_at = new Date();
  // post.id = id;
// test disp
// console.log('ID ='+id)
console.log('Post = %j'+post)

console.log("Connected successfully to server")

var iresult = await userTable.insertOne({title : post.title , body : post.body })

// console.log( "IREsult = " , iresult ) 
// disp "what is iresult" , many lines message about insetrt 1 record in Database


  ctx.redirect('/');
}

// listen
async function main() {
  client = await MongoClient.connect(url)
  db = client.db(dbName)
  userTable = db.collection('user')
  if (!module.parent) app.listen(3000);
}

main().catch(function(error) {
  console.log('error=', error)
})

/*
main().catch(
  (error)=>console.log('error=', error)
)
*/


