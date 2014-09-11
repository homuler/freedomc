var fc = fc || {};
fc.data = fc.data || {};

(function(ns){
    ns.tempoMarks =
        {
            250: "Grave",
            300: "Lento",
            350: "Largo",
            400: "Adagio",
            450: "Andante",
            500: "Moderato",
            550: "Allegro",
            600: "Vivace",
            650: "Presto",
            700: "Prestissimo"
        };
    ns.difficulties = ["Easy", "Normal", "Hard", "Extra Hard",
                       "Extreme", "Lunatic"];
    ns.maxScores = [500000, 600000, 800000, 1000000, 1200000, 1500000];

    ns.maxScoresMap = {};
    for(var i = 0; i < ns.difficulties.length; i++){
        ns.maxScoresMap[ns.difficulties[i]] = ns.maxScores[i];
    }
})(fc.data = fc.data || {});
