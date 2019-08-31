import React from "react";
import "./App.css";
import Immutable from "immutable";
import lottie from "lottie-web";
import all from "./brickLevels";
var height = window.innerHeight,
  width = window.innerWidth;
var startHeight = 40,
  startWidth = 100,
  touchHeight = 100,
  touchWidth = 100,
  startTop = height - 100,
  lineMax = height * 1.5,
  lineLength = 0,
  brickEdge = width / 7,
  strokeWidth = width / 50,
  levelNo = 0,
  characterLottieSegments = [[0, 87], [88, 117], [117, 171]];
var allLevels = [];

export default class Bricks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: new Immutable.List(),
      relArray: new Immutable.List(),
      isDrawing: false,
      lineColor: "white",
      confettiLeft: 0,
      confettiTop: 0,
      isAlive: false,
      gameWon: false,
      start: [
        [width / 2 - startWidth, startTop],
        [width / 2 + startWidth, startTop],
        [width / 2 + startWidth, startTop + startHeight],
        [width / 2 - startWidth, startTop + startHeight]
      ],
      arr: [],
      orientation: { a: 0 }
    };
    this.gameLoop = this.gameLoop.bind(this);
    this.handleOrientation = this.handleOrientation.bind(this);
    this.allCharRefs = [];
    this.allCharLotties = [];
  }
  handleOrientation(e) {
    console.log(e);
    this.setState({
      orientation: e
    });
  }
  componentDidMount() {
    window.addEventListener("deviceorientation", this.handleOrientation, true);
    document.querySelector(".drawArea").style.height = height + "px";
    document.querySelector(".drawArea").style.width = width + "px";
    this.initConfettiLottie();
    allLevels = all(height, width, brickEdge);
    this.setState(
      {
        arr: allLevels[levelNo].balls
      },
      () => {
        this.initAllCharLotties();
        this.resetLevel();
      }
    );
    this.refs.drawArea.addEventListener(
      "touchmove",
      event => this.handleMouseMove(event),
      false
    );
    this.refs.drawArea.addEventListener(
      "touchend",
      event => this.handleMouseUp(event),
      false
    );
    this.refs.drawArea.addEventListener(
      "touchstart",
      event => this.handleMouseDown(event),
      false
    );
  }
  initAllCharLotties() {
    this.allCharRefs.map((charRef, index) => {
      if (this.state.arr[index].type !== "pop") return;
      this.allCharLotties[index] = lottie.loadAnimation({
        container: charRef,
        animType: "svg",
        prerender: true,
        autoplay: false,
        loop: true,
        animationData: require(`./assets/character.json`) // the path to the animation json
      });
      this.allCharLotties[index].setSpeed(0.7);
      const randomFrame = Math.floor(
        Math.random() * characterLottieSegments[0][1]
      );
      this.allCharLotties[index].playSegments(characterLottieSegments[0], true);
      this.allCharLotties[index].goToAndPlay(randomFrame, true);
    });
  }
  initConfettiLottie() {
    this.confettiLottie = lottie.loadAnimation({
      container: this.confettiRef,
      animType: "svg",
      prerender: true,
      autoplay: false,
      loop: false,
      animationData: require(`./assets/confetti3.json`) // the path to the animation json
    });
    this.confettiLottie.setSpeed(2);
  }
  changeLevel() {
    levelNo >= allLevels.length - 1 ? (levelNo = 0) : levelNo++;
    this.resetLevel();
  }
  resetLevel() {
    let poppedCount = 0;
    this.state.arr.map(brick => {
      if (brick.popped) poppedCount++;
    });
    if (poppedCount === this.state.poppableNumber && !this.state.gameWon) {
      this.setState({
        gameWon: true
      });
      this.allCharLotties.map(charLottie =>
        charLottie.playSegments(characterLottieSegments[2], true)
      );
    } else {
      allLevels = all(height, width, brickEdge);
      this.setState(
        {
          arr: allLevels[levelNo].balls,
          poppableNumber: allLevels[levelNo].poppableNumber,
          gameWon: false
        },
        () => {
          if (poppedCount !== 0) {
            this.allCharLotties.map(item => item.destroy());
            this.initAllCharLotties();
          }
        }
      );
    }
  }
  inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }
  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.touches[0].clientX - boundingRect.left,
      y: mouseEvent.touches[0].clientY - boundingRect.top
    });
  }
  handleMouseDown(mouseEvent) {
    if (this.state.gameWon) return;
    var touchPoint = [
      mouseEvent.touches[0].clientX,
      mouseEvent.touches[0].clientY
    ];
    // if (!this.inside(touchPoint, this.state.start)) return;
    let touchedBubbles = false;
    this.state.arr.map(item => {
      if (
        this.inside(touchPoint, [
          [item.style.left, item.style.top],
          [item.style.left + brickEdge, item.style.top],
          [item.style.left + brickEdge, item.style.top + brickEdge],
          [item.style.left, item.style.top + brickEdge]
        ])
      ) {
        touchedBubbles = true;
      }
    });
    if (touchedBubbles) return;
    this.resetLevel();
    // this.startLottie.pause();
    window.cancelAnimationFrame(this.gameLoopRef);
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    this.setState(
      {
        lines: new Immutable.List()
      },
      () => {
        this.setState(prevState => ({
          lines: prevState.lines.push(new Immutable.List([point])),
          isDrawing: true,
          isAnimating: false,
          relArray: new Immutable.List()
        }));
      }
    );
  }
  handleMouseMove = mouseEvent => {
    if (!this.state.isDrawing) {
      return;
    }
    const point = this.relativeCoordinatesForEvent(mouseEvent);
    if (lineLength > lineMax || this.detectCollision(point).genericCollision)
      this.handleMouseUp();
    // var touchPoint = [
    //   mouseEvent.touches[0].clientX,
    //   mouseEvent.touches[0].clientY
    // ];
    if (this.state.lines) {
      const listNumber = this.state.lines.size - 1;
      const pointNumber =
        (this.state.lines.get(this.state.lines.size - 1) &&
          this.state.lines.get(this.state.lines.size - 1).size - 1) ||
        0;
      const prevPoint = this.state.lines.getIn([listNumber, pointNumber]);
      if (prevPoint) {
        const slope =
          (prevPoint.get("y") - point.get("y")) /
          (prevPoint.get("x") - point.get("x"));
        const dist = Math.sqrt(
          Math.pow(prevPoint.get("y") - point.get("y"), 2) +
            Math.pow(prevPoint.get("x") - point.get("x"), 2)
        );
        if (dist < 2) return;
        const xDir = point.get("y") < prevPoint.get("y");
        const yDir = point.get("x") < prevPoint.get("x");
        let relSeg = [];
        if (dist > 20) {
          let flag = 0;
          let factor = dist / 3;
          while (flag < dist) {
            flag = flag + factor;
            relSeg.push({ slope: slope, dist: factor, xDir: xDir, yDir: yDir });
          }
        } else {
          relSeg.push({ slope: slope, dist: dist, xDir: xDir, yDir: yDir });
        }
        const newSeg = new Immutable.List(relSeg);
        lineLength = lineLength + dist;
        this.setState(prevState => ({
          lines: prevState.lines.updateIn([prevState.lines.size - 1], line =>
            line.push(point)
          ),
          relArray: prevState.relArray.concat(newSeg)
        }));
      }
    } else
      this.setState(prevState => ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line =>
          line.push(point)
        )
      }));
  };
  handleMouseUp() {
    if (!this.state.isDrawing) return;
    // this.startLottie.play();
    lineLength = 0;
    // var size =
    //   this.state.lines.get(this.state.lines.size - 1) &&
    //   this.state.lines.get(this.state.lines.size - 1).size;
    // if (size > 8)
    this.setState({ isDrawing: false, isAlive: true }, () => this.startTimer());
    // else
    // this.setState({
    //   lines: new Immutable.List(),
    //   relArray: new Immutable.List(),
    //   isDrawing: false,
    //   isAlive: false
    // });
  }
  startTimer() {
    this.relPointer = 0;
    (this.refPoint = this.state.lines
      .get(this.state.lines.size - 1)
      .get(this.state.lines.get(this.state.lines.size - 1).size - 1)),
      (this.relObj = this.state.relArray.get(this.relPointer));
    this.gameLoopRef = window.requestAnimationFrame(this.gameLoop);
  }
  gameLoop() {
    if (!this.state.isAlive) {
      window.cancelAnimationFrame(this.gameLoopRef);
      this.setState({
        lines: new Immutable.List(),
        relArray: new Immutable.List(),
        isDrawing: false,
        isAlive: false
      });
      return;
    }
    this.relObj = this.state.relArray.get(this.relPointer);
    this.relPointer++;
    if (this.relPointer > this.state.relArray.size - 1) this.relPointer = 0;
    if (!this.relObj)
      return (this.gameLoopRef = window.requestAnimationFrame(this.gameLoop));
    if (isNaN(this.relObj.slope))
      return (this.gameLoopRef = window.requestAnimationFrame(this.gameLoop));
    let newX = this.refPoint.get("x");
    let newY = this.refPoint.get("y");
    if (this.relObj.slope === Infinity) newY -= this.relObj.dist;
    else if (this.relObj.slope === -Infinity) newY += this.relObj.dist;
    else if (
      (this.relObj.xDir && !this.relObj.yDir) ||
      (!this.relObj.xDir && !this.relObj.yDir)
    ) {
      newY += this.relObj.dist * Math.sin(Math.atan(this.relObj.slope));
      newX += this.relObj.dist * Math.cos(Math.atan(this.relObj.slope));
    } else if (
      (!this.relObj.xDir && this.relObj.yDir) ||
      (this.relObj.xDir && this.relObj.yDir)
    ) {
      newY -= this.relObj.dist * Math.sin(Math.atan(this.relObj.slope));
      newX -= this.relObj.dist * Math.cos(Math.atan(this.relObj.slope));
    }
    var isAlive = newX < width && newX > 0 && newY > 0 && newY < height;
    var collisionDetection = this.detectCollision(this.refPoint).isAlive;
    isAlive = collisionDetection ? isAlive : false;
    this.refPoint = new Immutable.Map({ x: newX, y: newY });
    if (!isAlive) {
      this.setState(
        {
          confettiLeft: newX - touchWidth / 2,
          confettiTop: newY - touchHeight / 2
        },
        () => {
          this.confettiLottie.goToAndStop(0);
          this.confettiLottie.play();
        }
      );
      this.resetLevel();
    }
    this.setState(prevState => ({
      lines: prevState.lines.updateIn(
        [prevState.lines.size - 1],
        line => line && line.push(this.refPoint)
      ),
      isAlive: isAlive
    }));
    this.setState(prevState => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
        if (line) {
          if (line.size > 25) {
            return line.splice(0, 2) || (line.splice(0, line.size) && line);
          } else return line.shift();
        }
      })
    }));
    this.gameLoopRef = window.requestAnimationFrame(this.gameLoop);
  }
  detectCollision(refPoint) {
    let isAlive = true;
    let genericCollision = false;
    this.state.arr.map((item, index) => {
      if (
        refPoint.get("x") > item.style.left &&
        refPoint.get("x") < item.style.left + brickEdge &&
        refPoint.get("y") > item.style.top &&
        refPoint.get("y") < item.style.top + brickEdge
      ) {
        genericCollision = true;
        if (item.type === "pop") {
          item.popped = true;
          this.allCharLotties[index].playSegments(
            characterLottieSegments[1],
            true
          );
        } else {
          isAlive = false;
        }
      }
    });
    genericCollision &&
      this.setState({
        arr: this.state.arr
      });
    return { isAlive, genericCollision };
  }
  render() {
    return (
      <div>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <div id="jaz" className="drawArea" ref="drawArea">
          <span style={{ color: "white" }}>
            {JSON.stringify(this.state.orientation)}
          </span>
          <div
            ref={ref => (this.confettiRef = ref)}
            className="absoluteDiv"
            style={{
              height: touchHeight,
              width: touchWidth,
              top: this.state.confettiTop,
              left: this.state.confettiLeft
            }}
          />
          {this.state.arr.map((item, index) => {
            return (
              <div
                className={item.type === "pop" ? "brick" : "planet"}
                ref={ref => (this.allCharRefs[index] = ref)}
                style={item.style}
                key={index}
              />
            );
          })}
          <svg className="drawing">
            {this.state.lines.map((line, index) => (
              <DrawingLine
                key={index}
                line={line}
                stroke={this.state.lineColor}
                strokeWidth={strokeWidth}
                className="path"
              />
            ))}
          </svg>
          <div
            className="winModal"
            style={{ top: this.state.gameWon ? 0 : "100%" }}
          >
            <span>Level Completed</span>
            <span
              onClick={() => {
                this.setState({
                  gameWon: false
                });
                this.changeLevel();
              }}
              className="nextButton"
            >
              Next Level
            </span>
          </div>
        </div>
      </div>
    );
  }
}
function DrawingLine({ line, stroke, strokeWidth, className }) {
  if (line.size <= 0) return null;
  const pathData =
    "M " +
    line
      .map(p => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");
  return (
    <path
      className={className}
      d={pathData}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
