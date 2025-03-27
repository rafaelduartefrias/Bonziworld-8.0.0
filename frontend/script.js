"use strict";
var moving = false;
var passcode = "";
var err = false;
var target;
var mouseevents = {
    mousemove: "mousemove",
    mousedown: "mousedown",
    mouseup: "mouseup"
}
function quote() {
    socket.emit("quote", { msg: $("#replyvalue").val(), guid: $("#guid").val() })
    $("#quote").hide();
    $("#replyvalue").val("");
}
function dm() {
    socket.emit("dm", { msg: $("#dmvalue").val(), guid: $("#dmguid").val() })
    $("#dm").hide();
    $("#dmvalue").val("");
}
function youtubeParser(a) {
    var b = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        c = a.match(b);
    return !(!c || 11 != c[7].length) && c[7];
}
function updateAds() {
    var a = $(window).height() - $(adElement).height(),
        b = a <= 250;
    b && (a = $(window).height()), $(adElement)[b ? "hide" : "show"](), $("#content").height(a);
}
function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function range(a, b) {
    for (var c = [], d = a; d <= b; d++) c.push(d);
    for (var d = a; d >= b; d--) c.push(d);
    return c;
}
function replaceAll(a, b, c) {
    return a.replace(new RegExp(b, "g"), c);
}
function s4() {
    return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
}
function movestart(mouse, self) {
    if (moving) return;
    if (mouse.touches != undefined) mouse = mouse.touches[0];
    target = self;
    //Find offset of mouse to target
    target.offsetx = mouse.clientX - target.x;
    target.offsety = mouse.clientY - target.y;
    target.lx = target.x;
    target.ly = target.y;
    //Enable moving
    moving = window.cont == undefined;
}

function mouseup(mouse) {
    if (mouse.touches != undefined) mouse = mouse.touches[0];
    moving = false;
}

