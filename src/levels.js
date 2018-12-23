function levels(h, w) {
    return levels = [
        {
            id: 1,
            obstacles: [[[w,((2 * h)/9) -25],[w,((2 * h)/9) +25],[w/2,((2 * h)/9) +25], [w/2,((2 * h)/9) -25]]],
            target: [[(w / 2 )+ 25,((2 * h)/9) -50 - 50],[ (w / 2 ) + 75,((2 * h)/9) -50 - 50],[(w / 2 ) + 75, ((2 * h)/9) -50], [(w / 2 )+ 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        }
        ,
        {
            id: 2,
            obstacles: [[[w,((2 * h)/9) -25],[w,((2 * h)/9) +25],[w/2,((2 * h)/9) +25], [w/2,((2 * h)/9) -25]]],
            target: [[w- 25,((2 * h)/9) -50 - 50],[ w- 75,((2 * h)/9) -50 - 50],[w- 75, ((2 * h)/9) -50], [w- 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        }
        ,
        {
            id: 3,
            obstacles: [[[((3*w) / 4),((2 * h)/9) -25],[((3*w) / 4),((2 * h)/9) +25],[w/4,((2 * h)/9) +25], [w/4,((2 * h)/9) -25]]],
            target: [[(w/ 2)- 25,((2 * h)/9) -50 - 50],[ (w/2) + 25,((2 * h)/9) -50 - 50],[(w/2) + 25, ((2 * h)/9) -50], [(w/ 2)- 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        },
        {
            id: 4,
            obstacles: [[[(w/2),((2 * h)/9) -25],[(w/2),((2 * h)/9) +25],[0,((2 * h)/9) +25], [0,((2 * h)/9) -25]]],
            target: [[(w/ 9)- 25,((2 * h)/9) -50 - 50],[ (w/9) + 25,((2 * h)/9) -50 - 50],[(w/9) + 25, ((2 * h)/9) -50], [(w/ 9)- 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        }
        ,
        {
            id: 5,
            obstacles: [[[(w/2),((2 * h)/9) -75], [(w/2),((2 * h)/9) +25],[0,((2 * h)/9) +25], [0,((2 * h)/9) -25], [((w/2)-50),((2 * h)/9) -25], [((w/2)-50),((2 * h)/9) -75]]],
            target: [[(w/ 9)- 25,((2 * h)/9) -50 - 50],[ (w/9) + 25,((2 * h)/9) -50 - 50],[(w/9) + 25, ((2 * h)/9) -50], [(w/ 9)- 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        },
        {
            id: 6,
            obstacles: [[[(w/2),((2 * h)/9) -75], [(w/2),((2 * h)/9) +25],[w,((2 * h)/9) +25], [w,((2 * h)/9) -25], [((w/2)-50),((2 * h)/9) -25], [((w/2)-50),((2 * h)/9) -75]]],
            target: [[w- 25,((2 * h)/9) -50 - 50],[ w- 75,((2 * h)/9) -50 - 50],[w- 75, ((2 * h)/9) -50], [w- 25, ((2 * h)/9) -50]],
            start: [[40,h-40],[80,h-40],[80,h-80],[40,h-80]]
        }
    ]
    }

    export default function level2(h, w) {
        return levels = [
            {
                id: 1,
                obstacles: [{
                    points: [[0,h/6], [200,h/6], [200,h/6 + 50], [0,h/6 + 50]],
                    durations: [[0, 2000],[2000, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: w-200, moveY: 0, rot: 0 }, { moveX: 200-w, moveY: 0, rot: 0 }],
                }],
                target: [[0, 0],[w, 0], [w, 40], [0,40]],
                targetTop: 0,
                targetHeight: 40,
                targetWidth: w,
                startTop: h-40,
                startHeight: 40,
                startWidth: w,
                start: [[0, h],[w, h], [w, h-60], [0,h-60]]
            },
            {
                id: 2,
                obstacles: [{
                    points: [[0,h/6], [w/2,h/6], [w/2,h/6 + 50], [0,h/6 + 50]],
                    durations: [[0, 1800],[1800,2000],[2000, 4000],[4000,4200]],
                    resetDuration: 4200,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 },{ moveX: w/2, moveY: 0, rot: 0 },{ moveX: 0, moveY: 0, rot: 0 }, { moveX: -w/2, moveY: 0, rot: 0 }],
                },
                {
                    points: [[w/2,h/3], [w,h/3], [w,h/3 + 50], [w/2,h/3 + 50]],
                    durations: [[0, 1800],[1800,2000],[2000, 4000],[4000,4200]],
                    resetDuration: 4200,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 },{ moveX: -w/2, moveY: 0, rot: 0 },{ moveX: 0, moveY: 0, rot: 0 }, { moveX: w/2, moveY: 0, rot: 0 }],
                }],
                target: [[0, 0],[w, 0], [w, 40], [0,40]],
                targetTop: 0,
                targetHeight: 40,
                targetWidth: w,
                startTop: h-40,
                startHeight: 40,
                startWidth: w,
                start: [[0, h],[w, h], [w, h-60], [0,h-60]]
            },
            {
                id: 3,
                obstacles: [{
                    points: [[50,h/3 - 25], [w - 50,h/3 - 25], [w - 50,h/3 + 25], [50,h/3 + 25]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 360 }],
                }],
                target: [[0, 0],[w, 0], [w, 40], [0,40]],
                targetTop: 0,
                targetHeight: 40,
                targetWidth: w,
                startTop: h-40,
                startHeight: 40,
                startWidth: w,
                start: [[0, h],[w, h], [w, h-60], [0,h-60]]
            },
            {
                id: 4,
                obstacles: [{
                    points: [[100,h/2 - 25], [w-100,h/2 - 25], [w-100,h/2 + 25], [100,h/2 + 25]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 360 }],
                },
                {
                    points: [[0,h/5], [w/2 - 25,h/5], [w/2 - 25,h/5 + 50], [0,h/5 + 50]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 }],
                },
                {
                    points: [[w/2 + 25,h/5], [w,h/5], [w,h/5 + 50], [w/2 + 25,h/5 + 50]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 }],
                }],
                target: [[0, 0],[w, 0], [w, 40], [0,40]],
                targetTop: 0,
                targetHeight: 40,
                targetWidth: w,
                startTop: h-40,
                startHeight: 40,
                startWidth: w,
                start: [[0, h],[w, h], [w, h-60], [0,h-60]]
            },
            {
                id: 5,
                obstacles: [{
                    points: [[100,h/2 - 50], [w-100,h/2 - 50], [w-100,h/2], [100,h/2]],
                    durations: [[0, 2000], [2000, 4000],[4000,6000], [6000,8000]],
                    resetDuration: 8000,
                    animation: [{ moveX: 0, moveY: 100, rot: 0 }, { moveX: 0, moveY: -100, rot: 0 }, { moveX: 0, moveY: -100, rot: 0 },{ moveX: 0, moveY: 100, rot: 0 }],
                },
                {
                    points: [[0,h/2 - 50], [w/2 - 100,h/2 - 50], [w/2 - 100,h/2 - 50 + 50], [0,h/2 - 50 + 50]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 }],
                },
                {
                    points: [[w/2 + 100,h/2 - 50], [w,h/2 - 50], [w,h/2 - 50 + 50], [w/2 + 100,h/2 - 50 + 50]],
                    durations: [[0, 4000]],
                    resetDuration: 4000,
                    animation: [{ moveX: 0, moveY: 0, rot: 0 }],
                }],
                target: [[0, 0],[w, 0], [w, 40], [0,40]],
                targetTop: 0,
                targetHeight: 40,
                targetWidth: w,
                startTop: h-40,
                startHeight: 40,
                startWidth: w,
                start: [[0, h],[w, h], [w, h-60], [0,h-60]]
            },
            {
                id: 6,
                obstacles: [{
                    points: [[w/2-30,300],[w/2-100,300],[w/2-100,100],[w/2+100,100],[w/2+100,300],[w/2+30,300],[w/2+30,150],[w/2-30,150]],
                    durations: [[0, 8000]],
                    resetDuration: 8000,
                    animation: [{ moveX: 0, moveY: 0, rot: -360 }],
                }],
                target: [[w/2-10, 180],[w/2-10, 200],[w/2+10, 200],[w/2+10, 180]],
                targetTop: 180,
                targetHeight: 20,
                targetWidth: 20,
                startTop: h-100,
                startHeight: 40,
                startWidth: 40,
                start: [[w/2 - 20, h- 100],[w/2 - 20, h - 60], [w/2 + 20, h-60], [w/2 + 20,h-100]]
            },
            {
                id: 7,
                obstacles: [],
                target: [],
                targetTop: 180,
                targetHeight: 20,
                targetWidth: 20,
                startTop: h-100,
                startHeight: 40,
                startWidth: 40,
                start: [[w/2 - 20, h- 100],[w/2 - 20, h - 60], [w/2 + 20, h-60], [w/2 + 20,h-100]]
            },
        ]
        }