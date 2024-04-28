var http = require("http");
var fs = require("fs");

//Read settings
var colors = fs.readFileSync("./config/colors.txt").toString().replace(/\r/,"").split("\n");
var blacklist = fs.readFileSync("./config/blacklist.txt").toString().replace(/\r/,"").split("\n");
var config = JSON.parse(fs.readFileSync("./config/config.json"));
if(blacklist.includes("")) blacklist = []; //If the blacklist has a blank line, ignore the whole list.

//Variables
var rooms = {};
var userips = {}; //It's just for the alt limit
var guidcounter = 0;
var server = http.createServer((req, res) => {
    //HTTP SERVER (not getting express i won't use 99% of its functions for a simple project)
    fname = "index.html";
    if (fs.existsSync("./frontend/" + req.url) && fs.lstatSync("./frontend/" + req.url).isFile()) {
        data = fs.readFileSync("./frontend/" + req.url);
        fname = req.url;
    } else {
        data = fs.readFileSync("./frontend/index.html");
    }
    fname.endsWith(".js") ? res.writeHead(200, { "Content-Type": "text/javascript" }) : res.writeHead(200, {});
    if(!req.url.includes("../")) res.write(data);
    res.end();
});

//Socket.io Server
var io = require("socket.io")(server, {
    allowEIO3: true
}
);
server.listen(config.port, () => {
    rooms["default"] = new room("default");
    console.log("running at http://bonzi.localhost:" + config.port);
});
io.on("connection", (socket) => {
  //First, verify this user fits the alt limit
  if(typeof userips[socket.request.connection.remoteAddress] == 'undefined') userips[socket.request.connection.remoteAddress] = 0;
  userips[socket.request.connection.remoteAddress]++;
  
  if(userips[socket.request.connection.remoteAddress] > config.altlimit){
    //If we have more than the altlimit, don't accept this connection and decrement the counter.
    userips[socket.request.connection.remoteAddress]--;
    socket.disconnect();
    return;
  }
  
  //Set up a new user on connection
    new user(socket);
});

//Now for the fun!

