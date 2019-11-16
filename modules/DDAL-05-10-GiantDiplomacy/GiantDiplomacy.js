var GiantDiplomacy = GiantDiplomacy || (function() {
    //TODO support multiple puzzles

    //Puzzle section
    const puzzles = { }

    function createPuzzle(options) {
        const root = () => {
            log("root from " + options.root)
            return getObj('graphic', options.root);
        }

        const config = {
            initial: {
                purple: {
                    leftOffset: 150,
                    topOffset: 100,
                    width:200,
                    height:400,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566809/iw45lqgxNFIOnR1zDlPcNg/thumb.png?1570232983'
                },
                green: {
                    leftOffset: 200,
                    topOffset: - 50,
                    width:300,
                    height:100,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566811/HLnviO6jNFs1JH3yquDUiQ/thumb.png?1570232983'
                },
                pink: {
                    leftOffset: 348,
                    topOffset: 0,
                    width:200,
                    height:202,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566812/Ahk3weelk39Nqgo5IeGJ2g/thumb.png?1570232983',
                },
                yellow: {
                    leftOffset: 250,
                    topOffset: 50,
                    width:200,
                    height:100,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566808/ANJn5E51l1uAUhmYpV_6Kg/thumb.png?15702329835'
                },
                blue: {
                    leftOffset: 350,
                    topOffset: 100,
                    width:200,
                    height:198,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566813/4LO3qLBnBkmX3Z-sWQtT0g/thumb.png?1570232983'
                },
                red: {
                    leftOffset: 400,
                    topOffset: 200,
                    width:98,
                    height:200,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93567501/o8KJFn_G0F_ltiH7GLv6sw/thumb.png?1570233445'
                },
                orange: {
                    leftOffset: 250,
                    topOffset: 200,
                    width:400,
                    height:201,
                    imgsrc: 'https://s3.amazonaws.com/files.d20.io/images/93566814/8NUy4-XMAVBOpPP8FkL6Ig/thumb.png?1570232984'
                }
            },
            cat: {
                purple: {
                    leftOffset: 465,
                    topOffset: 175,
                    rotation: -45
                },
                green: {
                    leftOffset: 100,
                    topOffset: 155,
                    rotation: 90
                },
                pink: {
                    leftOffset: 395,
                    topOffset: 105,
                    rotation: -45
                },
                yellow: {
                    leftOffset: 540,
                    topOffset: -140,
                    rotation: 90
                },
                blue: {
                    leftOffset: 492,
                    topOffset: -40,
                    rotation: 0
                },
                red: {
                    leftOffset: 440,
                    topOffset: -130,
                    rotation: 180
                },
                orange: {
                    leftOffset: 250,
                    topOffset: 200,
                    rotation: 0
                }
            },
            diamond: {
                purple: {
                    leftOffset: 250,
                    topOffset: 100,
                    rotation: 90
                },
                green: {
                    leftOffset: 400,
                    topOffset: 155,
                    rotation: 90
                },
                pink: {
                    leftOffset: 250,
                    topOffset: 200,
                    rotation: 90
                },
                yellow: {
                    leftOffset: 250,
                    topOffset: 350,
                    rotation: 0
                },
                blue: {
                    leftOffset: 150,
                    topOffset: 200,
                    rotation: 0
                },
                red: {
                    leftOffset: 100,
                    topOffset: 104,
                    rotation: 180
                },
                orange: {
                    leftOffset: 250,
                    topOffset: -100,
                    rotation: 0
                }
            },
            house: {
                purple: {
                    leftOffset: 385,
                    topOffset: 0,
                    rotation: -90
                },
                green: {
                    leftOffset: 190,
                    topOffset: 30,
                    rotation: 135
                },
                pink: {
                    leftOffset: 350,
                    topOffset: 200,
                    rotation: 0
                },
                yellow: {
                    leftOffset: 150,
                    topOffset: 150,
                    rotation: 0
                },
                blue: {
                    leftOffset: 260,
                    topOffset: -110,
                    rotation: 45
                },
                red: {
                    leftOffset: 100,
                    topOffset: 200,
                    rotation: 180
                },
                orange: {
                    leftOffset: 250,
                    topOffset: 200,
                    rotation: 0
                }
            }
        };

        const initialRoot = root();
        const attInt = (obj, name) => {
            return parseInt(obj.get(name));
        }

        const initialLeft = attInt(initialRoot, "left");
        const initialTop = attInt(initialRoot, "top");

        const createPiece = (name) => {
            const conf = config.initial[name];
            return createObj("graphic", {
                subType: "token",
                left: initialLeft + conf.leftOffset,
                top: initialTop + conf.topOffset,
                width: conf.width,
                height: conf.height,
                imgsrc: conf.imgsrc,
                pageid: Campaign().get("playerpageid"),
                layer: "objects",
                controlledby: "all"
            })
        }

        const purple = createPiece('purple');
        const green = createPiece('green');
        const pink = createPiece('pink');
        const yellow = createPiece('yellow');
        const blue = createPiece('blue');
        const red = createPiece('red');
        const orange = createPiece('orange');

        //TODO populate from config
        [orange, purple, pink, green, blue, red, yellow].forEach(piece => {
            toFront(piece);
        });
        const puzzle = {
            purple: purple,
            green: green,
            pink: pink,
            yellow: yellow,
            blue: blue,
            red: red,
            orange: orange,
            solve: function(type, ids) {
                const solveRoot = root();
                const solveLeft = attInt(solveRoot, "left");
                const solveTop = attInt(solveRoot, "top");
                const isRoot = ids.includes(solveRoot.get("id"));
                Object.getOwnPropertyNames(this).forEach((prop) => {
                    if (typeof this[prop] !== 'function') {
                        if (isRoot ||  ids.includes(this[prop].get("id"))) {
                            this[prop].set("top", solveTop + config[type][prop].topOffset);
                            this[prop].set("left", solveLeft + config[type][prop].leftOffset);
                            this[prop].set("rotation", config[type][prop].rotation);
                        }
                    }
                });
            },
            reset: function(ids) {
                const resetRoot = root();
                const resetLeft = attInt(resetRoot, "left");
                const resetTop = attInt(resetRoot, "top");
                const isRoot = ids.includes(resetRoot.get("id"));
                Object.getOwnPropertyNames(this).forEach((prop) => {
                    if (typeof this[prop] !== 'function') {
                        if (isRoot || ids.includes(this[prop].get("id"))) {
                            this[prop].set("top", resetTop + config.initial[prop].topOffset);
                            this[prop].set("left", resetLeft + config.initial[prop].leftOffset);
                            this[prop].set("rotation", 0);
                        }
                    }
                });
            },
            restore: function() {
                const resetRoot = root();
                [orange, purple, pink, green, blue, red, yellow].forEach(component => {
                    log(component);
                })
            },
            moveAll: function(deltaLeft, deltaTop) {
                Object.getOwnPropertyNames(this).forEach((prop) => {
                    if (typeof this[prop] !== 'function') {
                        this[prop].set("top", parseInt(this[prop].get("top")) + deltaTop);
                        this[prop].set("left", parseInt(this[prop].get("left")) + deltaLeft);
                    }
                });
            },
            destroy: function() {
                const destroyRoot = root();
                const destroyId = destroyRoot.get("id");
                Object.getOwnPropertyNames(this).forEach((prop) => {
                    if (typeof this[prop] !== 'function') {
                        this[prop].remove();
                        delete this[prop];
                        delete this;
                    }
                });

                destroyRoot.remove();
                delete puzzles[destroyId];
            }
        }
        return puzzle;
    }

    const normalizeSelected = (selected) => {
        let ids;
        if (selected === undefined) {
            log('no selected');
        } else {
            ids = selected.map((sel) => {
                return sel._id;
            });
        }
        return ids;
    }

    const solve = (type, selected) => {
        const ids = normalizeSelected(selected);
        if (ids) {
            Object.getOwnPropertyNames(puzzles).forEach((puzzleId) => {
                puzzles[puzzleId].solve(type, ids);
            });
        }
    }

    const reset = (selected) => {
        const ids = normalizeSelected(selected);
        if (ids) {
            Object.getOwnPropertyNames(puzzles).forEach((puzzleId) => {
                puzzles[puzzleId].reset(ids);
            });
        }
    }

    const removePuzzle = (selected) => {
        const ids = normalizeSelected(selected);
        if (ids) {
            ids.forEach(id => {
               if (puzzles[id]) {
                   puzzles[id].destroy();
               }
            });
        }
    }

    const restorePuzzle = (selected) => {
        const ids = normalizeSelected(selected);
        if (ids) {
            ids.forEach(id => {
                if (puzzles[id]) {
                    puzzles[id].restore();
                }
            });
        }
    }

    const registerPuzzleEventHandlers = function() {
        on('chat:message', function(msg) {
            if (msg.type !== "api") {
                return;
            }
            const mode = msg.content.match(/^!puzzle (--reset|--solve|--destroy|--restore)/);
            if (mode && mode[1]) {
                if (mode[1] === '--solve') {
                    if (playerIsGM(msg.playerid)) {
                        const type = msg.content.match(/^.*--solve --(cat|diamond|house)/);
                        solve(type && type[1] ? type[1] : 'cat', msg.selected);
                    }
                } else if (mode[1] === '--reset') {
                    reset(msg.selected);
                } else if (mode[1] === '--destroy') {
                    removePuzzle(msg.selected);
                } else if (mode[1] === '--restore') {
                    restorePuzzle(msg.selected);
                }
            }
        });
        on('add:graphic', (added) => {
            const character = getObj('character', added.get('represents'));
            if (character) {
                const attr = getAttrByName(character.get("id"), "puzzle_config");
                if (attr) {
                    puzzles[added.get("id")] = createPuzzle({
                        root: added.get("id"),
                    })
                    added.set("controlledby", "all");
                    character.set("controlledby", "all");
                }
            }
        });
        on('destroy:graphic', (destroyed) => {
            const destroyedId = destroyed.get("id");
            if (puzzles[destroyedId]) {
                puzzles[destroyedId].destroy();
            } else {
                log('no protection against puzzle piece deletion yet')
            }
        });

        on('change:graphic', (obj, prev) => {
            const id = obj.get("id");
            if (puzzles[id]) {
                const deltaLeft = parseInt(obj.get("left")) - parseInt(prev["left"]);
                const deltaTop = parseInt(obj.get("top")) - parseInt(prev["top"]);
                if (deltaLeft !== 0 || deltaTop !== 0) {
                    puzzles[id].moveAll(deltaLeft, deltaTop);
                }
            }
        })
    };

    //contest section
    const findRound = (roundName) => {
        return contestData.filter((round) => {
            return round.name === roundName;
        })
    }

    //update the score for a round
    const updateScore = (character, round, value) => {
        if (value > -5) {
            round.scores[character.get("name")] = value;
        } else {
            delete round.scores[character.get("name")]
        }
    }

    //Write all scores for rounds that have scores
    const writeScoreboard = () => {
        let text = "";
        contestData.forEach((round) => {
            if (round.title && !(_.isEmpty(round.scores))) {
                text = text + "<h2>" + round.title + "</h2>";
                text += round.outputScores(round.scores, round.threshold, round.critSuccess, round.critFail);
                if (round.outputResults) {
                    const results = round.outputResults(round.scores, round.threshold);
                    if (results !== "") {
                        if (results === "WIN") {
                            text += "Grindle lets the small creatures win";
                        } else if (results === "TIE") {
                            text += "Grindle lets the players equal him"
                        } else if (results === "LOSS") {
                            text += "Grindle defeats the foolish small creatures";
                        } else {
                            text += results;
                        }
                    }
                }
            }
        });
        scoreboard.set("notes", text);
    }

    const simpleSuccessFailure = (scores, threshold) => {
        let text = "";
        _.each(_.keys(scores), (key) => {
            text = text + "<p>" + key + " = " + (scores[key] >= threshold ? "Success" : "Failure") + "</p>"
        });
        return text;
    }

    const successFailureCritFail = (scores, threshold, critSuccess, critFail) => {
        let text = "";
        _.each(_.keys(scores), (key) => {
            text = text + "<p>" + key + " = " + (scores[key] >= threshold ? "Success" : (scores[key] > critFail ? "Failure" : "Embarrassing Failure")) + "</p>"
        });
        return text;
    }

    const showValue = (scores) => {
        let text = "";
        _.each(_.keys(scores), (key) => {
            text = text + "<p>" + key + " = " + scores[key] + "</p>"
        });
        return text;
    }

    const simpleWinLossTie = (scores, threshold) => {
        const grindleScore = scores['Grindle'];
        if (grindleScore) {
            const playerValues = _.omit(scores, 'Grindle');
            if (!(_.isEmpty(playerValues))) {
                const maxPlayer = _.max(_.values(playerValues));
                if (grindleScore >= threshold) {
                    if (maxPlayer >= threshold) {
                        return "TIE";
                    } else {
                        return "LOSS";
                    }
                } else {
                    if (maxPlayer >= threshold) {
                        return "WIN";
                    } else {
                        return "TIE";
                    }
                }
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    const contestData = [{
        name: "pixiesangria", title: "Drink 1: Pixie Sangria",
        threshold:7,
        outputScores: simpleSuccessFailure,
        scores: {}
    },
    {
        name: "pigups", title: "Challenge A: Pig-Ups",
        threshold: 18,
        critSuccess: undefined,
        critFail: 1,
        outputScores: successFailureCritFail,
        outputResults: simpleWinLossTie,
        scores: {}
    },
    {
        name: "everydayettin", title: "Drink 2: Everyday Ettin",
        threshold:10,
        outputScores: simpleSuccessFailure,
        scores: {}
    },
    {
        name: "strengthoffeet", title: "Challenge B: Great Strength of Feet",
        threshold: 15,
        critSuccess: undefined,
        critFail: 1,
        outputScores: successFailureCritFail,
        outputResults: simpleWinLossTie,
        scores: {}
    },
    {
        name: "ettingrinder", title: "Drink 3: Ettin Grinder",
        threshold:12,
        outputScores: simpleSuccessFailure,
        scores: {}
    },
    {
        name: "wholehog", title: "Challenge C: The Whole Hog",
        threshold:12,
        updateScore: (character, round, value) => {
            const dogRound = parseInt(value.substring(0, value.indexOf('|'))) -1;
            const dogCount = parseInt(value.substring(value.indexOf('|') +1));
            const charName = character.get("name");
            if (round.scores[charName]) {

            } else {
                round.scores[charName] = [ undefined, undefined, undefined, undefined ];
            }
            if (dogCount > -1) {
                round.scores[charName][dogRound] = dogCount;
            } else {
                round.scores[charName][dogRound] = undefined;
            }
            const roundScores = _.compact(_.initial(round.scores[charName]));
            if (roundScores.length === 0) {
                delete round.scores[charName];
            } else {
                let total = 0;
                round.scores[charName][3] = _.reduce(roundScores, (total, num) => { return total + num;}, 0);
            }
        },
        outputScores: (scores) => {
            let text = "<table><tr><th>Eater</th><th>Round 1</th><th>Round 2</th><th>Round 3</th><th>Total</th></tr>";
            let sortedResults = [];
            _.each(_.keys(scores), (key) => {
                sortedResults.push([key, scores[key][0], scores[key][1], scores[key][2], scores[key][3]]);
            });

            sortedResults = _.sortBy(sortedResults, (arr) => { return -1*arr[4] });

            _.each(sortedResults, result => {
                text += "<tr>";
                _.each(result, val => {
                    if(val === undefined) {
                        text += "<td></td>";
                    } else {
                        text += "<td>" + val + "</td>";
                    }
                });
                text += "</tr>";
            });
            text += "</table>";
            return text;
        },
        outputResults: (scores, threshold) => {
            const grindleScore = scores['Grindle'];
            if (grindleScore && !_.some(grindleScore, val => { return val === undefined; })) {
                const grindleValue = grindleScore[3];
                if (grindleValue) {
                    const playerScores = _.omit(scores, 'Grindle');
                    if (_.some(_.flatten(_.values(playerScores)), val => { return val === undefined;})) {
                        return "";
                    } else {
                        if (!(_.isEmpty(playerScores))) {
                            const playerValues = _.map(playerScores, (arr) => {return arr[3]});
                            const maxPlayer = _.max(_.values(playerValues));
                            if (grindleValue === maxPlayer) {
                                return "TIE";
                            } else {
                                return grindleValue > maxPlayer ? "Nobody eats more than Grindle!" : "WIN";
                            }
                        } else {
                            return "";
                        }
                    }
                }
            }
            return ""
        },
        scores: {}
    },
    {
        name: "harpysdream", title: "Drink 4: Harpy's Dream",
        threshold:13,
        outputScores: simpleSuccessFailure,
        scores: {}
    },
    {
        name: "harpysnightmare", title: "Drink 4: Harpy's Nightmare",
        threshold:11,
        outputScores: simpleSuccessFailure,
        scores: {}
    }
    ];

    const registerContestEventHandlers = function() {
        on('chat:message', function (msg) {
            if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
                return;
            }
            const args = msg.content.match(/^(!&#13;)?!contest --([A-Za-z]+) ([A-Za-z0-9]+) (-?[\|0-9]+)/);
            if (args && args[2] && args[3] && args[4]) {
                if (msg.selected) {
                    const round = findRound(args[3]);
                    if (round && round[0]) {
                        _.each(msg.selected, (obj) => {
                            const token = getObj('graphic', obj._id);
                            if (token) {
                                const character = getObj("character", token.get("represents"));
                                if (character) {
                                    if (round[0].updateScore) {
                                        round[0].updateScore(character, round[0], args[4]);
                                    } else {
                                        updateScore(character, round[0], args[4]);
                                    }
                                }
                            }
                        });
                        writeScoreboard();
                    } else {
                        log("Missing or invalid round: " + args[3]);
                    }
                } else {
                    log("No tokens selected")
                }
            }
        });
    };
    let scoreboard = undefined;
    const registerEventHandlers = () => {
        registerPuzzleEventHandlers();
        registerContestEventHandlers();
        scoreboard = filterObjs((obj=> {
            return obj.get("_type") === 'handout' && obj.get("name") === "Scoreboard";
        }))[0];
    }
    return {
        registerEventHandlers: registerEventHandlers
    };
}());

on('ready', () => {
    'use strict';
    GiantDiplomacy.registerEventHandlers();
});