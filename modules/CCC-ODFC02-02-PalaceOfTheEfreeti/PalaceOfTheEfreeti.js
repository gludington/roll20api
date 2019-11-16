var EfreetiTimer = EfreetiTimer || (function() {

    var startClock = function(value) {
        if (! state.EfreetiTimer.timers[this.name]) {
            state.EfreetiTimer.timers[this.name] = { count: 180}
        }
        if (value) {
            state.EfreetiTimer.timers[this.name].count = value;
        }

        var pagetop = this.top || (this.page.get("height") * 70) / 2;
        var pageleft = this.left || (this.page.get("width") * 70) / 2;
        this.display = findObjs({
           _pageid: this.page.id,
           _type: "text",
           top: pagetop,
           left: pageleft,
           layer: "map"
       })[0];

        if(!this.display) {
            this.display = createObj("text", {
                pageid: this.page.id,
                top: pagetop,
                left: pageleft,
                name:"timer_" + this.name,
                layer: "map",
                color: "rgb(0, 0, 0)",
                font_size: 56,
                font_family: "Contrail",
                text: asMinutesSeconds(state.EfreetiTimer.timers[this.name].count)
            });
        }
        toFront(this.display);
        this.clocktimer = setInterval(() => {
            render(this)
        }, 1000);
    }

    var stopClock = function() {
        if (this.clocktimer) {
            clearInterval(this.clocktimer)
            this.clocktimer = undefined;
        }
    }

    var asMinutesSeconds = function(timer) {
        var minutes = Math.floor(timer / 60);
        var seconds = timer - (minutes * 60);
        if(seconds < 10) {seconds = "0" + seconds};
        return minutes + ":" + seconds;
    }

    var render = function(timer) {
        state.EfreetiTimer.timers[timer.name].count = state.EfreetiTimer.timers[timer.name].count - 1;
        var output = asMinutesSeconds(state.EfreetiTimer.timers[timer.name].count);
        var textcolor = state.EfreetiTimer.timers[timer.name].count > 60 ? "rgb(0, 0, 0)" : "rgb(206, 32, 41)";
        timer.display.set({
            text: output,
            color: textcolor
        });
        if(state.EfreetiTimer.timers[timer.name].count < 1) {
            timer.stopClock();
            sendChat("HAHAHA", "!contest --level +5");
        }
    }

    var timer = function(options) {
        var opts = options || {}
        this.name = opts.name || "EfreetiTimer";
        this.top = opts.top;
        this.left = opts.left;
        this.page = options.page || findObjs({
            _type: "page",
            name: "An Appeal to Logic",
        })[0];
    }

    var isRunning = function() {
        return this.clocktimer !== undefined;
    }
    timer.prototype = {
        constructor: timer,
        startClock: startClock,
        stopClock: stopClock,
        isRunning: isRunning
    }

    return timer;
}());


