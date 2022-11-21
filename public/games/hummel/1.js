[
    {
        time: 0,
        messageUrl: 'messages.html #intro',
        pause: true,
        onDismissed: function () {
            $(document).data('engine.cvh').execCuepoint({
                timeout: 1,
                messageUrl: 'messages.html #sponsor',
                onDismissed: function () {
                    $(document).data('engine.cvh').goto(208.8, true); // 208.8
                }
            }); // 208.8
        }
    },
    //{ goto: 148, time: 0 },
    //{ goto: 33, time: 8 },      // 1-0
    //{ goto: 88, time: 40 },     // 2-0
    //{ goto: 148, time: 98 },    // 3-0
    { goto: 209, time: 159 },   // 3-1
    {
        time: 209.2, timeout: 5,
        coords: [
            { correct: false, xp: 83.8, yp: 39.5 },
            { correct: true, xp: 35.3, yp: 44.7 },
            { correct: false, xp: 45.1, yp: 49.5 }
        ]
    },
    { goto: 222.2, time: 217 },
    { goto: 244, time: 236 },   // 3-2
    {
        time: 244.8, timeout: 5,
        coords: [
            { correct: true, xp: 83.1, yp: 40.1 },
            { correct: false, xp: 83.2, yp: 54.7 },
            { correct: false, xp: 40.4, yp: 42.4 }
        ]
    },
    {
        time: 245.9, timeout: 5,
        coords: [
            { correct: true, xp: 65.5, yp: 55.1 },
            { correct: false, xp: 27.6, yp: 35.0 },
            { correct: false, xp: 63.6, yp: 30.9 }
        ]
    },
    {
        time: 247.5, timeout: 5,
        coords: [
            { correct: true, xp: 77.4, yp: 61.5 },
            { correct: false, xp: 42.3, yp: 43.0 },
            { correct: false, xp: 33.1, yp: 47.5 }
        ]
    },
    {
        time: 249.4, timeout: 5,
        coords: [
            { correct: true, xp: 12.1, yp: 47.0 },
            { correct: false, xp: 58.3, yp: 40.8 },
            { correct: false, xp: 69.9, yp: 48.0 }
        ]
    },
    {
        time: 250.8, timeout: 5,
        coords: [
            { correct: true, xp: 48.3, yp: 47.8 },
            { correct: false, xp: 61.0, yp: 44.7 }
        ]
    },
    { goto: 263, time: 255 },
    {
        time: 277, timeout: 5,
        coords: [
            { correct: true, xp: 56.9, yp: 49.3 },
            { correct: false, xp: 76.0, yp: 40.6 },
            { correct: false, xp: 76.8, yp: 55.7 }
        ]
    },
    {
        time: 279.2, timeout: 5,
        coords: [
            { correct: true, xp: 54.0, yp: 52.3 },
            { correct: false, xp: 45.6, yp: 46.2 },
            { correct: false, xp: 68.1, yp: 51.8 }
        ]
    },
    {
        time: 280.7, timeout: 5,
        coords: [
            { correct: true, xp: 74.5, yp: 47.9 },
            { correct: false, xp: 62.5, yp: 39.8 }
        ]
    },
    //{ goto: 270, time: 270 },   // 3-3
    { time: 321, end: true }
]