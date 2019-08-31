export default function makeLevels(height, width, brickEdge) {
  return [
    {
      index: 0,
      poppableNumber: 2,
      balls: [
        {
          popped: false,
          type: "pop",
          style: {
            top: height / 2 - brickEdge / 2 - brickEdge - brickEdge / 2,
            left: width / 2 - brickEdge / 2,
            height: brickEdge,
            width: brickEdge,
            borderRadius: brickEdge / 2
          }
        },
        {
          popped: false,
          type: "black",
          style: {
            top: height / 2 - brickEdge / 2,
            left: width / 2 - brickEdge / 2,
            height: brickEdge,
            width: brickEdge,
            borderRadius: brickEdge / 2
          }
        },
        {
          popped: false,
          type: "pop",
          style: {
            top: height / 2 + brickEdge / 2 + brickEdge / 2,
            left: width / 2 - brickEdge / 2,
            height: brickEdge,
            width: brickEdge,
            borderRadius: brickEdge / 2
          }
        }
      ]
    },
    {
      index: 1,
      poppableNumber: 2,
      balls: [
        {
          popped: false,
          type: "pop",
          style: {
            top: 100,
            left: width / 2 - 80,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        },
        {
          popped: false,
          type: "black",
          style: {
            top: 100,
            left: width / 2 - 20,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        },
        {
          popped: false,
          type: "pop",
          style: {
            top: 100,
            left: width / 2 + 40,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        }
      ]
    },
    {
      index: 2,
      poppableNumber: 3,
      balls: [
        {
          popped: false,
          type: "pop",
          style: {
            top: 100,
            left: width / 2 - 80,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        },
        {
          popped: false,
          type: "black",
          style: {
            top: 100,
            left: width / 2 - 20,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        },
        {
          popped: false,
          type: "pop",
          style: {
            top: 40,
            left: width / 2 - 20,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        },
        {
          popped: false,
          type: "pop",
          style: {
            top: 100,
            left: width / 2 + 40,
            height: brickEdge,
            width: brickEdge,
            borderRadius: 20
          }
        }
      ]
    }
  ];
}
