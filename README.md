#Bot Kamath

##Installation
Basically I took shpotify and the facebook-chat-api npm package and turned Facebook Messenger into an ssh client. All you need to do is 

1) clone the repo 
2) change your email and password in index.js
3) run <code>~$ cd fb-chat-ssh && npm install && node index.js</code>

and you should be golden

##Things it can do
* Display commands - "show commands"
* Control your music - "music [play|pause|next|prev|vol up/down]"
* Set passwords - "pw [site, i.e. facebook] [password, i.e. hunter21]"
* Get passwords - "pw get [site]"
* Run any Mac terminal command like ls, say, echo, touch, cat, etc.

I used [shpotify](https://github.com/hnarayanan/shpotify/archive/master.zip) and [facebook-chat-api](https://www.npmjs.com/package/facebook-chat-api)

#IMPORTANT: This has only been tested on Mac. Music controls only work on Mac. Everything else *may* work on Linux/Windows, but no guarantee
