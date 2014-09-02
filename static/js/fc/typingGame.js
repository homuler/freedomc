var fc = fc || {};
fc.graphics = fc.graphics || {};
fc.typing = fc.typing || {};
fc.typing.util = fc.typing.util || {};
fc.typing.status = fc.typing.status || {};
fc.typing.status.gameInfo = fc.typing.status.gameInfo || {};
fc.typing.status.playInfo = fc.typing.status.playInfo || {};
fc.typing.graphics = fc.typing.graphics || {};
fc.typing.events = fc.typing.events || {};

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
})(fc);

(function(ns){
    ns.constants = {
        htmlID: {
            title: "title",
            musician: "musician",
            sound: "typing-sound",
            difficulty: "difficulty",
            tempo: "tempo-mark",
            problem: {
                id: "problem-id",
                ruby: "problem-ruby",
                caption: "problem-caption",
                raw: "problem-raw",
            },
            correct: "correct-cell",
            miss: "miss-cell",
            combo: "combo-cell",
            score: "score-sum-cell",
            result: {
                resultData: "result-data",
                difficulty: "res-difficulty",
                maxScore: "res-max-score",
                maxType: "res-max-type",
                correct: "res-correct",
                correctScore: "res-correct-score",
                avgSpeed: "res-avg-speed",
                avgSpeedScore: "res-avg-speed-score",
                comboScore: "res-combo-score",
                solved: "res-solved",
                solvedScore: "res-solved-score",
                maxSpeed: "res-max-speed",
                maxSpeedScore: "res-max-speed-score",
                maxCombo: "res-max-combo",
                maxComboScore: "res-max-combo-score",
                scoreSumRaw: "res-score-sum-raw",
                correctRate: "res-correct-rate",
                scoreSum: "res-score-sum"
            }
        },
        graphicID: {
            speedGauge: "container-speed",
            speedGraph: "speed-graph",
            scoreGraph: "score-graph",
            scoreSpec: "score-spec"
        },
        graphicOptions: {
            speedGauge: { size: 200,
                          clipWidth: 200,
                          clipHeight: 200,
                          ringWidth: 60,
                          maxValue: 1000,
                          transitionMs: 4000
                        },
            speedGraph: {},
            scoreGraph: {},
            scoreSpec: {}
        },
        tempoMarks: { 250: "Grave",
                      300: "Lento",
                      350: "Largo",
                      400: "Adagio",
                      450: "Andante",
                      500: "Moderato",
                      550: "Allegro",
                      600: "Vivace",
                      650: "Presto",
                      700: "Prestissimo" },
        difficulties: ["Easy", "Normal", "Hard", "Extra Hard",
                       "Extreme", "Lunatic"],
        maxScores: [500000, 600000, 800000, 1000000, 1200000, 1500000]
    };
    ns.nodes = {
        typingSound: $("#" + ns.constants.htmlID.sound)[0],
        $musicTitle: $("#" + ns.constants.htmlID.title),
        $musicianName: $("#" + ns.constants.htmlID.musician),
        $difficulty: $("#" + ns.constants.htmlID.difficulty),
        $tempo: $("#" + ns.constants.htmlID.tempo),
        $problemID: $("#" + ns.constants.htmlID.problem.id),
        $problemRuby: $("#" + ns.constants.htmlID.problem.ruby),
        $problemCaption: $("#" + ns.constants.htmlID.problem.caption),
        $problemRaw: $("#" + ns.constants.htmlID.problem.raw),
        $correct: $("#" + ns.constants.htmlID.correct),
        $miss: $("#" + ns.constants.htmlID.miss),
        $combo: $("#" + ns.constants.htmlID.combo),
        $score: $("#" + ns.constants.htmlID.score),
        $resultData: $("#" + ns.constants.htmlID.result.resultData),
        $resDifficulty: $("#" + ns.constants.htmlID.result.difficulty),
        $resMaxScore: $("#" + ns.constants.htmlID.result.maxScore),
        $resMaxType: $("#" + ns.constants.htmlID.result.maxType),
        $resCorrect: $("#" + ns.constants.htmlID.result.correct),
        $resCorrectScore: $("#" + ns.constants.htmlID.result.correctScore),
        $resAvgSpeed: $("#" + ns.constants.htmlID.result.avgSpeed),
        $resAvgSpeedScore: $("#" + ns.constants.htmlID.result.avgSpeedScore),
        $resComboScore: $("#" + ns.constants.htmlID.result.comboScore),
        $resSolved: $("#" + ns.constants.htmlID.result.solved),
        $resSolvedScore: $("#" + ns.constants.htmlID.result.solvedScore),
        $resMaxSpeed: $("#" + ns.constants.htmlID.result.maxSpeed),
        $resMaxSpeedScore: $("#" + ns.constants.htmlID.result.maxSpeedScore),
        $resMaxCombo: $("#" + ns.constants.htmlID.result.maxCombo),
        $resMaxComboScore: $("#" + ns.constants.htmlID.result.maxComboScore),
        $resScoreSumRaw: $("#" + ns.constants.htmlID.result.scoreSumRaw),
        $resCorrectRate: $("#" + ns.constants.htmlID.result.correctRate),
        $resScoreSum: $("#" + ns.constants.htmlID.result.scoreSum)
    };

    ns.dictionary = {
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
        "?": ["?"],
        "？": ["?"],
        "'": ["'"],
        "!": ["!"],
        "！": ["!"]
    };
    ns.renderHTML = function(){
        var pId = fc.typing.status.playInfo.problemID,
            gameInfo = fc.typing.status.gameInfo;
        ns.nodes.$difficulty.html(fc.typing.constants.difficulties[gameInfo.difficulty]);
        ns.nodes.$problemID.html(pId+1);
        ns.nodes.$problemRuby.html(gameInfo.problemData[pId].problem);
        ns.nodes.$problemCaption.html(gameInfo.problemData[pId].display);
    };
})(fc.typing);

