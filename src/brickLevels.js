export default function makeLevels(height, width) {
    return[
        {
            index: 0,
            balls: [{
                popped: false,
                type: 'pop',
                style: {
                    top: 40,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            },
            {
                popped: false,
                type: 'black',
                style: {
                    top: 100,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    background: 'grey'
                }
            },
            {
                popped: false,
                type: 'pop',
                style: {
                    top: 160,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            }]
        },
        {
            index: 1,
            balls: [{
                popped: false,
                type: 'pop',
                style: {
                    top: 100,
                    left: width/2 - 80,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            },
            {
                popped: false,
                type: 'black',
                style: {
                    top: 100,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    background: 'grey'
                }
            },
            {
                popped: false,
                type: 'pop',
                style: {
                    top: 100,
                    left: width/2 + 40,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            }]
        },
        {
            index: 2,
            balls: [{
                popped: false,
                type: 'pop',
                style: {
                    top: 100,
                    left: width/2 - 80,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            },
            {
                popped: false,
                type: 'black',
                style: {
                    top: 100,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    background: 'grey'
                }
            },
            {
                popped: false,
                type: 'pop',
                style: {
                    top: 40,
                    left: width/2 - 20,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            },
            {
                popped: false,
                type: 'pop',
                style: {
                    top: 100,
                    left: width/2 + 40,
                    height: 40,
                    width: 40,
                    borderRadius: 20
                }
            }]
        }
    ]
}