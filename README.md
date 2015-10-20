##The App

The application consists of a simple [Sinatra](http://www.sinatrarb.com/) application to serve up the chat room and maintain a list of users.

[Faye](http://faye.jcoglan.com/ruby.html) handles all routing and delivery of messages between clients

The browser application is a set of [React](https://facebook.github.io/react/) components and utilizes Faye's javascript client for communcation with other clients.

Bob is an annoying chat bot that has a few canned responses. Bob is built as a server-side Faye client running inside of EventMachine.

##How To Use

###Starting The App & Bob

1. `bundle install && foreman start`
2. Open browser and navigate to [http://localhost:3000]()

###Ruby Tests

Ruby tests are built on minispec and executed using Rake

`bundle install && rake`

###Javascript Tests

The javascript tests are written using Jest which requires Node v4. With the required node environment installed, run

`npm install && npm test`

##TODO
1. There is no way to remove afk/disconnected users
2. JSX is compiled in the browser. This is deprecated (as of React 0.14)
   and it is slow. Use webpack & Babel to compile the JSX