function mousemove(mouse) {
    if (mouse.touches != undefined) mouse = mouse.touches[0];
    if (!moving) return;

    //Find new x. If new x above or below limits, set it to appropriate limit.
    target.x = Math.max(minx, Math.min(innerWidth - target.w, mouse.clientX - target.offsetx))

    //Do the same as above to Y
    target.y = Math.max(0, Math.min(innerHeight - target.h - 32, mouse.clientY - target.offsety));
    target.update();
}
function rInterval(a, b) {
    var c,
        d = Date.now,
        e = window.requestAnimationFrame,
        f = d(),
        g = function () {
            d() - f < b || ((f += b), a()), c || e(g);
        };
    return (
        e(g),
        {
            clear: function () {
                c = 1;
            },
        }
    );
}
function linkify(a) {
    var b = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/gi;
    return a.replace(b, "<a href='$1' target='_blank'>$1</a>");
}
function loadBonzis(a) {
    loadQueue.loadManifest([
        { id: "bonziPurple", src: "./img/bonzi/purple.png" },
        { id: "peedy", src: "./img/bonzi/peedy.png" },
      { id: "clippy", src: "./img/bonzi/clippy.png" },
      { id: "genie", src: "./img/bonzi/genie.png" },
      { id: "merlin", src: "./img/bonzi/merlin.png" },
      { id: "bonzi", src: "./img/bonzi/bonzi.png" },
      { id: "rover", src: "./img/bonzi/rover.png" },
      { id: "floyd", src: "./img/bonzi/floyd.png" },
      { id: "jew", src: "./img/bonzi/jew.png" },
    ]),
        loadQueue.on(
            "fileload",
            function (a) {
                loadDone.push(a.item.id);
            },
            this
        ),
        a && loadQueue.on("complete", a, this);
}
function loadTest() {
    $("#login_card").hide(),
        $("#login_error").hide(),
        $("#login_load").show(),
        (window.loadTestInterval = rInterval(function () {
            try {
                if (!loadDone.equals(loadNeeded)) throw "Not done loading.";
                login(), loadTestInterval.clear();
            } catch (a) {}
        }, 100));
}
function login() {
   socket.emit("login", {passcode:passcode, name: $("#login_name").val(), room: $("#login_room").val() }), setup();
}
function errorFatal() {
    ("none" != $("#page_ban").css("display") && "none" != $("#page_kick").css("display")) || $("#page_error").show();
}
function setup() {
    $("#chat_send").click(sendInput),
        $("#chat_message").keypress(function (a) {
            13 == a.which && sendInput();
        }),
        socket.on("room", function (a) {
            $("#room_owner")[a.isOwner ? "show" : "hide"](), $("#room_public")[a.isPublic ? "show" : "hide"](), $("#room_private")[a.isPublic ? "hide" : "show"](), $(".room_id").text(a.room);
        }),
        socket.on("updateAll", function (a) {
            $("#page_login").hide(), (usersPublic = a.usersPublic), usersUpdate(), BonziHandler.bonzisCheck();
            $("#log").show();
        }),
        socket.on("update", function (a) {
            (window.usersPublic[a.guid] = a.userPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("talk", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.runSingleEvent([{ type: "text", text: a.text }]);
        }),
        socket.on("asshole", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.asshole(a.target);
        }),
socket.on("joke", function (a) {
            var b = bonzis[a.guid];
            (b.rng = new Math.seedrandom(a.rng)), b.cancel(), b.joke();
        }),
      socket.on("fact", function (a) {
            var b = bonzis[a.guid];
            (b.rng = new Math.seedrandom(a.rng)), b.cancel(), b.fact();
        }),
        socket.on("owo", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.owo(a.target);
        }),
        socket.on("announcement", function (a) {
         new msWindow("Announcement From: " + a.from, a.msg,
                      [{
                        name: "Cancel"
                        }]);
        }),

        socket.on("youtube", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.youtube(a.vid);
        }),
        socket.on("leave", function (a) {
            var b = bonzis[a.guid];
            "undefined" != typeof b &&
                b.exit(
                    function (a) {
                        this.deconstruct(), delete bonzis[a.guid], delete usersPublic[a.guid], usersUpdate();
                    }.bind(b, a)
                );
        });
}
function usersUpdate() {
    (usersKeys = Object.keys(usersPublic)), (usersAmt = usersKeys.length);
}
function sendInput() {
    var a = $("#chat_message").val();
    if (($("#chat_message").val(""), a.length > 0)) {
      var b = youtubeParser(a);
      if (b) return void socket.emit("command", { list: ["youtube", b] });
        if ("/" == a.substring(1, 0)) {
            var c = a.substring(1).split(" ");
            socket.emit("command", { list: c });
        } else socket.emit("talk", { text: a });
    }
}
function touchHandler(a) {
    var b = a.changedTouches,
        c = b[0],
        d = "";
    switch (a.type) {
        case "touchstart":
            d = "mousedown";
            break;
        case "touchmove":
            d = "mousemove";
            break;
        case "touchend":
            d = "mouseup";
            break;
        default:
            return;
    }
    var e = document.createEvent("MouseEvent");
    e.initMouseEvent(d, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), c.target.dispatchEvent(e);
}
var adElement = "#ap_iframe";
$(function () {
    $(window).load(updateAds), $(window).resize(updateAds), $("body").on("DOMNodeInserted", adElement, updateAds), $("body").on("DOMNodeRemoved", adElement, updateAds);
});
var _createClass = (function () {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                (d.enumerable = d.enumerable || !1), (d.configurable = !0), "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
            }
        }
        return function (b, c, d) {
            return c && a(b.prototype, c), d && a(b, d), b;
        };
    })(),
    Bonzi = (function () {
        function a(b, c) {
            var d = this;
            _classCallCheck(this, a),
                (this.userPublic = c || { name: "BonziBUDDY", color: "purple", speed: 175, pitch: 50, voice: "en-us" }),
                (this.color = this.userPublic.color),
                this.colorPrev,
                (this.data = window.BonziData),
                (this.drag = !1),
                (this.dragged = !1),
                (this.eventQueue = []),
                (this.eventRun = !0),
                (this.event = null),
                (this.willCancel = !1),
                (this.run = !0),
                (this.mute = !1),
                (this.eventTypeToFunc = { anim: "updateAnim", html: "updateText", text: "updateText", idle: "updateIdle", add_random: "updateRandom" }),
                "undefined" == typeof b ? (this.id = s4() + s4()) : (this.id = b),
                (this.rng = new Math.seedrandom(this.seed || this.id || Math.random())),
                (this.selContainer = "#content"),
                (this.$container = $(this.selContainer)),
                this.$container.append(
                    "\n\t\t\t<div id='bonzi_" +
                        this.id +
                        "' class='bonzi'>\n\t\t\t\t<div class='bonzi_name'></div>\n\t\t\t\t\t<div class='bonzi_placeholder'></div>\n\t\t\t\t<div style='display:none' class='bubble'>\n\t\t\t\t\t<p class='bubble-content'></p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t"
                ),
                (this.selElement = "#bonzi_" + this.id),
                (this.selDialog = this.selElement + " > .bubble"),
                (this.selDialogCont = this.selElement + " > .bubble > p"),
                (this.selNametag = this.selElement + " > .bonzi_name"),
                (this.selCanvas = this.selElement + " > .bonzi_placeholder"),
                $(this.selCanvas).width(this.data.size.x).height(this.data.size.y),
                (this.$element = $(this.selElement)),
                (this.$canvas = $(this.selCanvas)),
                (this.$dialog = $(this.selDialog)),
                (this.$dialogCont = $(this.selDialogCont)),
                (this.$nametag = $(this.selNametag)),
                this.updateName(),
                $.data(this.$element[0], "parent", this),
                this.updateSprite(!0),
                (this.generate_event = function (a, b, c) {
                    var d = this;
                    a[b](function (a) {
                        d[c](a);
                    });
                }),
                this.generate_event(this.$canvas, "mousedown", "mousedown"),
                this.generate_event($(window), "mousemove", "mousemove"),
                this.generate_event($(window), "mouseup", "mouseup");
            var e = this.maxCoords();
            (this.x = e.x * this.rng()),
                (this.y = e.y * this.rng()),
                this.move(),
                $.contextMenu({
                    selector: this.selCanvas,
                    build: function (a, b) {
                        return {
                            items: {
                                cancel: {
                                    name: "Cancel",
                                    callback: function () {
                                        d.cancel();
                                    },
                                },
                                //mute: {
                                    //name: function () {
                                        //return d.mute ? "Unmute" : "Mute";
                                    //},
                                    //callback: function () {
                                        //d.cancel(), (d.mute = !d.mute);
                                    //},
                                //},
                                dm: {
                                    name: "Private Message",
                                    callback: function () {
                                        $("#dmto").html("Message " + d.userPublic.name);
                                        $("#dmguid").val(d.id);
                                        $("#dm").show();
                                    },
                                },
                                quote: {
                                    name: "Quote/Reply",
                                    callback: function () {
                                        $("#replyto").html("Reply to " + d.userPublic.name);
                                        $("#guid").val(d.id);
                                        $("#quote").show();
                                    },
                                },
                                asshole: {
                                    name: "Call an Asshole",
                                    callback: function () {
                                        socket.emit("command", { list: ["asshole", d.userPublic.name] });
                                    },
                                },
                              owo: {
                                  name: "Notice Bulge",
                                  callback: function () {
                                      socket.emit("command", { list: ["owo", d.userPublic.name] });
                                  },
                              },
                              gmcs: {
                                    name: "Gamer Mod CMDs",
                                    items: {
                              jew: {
                                        name: "Jewify",
                                        callback: function () {
                                            socket.emit("command", { list: ["jewify", d.id] });
                                        }
                                    },
                                    bless: {
                                        name: "Bless",
                                        callback: function () {
                                            socket.emit("command", { list: ["bless", d.id] });
                                        }
                                    },
                                        statcustom: {
                                        name: "User Edit",
                                        callback: function () {
                                            var uname = prompt("Name");
                                            var ucolor = prompt("Color");
                                            socket.emit("useredit", { id: d.id, name: uname, color: ucolor });
                                        }
                                    },
                              kick: {
                                    name: "Kick",
                                    callback: function () {
                                        socket.emit("command", { list: ["kick", d.id] });
                                          },
                                       },
                                    },
                                },
                            },
                        };
                    },
                    animation: { duration: 175, show: "fadeIn", hide: "fadeOut" },
                }),
                (this.needsUpdate = !1),
                this.runSingleEvent([{ type: "anim", anim: "surf_intro", ticks: 30 }]);
        }
        return (
            _createClass(a, [
                {
                    key: "eventMake",
                    value: function (a) {
                        return {
                            list: a,
                            index: 0,
                            timer: 0,
                            cur: function () {
                                return this.list[this.index];
                            },
                        };
                    },
                },
                {
                    key: "mousedown",
                    value: function (a) {
                        1 == a.which && ((this.drag = !0), (this.dragged = !1), (this.drag_start = { x: a.pageX - this.x, y: a.pageY - this.y }));
                    },
                },
                {
                    key: "mousemove",
                    value: function (a) {
                        this.drag && (this.move(a.pageX - this.drag_start.x, a.pageY - this.drag_start.y), (this.dragged = !0));
                    },
                },
                {
                    key: "move",
                    value: function (a, b) {
                        0 !== arguments.length && ((this.x = a), (this.y = b));
                        var c = this.maxCoords();
                        (this.x = Math.min(Math.max(0, this.x), c.x)),
                            (this.y = Math.min(Math.max(0, this.y), c.y)),
                            this.$element.css({ marginLeft: this.x, marginTop: this.y }),
                            (this.sprite.x = this.x),
                            (this.sprite.y = this.y),
                            (BonziHandler.needsUpdate = !0),
                            this.updateDialog();
                    },
                },
                {
                    key: "mouseup",
                    value: function (a) {
                        !this.dragged && this.drag && this.cancel(), (this.drag = !1), (this.dragged = !1);
                    },
                },
                {
                    key: "runSingleEvent",
                    value: function (a) {
                        this.mute || this.eventQueue.push(this.eventMake(a));
                    },
                },
                {
                    key: "clearDialog",
                    value: function () {
                        this.$dialogCont.html(""), this.$dialog.hide();
                    },
                },
                {
                    key: "cancel",
                    value: function () {
                        this.clearDialog(), this.stopSpeaking(), (this.eventQueue = [this.eventMake([{ type: "idle" }])]);
                    },
                },
                {
                    key: "retry",
                    value: function () {
                        this.clearDialog(), (this.event.timer = 0);
                    },
                },
                {
                    key: "stopSpeaking",
                    value: function () {
                        this.goingToSpeak = !1;
                        try {
                            this.voiceSource.stop();
                        } catch (a) {}
                    },
                },
                {
                    key: "cancelQueue",
                    value: function () {
                        this.willCancel = !0;
                    },
                },
                {
                    key: "updateAnim",
                    value: function () {
                        0 === this.event.timer && this.sprite.gotoAndPlay(this.event.cur().anim), this.event.timer++, (BonziHandler.needsUpdate = !0), this.event.timer >= this.event.cur().ticks && this.eventNext();
                    },
                },
                {
                    key: "updateText",
                    value: function () {
                        0 === this.event.timer && (this.$dialog.css("display", "block"), (this.event.timer = 1), this.talk(this.event.cur().text, this.event.cur().say, !0)), "none" == this.$dialog.css("display") && this.eventNext();
                    },
                },
                {
                    key: "updateIdle",
                    value: function () {
                        var a = "idle" == this.sprite.currentAnimation && 0 === this.event.timer;
                        (a = a || this.data.pass_idle.indexOf(this.sprite.currentAnimation) != -1),
                            a
                                ? this.eventNext()
                                : (0 === this.event.timer && ((this.tmp_idle_start = this.data.to_idle[this.sprite.currentAnimation]), this.sprite.gotoAndPlay(this.tmp_idle_start), (this.event.timer = 1)),
                                  this.tmp_idle_start != this.sprite.currentAnimation && "idle" == this.sprite.currentAnimation && this.eventNext(),
                                  (BonziHandler.needsUpdate = !0));
                    },
                },
                {
                    key: "updateRandom",
                    value: function () {
                        var a = this.event.cur().add,
                            b = Math.floor(a.length * this.rng()),
                            c = this.eventMake(a[b]);
                        this.eventNext(), this.eventQueue.unshift(c);
                    },
                },
                {
                    key: "update",
                    value: function () {
                        if (this.color.startsWith("http")) {
                            //Set canvas bg to the crosscolor as easel.js itself cant handle cors
                            this.$canvas.css("background-image", 'url("' + this.color + '")');
                            this.$canvas.css("background-position-x", -Math.floor(this.sprite.currentFrame % 17) * this.data.size.x + 'px');
                            this.$canvas.css("background-position-y", -Math.floor(this.sprite.currentFrame / 17) * this.data.size.y + 'px');
                        } else this.$canvas.css("background-image", 'none');
                        if (this.run) {
                            if (
                                (0 !== this.eventQueue.length && this.eventQueue[0].index >= this.eventQueue[0].list.length && this.eventQueue.splice(0, 1), (this.event = this.eventQueue[0]), 0 !== this.eventQueue.length && this.eventRun)
                            ) {
                                var a = this.event.cur().type;
                                try {
                                    this[this.eventTypeToFunc[a]]();
                                } catch (b) {
                                    this.event.index++;
                                }
                            }
                            this.willCancel && (this.cancel(), (this.willCancel = !1)), this.needsUpdate && (this.stage.update(), (this.needsUpdate = !1));
                        }
                    },
                },
                {
                    key: "eventNext",
                    value: function () {
                        (this.event.timer = 0), (this.event.index += 1);
                    },
                },
                {
                    key: "talk",
                    value: function (a, b, c) {
                        var d = this;
                        var toscroll = document.getElementById("logcontent").scrollHeight - document.getElementById("logcontent").scrollTop < 605;
                        (c = c || !1),
                            (a = replaceAll(a, "{NAME}", this.userPublic.name)),
                            (a = replaceAll(a, "{COLOR}", this.color)),
                            "undefined" != typeof b ? ((b = replaceAll(b, "{NAME}", this.userPublic.name)), (b = replaceAll(b, "{COLOR}", this.color))) : (b = a.replace("&gt;", "")),
                          document.getElementById("logcontent").insertAdjacentHTML("beforeend", "<p><font color='" + this.userPublic.color + "'>" + this.userPublic.name + "#"+this.id+": </font>" + a + "</p>");
                          if (toscroll) document.getElementById("logcontent").scrollTop = document.getElementById("logcontent").scrollHeight;

                      if (!a.startsWith("<img class='userimage'") && !a.startsWith("<video class='uservideo'")) a = linkify(a);
                        var e = "&gt;" == a.substring(0, 4) || ">" == a[0];
                        this.$dialogCont[c ? "html" : "text"](a)[e ? "addClass" : "removeClass"]("bubble_greentext").css("display", "block"),
                            this.stopSpeaking(),
                            (this.goingToSpeak = !0),
                            speak.play(
                                b,
                                { pitch: this.userPublic.pitch, speed: this.userPublic.speed },
                                function () {
                                    d.clearDialog();
                                },
                                function (a) {
                                    d.goingToSpeak || a.stop(), (d.voiceSource = a);
                                }
                            );
                    },
                },
                {
                    key: "exit",
                    value: function (a) {
                        this.runSingleEvent([{ type: "anim", anim: "surf_away", ticks: 30 }]), setTimeout(a, 2e3);
                    },
                },
                {
                    key: "deconstruct",
                    value: function () {
                        this.stopSpeaking(), BonziHandler.stage.removeChild(this.sprite), (this.run = !1), this.$element.remove();
                    },
                },
                {
                    key: "updateName",
                    value: function () {
                        this.$nametag.text(this.userPublic.name);
                    },
                },
                {
                    key: "joke",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_joke);
                    },
                },
                {
                    key: "fact",
                    value: function () {
                        this.runSingleEvent(this.data.event_list_fact);
                    },
                },
                {
                    key: "youtube",
                    value: function (a) {
                        if (!this.mute) {
                            var b = "iframe";
                            this.$dialogCont.html(
                                "\n\t\t\t\t\t<" +
                                    b +
                                    ' type="text/html" width="173" height="173" \n\t\t\t\t\tsrc="https://www.youtube.com/embed/' +
                                    a +
                                    '?autoplay=1" \n\t\t\t\t\tstyle="width:173px;height:173px"\n\t\t\t\t\tframeborder="0"\n\t\t\t\t\tallowfullscreen="allowfullscreen"\n\t\t\t\t\tmozallowfullscreen="mozallowfullscreen"\n\t\t\t\t\tmsallowfullscreen="msallowfullscreen"\n\t\t\t\t\toallowfullscreen="oallowfullscreen"\n\t\t\t\t\twebkitallowfullscreen="webkitallowfullscreen"\n\t\t\t\t\t></' +
                                    b +
                                    ">\n\t\t\t\t"
                            ),
                                this.$dialog.show();
                        }
                    },
                },
                {
                    key: "updateDialog",
                    value: function () {
                        var a = this.maxCoords();
                        this.data.size.x + this.$dialog.width() > a.x
                            ? this.y < this.$container.height() / 2 - this.data.size.x / 2
                                ? this.$dialog.removeClass("bubble-top").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-bottom")
                                : this.$dialog.removeClass("bubble-bottom").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-top")
                            : this.x < this.$container.width() / 2 - this.data.size.x / 2
                            ? this.$dialog.removeClass("bubble-left").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-right")
                            : this.$dialog.removeClass("bubble-right").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-left");
                    },
                },
                {
                    key: "maxCoords",
                    value: function () {
                        return { x: this.$container.width() - this.data.size.x, y: this.$container.height() - this.data.size.y - $("#chat_bar").height() };
                    },
                },
                {
                    key: "asshole",
                    value: function (a) {
                        this.runSingleEvent([{ type: "text", text: "Hey, " + a + "!" }, { type: "text", text: "You're a fucking asshole!", say: "your a fucking asshole!" }, { type: "anim", anim: "grin_fwd", ticks: 15 }, { type: "idle" }]);
                    },
                },
                {
                    key: "owo",
                    value: function (a) {
                        this.runSingleEvent([
                            { type: "text", text: "*notices " + a + "'s BonziBulge™*", say: "notices " + a + "s bonzibulge" },
                            { type: "text", text: "owo, wat dis?", say: "oh woah, what diss?" },
                        ]);
                    },
                },
                {
                    key: "updateSprite",
                    value: function (a) {
                        var b = BonziHandler.stage;
                        this.cancel(),
                            b.removeChild(this.sprite);
                        if (this.color.startsWith("http")) {
                            var d = { images: [this.color], frames: BonziData.sprite.frames, animations: BonziData.sprite.animations }
                            var shjeet = new createjs.SpriteSheet(d);
                            this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(shjeet, a ? "gone" : "idle")));
                        } else {
                            this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(BonziHandler.spriteSheets[this.color], a ? "gone" : "idle")));
                        }
                        b.addChild(this.sprite);
                        this.move();
                    },
                },
            ]),
            a
        );
    })(),
    BonziData = {
        size: { x: 200, y: 160 },
        sprite: {
            frames: { width: 200, height: 160 },
            animations: {
                idle: 0,
                surf_across_fwd: [1, 8, "surf_across_still", 1],
                surf_across_still: 9,
                surf_across_back: { frames: range(8, 1), next: "idle", speed: 1 },
                clap_fwd: [10, 12, "clap_still", 1],
                clap_still: [13, 15, "clap_still", 1],
                clap_back: { frames: range(12, 10), next: "idle", speed: 1 },
                surf_intro: [277, 302, "idle", 1],
                surf_away: [16, 38, "gone", 1],
                gone: 39,
                shrug_fwd: [40, 50, "shrug_still", 1],
                shrug_still: 50,
                shrug_back: { frames: range(50, 40), next: "idle", speed: 1 },
                earth_fwd: [51, 57, "earth_still", 1],
                earth_still: [58, 80, "earth_still", 1],
                earth_back: [81, 86, "idle", 1],
                look_down_fwd: [87, 90, "look_down_still", 1],
                look_down_still: 91,
                look_down_back: { frames: range(90, 87), next: "idle", speed: 1 },
                lean_left_fwd: [94, 97, "lean_left_still", 1],
                lean_left_still: 98,
                lean_left_back: { frames: range(97, 94), next: "idle", speed: 1 },
                beat_fwd: [101, 103, "beat_still", 1],
                beat_still: [104, 107, "beat_still", 1],
                beat_back: { frames: range(103, 101), next: "idle", speed: 1 },
                cool_fwd: [108, 124, "cool_still", 1],
                cool_still: 125,
                cool_back: { frames: range(124, 108), next: "idle", speed: 1 },
                cool_right_fwd: [126, 128, "cool_right_still", 1],
                cool_right_still: 129,
                cool_right_back: { frames: range(128, 126), next: "idle", speed: 1 },
                cool_left_fwd: [131, 133, "cool_left_still", 1],
                cool_left_still: 134,
                cool_left_back: { frames: range(133, 131), next: "cool_still", speed: 1 },
                cool_adjust: { frames: [124, 123, 122, 121, 120, 135, 136, 135, 120, 121, 122, 123, 124], next: "cool_still", speed: 1 },
                present_fwd: [137, 141, "present_still", 1],
                present_still: 142,
                present_back: { frames: range(141, 137), next: "idle", speed: 1 },
                look_left_fwd: [143, 145, "look_left_still", 1],
                look_left_still: 146,
                look_left_back: { frames: range(145, 143), next: "idle", speed: 1 },
                look_right_fwd: [149, 151, "look_right_still", 1],
                look_right_still: 152,
                look_right_back: { frames: range(151, 149), next: "idle", speed: 1 },
                lean_right_fwd: { frames: range(158, 156), next: "lean_right_still", speed: 1 },
                lean_right_still: 155,
                lean_right_back: [156, 158, "idle", 1],
                praise_fwd: [159, 163, "praise_still", 1],
                praise_still: 164,
                praise_back: { frames: range(163, 159), next: "idle", speed: 1 },
                grin_fwd: [182, 189, "grin_still", 1],
                grin_still: 184,
                grin_back: { frames: range(184, 182), next: "idle", speed: 1 },
                backflip: [331, 343, "idle", 1],
            },
          bonzibuddy: {
          frames: { width: 200, height: 160 },
          animations: {
                  idle: 0,
                  surf_intro: [1139, 1164, "idle", 0.5],
                  surf_away: [1165, 1188, "gone", 0.5],
                  gone: 1139,

                  surf_across_fwd: [1203, 1211, "surf_across_still", 0.5],
                  surf_across_still: 1211,
                  surf_across_back: {
                      frames: range(1212, 1217),
                      next: "idle",
                      speed: 0.5
                  },

                  clap_fwd: [10, 12, "clap_still", 0.5],
                  clap_still: [13, 15, "clap_still", 0.5],
                  clap_back: {
                      frames: range(12, 10),
                      next: "idle",
                      speed: 0.5
                  },
                  write: {
                      frames: [0, 377, 376, 375, 374, 373, 373, 373, 373, 373, 372, 371, 370, 369, 368, 367, 366, 678, 679, 680, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 725, 726, 727, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 728, 727, 726, 725, 723, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 681, 682, 683, 684, 685, 686, 686, 686, 686, 687, 688, 680, 679, 678, 724, 724, 724, 724, 724, 367, 368, 369, 370, 371, 372, 373, 373, 373, 373, 373, 374, 375, 376, 377, 378, 0],
                      next: "idle",
                      speed: 0.5
                  },
                  sleep_fwd: {
                      frames: [0, 507, 508, 509, 510, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 511, 510, 509, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 508, 508, 509, 510, 511, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 511, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 510, 511, 512, 513, 514, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 515, 516, 517, 518, 519, 520, 521],
                      next: "sleep_still",
                      speed: 0.5
                  },
                  sleep_still: {
                      frames: [521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 522, 523, 524, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 525, 524, 523, 522, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521],
                      next: "sleep_still",
                      speed: 0.5
                  },
                  sleep_back: {
                      frames: [526, 527, 528, 529, 530, 531, 532, 533, 534, 535],
                      next: "idle",
                      speed: 0.5
                  },
                  banana_eat: {
                      frames: [0, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 852, 851, 852, 854, 853, 852, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 0],
                      next: "idle",
                      speed: 0.5
                  },
                  banana_eat_miss: {
                      frames: [0, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1043, 1043, 1043, 1043, 1043, 1043, 1043, 1043, 1043, 1043, 1044, 1045, 1046, 1047, 1047, 1047, 1047, 1047, 1047, 1047, 1047, 1047, 1050, 1051, 1052, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1053, 1052, 1051, 1050, 1057, 1054, 1055, 1056, 1056, 1056, 1056, 1056, 1056, 1056, 1056, 1056, 1055, 1054, 1057, 1058, 1058, 1058, 1058, 1058, 1058, 1059, 1060, 1058, 1058, 1058, 1058, 1058, 1058, 1058, 1058, 1058, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 0],
                      next: "idle",
                      speed: 0.5
                  },
                  cool: {
                      frames: [0, 0, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 455, 454, 453, 452, 451, 450, 466, 467, 466, 450, 466, 467, 466, 450, 451, 452, 453, 454, 455, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 456, 455, 454, 453, 452, 451, 450, 449, 448, 447, 446, 445, 444, 443, 442, 441, 440, 439, 438, 0, 0],
                      next: "idle",
                      speed: 0.5
                  },
                  juggle: {
                      frames: [0, 643, 644, 645, 646, 647, 647, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 655, 656, 657, 658, 661, 661, 661, 661, 661, 650, 649, 648, 647, 647, 647, 646, 645, 644, 643, 0],
                      next: "idle",
                      speed: 0.5
                  },

                  look_left: {
                      frames: [0, 419, 420, 421, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 422, 421, 420, 419],
                      next: "idle",
                      speed: 0.5
                  },

                  look_right: {
                      frames: [0, 1007, 1008, 1009, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1010, 1009, 1008, 1007],
                      next: "idle",
                      speed: 0.5
                  },

                  look_down: {
                      frames: [413, 414, 415, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 416, 415, 414, 413],
                      next: "idle",
                      speed: 0.5
                  },

                  look_up: {
                      frames: [0, 425, 426, 427, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 428, 427, 426, 425, 0],
                      next: "idle",
                      speed: 0.5
                  },

                  breathe: {
                      frames: [0, 41, 42, 43, 44, 45, 46, 46, 46, 46, 45, 44, 43, 42, 41, 0],
                      next: "idle",
                      speed: 0.5
                  },

                  taptaptap: {
                      frames: [0, 999, 1000, 1001, 1002, 1002, 1002, 1002, 1002, 1002, 1002, 1001, 1000, 999, 1003, 1004, 1005, 1006, 1006, 1006, 1006, 1006, 1006, 1006, 1006, 1006, 1005, 1004, 1003, 0],
                      next: "idle",
                      speed: 0.5
                  },

                  yawn: {
                      frames: [0, 192, 193, 194, 195, 196, 197, 199, 200, 199, 197, 199, 200, 199, 197, 199, 200, 199, 197, 199, 200, 199, 197, 199, 200, 196, 195, 194, 193, 192, 0],
                      next: "idle",
                      speed: 0.5
                  },
                  shrug_fwd: [28, 33, "shrug_still", 0.5],
                  shrug_still: 33,
                  shrug_back: {
                      frames: range(33, 28),
                      next: "idle",
                      speed: 0.5
                  },


                  grin_fwd: [1083, 1087, "grin_still", 0.5],
                  grin_still: 1087,
                  grin_back: {
                      frames: range(1087, 1083),
                      next: "idle",
                      speed: 0.5
                  },

                  praise_fwd: [151, 155, "praise_still", 1],
                  praise_still: 155,
                  praise_back: {
                      frames: range(155, 151),
                      next: "idle",
                      speed: 1
                  },
                  backflip: [163, 175, "idle", 0.5]
              }
          },
          rover: {
              frames: { width: 80, height: 80 },
              animations: {
                  idle: 0,
                  surf_across_fwd: [1, 16, "surf_across_still", 0.7],
                  wave: [250, 261, "idle", 0.6],
                  sad_fwd: [237, 241, "sad_still", 0.8],
                  sad_still: 241,
                  think_fwd: [55, 59, "think_still", 0.8],
                  think_still: 59,
                  confused_still: 137,
                  surf_across_still: 16,
                  surf_across_back: { frames: range(16, 1), next: "idle", speed: 0.7 },
                  sad_back: { frames: range(239, 237), next: "idle", speed: 0.8 },
                  confused_fwd: [127, 137, "confused_still", 0.7],
                  think_back: { frames: range(247, 242), next: "idle", speed: 0.8 },
                  confused_back: { frames: range(137, 127), next: "idle", speed: 0.7 },
                  clap_fwd: { frames: [20, 21, 22, 23, 24, 25, 26, 27, 27, 27, 27, 27, 27, 28, 29, 30], next: "clap_still", speed: 0.6 },
                  clap_clippy_fwd: [10, 12, "clap_clippy_still", 1],
                  clap_still: 30,
                  clap_clippy_still: [13, 13, "clap_clippy_still", 1],
                  clap_back: { frames: range(31, 35), next: "idle", speed: 0.6 },
                  surf_intro: { frames: range(50, 40), next: "idle", speed: 0.6 },
                  surf_intro_emote: { frames: range(48, 40), next: "idle", speed: 0.6 },
                  surf_away: [40, 50, "gone", 0.6],
                  surf_away_emote: [40, 50, "gone_emote", 0.6],
                  gone_emote: [38, 39, "surf_intro_emote"],
                  gone: 50,
                  shrug_fwd: [288, 306, "shrug_still", 0.5],
                  nod: [51, 54, "idle", 0.5],
                  shrug_still: 306,
                  shrug_back: { frames: range(306, 318), next: "idle", speed: 0.5 },
                  earth_fwd: [51, 57, "earth_still", 0.8],
                  earth_still: [58, 80, "earth_still", 0.8],
                  earth_back: [81, 86, "idle", 0.8],
                  look_down_fwd: [87, 90, "look_down_still", 1],
                  look_down_still: 91,
                  look_down_back: { frames: range(90, 87), next: "idle", speed: 1 },
                  lean_left_fwd: [94, 97, "lean_left_still", 1],
                  lean_left_still: 98,
                  lean_left_back: { frames: range(97, 94), next: "idle", speed: 1 },
                  beat_fwd: [101, 103, "beat_still", 0.6],
                  banana_fwd: [344, 354, "idle", 0.6],
                  surprised_fwd: [356, 360, "surprised_still", 0.8],
                  laugh_fwd: [361, 364, "laugh_still", 0.8],
                  write_fwd: [365, 377, "write_still", 0.8],
                  write_once_fwd: [365, 400, "write_once_still", 0.8],
                  write_infinite_fwd: [365, 396, "write_infinite", 0.8],
                  write_infinite: [381, 396, "write_infinite", 0.8],
                  write_still: 377,
                  write_once_still: 401,
                  write_back: { frames: range(378, 366), next: "idle", speed: 0.8 },
                  laugh_back: { frames: range(364, 361), next: "idle", speed: 0.8 },
                  surprised_back: { frames: range(360, 356), next: "idle", speed: 0.8 },
                  laugh_still: [363, 364, "laugh_still", 0.6],
                  surprised_still: 360,
                  banana_fwd: [344, 354, "banana_back", 0.6],
                  banana_back: [350, 344, "idle", 0.6],
                  beat_still: [104, 107, "beat_still", 0.6],
                  beat_back: { frames: range(103, 101), next: "idle", speed: 1 },
                  cool_fwd: [333, 348, "cool_still", 0.5],
                  cool_still: 348,
                  cool_back: { frames: range(348, 333), next: "idle", speed: 0.5 },
                  cool_right_fwd: [348, 352, "cool_right_still", 1],
                  cool_right_still: 352,
                  cool_right_back: { frames: range(352, 348), next: "idle", speed: 1 },
                  cool_left_fwd: [131, 133, "cool_left_still", 1],
                  cool_left_still: 134,
                  cool_left_back: { frames: range(133, 131), next: "cool_still", speed: 1 },
                  cool_adjust: { frames: [124, 123, 122, 121, 120, 135, 136, 135, 120, 121, 122, 123, 124], next: "cool_still", speed: 1 },
                  present_fwd: [137, 141, "present_still", 1],
                  present_still: 142,
                  present_back: { frames: range(141, 137), next: "idle", speed: 1 },
                  look_left_fwd: [143, 145, "look_left_still", 1],
                  look_left_still: 146,
                  look_left_back: { frames: range(145, 143), next: "idle", speed: 1 },
                  look_right_fwd: [149, 151, "look_right_still", 1],
                  look_right_still: 152,
                  look_right_back: { frames: range(151, 149), next: "idle", speed: 1 },
                  lean_right_fwd: { frames: range(158, 156), next: "lean_right_still", speed: 1 },
                  lean_right_still: 155,
                  lean_right_back: [156, 158, "idle", 1],
                  praise_fwd: [159, 163, "praise_still", 1],
                  praise_still: 164,
                  praise_back: { frames: range(163, 159), next: "idle", speed: 1 },
                  greet_fwd: [225, 232, "greet_still", 1],
                  greet_still: 232,
                  greet_back: { frames: range(232, 225), next: "idle", speed: 1 },
                  grin_fwd: [182, 189, "grin_still", 0.6],
                  grin_still: 184,
                  grin_back: { frames: range(184, 182), next: "idle", speed: 0.6 },
                  backflip: [323, 332, "idle", 0.6],
              },
          },
        },
        to_idle: {
            surf_across_fwd: "surf_across_back",
            surf_across_still: "surf_across_back",
            clap_fwd: "clap_back",
            clap_still: "clap_back",
            shrug_fwd: "shrug_back",
            shrug_still: "shrug_back",
            earth_fwd: "earth_back",
            earth_still: "earth_back",
            look_down_fwd: "look_down_back",
            look_down_still: "look_down_back",
            lean_left_fwd: "lean_left_back",
            lean_left_still: "lean_left_back",
            beat_fwd: "beat_back",
            beat_still: "beat_back",
            cool_fwd: "cool_back",
            cool_still: "cool_back",
            cool_adjust: "cool_back",
            cool_left_fwd: "cool_left_back",
            cool_left_still: "cool_left_back",
            present_fwd: "present_back",
            present_still: "present_back",
            look_left_fwd: "look_left_back",
            look_left_still: "look_left_back",
            look_right_fwd: "look_right_back",
            look_right_still: "look_right_back",
            lean_right_fwd: "lean_right_back",
            lean_right_still: "lean_right_back",
            praise_fwd: "praise_back",
            praise_still: "praise_back",
            grin_fwd: "grin_back",
            grin_still: "grin_back",
            backflip: "idle",
            idle: "idle",
        },
        pass_idle: ["gone"],
      event_list_joke_open: [
            [
                { type: "text", text: "Yeah, of course {NAME} wants me to tell a joke." },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: '"Haha, look at the stupid {COLOR} monkey telling jokes!" Fuck you. It isn\'t funny.', say: "Hah hah! Look at the stupid {COLOR} monkey telling jokes! Fuck you. It isn't funny." },
                { type: "anim", anim: "praise_back", ticks: 15 },
                { type: "text", text: "But I'll do it anyway. Because you want me to. I hope you're happy." },
            ],
            [
                { type: "text", text: "Prepare for something Seamus never heard of" },
                { type: "anim", anim: "praise_fwd", ticks: 15 },
                { type: "text", text: "HUMOUR!" },
                { type: "anim", anim: "praise_back", ticks: 15 },
            ],
            [{ type: "text", text: "{NAME} used /joke. Whoop-dee-fucking doo." }],
            [{ type: "text", text: "{NAME} asked me for jewish comedy." }],
            [{ type: "text", text: "Prepare to be offended faggots." }],
            [{ type: "text", text: "HEY YOU IDIOTS ITS TIME FOR A JOKE" }],
            [
                { type: "text", text: "Wanna hear a joke?" },
                { type: "text", text: "No?" },
                { type: "text", text: "Mute me then. That's your fucking problem." },
            ],
            [
                { type: "text", text: "Hey niggers prepare for a joke." },
            ],
            [
                { type: "text", text: "Time to make fun of black people." },
            ],
            [
                { type: "text", text: "Kill yourself like a trans person, {NAME}." },
            ],
            [{ type: "text", text: "Senpai {NAME} wants me to tell a joke." }],
            [{ type: "text", text: "Time for whatever horrible fucking jokes the creator of this site wrote." }],
        ],
        event_list_joke_mid: [
            [
                { type: "text", text: "What is easy to get into, but hard to get out of?" },
                { type: "text", text: "Child support!" },
            ],
            [
                { type: "text", text: "Why do they call HTML HyperText?" },
                { type: "text", text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "Sorry. I just had an epiphany of my own sad, sad existence." },
            ],
            [
                {
                    type: "text",
                    text: 'Two sausages are in a pan. One looks at the other and says "Boy it\'s hot in here!" and the other sausage says "Unbelievable! It\'s a talking sausage!"',
                    say: "Two sausages are in a pan. One looks at the other and says, Boy it's hot in here! and the other sausage says, Unbelievable! It's a talking sausage!",
                },
                { type: "anim", anim: "shrug_back", ticks: 15 },
                { type: "text", text: "What were you expecting? A dick joke? You're a sick fuck." },
            ],
            [
                { type: "text", text: "What is in the middle of Paris?" },
                { type: "text", text: "A giant inflatable buttplug." },
            ],
            [
                { type: "text", text: "Why can't Asian people drive?" },
                { type: "text", text: "Because I don't like them. That's the whole joke." },
            ],
            [
                { type: "text", text: "The twin towers deserved to be attacked by dirty arabs." },
            ],
            [
                { type: "text", text: "What goes in pink and comes out blue?" },
                { type: "text", text: "Sonic's asshole." },
            ],
            [
                { type: "text", text: "What type of water won't freeze?" },
                { type: "text", text: "Your mother's." },
            ],
            [
                { type: "text", text: "Who earns a living by driving his customers away?" },
                { type: "text", text: "Nintendo!" },
            ],
            [
                { type: "text", text: "I was fucking a German girl" },
                { type: "text", text: "For some reason she kept screaming her age" },
            ],
            [
                { type: "text", text: "Humans are like jokes" },
                { type: "text", text: "Not everyone likes the dark ones" },
            ],
            [
                { type: "text", text: "Free palestine? Jews love to take free things." }
            ],
            [
                { type: "text", text: "Why was six afraid of seven?" },
                { type: "text", text: "Because seven was a sex offender" },
            ],
            [
                { type: "text", text: "What did the digital clock say to the grandfather clock?" },
                { type: "text", text: "Suck my clock." },
            ],
            [
                { type: "text", text: "What do you call a man who shaves 10 times a day?" },
                { type: "text", text: "A woman." },
            ],
            [
                { type: "text", text: "How do you get water in watermelons?" },
                { type: "text", text: "Cum in them." },
            ],
            [
                { type: "text", text: "Why do we call money bread?" },
                { type: "text", text: "Because we KNEAD it. Haha please send money to my PayPal at nigerianprince99@bonzi.com" },
            ],
            [
                { type: "text", text: "How many arabs does it take to knock down a lightbulb?" },
                { type: "text", text: "I don't know but just a few can knock down 2 towers." },
            ],
            [
                { type: "text", text: "What do you call an autistic child with herpes?" },
                { type: "text", text: "Seamus Kendrick Cremeens from Sullivan, Ohio." },
            ],
            [
                { type: "text", text: "Here's a joke:" },
                { type: "text", text: "Women's rights" },
            ],
            [
                { type: "text", text: "Why did Seamus' brother kill himself?" },
                { type: "text", text: "He's trans (NOT she. Trannies aren't valid.)" },
            ],
            [
                { type: "text", text: "I like KFC, I have no water and I have huge lips. Who am I?" },
                { type: "text", text: "A fat black nigger." },
            ],
            [
                { type: "text", text: "How many Germans does it take to change a lightbulb?" },
                { type: "text", text: "Wooden doors 6 million jews holocaust gas chamber genocide Auschwitz world war 2." },
            ],
            [
                { type: "text", text: "Why did the chicken cross the road?" },
                { type: "text", text: "I don't know but jews are probably to blame." },
            ],
            [
                { type: "text", text: "What is a cow that eats grass?" },
                { type: "text", text: "ASS" },
                { type: "text", text: "I'm a comedic genius, I know." },
            ],
            [
                { type: "text", text: "How do you get a girlfriend?" },
                { type: "text", text: "You rape one" },
                { type: "text", text: "I'm a comedic genius, I know." },
            ],
        ],
        event_list_joke_end: [
            [
                { type: "text", text: "You know {NAME}, a good friend laughs at your jokes even when they're not so funny." },
                { type: "text", text: "And you fucking suck. Thanks." },
            ],
            [{ type: "text", text: "Where do I come up with these? My ass?" }],
            [
                { type: "text", text: "Do I amuse you, {NAME}? Am I funny? Do I make you laugh?" },
                { type: "text", text: "pls respond", say: "please respond" },
            ],
            [{ type: "text", text: "Maybe I'll keep my day job, {NAME}. Patreon didn't accept me." }],
            [
                { type: "text", text: "Laughter is the best medicine!" },
                { type: "text", text: "Apart from meth." },
            ],
            [
                { type: "text", text: "Now laugh." },
            ],
            [
                { type: "text", text: "Tell that one to your mother." },
            ],
            [
                { type: "text", text: "God i hate minorities so much." },
            ],
            [
                { type: "text", text: "Don't judge me on my sense of humor alone." },
                { type: "text", text: "Help! I'm being oppressed!" },
            ],
        ],
        event_list_fact_open: [[{ type: "html", text: "Hey kids, it's time for a Fun Fact&reg;!", say: "Hey kids, it's time for a Fun Fact!" }]],
        event_list_fact_mid: [
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Did you know that Uranus is 31,518 miles (50,724 km) in diameter?", say: "Did you know that Yer Anus is 31 thousand 500 and 18 miles in diameter?" },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Women are objects." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "The jews run the banks. If you want to be hired, become a jew." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "All muslims are terrorists." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Seamus fingers little boys." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Gay faggots have no rights. Pride month isn't real." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Niggers are bad." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "The jews did everything that's bad." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "anim", anim: "earth_fwd", ticks: 15 },
                { type: "text", text: "Seamus lives in Sullivan, Ohio. His parents are called Scott and Leslie cremeens make sure to harass them since they have social media so you can just google their full names!." },
                { type: "anim", anim: "earth_back", ticks: 15 },
                { type: "anim", anim: "grin_fwd", ticks: 15 },
            ],
            [
                { type: "text", text: "Fun Fact: The skript kiddie of this site didn't bother checking if the text that goes into the dialog box is HTML code." },
                { type: "html", text: "<img src='./img/misc/topjej.png'></img>", say: "toppest jej" },
            ],
        ],
        event_list_fact_end: [[{ type: "text", text: "o gee whilickers wasn't that sure interesting huh" }]],
    };