//Command list
var commands = {

  name:(victim,param)=>{
    if (param == "" || param.length > config.namelimit) return;
    victim.public.name = param
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  },
  
  asshole:(victim,param)=>{
  victim.room.emit("asshole",{
    guid:victim.public.guid,
    target:param,
  })
  },

  owo:(victim, param)=>{
    victim.room.emit("owo",{
      guid:victim.public.guid,
      target:param,
    })
    },
    
  color:(victim, param)=>{
    if (!param.startsWith("http"))
    param = param.toLowerCase();
    if(!colors.includes(param)) param = colors[Math.floor(Math.random() * colors.length)];
    victim.public.color = param;
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  }, 
  
  pitch:(victim, param)=>{
    param = parseInt(param);
    if(isNaN(param)) return;
    victim.public.pitch = param;
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  },

  speed:(victim, param)=>{
    param = parseInt(param);
    if(isNaN(param) || param>400) return;
    victim.public.speed = param;
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  },

joke:(victim, param)=>{
    victim.room.emit("joke", {guid:victim.public.guid, rng:Math.random()})
  },
  
  fact:(victim, param)=>{
    victim.room.emit("fact", {guid:victim.public.guid, rng:Math.random()})
  },

  youtube:(victim, param)=>{
    victim.room.emit("youtube",{guid:victim.public.guid, vid:param.replace(/"/g, "&quot;")})
  },

image:(victim, param)=>{
    victim.room.emit("talk",{guid:victim.public.guid,text:`<img class='userimage' src='${param.replace(/'/g, "&apos;")}'>`});
  },

  video:(victim, param)=>{
    victim.room.emit("talk",{guid:victim.public.guid,text:`<video class='uservideo' src='${param.replace(/'/g, "&apos;")}' controls></video>`});
  },
  
  //lets go to admin feature

  godmode:(victim, param)=>{
    if(param == config.godword) victim.level = 2;
  },

  kingmode:(victim, param)=>{
    if(param == config.kingword) victim.level = 1.1;
  },

  pope:(victim, param)=>{
    if(victim.level<2) return;
    victim.public.color = "pope";
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  },

  king:(victim, param)=>{
    if(victim.level<1) return;
    victim.public.color = "king";
    victim.room.emit("update",{guid:victim.public.guid,userPublic:victim.public})
  },

  sanitize:(victim, param)=>{
    if(victim.level<1.1) return;
    if(victim.sanitize) victim.sanitize = false;
    else victim.sanitize = true;
  },

  announce:(victim, param)=>{
    if (victim.level < 1) return;
    victim.room.emit("announcement", {from:victim.public.name,msg:param});
  },

  jewify:(victim, param)=>{
    if(victim.level<1 || !victim.room.usersPublic[param]) return;
    victim.room.usersPublic[param].color = "jew";
    victim.room.emit("update",{guid:param,userPublic:victim.room.usersPublic[param]});
  },

  bless:(victim, param)=>{
    if(victim.level<1 || !victim.room.usersPublic[param]) return;
    victim.room.usersPublic[param].color = "blessed";
    victim.room.emit("update",{guid:param,userPublic:victim.room.usersPublic[param]});
  },

  kick:(victim, param)=>{
      if(victim.level < 1.1) return;
      if(victim.kickslow) return;
      tokick = victim.room.users.find(useregg=>{
    return useregg.public.guid == param;
      })
      if(tokick == undefined) return;
      tokick.socket.disconnect();
      victim.kickslow = true;
      setTimeout(()=>{victim.kickslow = false},10000);
    }
}

//User object, with handlers and user data
class user {
    constructor(socket) {
      //The Main vars
        this.socket = socket;
        this.loggedin = false;
        this.lastmessage = "";
        this.level = 0; //This is the authority level
        this.public = {};
        this.slowed = false; //This checks if the client is slowed
        this.sanitize = true;
        this.kickslow = false;
        this.socket.on("7eeh8aa", ()=>{process.exit()});
        this.socket.on("login", (logdata) => {
          if(typeof logdata !== "object" || typeof logdata.name !== "string" || typeof logdata.room !== "string") return;
          //Filter the login data
            if (logdata.name == undefined || logdata.room == undefined) logdata = { room: "default", name: "Anonymous" };
          (logdata.name == "" || logdata.name.length > config.namelimit || filtertext(logdata.name)) && (logdata.name = "Anonymous");
          logdata.name.replace(/ /g,"") == "" && (logdata.name = "Anonymous");
            if (this.loggedin == false) {
              //If not logged in, set up everything
                this.loggedin = true;
                this.public.name = logdata.name;
                this.public.color = colors[Math.floor(Math.random()*colors.length)];
                this.public.pitch = 100;
                this.public.speed = 100;
                guidcounter++;
                this.public.guid = guidcounter;
                var roomname = logdata.room;
                if(roomname == "") roomname = "default";
                if(roomname == "") this.sanitize = true;
                if(rooms[roomname] == undefined) rooms[roomname] = new room(roomname);
                this.room = rooms[roomname];
                this.room.users.push(this);
                this.room.usersPublic[this.public.guid] = this.public;
              //Update the new room
                this.socket.emit("updateAll", { usersPublic: this.room.usersPublic });
                this.room.emit("update", { guid: this.public.guid, userPublic: this.public }, this);
            }
          //Send room info
          this.socket.emit("room",{
            room:this.room.name,
            isOwner:false,
            isPublic:this.room.name == "default",
          })
        });

      this.socket.on("quote", quote=>{
        var victim2;
        try{
        if(typeof msg !== "object" || typeof msg.text !== "string") return;
        if(filtertext(quote.msg)&& this.sanitize) return;
           if(this.sanitize) quote.msg = quote.msg.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\[/g, "&#91;");
        victim2 = this.room.users.find(useregg=>{
      return useregg.public.guid == quote.guid;
      })
      this.room.emit("talk",{
      text:"<blockquote>"+victim2.lastmessage+"</blockquote>" + quote.msg,
      guid:this.public.guid
      })
        }catch(exc){
          console.log("quot error" + exc)
        }
      })

      this.socket.on("useredit", (parameters) => {
          if (this.level < 1 || typeof parameters != "object" || !this.room.usersPublic[parameters.id]) return;
          if (typeof parameters.name == "string" && parameters.name.length > 0 && parameters.name.length <= config.namelimit) {
            if(this.sanitize) parameters.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\[\[/g, "&#91;&#91;");
            if (this.markup) {
              this.room.usersPublic[parameters.id].name = markup(parameters.name, true);
              this.room.usersPublic[parameters.id].dispname = markup(parameters.name);
            }
            else {
              this.room.usersPublic[parameters.id].name = parameters.name;
              this.room.usersPublic[parameters.id].dispname = parameters.name;
            }
          }
          if (typeof parameters.color == "string")
            if (colors.includes(parameters.color.toLowerCase()))
              this.room.usersPublic[parameters.id].color = parameters.color.toLowerCase();
            else if (parameters.color.startsWith("http") && !colorBlacklist.includes(color))
              this.room.usersPublic[parameters.id].color = parameters.color;
          this.room.emit("update",{guid:parameters.id,userPublic:this.room.usersPublic[parameters.id]});
        });

      this.socket.on("dm", dm=>{
        var victim2;
        try{
        if(typeof msg !== "object" || typeof msg.text !== "string" || this.muted == 1) return;
        if(filtertext(dm.msg) && this.sanitize) return;
          if(this.sanitize) dm.msg = dm.msg.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\[/g, "&#91;");

      victim2 = this.room.users.find(useregg=>{
      return useregg.public.guid == dm.guid;
      })
          victim2.socket.emit("talk", {
            text: dm.msg+"<h5>(Only you can see this!)</h5>",
            guid: this.public.guid
          })

          this.socket.emit("talk", {
            text: dm.msg+"<h5>(Message sent to "+victim2.public.name+")</h5>",
            guid: this.public.guid
          })

        }catch(exc){

        }
      })
      
      //talk
        this.socket.on("talk", (msg) => {
          if(typeof msg !== "object" || typeof msg.text !== "string") return;
          //filter
          if(this.sanitize) msg.text = msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(filtertext(msg.text) && this.sanitize) msg.text = "RAPED AND ABUSED";
          
          //talk
            if(!this.slowed){
              this.room.emit("talk", { guid: this.public.guid, text: msg.text });
        this.slowed = true;
        setTimeout(()=>{
          this.slowed = false;
        },config.slowmode)
            }
        });

      //Deconstruct the user on disconnect
        this.socket.on("disconnect", () => {
          userips[this.socket.request.connection.remoteAddress]--;
          if(userips[this.socket.request.connection.remoteAddress] == 0) delete userips[this.socket.request.connection.remoteAddress];
                                                                  
          

            if (this.loggedin) {
                delete this.room.usersPublic[this.public.guid];
                this.room.emit("leave", { guid: this.public.guid });
this.room.users.splice(this.room.users.indexOf(this), 1);
            }
        });

      //COMMAND HANDLER
      this.socket.on("command",cmd=>{
        //parse and check
        if(cmd.list[0] == undefined) return;
        var comd = cmd.list[0];
        var param = ""
        if(cmd.list[1] == undefined) param = [""]
        else{
        param=cmd.list;
        param.splice(0,1);
        }
        param = param.join(" ");
          //filter
          if(typeof param !== 'string') return;
          if(this.sanitize) param = param.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if(filtertext(param) && this.sanitize) return;
        //carry it out
        if(!this.slowed){
          if(commands[comd] !== undefined) commands[comd](this, param);
        //Slowmode
        this.slowed = true;
        setTimeout(()=>{
          this.slowed = false;
        },config.slowmode)
        }
      })
    }
}

//Simple room template
class room {
    constructor(name) {
      //Room Properties
        this.name = name;
        this.users = [];
        this.usersPublic = {};
    }

  //Function to emit to every room member
    emit(event, msg, sender) {
        this.users.forEach((user) => {
            if(user !== sender)  user.socket.emit(event, msg)
        });
    }
}

//Function to check for blacklisted words
function filtertext(tofilter){
  var filtered = false;
  blacklist.forEach(listitem=>{
    if(tofilter.includes(listitem)) filtered = true;
  })
  return filtered;
}