var EfreetiPalace = EfreetiPalace || (function() {

    let timer;
    let page
    let clueBoard;
    const puzzles = {
        A: {
            solution: [
                "Druid (5 of Wisdom)",
                "Paladin (2 of Strength)",
                "Enchanter (3 of Intellect)",
                "Merchant (4 of Wealth)"
            ],
            clues: [
                "The first to come is the representative of wisdom, who has the prudence to arrive early.",
                "The last to come is the representative of wealth, whose time is precious and patience thin.",
                "The second representative to arrive is the quietest and humblest one that night, for they have the lowest rank of the entire group.",
                "The represnetative of intellect and the rank 4 representative arrive at nearly the same time, one immediately after the other.",
                "One of the representatives in a noble paladin, who is not the only divine spellcaster amond the group.",
                "Only one of the representatives cannot cast spells, yet they outrank half the representatives here.",
                "Because of some recent incidents involving property damage, the elementalist was not invited.",
                "At least two of the representatives have a rank that match the order that they arrive in.",
                "The two most religious representatives spend some time discussing religious matters as they arrive one after the other.",
                "The represenative of intellect has sold numerous magical scrolls to the representative who comes last, who ended up selling them at a profit.",
                "The representative of wisdom knows the importance of humility despite being the highest-ranking member of their society.",
                "The representative who comes first has a very close relationship with nature.",
                "The representative who comes second lives to smite evil",
                "The representative who comes third likes to dominate others using magic.",
                "The representatives who comes fourth sees the world in a transactional light."
            ]
        },
        B: {
            solution: [
                "Shepherd (4 of Wisdom)",
                "Soldier (3 of Strength)",
                "Elementalist (5 of Intellect)",
                "Swashbuckler (1 of Wealth)"
            ],
            clues: [
                "The mayor had falling out with the churches in town, so none of the representatives are religious, nor are any of them divine casters.",
                "The second representative to arrive is a member of the society of strength.",
                "The last representative to arrive has a meager rank of 1.",
                "None of the representatives has a rank equal to the order that they arrive in.",
                "The names of the three of the representatives start with the same letter.",
                "The last time he was invited to the mayor's mansion, the monk thre up all over the carpet.  He was not invited this time.",
                "None of the representatives has a rank of 2.",
                "The third representative to arrive has a greater rank than that of the second and fourth representative combined.",
                "The mayor invited the swashbuckler to come after the latter sword that she would not swing the chandelier.",
                "None of the chosen representatives are particularly wealthy or greedy.",
                "One of the representatives is a soldier who is the captain of the town guard.",
                "The representatives who comes first has a moral fear of wolves.",
                "The representative who comes second is always ready to fight.",
                "The representative who comes third is responsible for creating festive fireworks and snowfall during the event.",
                "The representative who comes fourth is a charming rogue."
            ]
        },
        C: {
            solution: [
                "Philanthropist (2 of Wealth)",
                "Healer (3 of Wisdom)",
                "Mercenary (4 of Strength)",
                "Transmuter (1 of Intellect)"
            ],
            clues: [
                "The representative who comes third is not from a society that values mental abilities.",
                "The representatives who come first and second have a lot in common.  They both want to help people and do good in the world.",
                "None of the representatives are the highest ranked members of their society.",
                "All of the representatives, except for the one who comes fourth, arrive in ascending order of rank (low to high).",
                "The representative who comes first is not the lowest ranked member of the group.",
                "The mayor decided to invite the healer in case a brawl erupts and someone gets injured.",
                "The representative of intellect spends so much time thinking they always show up last.",
                "The representative who comes third only works for gold, which is surprising considering they are not part of the society of wealth.",
                "The representative of wealth is the only member of that society who has not asked the representative of intellect to turn lead into gold for them.",
                "Half of the assembled representatives are capable in combat, but only one of them wears armor.",
                "The representative of wisdom is among the first two guests to arrive.",
                "The representative who comes first is so wealthy they like to just give it away.",
                "The representative who comes second can bring others back from the brink of death.",
                "The representative who comes third sells their sword to the highest bidder.",
                "The representative who comes fourth likes to transform one thing into another."
            ]
        }
    }

    const paths = {
        5: [{
            "width": 141,
            "height": 136,
            "top": 840,
            "left": 840,
            "layer": "objects",
            "_path": "[[\"M\",0,0],[\"L\",141,0],[\"L\",141,136],[\"L\",0,136],[\"L\",0,0]]",
        }],
        10 : [{
            "width": 282,
            "height": 279,
            "top": 841.5,
            "left": 839,

            "_path": "[[\"M\",73,0],[\"L\",0,70],[\"L\",0,213],[\"L\",71,279],[\"L\",214,277],[\"L\",281,208],[\"L\",282,69],[\"L\",208,2],[\"L\",73,0]]",
        }],
        15: [{
            "width": 422,
            "height": 421,
            "top": 841.5,
            "left": 838,
            "_path": "[[\"M\",72,0],[\"L\",1,68],[\"L\",0,352],[\"L\",70,421],[\"L\",350,420],[\"L\",422,348],[\"L\",422,69],[\"L\",352,0],[\"L\",72,0]]",
        }],
        20: [{
            "width":134,
            "height":135,
            "top":243.5,
            "left":242,
            "_path":"[[\"M\",68,0],[\"L\",0,69],[\"L\",66,135],[\"L\",134,69],[\"L\",68,0]]",
        }, {
            "width": 311,
            "height": 315,
            "top": 474.5,
            "left": 470.5, "_path": "[[\"M\",68,0],[\"L\",0,68],[\"L\",243,315],[\"L\",311,246],[\"L\",68,0]]",
        }, {
            "width":564,
            "height":561,
            "top":841.5,
            "left":838,"scaleX":1,
            "_path":"[[\"M\",1,69],[\"L\",0,491],[\"L\",72,559],[\"L\",495,561],[\"L\",563,491],[\"L\",564,68],[\"L\",491,1],[\"L\",68,0],[\"L\",1,69]]",
        }, {
            "width": 247,
            "height": 243,
            "top": 508.5,
            "left": 1169.5,
            "_path": "[[\"M\",0,178],[\"L\",71,243],[\"L\",247,69],[\"L\",178,0],[\"L\",0,178]]",
        }, {
            "width":208,
            "height":211,
            "top":279.5,
            "left":1400,
            "_path":"[[\"M\",0,140],[\"L\",69,211],[\"L\",208,73],[\"L\",138,0],[\"L\",0,140]]",
        }, {
            "width":391,
            "height":392,
            "top":1240,
            "left":437.5,
            "_path":"[[\"M\",322,0],[\"L\",0,323],[\"L\",69,392],[\"L\",391,72],[\"L\",322,0]]",
        },{
            "width":175,
            "height":174,
            "top":1136,
            "left":1135.5,
            "_path":"[[\"M\",0,70],[\"L\",106,174],[\"L\",175,106],[\"L\",66,0],[\"L\",0,70]]",
        },{
            "width":278,
            "height":275,
            "top":1366.5,
            "left":1365,
            "_path":"[[\"M\",0,67],[\"L\",210,275],[\"L\",278,209],[\"L\",68,0],[\"L\",0,67]]",
        }],
        25: [{
            "width":211,
            "height":206,
            "top":244,
            "left":241.5,
            "_path":"[[\"M\",142,0],[\"L\",0,141],[\"L\",69,206],[\"L\",211,70],[\"L\",142,0]]",
        },{
            "width":357,
            "height":358,
            "top":461,
            "left":456.5,
            "_path":"[[\"M\",0,141],[\"L\",216,358],[\"L\",357,210],[\"L\",140,0],[\"L\",0,141]]",
        },{
            "width":704,
            "height":703,
            "top":839.5,
            "left":838,
            "_path":"[[\"M\",0,125],[\"L\",2,571],[\"L\",127,702],[\"L\",240,703],[\"L\",255,675],[\"L\",277,654],[\"L\",303,639],[\"L\",338,630],[\"L\",357,630],[\"L\",396,635],[\"L\",426,642],[\"L\",450,657],[\"L\",463,680],[\"L\",474,702],[\"L\",578,701],[\"L\",704,572],[\"L\",703,116],[\"L\",572,0],[\"L\",126,1],[\"L\",0,125]]",
        }, {"width":216,"height":211,"top":1151.5,"left":1151,"_path":"[[\"M\",0,134],[\"L\",75,211],[\"L\",216,75],[\"L\",138,0],[\"L\",0,134]]",},
            {"width":348,"height":347,"top":1366.5,"left":1366,"_path":"[[\"M\",0,138],[\"L\",211,347],[\"L\",348,210],[\"L\",137,0],[\"L\",0,138]]",},
            {"width":428,"height":430,"top":1256,"left":422,"_path":"[[\"M\",289,0],[\"L\",0,290],[\"L\",138,430],[\"L\",428,144],[\"L\",289,0]]",},
            {"width":292,"height":297,"top":497.5,"left":1186,"_path":"[[\"M\",0,151],[\"L\",151,0],[\"L\",292,142],[\"L\",140,297],[\"L\",0,151]]",},
            {"width":279,"height":281,"top":279.5,"left":1400.5,"_path":"[[\"M\",0,141],[\"L\",142,0],[\"L\",279,140],[\"L\",139,281],[\"L\",0,141]]",}
        ],
        35: [{
            "width":211,
            "height":206,
            "top":244,
            "left":241.5,
            "_path":"[[\"M\",142,0],[\"L\",0,141],[\"L\",69,206],[\"L\",211,70],[\"L\",142,0]]",
        }, {
            "width": 357,
            "height": 358,
            "top": 461,
            "left": 456.5,
            "_path": "[[\"M\",0,141],[\"L\",216,358],[\"L\",357,210],[\"L\",140,0],[\"L\",0,141]]",
        }, {
            "width":840,"height":841,"top":842.5,"left":838,"_path":"[[\"M\",0,0],[\"L\",0,841],[\"L\",296,840],[\"L\",299,792],[\"L\",307,761],[\"L\",329,729],[\"L\",366,705],[\"L\",402,696],[\"L\",438,699],[\"L\",481,705],[\"L\",508,719],[\"L\",532,756],[\"L\",543,803],[\"L\",539,838],[\"L\",699,838],[\"L\",839,699],[\"L\",840,1],[\"L\",0,0]]",
        }, {"width":216,"height":211,"top":1151.5,"left":1151,"_path":"[[\"M\",0,134],[\"L\",75,211],[\"L\",216,75],[\"L\",138,0],[\"L\",0,134]]",},
            {"width":348,"height":347,"top":1366.5,"left":1366,"_path":"[[\"M\",0,138],[\"L\",211,347],[\"L\",348,210],[\"L\",137,0],[\"L\",0,138]]",},
            {"width":428,"height":430,"top":1256,"left":422,"_path":"[[\"M\",289,0],[\"L\",0,290],[\"L\",138,430],[\"L\",428,144],[\"L\",289,0]]",},
            {"width":292,"height":297,"top":497.5,"left":1186,"_path":"[[\"M\",0,151],[\"L\",151,0],[\"L\",292,142],[\"L\",140,297],[\"L\",0,151]]",},
            {"width":279,"height":281,"top":279.5,"left":1400.5,"_path":"[[\"M\",0,141],[\"L\",142,0],[\"L\",279,140],[\"L\",139,281],[\"L\",0,141]]",}
        ],
        45: [{
            "width":211,
            "height":206,
            "top":244,
            "left":241.5,
            "_path":"[[\"M\",142,0],[\"L\",0,141],[\"L\",69,206],[\"L\",211,70],[\"L\",142,0]]",
        }, {
            "width": 357,
            "height": 358,
            "top": 461,
            "left": 456.5,
            "_path": "[[\"M\",0,141],[\"L\",216,358],[\"L\",357,210],[\"L\",140,0],[\"L\",0,141]]",
        }, {
            "width":982,"height":986,"top":841,"left":838,"_path":"[[\"M\",0,3],[\"L\",1,986],[\"L\",420,984],[\"L\",389,961],[\"L\",373,938],[\"L\",366,912],[\"L\",373,864],[\"L\",381,831],[\"L\",406,801],[\"L\",440,780],[\"L\",474,770],[\"L\",513,771],[\"L\",553,781],[\"L\",585,797],[\"L\",599,817],[\"L\",611,849],[\"L\",611,896],[\"L\",602,937],[\"L\",588,962],[\"L\",560,985],[\"L\",840,983],[\"L\",981,841],[\"L\",982,142],[\"L\",842,0],[\"L\",0,3]]",
        }, {"width":216,"height":211,"top":1151.5,"left":1151,"_path":"[[\"M\",0,134],[\"L\",75,211],[\"L\",216,75],[\"L\",138,0],[\"L\",0,134]]",},
            {"width":348,"height":347,"top":1366.5,"left":1366,"_path":"[[\"M\",0,138],[\"L\",211,347],[\"L\",348,210],[\"L\",137,0],[\"L\",0,138]]",},
            {"width":428,"height":430,"top":1256,"left":422,"_path":"[[\"M\",289,0],[\"L\",0,290],[\"L\",138,430],[\"L\",428,144],[\"L\",289,0]]",},
            {"width":292,"height":297,"top":497.5,"left":1186,"_path":"[[\"M\",0,151],[\"L\",151,0],[\"L\",292,142],[\"L\",140,297],[\"L\",0,151]]",},
            {"width":279,"height":281,"top":279.5,"left":1400.5,"_path":"[[\"M\",0,141],[\"L\",142,0],[\"L\",279,140],[\"L\",139,281],[\"L\",0,141]]",}
        ],
        55: [{
            "width":211,
            "height":206,
            "top":244,
            "left":241.5,
            "_path":"[[\"M\",142,0],[\"L\",0,141],[\"L\",69,206],[\"L\",211,70],[\"L\",142,0]]",
        }, {
            "width": 357,
            "height": 358,
            "top": 461,
            "left": 456.5,
            "_path": "[[\"M\",0,141],[\"L\",216,358],[\"L\",357,210],[\"L\",140,0],[\"L\",0,141]]",
        }, {
            "width":1127,"height":1127,"top":841.5,"left":838.5,"_path":"[[\"M\",144,0],[\"L\",0,143],[\"L\",3,1127],[\"L\",495,1122],[\"L\",494,1053],[\"L\",467,1037],[\"L\",448,1008],[\"L\",445,964],[\"L\",449,925],[\"L\",461,891],[\"L\",490,864],[\"L\",524,847],[\"L\",564,840],[\"L\",606,847],[\"L\",643,858],[\"L\",665,874],[\"L\",679,903],[\"L\",688,940],[\"L\",684,974],[\"L\",677,1007],[\"L\",662,1031],[\"L\",649,1047],[\"L\",632,1055],[\"L\",633,1124],[\"L\",1127,1126],[\"L\",1127,2],[\"L\",144,0]]",
        }, {"width":216,"height":211,"top":1151.5,"left":1151,"_path":"[[\"M\",0,134],[\"L\",75,211],[\"L\",216,75],[\"L\",138,0],[\"L\",0,134]]",},
            {"width":348,"height":347,"top":1366.5,"left":1366,"_path":"[[\"M\",0,138],[\"L\",211,347],[\"L\",348,210],[\"L\",137,0],[\"L\",0,138]]",},
            {"width":428,"height":430,"top":1256,"left":422,"_path":"[[\"M\",289,0],[\"L\",0,290],[\"L\",138,430],[\"L\",428,144],[\"L\",289,0]]",},
            {"width":292,"height":297,"top":497.5,"left":1186,"_path":"[[\"M\",0,151],[\"L\",151,0],[\"L\",292,142],[\"L\",140,297],[\"L\",0,151]]",},
            {"width":279,"height":281,"top":279.5,"left":1400.5,"_path":"[[\"M\",0,141],[\"L\",142,0],[\"L\",279,140],[\"L\",139,281],[\"L\",0,141]]",}
        ],
        65: [{
            "width":211,
            "height":206,
            "top":244,
            "left":241.5,
            "_path":"[[\"M\",142,0],[\"L\",0,141],[\"L\",69,206],[\"L\",211,70],[\"L\",142,0]]",
        }, {
            "width": 357,
            "height": 358,
            "top": 461,
            "left": 456.5,
            "_path": "[[\"M\",0,141],[\"L\",216,358],[\"L\",357,210],[\"L\",140,0],[\"L\",0,141]]",
        }, {
            "width":1266,"height":1264,"top":843,"left":840,"_path":"[[\"M\",2,0],[\"L\",0,1122],[\"L\",139,1264],[\"L\",563,1261],[\"L\",563,1121],[\"L\",541,1108],[\"L\",517,1078],[\"L\",512,1050],[\"L\",512,1011],[\"L\",520,978],[\"L\",543,944],[\"L\",574,921],[\"L\",604,910],[\"L\",634,906],[\"L\",689,915],[\"L\",724,934],[\"L\",748,976],[\"L\",756,1019],[\"L\",748,1061],[\"L\",734,1092],[\"L\",722,1109],[\"L\",701,1121],[\"L\",702,1262],[\"L\",1266,1263],[\"L\",1265,0],[\"L\",2,0]]",
        }, {"width":216,"height":211,"top":1151.5,"left":1151,"_path":"[[\"M\",0,134],[\"L\",75,211],[\"L\",216,75],[\"L\",138,0],[\"L\",0,134]]",},
            {"width":348,"height":347,"top":1366.5,"left":1366,"_path":"[[\"M\",0,138],[\"L\",211,347],[\"L\",348,210],[\"L\",137,0],[\"L\",0,138]]",},
            {"width":428,"height":430,"top":1256,"left":422,"_path":"[[\"M\",289,0],[\"L\",0,290],[\"L\",138,430],[\"L\",428,144],[\"L\",289,0]]",},
            {"width":292,"height":297,"top":497.5,"left":1186,"_path":"[[\"M\",0,151],[\"L\",151,0],[\"L\",292,142],[\"L\",140,297],[\"L\",0,151]]",},
            {"width":279,"height":281,"top":279.5,"left":1400.5,"_path":"[[\"M\",0,141],[\"L\",142,0],[\"L\",279,140],[\"L\",139,281],[\"L\",0,141]]",}
        ],
        75: [
            {
                "width": 1410,
                "height": 1411,
                "top": 838.5,
                "left": 839,
                "_path": "[[\"M\",145,4],[\"L\",0,146],[\"L\",1,1271],[\"L\",144,1411],[\"L\",636,1408],[\"L\",636,1198],[\"L\",610,1182],[\"L\",592,1154],[\"L\",586,1124],[\"L\",588,1083],[\"L\",597,1048],[\"L\",618,1019],[\"L\",647,1002],[\"L\",680,987],[\"L\",711,987],[\"L\",753,993],[\"L\",789,1006],[\"L\",811,1032],[\"L\",823,1061],[\"L\",828,1106],[\"L\",821,1140],[\"L\",811,1163],[\"L\",796,1185],[\"L\",774,1200],[\"L\",776,1410],[\"L\",1268,1410],[\"L\",1410,1268],[\"L\",1410,149],[\"L\",1267,0],[\"L\",145,4]]",
            }
        ]
    }
    let currentPaths;
    let currentLevel = 0;
    const adjustLevel = (adj) => {
        let level;
        if (adj.indexOf("+") === 0) {
            level = currentLevel + parseInt(adj.substring(1));
        } else if (adj.indexOf("-") === 0) {
            level = currentLevel - parseInt(adj.substring(1));
        } else {
            level = adj;
        }

        if (level !== undefined) {
            let matches = Object.entries(paths).filter((k, idx) => level >= k[0]);
            let match;
            if (matches) {
                match = _.last(matches);
            }

            if (match) {
                if (level > currentLevel) {
                    spawnFxBetweenPoints({x: 470, y: 620}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 1200, y: 620}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 630, y: 500}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 1050, y: 500}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 630, y: 1200}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 1050, y: 1200}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 470, y: 1050}, {x: 835, y: 850}, "breath-fire", page.id)
                    spawnFxBetweenPoints({x: 1200, y: 1050}, {x: 835, y: 850}, "breath-fire", page.id)
                    let dmgText = "<p>The floor is lava, anybody touching takes [[3d10]] fire damage or [[2d10]] if weak party.</p>"

                    if (level >= 10) {
                        let airDmg = Math.floor(level / 10);
                        if (airDmg > 4) {
                            airDmg = 4;
                        }
                        dmgText += "<p>The air is also lava, everybody takes " + airDmg + " fire damage</p>"
                    }
                    sendChat("Lava", dmgText)
                }

                let temp = match[1].map(config => {
                    return createObj("path", Object.assign({
                   "fill": "#ff0000",
                   "stroke": "#ff0000",
                   "rotation": 0,
                   "stroke_width": 0,
                   "scaleX": 1,
                   "scaleY": 1,
                   "layer": "objects",
                   "_pageid": page.id}, config));
                });
                if (currentPaths !== undefined) {
                    currentPaths.forEach(path => path.remove());
                }
                currentPaths = temp;
                currentLevel = parseInt(level);
            } else {
                if (currentPaths !== undefined) {
                    currentPaths.forEach(path => path.remove());
                    currentPaths = undefined;
                }
                currentLevel = 0;
            }
        } else {
            if (currentPaths !== undefined) {
                currentPaths.forEach(path => path.remove());
                currentPaths = undefined;
            }
            currentLevel = 0;
        }
    }

    let currentClueLevel = -1;
    const adjustClues = (puzzleCode, adj) => {
        let level;
        if (adj.indexOf("+") === 0) {
            level = currentClueLevel + parseInt(adj.substring(1));
        } else if (adj.indexOf("-") === 0) {
            level = currentClueLevel - parseInt(adj.substring(1));
        } else {
            level = adj;
        }
        if (level < 0) {
            level =  -1;
        }
        if (level < 0) {
            currentClueLevel = level;
            clueBoard.set("notes", '');
        } else {
            const puzzle = puzzles[puzzleCode]
            if (puzzle) {
                if (level > puzzle.clues.length -1) {
                    level = puzzle.clues.length -1;
                } else if (level < 0) {
                    level = -1;
                }

                let text = '';
                if (level >= 0) {
                    text += '<h2>Clues</h2><ol>'
                    for (var idx = 0; idx <= level; idx++) {
                        text += '<li>' + puzzle.clues[idx] + '</li>'
                    }
                    text += '</ol>'
                }
                currentClueLevel = level;
                clueBoard.set("notes", text);
            }
        }
    }

    const whisperSolution = (puzzleCode) => {
        const puzzle = puzzles[puzzleCode];
        if (puzzle) {
            let text = '/w gm <ol>'
                for (var idx = 0; idx < puzzle.solution.length; idx++) {
                    text += '<li>' + puzzle.solution[idx] + '</li>'
                }
                text += '</ol>'
            sendChat("Solution for Puzzle " + puzzleCode, text);
        }
    }


    const registerEventHandlers = () => {

        page = findObjs({
            _type: "page",
            name: "An Appeal to Logic",
        })[0];
        clueBoard = findObjs({
            _type: "handout",
            name: "Clues"
        })[0];

        on('chat:message', (msg) => {
            if (msg.type !== "api" || (!playerIsGM(msg.playerid) && msg.playerid !== 'API')) {
            return;
        }
        const args = msg.content.splitArgs();
        if (args[0] === '!contest') {
            if (args[1] === '--level') {
                adjustLevel(args[2]);
            }
        } else if (args[0] === '!timer') {
            if (timer === undefined) {
                timer = new EfreetiTimer({name:"PalaceContest", page: page, top:1000, left:600});
            }
            if (args[1] === '--start') {
                if (timer.isRunning() === true) {
                    timer.stopClock();
                }
                timer.startClock(parseInt(args[2] || 180));
            } else if (args[1] === '--pause') {
                timer.stopClock()
            } else if (args[1] === '--continue') {
                timer.startClock();
            }
        } else if (args[0] === '!clue') {
            adjustClues(args[1], args[2])
        } else if (args[0] === '!solution') {
            whisperSolution(args[1]);
        }
    });
    }

    return {
        registerEventHandlers: registerEventHandlers
    };
}());

on('ready', () => {
    'use strict';
    EfreetiPalace.registerEventHandlers();
    // Check if the namespaced property exists, creating it if it doesn't
    if( ! state.EfreetiTimer ) {
        state.EfreetiTimer = {
            version: 1.0,
            timers: {}
        };
    }
});