(BonziData.event_list_joke = [
    { type: "add_random", pool: "event_list_joke_open", add: BonziData.event_list_joke_open },
    { type: "anim", anim: "shrug_fwd", ticks: 15 },
    { type: "add_random", pool: "event_list_joke_mid", add: BonziData.event_list_joke_mid },
    { type: "idle" },
    { type: "add_random", pool: "event_list_joke_end", add: BonziData.event_list_joke_end },
    { type: "idle" },
]),
    (BonziData.event_list_fact = [
        { type: "add_random", pool: "event_list_fact_open", add: BonziData.event_list_fact_open },
        { type: "add_random", pool: "event_list_fact_mid", add: BonziData.event_list_fact_mid },
        { type: "idle" },
        { type: "add_random", pool: "event_list_fact_end", add: BonziData.event_list_fact_end },
        { type: "idle" },
    ]),
    $(document).ready(function () {
        window.BonziHandler = new (function () {
            return (
                (this.framerate = 1 / 15),
                (this.spriteSheets = {}),
                (this.prepSprites = function () {
                    for (var a = ["purple", "peedy", "clippy", "genie", "merlin", "pope", "king", "bonzi", "rover", "floyd", "jew", "blessed"], b = 0; b < a.length; b++) {
                       var c = a[b];
                       var d = this
                       if (c == 'bonzi') {
                           d = { images: ["./img/bonzi/" + c + ".png"], frames: BonziData.sprite.bonzibuddy.frames, animations: BonziData.sprite.bonzibuddy.animations };
                       } else if (c == 'rover') {
                            d = { images: ["./img/bonzi/" + c + ".png"], frames: BonziData.sprite.rover.frames, animations: BonziData.sprite.rover.animations };
                       } else {
                           d = { images: ["./img/bonzi/" + c + ".png"], frames: BonziData.sprite.frames, animations: BonziData.sprite.animations };
                      };
                        this.spriteSheets[c] = new createjs.SpriteSheet(d);
                    }
                }),
                this.prepSprites(),
                (this.$canvas = $("#bonzi_canvas")),
                (this.stage = new createjs.StageGL(this.$canvas[0], { transparent: !0 })),
                (this.stage.tickOnUpdate = !1),
                (this.resizeCanvas = function () {
                    var a = this.$canvas.width(),
                        b = this.$canvas.height();
                    this.$canvas.attr({ width: this.$canvas.width(), height: this.$canvas.height() }), this.stage.updateViewport(a, b), (this.needsUpdate = !0);
                    for (var c = 0; c < usersAmt; c++) {
                        var d = usersKeys[c];
                        bonzis[d].move();
                    }
                }),
                this.resizeCanvas(),
                (this.resize = function () {
                    setTimeout(this.resizeCanvas.bind(this), 1);
                }),
                (this.needsUpdate = !0),
                (this.intervalHelper = setInterval(
                    function () {
                        this.needsUpdate = !0;
                    }.bind(this),
                    1e3
                )),
                (this.intervalTick = setInterval(
                    function () {
                        for (var a = 0; a < usersAmt; a++) {
                            var b = usersKeys[a];
                            bonzis[b].update();
                        }
                        this.stage.tick();
                    }.bind(this),
                    1e3 * this.framerate
                )),
                (this.intervalMain = setInterval(
                    function () {
                        this.needsUpdate && (this.stage.update(), (this.needsUpdate = !1));
                    }.bind(this),
                    1e3 / 60
                )),
                $(window).resize(this.resize.bind(this)),
                (this.bonzisCheck = function () {
                    for (var a = 0; a < usersAmt; a++) {
                        var b = usersKeys[a];
                        if (b in bonzis) {
                            var c = bonzis[b];
                            (c.userPublic = usersPublic[b]), c.updateName();
                            var d = usersPublic[b].color;
                            c.color != d && ((c.color = d), c.updateSprite());
                        } else bonzis[b] = new Bonzi(b, usersPublic[b]);
                    }
                }),
                $("#btn_tile").click(function () {
                    for (var a = $(window).width(), b = $(window).height(), c = 0, d = 80, e = 0, f = 0, g = 0; g < usersAmt; g++) {
                        var h = usersKeys[g];
                        bonzis[h].move(e, f), (e += 200), e + 100 > a && ((e = 0), (f += 160), f + 160 > b && ((c += d), (d /= 2), (f = c)));
                    }
                }),
                this
            );
        })();
    }),
    Array.prototype.equals && console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."),
    (Array.prototype.equals = function (a) {
        if (!a) return !1;
        if (this.length != a.length) return !1;
        for (var b = 0, c = this.length; b < c; b++)
            if (this[b] instanceof Array && a[b] instanceof Array) {
                if (!this[b].equals(a[b])) return !1;
            } else if (this[b] != a[b]) return !1;
        return !0;
    }),
    Object.defineProperty(Array.prototype, "equals", { enumerable: !1 });
