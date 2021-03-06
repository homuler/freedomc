var fc = fc || {};
fc.typing = fc.typing || {};
fc.typing.events = fc.typing.events || {};

function roundN(num, n){
    var d = Math.pow(10, n);
    var x = num * d;
    return Math.round(x) / d;
}

(function(ns){
    ns.timers = {
        timerID: 0,
        timers: [],
        paused: false,

        add: function(fn){
            this.timers.push(fn);
        },

        start: function(){
            if(this.timerID) return;
            this.paused = false;
            (function runNext() {
                if(ns.timers.timers.length > 0){
                    if(!ns.timers.paused){
                        for(var i = 0; i < ns.timers.timers.length; i++){
                            if(ns.timers.timers[i]() === false){
                                ns.timers.timers.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    ns.timers.timerID = setTimeout(runNext, 100);
                }
            })();
        },

        pause: function(){
            this.paused = true;
        },

        stop: function(){
            clearTimeout(this.timerID);
            this.timerID = 0;
        }
    };
    ns.typing = {
        nodes: {},
        graphics: {},
        constants: {},
        status: {},
        speedSigns: ["Lent", "Alegro", "Vivace"],
        dictionary: {},
        problemData: [],
        init: function(){
            ns.typing.nodes = {
                typingSound: $("#typing-sound")[0],
                $musicTitle: $("#title"),
                $musicianName: $("#musician"),
                difficultyNode: $("#difficulty")[0],
                $problemID: $("#problem-id"),
                $problemRuby: $("#problem-ruby"),
                $problemCaption: $("#problem-caption"),
                $problemRaw: $("#problem-raw"),
                $correctNode: $("#correct-cell"),
                $missNode: $("#miss-cell"),
                $comboNode: $("#combo-cell"),
                $scoreSumNode: $("#score-sum-cell")
            };
            ns.typing.graphics = {
                speedGauge: fc.graphics.speedGauge("#container-speed",{
                    size: 200,
                    clipWidth: 200,
                    clipHeight: 200,
                    ringWidth: 60,
                    maxValue: 1000,
                    transitionsMs: 4000,
                }),
                speedGraph: new Chart($("#speed-graph")[0].getContext("2d"))
                    .Line(fc.graphics.speedGraph.data, fc.graphics.speedGraph.options),
                scoreGraph: new Chart($("#score-graph")[0].getContext("2d"))
                    .Line(fc.graphics.scoreGraph.data, fc.graphics.scoreGraph.options),
                scoreSpec: new Chart($("#score-spec")[0].getContext("2d"))
                    .PolarArea(fc.graphics.scoreSpec.data, fc.graphics.scoreSpec.options)
            };
            ns.typing.status = {
                loaded: false,
                calledNum: 0,
                score: { correct: 0,
                         combo: 0,
                         speed: 0,
                         bonus: 0,
                         miss: 0 },
                problemID: 0,
                combo: 0,
                maxCombo: 0,
                maxSpeed: 0,
                correct: 0,
                miss: 0,
                totalTime: 0.0,
                intermission: true,
                currentProblem: []
            };
            // initialize dictionary
            ns.typing.dictionary = {
                "A": ["A"],
                "B": ["B"],
                "C": ["C"],
                "D": ["D"],
                "E": ["E"],
                "F": ["F"],
                "G": ["G"],
                "H": ["H"],
                "I": ["I"],
                "J": ["J"],
                "K": ["K"],
                "L": ["L"],
                "M": ["M"],
                "N": ["N"],
                "O": ["O"],
                "P": ["P"],
                "Q": ["Q"],
                "R": ["R"],
                "S": ["S"],
                "T": ["T"],
                "U": ["U"],
                "V": ["V"],
                "W": ["W"],
                "X": ["X"],
                "Y": ["Y"],
                "Z": ["Z"],

                "a": ["a"],
                "b": ["b"],
                "c": ["c"],
                "d": ["d"],
                "e": ["e"],
                "f": ["f"],
                "g": ["g"],
                "h": ["h"],
                "i": ["i"],
                "j": ["j"],
                "k": ["k"],
                "l": ["l"],
                "m": ["m"],
                "n": ["n"],
                "o": ["o"],
                "p": ["p"],
                "q": ["q"],
                "r": ["r"],
                "s": ["s"],
                "t": ["t"],
                "u": ["u"],
                "v": ["v"],
                "w": ["w"],
                "x": ["x"],
                "y": ["y"],
                "z": ["z"],

                "0": ["0"],
                "1": ["1"],
                "2": ["2"],
                "3": ["3"],
                "4": ["4"],
                "5": ["5"],
                "6": ["6"],
                "7": ["7"],
                "8": ["8"],
                "9": ["9"],

                "あ": ["a"],
                "い": ["i"],
                "う": ["u"],
                "え": ["e"],
                "お": ["o"],
                "か": ["ka"],
                "き": ["ki"],
                "く": ["ku"],
                "け": ["ke"],
                "こ": ["ko"],
                "さ": ["sa"],
                "し": ["si", "shi"],
                "す": ["su"],
                "せ": ["se"],
                "そ": ["so"],
                "た": ["ta"],
                "ち": ["ti", "chi"],
                "つ": ["tu", "tsu"],
                "て": ["te"],
                "と": ["to"],
                "な": ["na"],
                "に": ["ni"],
                "ぬ": ["nu"],
                "ね": ["ne"],
                "の": ["no"],
                "は": ["ha"],
                "ひ": ["hi"],
                "ふ": ["fu", "hu"],
                "へ": ["he"],
                "ほ": ["ho"],
                "ま": ["ma"],
                "み": ["mi"],
                "む": ["mu"],
                "め": ["me"],
                "も": ["mo"],
                "や": ["ya"],
                "ゆ": ["yu"],
                "よ": ["yo"],
                "ら": ["ra"],
                "り": ["ri"],
                "る": ["ru"],
                "れ": ["re"],
                "ろ": ["ro"],
                "わ": ["wa"],
                "ゐ": ["wi"],
                "ゑ": ["we"],
                "を": ["wo"],
                "ん": ["nn"],

                "が": ["ga"],
                "ぎ": ["gi"],
                "ぐ": ["gu"],
                "げ": ["ge"],
                "ご": ["go"],
                "ざ": ["za"],
                "じ": ["ji", "zi"],
                "ず": ["zu"],
                "ぜ": ["ze"],
                "ぞ": ["zo"],
                "だ": ["da"],
                "ぢ": ["di"],
                "づ": ["du"],
                "で": ["de"],
                "ど": ["do"],
                "ば": ["ba"],
                "び": ["bi"],
                "ぶ": ["bu"],
                "べ": ["be"],
                "ぼ": ["bo"],
                "ぱ": ["pa"],
                "ぴ": ["pi"],
                "ぷ": ["pu"],
                "ぺ": ["pe"],
                "ぽ": ["po"],

                "ぁ": ["xa"],
                "ぃ": ["xi"],
                "ぅ": ["xu"],
                "ぇ": ["xe"],
                "ぉ": ["xo"],
                "ゃ": ["xya"],
                "ゅ": ["xyu"],
                "ょ": ["xyo"],

                "きゃ": ["kya"],
                "きぃ": ["kyi"],
                "きゅ": ["kyu"],
                "きぇ": ["kye"],
                "きょ": ["kyo"],
                "ぎゃ": ["gya"],
                "ぎぃ": ["gyi"],
                "ぎゅ": ["gyu"],
                "ぎぇ": ["gye"],
                "ぎょ": ["gyo"],
                "しゃ": ["sha", "sya"],
                "しぃ": ["syi"],
                "しゅ": ["shu", "syu"],
                "しぇ": ["she", "sye"],
                "しょ": ["sho", "syo"],
                "じゃ": ["ja", "zya"],
                "じぃ": ["zyi"],
                "じゅ": ["ju", "zyu"],
                "じぇ": ["je", "zye"],
                "じょ": ["jo", "zyo"],
                "ちゃ": ["cha", "cya"],
                "ちぃ": ["cyi"],
                "ちゅ": ["chu", "cyu"],
                "ちぇ": ["che", "cye"],
                "ちょ": ["cho", "cyo"],
                "ぢゃ": ["dya"],
                "ぢぃ": ["dyi"],
                "ぢゅ": ["dyu"],
                "ぢぇ": ["dye"],
                "ぢょ": ["dyo"],
                "でゃ": ["dha"],
                "でぃ": ["dhi"],
                "でゅ": ["dhu"],
                "でぇ": ["dhe"],
                "でょ": ["dho"],
                "にゃ": ["nya"],
                "にぃ": ["nyi"],
                "にゅ": ["nyu"],
                "にぇ": ["nye"],
                "にょ": ["nyo"],
                "ひゃ": ["hya"],
                "ひぃ": ["hyi"],
                "ひゅ": ["hyu"],
                "ひぇ": ["hye"],
                "ひょ": ["hyo"],
                "びゃ": ["bya"],
                "びぃ": ["byi"],
                "びゅ": ["byu"],
                "びぇ": ["bye"],
                "びょ": ["byo"],
                "ぴゃ": ["pya"],
                "ぴぃ": ["pyi"],
                "ぴゅ": ["pyu"],
                "ぴぇ": ["pye"],
                "ぴょ": ["pyo"],
                "ふぁ": ["fa"],
                "ふぃ": ["fi"],
                "ふぇ": ["fe"],
                "ふぉ": ["fo"],
                "みゃ": ["mya"],
                "みぃ": ["myi"],
                "みゅ": ["myu"],
                "みぇ": ["mye"],
                "みょ": ["myo"],
                "りゃ": ["rya"],
                "りぃ": ["ryi"],
                "りゅ": ["ryu"],
                "りぇ": ["rye"],
                "りょ": ["ryo"],

                "ア": ["a"],
                "イ": ["i"],
                "ウ": ["u"],
                "エ": ["e"],
                "オ": ["o"],
                "カ": ["ka"],
                "キ": ["ki"],
                "ク": ["ku"],
                "ケ": ["ke"],
                "コ": ["ko"],
                "サ": ["sa"],
                "シ": ["si", "shi"],
                "ス": ["su"],
                "セ": ["se"],
                "ソ": ["so"],
                "タ": ["ta"],
                "チ": ["ti", "chi"],
                "ツ": ["tu", "tsu"],
                "テ": ["te"],
                "ト": ["to"],
                "ナ": ["na"],
                "ニ": ["ni"],
                "ヌ": ["nu"],
                "ネ": ["ne"],
                "ノ": ["no"],
                "ハ": ["ha"],
                "ヒ": ["hi"],
                "フ": ["fu", "hu"],
                "ヘ": ["he"],
                "ホ": ["ho"],
                "マ": ["ma"],
                "ミ": ["mi"],
                "ム": ["mu"],
                "メ": ["me"],
                "モ": ["mo"],
                "ヤ": ["ya"],
                "ユ": ["yu"],
                "ヨ": ["yo"],
                "ラ": ["ra"],
                "リ": ["ri"],
                "ル": ["ru"],
                "レ": ["re"],
                "ロ": ["ro"],
                "ワ": ["wa"],
                "ヰ": ["wi"],
                "ヱ": ["we"],
                "ヲ": ["wo"],
                "ン": ["nn"],

                "ガ": ["ga"],
                "ギ": ["gi"],
                "グ": ["gu"],
                "ゲ": ["ge"],
                "ゴ": ["go"],
                "ザ": ["za"],
                "ジ": ["ji", "zi"],
                "ズ": ["zu"],
                "ゼ": ["ze"],
                "ゾ": ["zo"],
                "ダ": ["da"],
                "ヂ": ["di"],
                "ヅ": ["du"],
                "デ": ["de"],
                "ド": ["do"],
                "バ": ["ba"],
                "ビ": ["bi"],
                "ブ": ["bu"],
                "ベ": ["be"],
                "ボ": ["bo"],
                "パ": ["pa"],
                "ピ": ["pi"],
                "プ": ["pu"],
                "ペ": ["pe"],
                "ポ": ["po"],

                "ァ": ["xa"],
                "ィ": ["xi"],
                "ゥ": ["xu"],
                "ェ": ["xe"],
                "ォ": ["xo"],
                "ャ": ["xya"],
                "ュ": ["xyu"],
                "ョ": ["xyo"],

                "キャ": ["kya"],
                "キィ": ["kyi"],
                "キュ": ["kyu"],
                "キェ": ["kye"],
                "キョ": ["kyo"],
                "ギャ": ["gya"],
                "ギィ": ["gyi"],
                "ギュ": ["gyu"],
                "ギェ": ["gye"],
                "ギョ": ["gyo"],
                "シャ": ["sha", "sya"],
                "シィ": ["syi"],
                "シュ": ["shu", "syu"],
                "シェ": ["she", "sye"],
                "ショ": ["sho", "syo"],
                "ジャ": ["ja", "zya"],
                "ジィ": ["zyi"],
                "ジュ": ["ju", "zyu"],
                "ジェ": ["je", "zye"],
                "ジョ": ["jo", "zyo"],
                "チャ": ["cha", "cya"],
                "チィ": ["cyi"],
                "チュ": ["chu", "cyu"],
                "チェ": ["che", "cye"],
                "チョ": ["cho", "cyo"],
                "ヂャ": ["dya"],
                "ヂィ": ["dyi"],
                "ヂュ": ["dyu"],
                "ヂェ": ["dye"],
                "ヂョ": ["dyo"],
                "デャ": ["dha"],
                "ディ": ["dhi"],
                "デュ": ["dhu"],
                "デェ": ["dhe"],
                "デョ": ["dho"],
                "ニャ": ["nya"],
                "ニィ": ["nyi"],
                "ニュ": ["nyu"],
                "ニェ": ["nye"],
                "ニョ": ["nyo"],
                "ヒャ": ["hya"],
                "ヒィ": ["hyi"],
                "ヒュ": ["hyu"],
                "ヒェ": ["hye"],
                "ヒョ": ["hyo"],
                "ビャ": ["bya"],
                "ビィ": ["byi"],
                "ビュ": ["byu"],
                "ビェ": ["bye"],
                "ビョ": ["byo"],
                "ピャ": ["pya"],
                "ピィ": ["pyi"],
                "ピュ": ["pyu"],
                "ピェ": ["pye"],
                "ピョ": ["pyo"],
                "ファ": ["fa"],
                "フィ": ["fi"],
                "フェ": ["fe"],
                "フォ": ["fo"],
                "ミャ": ["mya"],
                "ミィ": ["myi"],
                "ミュ": ["myu"],
                "ミェ": ["mye"],
                "ミョ": ["myo"],
                "リャ": ["rya"],
                "リィ": ["ryi"],
                "リュ": ["ryu"],
                "リェ": ["rye"],
                "リョ": ["ryo"],

                "-": ["-"],
                "ー": ["-"],
                " ": [" "],
                "　": [" "],
                "?": ["?"],
                "？": ["?"],
                "'": ["'"],
                "!": ["!"],
                "！": ["!"]
            };
            for(var i = 0; ns.typing.problemData[i]; i++){
                console.log(ns.typing.problemData[i]);
                ns.typing.problemData[i].problemList
                    = ns.typing.convert2TypingList(ns.typing.problemData[i].problem);
            }
            ns.typing.constants = {
                callInterval: Math.round(ns.typing.nodes.typingSound.duration/2),
                difficulties: ["Easy", "Normal", "Hard", "Extra Hard", "Extreme", "Lunatic"],
                difficulty: ns.typing.scoreFuncs.calcDifficulty(ns.typing.problemData),
                maxScore: 1000000
            };

            ns.typing.nodes.$problemID.html(ns.typing.status.problemID + 1);
            ns.typing.nodes.$problemRuby.html(ns.typing.problemData[ns.typing.status.problemID].problem);
            ns.typing.nodes.$problemCaption.html(ns.typing.problemData[ns.typing.status.problemID].display);
            ns.typing.resetCurrentProblem(ns.typing.status.problemID);
            ns.typing.updateProblemRaw();
            ns.typing.unfocusProblems();

            ns.typing.graphics.speedGauge.render();
            ns.typing.nodes.difficultyNode.innerHTML = ns.typing.constants.difficulties[ns.typing.constants.difficulty];
            console.log(ns.typing.nodes.difficultyNode.innerHTML);
            console.log(ns.typing.problemData);
        },
        focusProblems: function(){
            ns.typing.status.intermission = false;
            ns.typing.nodes.$problemID.removeClass("unfocus");
            ns.typing.nodes.$problemID.addClass("focus");
            ns.typing.nodes.$problemRuby.removeClass("unfocus");
            ns.typing.nodes.$problemRuby.addClass("focus");
            ns.typing.nodes.$problemCaption.removeClass("unfocus");
            ns.typing.nodes.$problemCaption.addClass("focus");
            ns.typing.nodes.$problemRaw.removeClass("unfocus");
            ns.typing.nodes.$problemRaw.addClass("focus");
        },
        unfocusProblems: function(){
            ns.typing.status.intermission = true;
            ns.typing.nodes.$problemID.addClass("unfocus");
            ns.typing.nodes.$problemID.removeClass("focus");
            ns.typing.nodes.$problemRuby.addClass("unfocus");
            ns.typing.nodes.$problemRuby.removeClass("focus");
            ns.typing.nodes.$problemCaption.addClass("unfocus");
            ns.typing.nodes.$problemCaption.removeClass("focus");
            ns.typing.nodes.$problemRaw.addClass("unfocus");
            ns.typing.nodes.$problemRaw.removeClass("focus");
        },
        updateProblems: function(){
            console.log("update Problems called");
      //      var preTime = parseFloat(ns.typing.nodes.typingSound.currentTime);
      //      var preCorrect = ns.typing.status.correct;
            return function() {
                if(ns.typing.status.problemID >= ns.typing.problemData.length){
                    console.log("play fin");
                    ns.typing.clearProblems();
                    ns.typing.displayFinPage();
                    return false;
                }

                var startTime = parseFloat(ns.typing.problemData[ns.typing.status.problemID].startTime),
                    endTime = parseFloat(ns.typing.problemData[ns.typing.status.problemID].endTime),
                    currentTime = parseFloat(ns.typing.nodes.typingSound.currentTime);
                if(ns.typing.status.intermission){
                    if(startTime <= currentTime){
                        ns.typing.focusProblems();
                    }
                } else if(endTime < currentTime){
                    ns.typing.status.problemID++;
                    ns.typing.status.combo = 0;
                    if(ns.typing.status.problemID >= ns.typing.problemData.length){
                        console.log("game fin");
                        ns.typing.clearProblems();
                        return false;
                    }
                    ns.typing.resetCurrentProblem(ns.typing.status.problemID);
                    var nextStartTime = parseFloat(ns.typing.problemData[ns.typing.status.problemID].startTime);
                    if(nextStartTime <= currentTime){
                        ns.typing.unfocusProblems();
                    }
                }
                return true;
            };
        },
        convert2TypingList: function(problem){
            var temp = [];
            var coeff = 0;
            for(var i = 0; i < problem.length; i++){
                var ch = problem.charAt(i);
                if(ns.typing.dictionary[ch]){
                    while(++i < problem.length && ns.typing.dictionary[ch+problem.charAt(i)]){
                        ch += problem.charAt(i);
                    }
                    i--;
                    temp.push(doubleCons(ns.typing.dictionary[ch], coeff));
                    coeff = 0;
                } else if(ch == "ッ" || ch == "っ"){
                    coeff++;
                } else {
                    console.log(problem.charAt(i) + " not found");
                }
            }
            if(coeff > 0){
                temp.push(doubleCons(["xtu", "xtsu"], coeff-1));
            }

            return temp;

            function doubleCons(arr, n){
                var ret = [];
                for(var i = 0; i < arr.length; i++){
                    var str = "";
                    for(var j = 0; j < n; j++){
                        str += arr[i].charAt(0).toLowerCase();
                    }
                    str += arr[i].toLowerCase();
                    ret.push(str);
                }
                return ret;
            }
        },
        resetCurrentProblem: function(pId){
            console.log("reset called");
            if(pId < 0 || pId >= ns.typing.problemData.length){
                console.log("invalid function call");
                return;
            }
            ns.typing.status.currentProblem = $.extend(true, [], ns.typing.problemData[pId].problemList);
            ns.typing.nodes.$problemID.html(pId + 1);
            ns.typing.nodes.$problemRuby.html(ns.typing.problemData[pId].problem);
            ns.typing.nodes.$problemCaption.html(ns.typing.problemData[pId].display);
            ns.typing.updateProblemRaw();
        },
        updateProblemRaw: function(){
            ns.typing.nodes.$problemRaw.html(getRawProblem());
            function getRawProblem(){
                var id = ns.typing.status.problemID;
                var currentProblem = ns.typing.status.currentProblem;
                var pStr = "";
                for(var i = 0; i < currentProblem.length; i++){
                    pStr += currentProblem[i][0];
                }
                return pStr;
            }
        },
        clearProblems: function(){
            console.log("clearProblems called");
            ns.typing.nodes.$problemID.html("FIN");
            ns.typing.nodes.$problemRuby.html("Ruby");
            ns.typing.nodes.$problemCaption.html("Caption");
            ns.typing.nodes.$problemRaw.html("Problem");
        },
        scoreFuncs: {
            calcDifficulty: function(problemData){
                console.log(problemData);
                var chCount = 0.
                    sum     = 0,
                    maxAvg  = 0.0;
                for(var i = 0; problemData[i]; i++){
                    var diff
                        = problemData[i].endTime - problemData[i].startTime;
                    var temp = 0;
                    for(var j = 0; problemData[i].problemList[j]; j++){
                        temp += problemData[i].problemList[j][0].length;
                    }
                    var avg = 60 * (temp / diff);
                    chCount += temp;
                    sum += avg * temp;
                    maxAvg = Math.max(maxAvg, avg);
                }
                var points = Math.min(calcAvgPoint(sum / chCount), 21) + Math.min(calcMaxAvgPoint(maxAvg), 13);
                console.log("avg = " + (sum/chCount) + ", max-avg = " + maxAvg);
                console.log("points = " + points);
                switch (true) {
                    case points < 5: return 0;
                         break;
                    case points < 8: return 1;
                         break;
                    case points < 13: return 2;
                         break;
                    case points < 18: return 3;
                         break;
                    case points < 34: return 4;
                         break;
                    default: return 5;
                }
                return -1;

                function calcAvgPoint(avg){
                    return fib(Math.floor((avg - 150) / 50));
                }
                function calcMaxAvgPoint(avg){
                    return fib(Math.floor((avg - 300) / 50));
                }
                function fib(n){
                    var x = 0;
                    var y = 1;
                    for(var i = 0; i < n; i++){
                        var tmp = x + y;
                        x = y;
                        y = tmp;
                    }
                    return x;
                }
            },
            calcComboScore: function(combo){
                return Math.pow(combo, 1.5);
            },
            calcCorrectScore: function(correct){
                return 10 * correct;
            },
            calcMissScore: function(miss){
                return 10 * miss;
            },
            calcSpeedScore: function(speed){
                return speed * speed;
            },
            calcBonusScore: function(){
                var bonusScore = 0;
                bonusScore += calcMaxComboBonus();
                bonusScore += calcMaxSpeedBonus();
                return bonusScore;

                function calcMaxComboBonus(){
                    var maxCombo = ns.typing.status.maxCombo;
                    return maxCombo * maxCombo;
                }
                function calcMaxSpeedBonus(){
                    var maxSpeed = ns.typing.status.maxSpeed;
                    return maxSpeed * maxSpeed;
                }
            }
        },
        updateGraphics: function(){
            var preTime = parseFloat(ns.typing.nodes.typingSound.currentTime);
            var diffTime = 0;
            var preCorrect = ns.typing.status.correct;
            return function(){
                ns.typing.nodes.$scoreSumNode.html(ns.typing.getScoreSum());
                if(!ns.typing.status.intermission &&
                   !ns.typing.nodes.typingSound.paused){
                    diffTime += ns.typing.nodes.typingSound.currentTime - preTime;
                }
                preTime = ns.typing.nodes.typingSound.currentTime;
                if(!ns.typing.status.intermission &&
                   !ns.typing.nodes.typingSound.paused &&
                   ns.typing.status.calledNum % ns.typing.constants.callInterval == 0){
                    ns.typing.status.totalTime += diffTime;
                    var deltaSpeed =
                        (ns.typing.status.correct - preCorrect)*60/diffTime;
                    ns.typing.status.maxSpeed =
                        Math.max(ns.typing.status.maxSpeed, deltaSpeed);
                    ns.typing.updateSpeedGraph(deltaSpeed);
                    ns.typing.updateScoreBar();
                    ns.typing.updateTimeBar();
                    ns.typing.updateSpeedGauge();
                    ns.typing.updateScoreGraph();
                    ns.typing.updateScoreSpec();
                    preCorrect = ns.typing.status.correct;
                    diffTime = 0;
                }
                ns.typing.status.calledNum++;
                return true;
            };
        },

        updateScoreBar: function(){

        },
        updateTimeBar: function(){

        },
        updateSpeedGauge: function(){
            var typingSpeed = ns.typing.getSpeed();
            ns.typing.status.score.speed =
                roundN(ns.typing.scoreFuncs.calcSpeedScore(typingSpeed), 2);
            //console.log("speed = " + typingSpeed);
            ns.typing.graphics.speedGauge.update(roundN(typingSpeed, 2));
        },
        updateSpeedGraph: function(speed){
            ns.typing.graphics.speedGraph.addData(
                [roundN(speed, 2)],
                ns.typing.formatTime(ns.typing.nodes.typingSound.currentTime));
        },
        getScoreSum: function(){
            var scoresum = 0;
            for(x in ns.typing.status.score){
              //  console.log(ns.typing.status.score[x]);
                scoresum += ns.typing.status.score[x];
            }
            scoresum -= ns.typing.status.score.miss;
            return scoresum;
        },
        updateScoreGraph: function(){
            ns.typing.graphics.scoreGraph.addData(
            [roundN(ns.typing.getScoreSum(), 2)],
            ns.typing.formatTime(ns.typing.nodes.typingSound.currentTime));
        },
        updateScoreSpec: function(){
            ns.typing.graphics.scoreSpec.segments[0].value =
                roundN(ns.typing.status.score.correct, 2);
            ns.typing.graphics.scoreSpec.segments[1].value =
                roundN(ns.typing.status.score.combo, 2);
            ns.typing.graphics.scoreSpec.segments[2].value =
                roundN(ns.typing.status.score.speed, 2);

            ns.typing.status.score.bonus = ns.typing.scoreFuncs.calcBonusScore();
            ns.typing.graphics.scoreSpec.segments[3].value =
                roundN(ns.typing.status.score.bonus, 2);
            ns.typing.graphics.scoreSpec.segments[4].value =
                roundN(ns.typing.status.score.miss, 2);
            ns.typing.graphics.scoreSpec.update();
        },
        getSpeed: function(){
            console.log("totalTime = " + ns.typing.status.totalTime);
            console.log("correct = " + ns.typing.status.correct);
            if(ns.typing.status.totalTime == 0){
                return 0;
            }
            return ns.typing.status.correct * 60 / ns.typing.status.totalTime;
        },
        formatTime: function(seconds){
            seconds = Math.floor(seconds);
            var min = Math.floor(seconds / 60);
            var sec = seconds % 60;
            if(sec < 10){
                sec = "0" + sec;
            }
            return min + ":" + sec;
        },
        displayFinPage: function(){

        }
    };
})(fc = fc || {});

(function(ns){
    ns.userInputEvent = function(e){
        if(fc.typing.nodes.typingSound.paused ||
           fc.typing.status.intermission){
            return;
        }
        var x = String.fromCharCode(e.keyCode).toLowerCase();
        var currentProblem = fc.typing.status.currentProblem;
        if(currentProblem.length == 0){
            return;
        }
        var currentChar = fc.typing.status.currentProblem[0];
        console.log(currentChar);
        var isCorrect = false;
        console.log("key = " + x);
        console.log("keyCode = " + e.keyCode);
        console.log("char = " + currentChar[0][0]);
        for(var i = 0; i < currentChar.length; i++){
            if(x == currentChar[i][0]){
                fc.typing.status.correct++;
                fc.typing.nodes.$correctNode.html(fc.typing.status.correct);
                console.log("correctNode = " + fc.typing.nodes.$correctNode);
                fc.typing.status.score.correct +=
                    fc.typing.scoreFuncs.calcCorrectScore(fc.typing.status.correct);
                isCorrect = true;
                fc.typing.status.combo++;
                fc.typing.nodes.$comboNode.html(fc.typing.status.combo);
                fc.typing.status.score.combo +=
                    fc.typing.scoreFuncs.calcComboScore(fc.typing.status.combo);
                fc.typing.status.maxCombo =
                    Math.max(fc.typing.status.maxCombo, fc.typing.status.combo);
                break;
            }
        }
        if(!isCorrect){
            fc.typing.status.miss++;
            fc.typing.nodes.$missNode.html(fc.typing.status.miss);
            fc.typing.status.score.miss +=
                fc.typing.scoreFuncs.calcMissScore(fc.typing.status.miss);
            fc.typing.status.combo = 0;
        } else {
            for(var i = 0; i < currentChar.length; i++){
                if(x == currentChar[i][0]){
                    if(currentChar[i].length == 1){
                        currentProblem.splice(0, 1);
                        if(currentProblem.length == 0){
                            fc.typing.status.problemID++;
                            fc.typing.unfocusProblems();
                            fc.typing.resetCurrentProblem(fc.typing.status.problemID);
                            console.log(fc.typing.status);
                            return;
                        }
                    } else {
                        console.log("slice");
                        currentChar[i] = currentChar[i].slice(1);
                    }
                } else {
                    currentChar.splice(i, 1);
                    i--;
                }
            }
        }
        fc.typing.updateProblemRaw();
    };
    ns.controlWithKeys = function(e){
        if(e.ctrlKey){
            switch (e.keyCode) {
                case 32: fc.typing.nodes.typingSound.play();
                         fc.timers.add(fc.typing.updateProblems());
                         fc.timers.add(fc.typing.updateGraphics());
                         fc.timers.start();
                         break;
                case 81: fc.typing.nodes.typingSound.pause();
                         fc.timers.stop();
                         break;
                default: break;
            }
        }
    };
    ns.keyDownEvent = function(e){
        if(!fc.typing.status.loaded){
            return;
        }
        if(!e) e = window.event;

        if(e.ctrlKey){
            ns.controlWithKeys(e);
        } else {
            ns.userInputEvent(e);
        }
    };
})(fc.typing.events = fc.typing.events || {});