(function(ns){
    ns.formatTime = function(seconds){
        seconds = Math.floor(seconds);
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        if(sec < 10){
            sec = "0" + sec;
        }
        return min + ":" + sec;
    };
    ns.roundN = function(num, n){
        var d = Math.pow(10, n);
        var x = num * d;
        return Math.round(x) / d;
    };
})(fc.typing.util);

(function(ns){
    ns.problemData = [];
    ns.difficulty = 0;
    ns.maxScore = 0;
    ns.maxType = 0;
    ns.scoreRate = {
        correct: 0.4,
        speed: 0.3,
        maxSpeed: 0.05,
        combo: 0.1,
        maxCombo: 0.1,
        solved: 0.05
    };

    ns.evalDifficulty = function (problemData){
        var chCount = 0.
            sum     = 0,
            maxAvg  = 0.0;
        for(var i = 0; problemData[i]; i++){
            var diff = problemData[i].endTime - problemData[i].startTime;
            var temp = 0;
            for(var j = 0; problemData[i].problemList[j]; j++){
                temp += problemData[i].problemList[j][0].length;
            }
            var avg = 60 * (temp / diff);
            problemData[i].avgSpeed = avg;
            chCount += temp;
            sum += avg * temp;
            maxAvg = Math.max(maxAvg, avg);
        }
        var points = Math.min(calcAvgPoint(sum / chCount), 21) + Math.min(calcMaxAvgPoint(maxAvg), 13);
        ns.maxType = chCount;
        maxScores = fc.typing.constants.maxScores;
        switch (true) {
            case points < 5:  ns.maxScore = maxScores[0];
                              return 0;
                              break;
            case points < 8:  ns.maxScore = maxScores[1];
                              return 1;
                              break;
            case points < 13: ns.maxScore = maxScores[2];
                              return 2;
                              break;
            case points < 18: ns.maxScore = maxScores[3];
                              return 3;
                              break;
            case points < 34: ns.maxScore = maxScores[4];
                              return 4;
                              break;
            default: ns.maxScore = maxScores[5];
                     return 5;
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
    }
    ns.setProblemList = function (){
        for(var i = 0; ns.problemData[i]; i++){
            ns.problemData[i].problemList =
                problem2List(ns.problemData[i].problem);
        }
        function problem2List(problem){
            var dict = fc.typing.dictionary,
                temp = [],
                coeff = 0;
            for(var i = 0; i < problem.length; i++){
                var ch = problem.charAt(i);
                if(dict[ch]){
                    while(++i < problem.length && dict[ch+problem.charAt(i)]){
                        ch += problem.charAt(i);
                    }
                    i--;
                    temp.push(doubleCons(dict[ch], coeff));
                    coeff = 0;
                } else if(ch == "ッ" || ch == "っ"){
                    coeff++;
                } else {
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
        }
    }
})(fc.typing.status.gameInfo);

(function(ns){
    ns.flag = {
        loaded: false,
        intermission: true,
        paused: true,
        justFin: false
    },
    ns.problemID = 0;
    ns.currentProblem = null,
    ns.score = {
        correct: 0,
        combo: 0,
        speed: 0,
        solved: 0,
        maxCombo: 0,
        maxSpeed: 0
    };

    ns.scoreConstants = {
        resetValue: function(){
            var gameInfo = fc.typing.status.gameInfo;
            ns.scoreConstants.M = gameInfo.maxScore;
            ns.scoreConstants.m = gameInfo.maxType;
            var M = ns.scoreConstants.M,
                m = ns.scoreConstants.m;
            ns.scoreConstants.correctK = 2*gameInfo.scoreRate.correct*M / (m*(m + 1));
            ns.scoreConstants.solvedK = gameInfo.scoreRate.solved*M / gameInfo.problemData.length;
            ns.scoreConstants.comboK = 2*gameInfo.scoreRate.combo*M / (m*(m + 1))
            ns.scoreConstants.speedA = gameInfo.scoreRate.speed*M / (Math.pow(300, 3) + Math.pow(200, 3));
            var speedA = ns.scoreConstants.speedA;
            ns.scoreConstants.speedB = speedA*Math.pow(300, 3);
            ns.scoreConstants.maxSpeedA = gameInfo.scoreRate.maxSpeed*M / (Math.pow(400, 3) + Math.pow(200, 3));
            var maxSpeedA = ns.scoreConstants.maxSpeedA;
            ns.scoreConstants.maxSpeedB = maxSpeedA*Math.pow(400, 3);
            ns.scoreConstants.maxComboA =2*gameInfo.scoreRate.maxCombo*M / Math.pow(m, 3);
            var maxComboA = ns.scoreConstants.maxComboA;
            ns.scoreConstants.maxComboB = maxComboA*Math.pow(m, 3)/8;
        }
    };
    ns.spec = {
        combo: 0,
        maxCombo: 0,
        speed: 0,
        maxSpeed: 0,
        correct: 0,
        miss: 0,
        solved: 0,
        totalTime: 0
    };
    ns.graphicData = {
        scoreGraph: {
            labels: ["", "0:00"],
            datasets: [
                {
                    label: "Score Graph",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [0, 0]
                }
            ]
        },
        speedGraph: {
            labels: ["", "0:00"],
            datasets: [
                {
                    label: "Speed Graph",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [0, 0]
                }
            ]
        },
        scoreSpec: {
            labels: ["Correct", "Combo", "Speed", "Max Combo", "Max Speed", "Solved"],
            datasets: [
                {
                    label: "Raw Value",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointsStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [100, 100, 100, 100, 100, 100]
                },
                {
                    label: "Score Value",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointsStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [100, 100, 100, 100, 100, 100]
                }
            ]
        }
   /*     scoreSpec: [
            {
                value: 600000,
                color: "#f7464a",
                highlight: "#ff5a5e",
                label: "Correct"
            },
            {
                value: 400000,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Combo"
            },
            {
                value: 200000,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Speed"
            },
            {
                value: 150000,
                color: "#949FB1",
                highlight: "#A8B3C5",
                label: "Max Combo"
            },
            {
                value: 150000,
                color: "#F27855",
                highlight: "#F48969",
                label: "Max Speed"
            },
            {
                value: 150000,
                color: "#278912",
                highlight: "#F48969",
                label: "Solved"
            }
        ]*/
    };
    ns.renderProblemInfo = function(){
        var gameInfo = fc.typing.status.gameInfo,
            nodes = fc.typing.nodes;
        if(ns.problemID === 0 && ns.currentProblem === null){
            resetCurrentProblem(ns.problemID);
            nodes.$difficulty.html(fc.typing.constants.difficulties[gameInfo.difficulty]);
            nodes.$problemID.html(ns.problemID+1);
            nodes.$problemRuby.html(gameInfo.problemData[ns.problemID].problem);
            nodes.$problemCaption.html(gameInfo.problemData[ns.problemID].display);
            ns.renderProblem();
        }
        if(ns.currentProblem.length === 0){
            ns.spec.solved++;
            ns.score.solved += ns.scoreFuncs.getSolvedScore();
            ns.problemID++;
            unfocusProblems();
            resetCurrentProblem(ns.problemID);
        }
        if(ns.problemID >= gameInfo.problemData.length){
            console.log("play fin");
            ns.flag.justFin = true;
            clearProblems();
            return false;
        }

        var startTime = parseFloat(gameInfo.problemData[ns.problemID].startTime),
            endTime = parseFloat(gameInfo.problemData[ns.problemID].endTime),
            currentTime = parseFloat(fc.typing.nodes.typingSound.currentTime);
        if(ns.flag.intermission){
            if(startTime <= currentTime){
                focusProblems();
            }
        } else if(endTime < currentTime){
            ns.problemID++;
            ns.spec.combo = 0;
            if(ns.problemID >= gameInfo.problemData.length){
                console.log("game fin");
                console.log(ns.score);
                console.log(ns.spec);
                ns.flag.justFin = true;
                clearProblems();
                return false;
            }
            resetCurrentProblem(ns.problemID);
            var nextStartTime = parseFloat(gameInfo.problemData[ns.problemID].startTime);
            if(nextStartTime <= currentTime){
                unfocusProblems();
            }
        }
        return true;
        function focusProblems(){
            var nodes = fc.typing.nodes;
            ns.flag.intermission = false;
            nodes.$tempo.removeClass("unfocus");
            nodes.$tempo.addClass("focus");
            nodes.$problemID.removeClass("unfocus");
            nodes.$problemID.addClass("focus");
            nodes.$problemRuby.removeClass("unfocus");
            nodes.$problemRuby.addClass("focus");
            nodes.$problemCaption.removeClass("unfocus");
            nodes.$problemCaption.addClass("focus");
            nodes.$problemRaw.removeClass("unfocus");
            nodes.$problemRaw.addClass("focus");
        }
        function unfocusProblems(){
            var nodes = fc.typing.nodes;
            ns.flag.intermission = true;
            nodes.$tempo.addClass("unfocus");
            nodes.$tempo.removeClass("focus");
            nodes.$problemID.addClass("unfocus");
            nodes.$problemID.removeClass("focus");
            nodes.$problemRuby.addClass("unfocus");
            nodes.$problemRuby.removeClass("focus");
            nodes.$problemCaption.addClass("unfocus");
            nodes.$problemCaption.removeClass("focus");
            nodes.$problemRaw.addClass("unfocus");
            nodes.$problemRaw.removeClass("focus");
        }
        function resetCurrentProblem(pId){
            //console.log("reset called");
            var gameInfo = fc.typing.status.gameInfo,
                nodes = fc.typing.nodes;
            if(pId < 0 || pId >= gameInfo.problemData.length){
              //  console.log("invalid function call");
                return;
            }
            var problemData = gameInfo.problemData;
            ns.currentProblem = $.extend(true, [], problemData[pId].problemList);
            nodes.$problemID.html(pId + 1);
            nodes.$problemRuby.html(problemData[pId].problem);
            nodes.$problemCaption.html(problemData[pId].display);
            ns.renderProblem();
            ns.renderTempo();
        }
        function clearProblems(){
            var nodes = fc.typing.nodes;
            //console.log("clearProblems called");
            nodes.$problemID.html("FIN");
            nodes.$problemRuby.html("Ruby");
            nodes.$problemCaption.html("Caption");
            nodes.$problemRaw.html("Problem");
            unfocusProblems();
        }
    };
    ns.renderProblem = function(){
        var pStr = "";
        for(var i = 0; i < ns.currentProblem.length; i++){
            pStr += ns.currentProblem[i][0];
        }
        fc.typing.nodes.$problemRaw.html(pStr);
    };
    ns.renderScores = function(){
        var nodes = fc.typing.nodes;
        nodes.$score.html(ns.scoreFuncs.getScoreSum());
        nodes.$correct.html(ns.spec.correct);
        nodes.$miss.html(ns.spec.miss);
        nodes.$combo.html(ns.spec.combo);
    };
    ns.renderTempo = function(){
        var gameInfo = fc.typing.status.gameInfo,
            avg = gameInfo.problemData[ns.problemID].avgSpeed,
            tmp = Math.floor(avg / 50) * 50,
            tempoMarks = fc.typing.constants.tempoMarks;

        if (tmp < 250){
            tmp = 250;
        } else if(tmp > 700){
            tmp = 700;
        }
        var tempo = tempoMarks[tmp];
        fc.typing.nodes.$tempo.html(tempo + " " + Math.floor(avg));
    },
    ns.scoreFuncs = {
        getComboScore: function(combo){
            var k = ns.scoreConstants.comboK;
            return k * combo;
        },
        getCorrectScore: function(correct){
            var k = ns.scoreConstants.correctK;
            return k * correct;
        },
        getMissScore: function(miss){
            return 10 * miss;
        },
        getSpeedScore: function(speed){
            var a = ns.scoreConstants.speedA,
                b = ns.scoreConstants.speedB;
            return a * Math.pow(speed - 300, 3) + b;
        },
        getSolvedScore: function(solved){
            var k = ns.scoreConstants.solvedK;
            return k;
        },
        getMaxComboBonus: function (maxCombo){
            var m = fc.typing.status.gameInfo.maxType,
                a = ns.scoreConstants.maxComboA,
                b = ns.scoreConstants.maxComboB;
            return ns.score.maxCombo = a * Math.pow(maxCombo - m/2, 3) + b;
        },
        getMaxSpeedBonus: function (maxSpeed){
            var m = fc.typing.status.gameInfo.maxType,
                a = ns.scoreConstants.maxSpeedA,
                b = ns.scoreConstants.maxSpeedB;
            return ns.score.maxSpeed = a * Math.pow(maxSpeed - 400, 3) + b;
        },
        getScoreSumRaw: function(){
            var scoresum = 0;
            for(x in ns.score){
		console.log(x + " " + ns.score[x]);
                scoresum += ns.score[x];
            }
            return scoresum;
        },
        getCorrectRate: function(){
            var typeSum = ns.spec.correct + ns.spec.miss;
            return rate = typeSum === 0 ? 0 : ns.spec.correct / typeSum;
        },
        getScoreSum: function(){
            return ns.scoreFuncs.getCorrectRate() * ns.scoreFuncs.getScoreSumRaw();
        }
    };
    ns.getSpeed = function(){
        if(ns.spec.totalTime == 0){
            return 0;
        }
        return ns.spec.correct * 60 / ns.spec.totalTime;
    };
    ns.displayFinPage = function(){
        var nodes = fc.typing.nodes,
            gameInfo = fc.typing.status.gameInfo;
            util = fc.typing.util;
        nodes.$resultData.removeAttr("hidden");
        nodes.$resDifficulty.html(fc.typing.constants.difficulties[gameInfo.difficulty]);
        nodes.$resMaxScore.html(gameInfo.maxScore);
        nodes.$resMaxType.html(gameInfo.maxType);
        var correctRate = util.roundN(100 * ns.score.correct / (gameInfo.scoreRate.correct * gameInfo.maxScore), 2),
            speedRate = util.roundN(100 * ns.score.speed / (gameInfo.scoreRate.speed * gameInfo.maxScore), 2),
            comboRate = util.roundN(100 * ns.score.combo / (gameInfo.scoreRate.combo * gameInfo.maxScore), 2),
            maxSpeedRate = util.roundN(100 * ns.score.maxSpeed / (gameInfo.scoreRate.maxSpeed * gameInfo.maxScore), 2),
            maxComboRate = util.roundN(100 * ns.score.maxCombo / (gameInfo.scoreRate.maxCombo * gameInfo.maxScore), 2),
            solvedRate = util.roundN(100 * ns.score.solved / (gameInfo.scoreRate.solved * gameInfo.maxScore), 2);
        nodes.$resCorrect.html(ns.spec.correct);
        nodes.$resCorrectScore.html(util.roundN(ns.score.correct, 2) + " (" + correctRate + "%)");
        nodes.$resAvgSpeed.html(util.roundN(ns.getSpeed(), 2));
        nodes.$resAvgSpeedScore.html(util.roundN(ns.scoreFuncs.getSpeedScore(ns.getSpeed()), 2) + " (" + speedRate + "%)");
        nodes.$resComboScore.html(util.roundN(ns.score.combo, 2) + " (" + comboRate + "%)");
        nodes.$resSolved.html(ns.spec.solved);
        nodes.$resSolvedScore.html(util.roundN(ns.score.solved, 2) + " (" + solvedRate + "%)");
        ns.score.maxSpeed = ns.scoreFuncs.getMaxSpeedBonus(ns.spec.maxSpeed);
        ns.score.maxCombo = ns.scoreFuncs.getMaxComboBonus(ns.spec.maxCombo);
        nodes.$resMaxSpeed.html(util.roundN(ns.spec.maxSpeed, 2));
        nodes.$resMaxSpeedScore.html(util.roundN(ns.score.maxSpeed, 2) + " (" + maxSpeedRate + "%)");
        nodes.$resMaxCombo.html(ns.spec.maxCombo);
        nodes.$resMaxComboScore.html(util.roundN(ns.score.maxCombo, 2) + " (" + maxComboRate + "%)");
        nodes.$resScoreSumRaw.html(util.roundN(ns.scoreFuncs.getScoreSumRaw(), 2));
        nodes.$resCorrectRate.html(100*util.roundN(ns.scoreFuncs.getCorrectRate(), 2) + "%");
        var sum = util.roundN(ns.scoreFuncs.getScoreSum(), 2),
            sumStr = sum + " (" + fc.typing.util.roundN((100*sum/gameInfo.maxScore), 2) + "%)";
        nodes.$resScoreSum.html(sumStr);
    };
})(fc.typing.status.playInfo);

(function(ns){
    var playInfo = fc.typing.status.playInfo,
        graphicID = fc.typing.constants.graphicID;
    ns.options = {
        speedGauge: { size: 200,
                      clipWidth: 200,
                      clipHeight: 200,
                      ringWidth: 60,
                      maxValue: 800,
                      transitionMs: 1000
                    },
        speedGraph: {},
        scoreGraph: {},
        scoreSpec: {}
    };
    ns.speedGauge = null;
    ns.speedGraph = null;
    ns.scoreGraph = null;
    ns.scoreSpec = null;
    ns.initLineChart = function(id, data, options){
        var node = $("#" + id)[0].getContext("2d");
        return new Chart(node).Line(data, options);
    };
    ns.initPolarAreaChart = function(id, data, options){
        var node = $("#" + id)[0].getContext("2d");
        return new Chart(node).PolarArea(data, options);
    };
    ns.initRadarChart = function(id, data, options){
        var node = $("#" + id)[0].getContext("2d");
        return new Chart(node).Radar(data, options);
    };
    ns.renderGraphics = function(){
        ns.speedGauge = fc.graphics.speedGauge("#" + graphicID.speedGauge, ns.options.speedGauge);
        ns.speedGauge.render();
        var graphicData = playInfo.graphicData,
            gameInfo = fc.typing.status.gameInfo;
        /*graphicData.scoreSpec[0].value = 0.4*gameInfo.maxScore;
        graphicData.scoreSpec[1].value = 0.1*gameInfo.maxScore;
        graphicData.scoreSpec[2].value = 0.3*gameInfo.maxScore;
        graphicData.scoreSpec[3].value = 0.05*gameInfo.maxScore;
        graphicData.scoreSpec[4].value = 0.1*gameInfo.maxScore;
        graphicData.scoreSpec[5].value = 0.05*gameInfo.maxScore;*/
        ns.speedGraph
            = ns.initLineChart(graphicID.speedGraph,
                                  graphicData.speedGraph,
                                  ns.options.speedGraph);
        ns.scoreGraph
            = ns.initLineChart(graphicID.scoreGraph,
                                  graphicData.speedGraph,
                                  ns.options.speedGraph);
        ns.scoreSpec
            = ns.initRadarChart(graphicID.scoreSpec,
                                      graphicData.scoreSpec,
                                      ns.options.scoreSpec);
    };
    ns.updateGraphics = function(){
        var nodes = fc.typing.nodes,
            preTime = parseFloat(nodes.typingSound.currentTime),
            events = fc.typing.events,
            diffTime = 0,
            preCorrect = playInfo.spec.correct;
        return function(){
            if(!playInfo.flag.intermission &&
               !nodes.typingSound.paused){
                diffTime += nodes.typingSound.currentTime - preTime;
            }
            preTime = nodes.typingSound.currentTime;
            if(!playInfo.flag.intermission &&
               !nodes.typingSound.paused &&
               events.status.called % events.callInterval == 0){
                playInfo.spec.totalTime += diffTime;
                updateGraphics(diffTime, preCorrect);
                preCorrect = playInfo.spec.correct;
                diffTime = 0;
            } else if(playInfo.flag.justFin){
                updateGraphics(diffTime, preCorrect);
		playInfo.displayFinPage();
                return false;
            }
            events.status.called++;
            return true;

            function updateGraphics(diffTime, preCorrect){
                events.callInterval =
                    isNaN(fc.typing.nodes.typingSound.duration) ?
                        events.callInterval :
                        Math.round(fc.typing.nodes.typingSound.duration/2);
                playInfo.score.maxSpeed = playInfo.scoreFuncs.getMaxSpeedBonus(playInfo.spec.maxSpeed);
                playInfo.score.maxCombo = playInfo.scoreFuncs.getMaxComboBonus(playInfo.spec.maxCombo);
                var deltaSpeed =
                    (playInfo.spec.correct - preCorrect)*60/diffTime;
                playInfo.spec.maxSpeed =
                    Math.max(playInfo.spec.maxSpeed, deltaSpeed);
                ns.updateSpeedGraph(deltaSpeed);
                ns.updateScoreBar();
                ns.updateTimeBar();
                ns.updateSpeedGauge();
                ns.updateScoreGraph();
                ns.updateScoreSpec();
            }
        };
    };
    ns.updateScoreBar = function(){

    };
    ns.updateTimeBar = function(){

    };
    ns.updateSpeedGauge = function(){
        var typingSpeed = playInfo.getSpeed();
        playInfo.score.speed =
            fc.typing.util.roundN(playInfo.scoreFuncs.getSpeedScore(typingSpeed), 2);
        ns.speedGauge.update(fc.typing.util.roundN(typingSpeed, 2));
    };
    ns.updateSpeedGraph = function(speed){
        ns.speedGraph.addData(
            [fc.typing.util.roundN(speed, 2)],
            fc.typing.util.formatTime(fc.typing.nodes.typingSound.currentTime));
    };
    ns.updateScoreGraph = function(){
        ns.scoreGraph.addData(
            [fc.typing.util.roundN(playInfo.scoreFuncs.getScoreSum(), 2)],
            fc.typing.util.formatTime(fc.typing.nodes.typingSound.currentTime));
    };
    ns.updateScoreSpec = function(){
        var gameInfo = fc.typing.status.gameInfo;
        ns.scoreSpec.datasets[0].points[0].value =
            fc.typing.util.roundN(playInfo.score.correct, 2)/(0.4*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[0].value =
            fc.typing.util.roundN(playInfo.spec.correct, 2)/gameInfo.maxType;
        ns.scoreSpec.datasets[0].points[1].value =
            fc.typing.util.roundN(playInfo.score.combo, 2)/(0.1*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[1].value =
            fc.typing.util.roundN(playInfo.spec.combo, 2)/gameInfo.maxType;
        ns.scoreSpec.datasets[0].points[2].value =
            fc.typing.util.roundN(playInfo.score.speed, 2)/(0.3*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[2].value =
            playInfo.getSpeed()/500;
        ns.scoreSpec.datasets[0].points[3].value =
            fc.typing.util.roundN(playInfo.score.maxCombo, 2)/(0.05*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[3].value =
            playInfo.spec.maxCombo/gameInfo.maxType;
        ns.scoreSpec.datasets[0].points[4].value =
            fc.typing.util.roundN(playInfo.score.maxSpeed, 2)/(0.1*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[4].value =
            playInfo.spec.maxSpeed/600;
        ns.scoreSpec.datasets[0].points[5].value =
            fc.typing.util.roundN(playInfo.score.solved, 2)/(0.05*gameInfo.maxScore);
        ns.scoreSpec.datasets[1].points[5].value =
            playInfo.spec.solved/gameInfo.problemData.length;
        ns.scoreSpec.update();
    };
})(fc.typing.graphics);

(function(ns){
    var playInfo = fc.typing.status.playInfo,
        nodes = fc.typing.nodes;
    ns.callInterval = 50;
    ns.status = {
        called: 0
    }
    ns.userInputEvent = function(e){
        if(nodes.typingSound.paused ||
           playInfo.flag.intermission){
            return;
        }
        var x = String.fromCharCode(e.keyCode).toLowerCase();
        var currentProblem = playInfo.currentProblem;
        if(currentProblem.length == 0){
            return;
        }
        var currentChar = playInfo.currentProblem[0];
        var isCorrect = false;
        for(var i = 0; i < currentChar.length; i++){
            if(x == currentChar[i][0]){
                playInfo.spec.correct++;
                nodes.$correct.html(playInfo.spec.correct);
                playInfo.score.correct +=
                    playInfo.scoreFuncs.getCorrectScore(playInfo.spec.correct);
                isCorrect = true;
                playInfo.spec.combo++;
                nodes.$combo.html(playInfo.spec.combo);
                playInfo.score.combo +=
                    playInfo.scoreFuncs.getComboScore(playInfo.spec.combo);
                playInfo.spec.maxCombo =
                    Math.max(playInfo.spec.maxCombo, playInfo.spec.combo);
                break;
            }
        }
        if(!isCorrect){
            playInfo.spec.miss++;
            playInfo.spec.combo = 0;
        } else {
            for(var i = 0; i < currentChar.length; i++){
                if(x == currentChar[i][0]){
                    if(currentChar[i].length == 1){
                        currentProblem.splice(0, 1);
                        if(currentProblem.length == 0){
                 //           playInfo.problemID++;
                 //           fc.typing.unfocusProblems();
                 //           fc.typing.resetCurrentProblem(fc.typing.status.problemID);
                            break;
                        }
                    } else {
                        currentChar[i] = currentChar[i].slice(1);
                    }
                } else {
                    currentChar.splice(i, 1);
                    i--;
                }
            }
        }
        playInfo.renderScores();
        playInfo.renderProblem();
    };
    ns.controlWithKeys = function(e){
        if(e.ctrlKey){
            switch (e.keyCode) {
                case 32: fc.typing.renderHTML();
                         fc.typing.nodes.typingSound.play();
                         fc.timers.add(playInfo.renderProblemInfo);
                         fc.timers.add(fc.typing.graphics.updateGraphics());
                         fc.timers.start();
                         break;
                case 81: fc.typing.nodes.typingSound.pause();
                         fc.timers.stop();
                         break;
                default: break;
            }
        }
    };
    ns.keyPressEvent = function(e){
        if(!playInfo.flag.loaded){
            return;
        }
        if(!e) e = window.event;

        if(!e.ctrlKey){
            e.preventDefault();
            ns.userInputEvent(e);
        }
    };
    ns.postRecord = function(){
        var $resultForm = fc.typing.nodes.$resultForm,
            scoreInput = document.createElement("input");
        scoreInput.name = "score-sum-val"
        scoreInput.value = playInfo.scoreFuncs.getScoreSum();
        scoreInput.hidden = true;
        $resultForm.append(scoreInput);
        $resultForm.submit();
        return false;
    };
})(fc.typing.events);