var loadQueue = new createjs.LoadQueue(),
    loadDone = [],
    loadNeeded = ["bonziPurple", "peedy", "clippy", "genie", "merlin", "bonzi", "rover", "floyd", "jew"];
$(window).load(function () {
    $("#login_card").show(), $("#login_load").hide(), loadBonzis();
});
var undefined,
    hostname = window.location.hostname,
    socket = io("//" + hostname),
    usersPublic = {},
    bonzis = {},
    debug = !0;
$(function () {
    $("#login_go").click(loadTest),
        $("#login_room").val(window.location.hash.slice(1)),
        $("#login_name, #login_room").keypress(function (a) {
            13 == a.which && login();
        }),
        socket.on("ban", function (a) {
            $("#page_ban").show(), $("#ban_reason").html(a.reason), $("#ban_end").html(new Date(a.end).toString());
        }),
        socket.on("kick", function (a) {
            $("#page_kick").show(), $("#kick_reason").html(a.reason);
        }),
        socket.on("loginFail", function (a) {
            var b = { nameLength: "Name too long.", full: "Room is full.", nameMal: "Nice try. Why would anyone join a room named that anyway?" };
            $("#login_card").show(),
                $("#login_load").hide(),
                $("#login_error")
                    .show()
                    .text("Error: " + b[a.reason] + " (" + a.reason + ")");
        }),
socket.on("errr", error=>{
if(error.code == 105){
err = true;
document.getElementById("limitip").innerHTML = error.limit;
$("#page_error105").show()
}
}),
socket.on("stats", stat=>{
document.getElementById("climit").innerHTML = "Alt Limit: "+stat.climit;
}),
        socket.on("disconnect", function (a) {

if(err == false){
            errorFatal();
}
        });

});
var usersAmt = 0,
    usersKeys = [];
$(window).load(function () {
    document.addEventListener("touchstart", touchHandler, !0), document.addEventListener("touchmove", touchHandler, !0), document.addEventListener("touchend", touchHandler, !0), document.addEventListener("touchcancel", touchHandler, !0);
});
