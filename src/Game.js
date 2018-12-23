import React from 'react';
import './App.css';
import Immutable from "immutable";
import Particles from 'react-particles-js';
import levels from "./levels";
var gameStep = 10;
let lineMax = 150;
let lineLength = 0;
let levelNo = 6;
let allLevels = levels(window.innerHeight,window.innerWidth)
var targetPoint = allLevels[levelNo].target;
var start = allLevels[levelNo].start;
var targetTop= allLevels[levelNo].targetTop,
                targetHeight= allLevels[levelNo].targetHeight,
                targetWidth= allLevels[levelNo].targetWidth,
                startTop= allLevels[levelNo].startTop,
                startHeight= allLevels[levelNo].startHeight,
                startWidth= allLevels[levelNo].startWidth;

                function generate(max, thecount) {
                  var r = [];
                  var currsum = 0;
                  for(var i=0; i<thecount-1; i++) {
                     r[i] = randombetween(1, max-(thecount-i-1)-currsum);
                     currsum += r[i];
                  }
                  r[thecount-1] = max - currsum;
                  return r;
                }
                function randombetween(min, max) {
                  return Math.floor(Math.random()*(max-min+1)+min);
                }
                console.log(generate(-20, 10))
function createObstacles(n) {
  let obz = [];
  let points = [];
  while(n > 0) {
    n--;
    let randomW = getRandomInt(40, window.innerWidth - 40);
    let randomH = getRandomInt(20, window.innerHeight/ 2);
    points = [[randomW,randomH], [randomW + 25 ,randomH], [randomW + 25 ,randomH + 25], [randomW,randomH + 25]]
    obz.push({
      points: points
    })
  }
  return obz;
}
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function get_polygon_centroid(pts) {
    var first = pts[0], last = pts[pts.length-1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    var twicearea=0,
    x=0, y=0,
    nPts = pts.length,
    p1, p2, f;
    for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
       p1 = pts[i]; p2 = pts[j];
       f = p1.x*p2.y - p2.x*p1.y;
       twicearea += f;          
       x += ( p1.x + p2.x ) * f;
       y += ( p1.y + p2.y ) * f;
    }
    f = twicearea * 3;
    return { x:x/f, y:y/f };
  }
  
function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }
// var obstacles = allLevels[levelNo].obstacles;
var obstacles = createObstacles(0)

// initially holds initial points of all obstacles
var animArray = [];

export default class Game extends React.Component {
    constructor() {
      super();
      this.state = {
        lines: new Immutable.List(),
        relArray : new Immutable.List(),
        isDrawing: false,
        isAnimating: false,
        propogationLogic: 'top',
        obstacles: obstacles,
        lineColor: "#23A6D5"
      };
      this.counters = [0,0,0,0,0];
      this.movePoint = undefined;
    }
    componentDidMount() {
    // this.startGameLoop();
    this.makeAnimArray(allLevels[levelNo].obstacles)
      document.querySelector(".drawArea").style.height = window.innerHeight + "px";
      document.querySelector(".drawArea").style.width = window.innerWidth + "px";
      this.refs.drawArea.addEventListener('touchmove', (event) => this.handleMouseMove(event), false)
      this.refs.drawArea.addEventListener('touchend', (event) => this.handleMouseUp(event), false)
      this.refs.drawArea.addEventListener('touchstart', (event) => this.handleMouseDown(event), false)
    }
    // componentWillUnmount() {
    //     this.endGameLoop();
    // }
    makeAnimArray(obstacles){
      animArray = [];
      obstacles.map((item,index) => {
        animArray[index] ? undefined : (animArray[index] = []);
        animArray[index].push(item.points)
    })
    obstacles.map((item,index) => {
        for(var i=0; i < obstacles[index].resetDuration; i+=gameStep){
            var flag = 0
            item.durations.map((item2,index2) => {
                if(i > item2[0] && i < item2[1] ) flag = index2;
            })
            var stepX = ((obstacles[index].animation[flag].moveX / (obstacles[index].durations[flag][1] - obstacles[index].durations[flag][0])) * gameStep);
            var stepY = ((obstacles[index].animation[flag].moveY / (obstacles[index].durations[flag][1] - obstacles[index].durations[flag][0])) * gameStep);
            var rot = ((obstacles[index].animation[flag].rot / (obstacles[index].durations[flag][1] - obstacles[index].durations[flag][0])) * gameStep);
            var length = animArray[index].length;
            // animArray[le].push([[animArray[length-1][0] + stepX, animArray[length-1][1] + stepy]])
            animArray[index][length] = [];
            var pts = []
            animArray[index][length -1].map(item => {
              pts.push({ x: item[0], y: item[1] })
            })
            var centroid = get_polygon_centroid(pts);
            animArray[index][length -1].map((item3,index3) => {
                animArray[index][length -1][index3] = rotate(centroid.x,centroid.y,item3[0], item3[1], rot)
             })
            animArray[index][length -1].map((item3,index3) => {
               animArray[index][length].push([item3[0] + stepX, item3[1] + stepY])
            })
        }
    })
    }
    switchLevel(){
        levelNo++;
        allLevels = levels(window.innerHeight,window.innerWidth)
        this.counters = [0,0,0,0,0];
        if(!allLevels[levelNo]) levelNo = 0;
        this.endGameLoop();
        start= allLevels[levelNo].start;
        targetPoint= allLevels[levelNo].target;
        obstacles= allLevels[levelNo].obstacles;
        targetTop= allLevels[levelNo].targetTop,
        targetHeight= allLevels[levelNo].targetHeight,
        targetWidth= allLevels[levelNo].targetWidth,
        startTop= allLevels[levelNo].startTop,
        startHeight= allLevels[levelNo].startHeight,
        startWidth= allLevels[levelNo].startWidth;
        this.makeAnimArray(allLevels[levelNo].obstacles)
        this.setState({
            obstacles: allLevels[levelNo].obstacles
        },() => this.startGameLoop())
    }
    inside(point, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
        var x = point[0], y = point[1];
    
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
    
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    
        return inside;
    }
    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
          x: mouseEvent.touches[0].clientX - boundingRect.left,
          y: mouseEvent.touches[0].clientY - boundingRect.top,
        });
      }
    handleMouseDown = (mouseEvent) => {
        var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
        // if (!this.inside(touchPoint,start)) return;
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        point.set('y', 0)
        clearInterval(this.timer)
        this.setState({
          lines: new Immutable.List()
        }, () => {
          this.setState(prevState => ({
            lines: prevState.lines.push(new Immutable.List([point])),
            isDrawing: true,
            isAnimating: false,
            relArray: new Immutable.List(),
            lineColor: "#23A6D5"
          }));
        })
      }
      handleMouseMove = (mouseEvent) => {
        if(lineLength > lineMax) return this.handleMouseUp()
          let collision = false;
        if (!this.state.isDrawing || this.state.isAnimating || collision) {
          return;
        }
        var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
        this.movePoint = touchPoint;
        obstacles.map((item) => {
          if(collision) return;
          if(this.inside(touchPoint, item.points)) {
            this.emptyOut()
            collision = true;
          }
        })
        const point = this.relativeCoordinatesForEvent(mouseEvent);
        if(this.state.lines) {
          const listNumber = this.state.lines.size - 1;
          const pointNumber = this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size - 1 || 0;
          const prevPoint = this.state.lines.getIn([listNumber, pointNumber]);
          if(prevPoint){
        const slope = (prevPoint.get('y') - point.get('y')) / (prevPoint.get('x') - point.get('x'));
        const dist = Math.sqrt(Math.pow((prevPoint.get('y') - point.get('y')), 2) + Math.pow((prevPoint.get('x') - point.get('x')), 2));
        const xDir = point.get('y') < prevPoint.get('y');
        const yDir = point.get('x') < prevPoint.get('x');
        let relSeg = [];
        if(dist > 3) {
          let flag = 0;
          let factor = 3;
          while(flag < dist) {
            flag = flag + factor;
            relSeg.push({ slope : slope, dist : factor, xDir: xDir, yDir: yDir })
          }
        } else {
          relSeg.push({ slope : slope, dist : dist, xDir: xDir, yDir: yDir })
        }
        let newSeg = new Immutable.List(relSeg)
        lineLength= lineLength + dist;
        this.setState(prevState =>  ({
          lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
          relArray: prevState.relArray.concat(newSeg)
        }));
      }
      }
      else this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
      }));
      }
      emptyOut(){
          // this.setState({
          //     lineColor: '#FFB88C'
          // })
        let timer2 = setInterval(() => {
          if((this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size === 0) || !this.state.lines.get(this.state.lines.size - 1)) {
            this.setState({ 
            isAnimating: false,
            propogationLogic: 'top',
          lines: new Immutable.List() }) 
            clearInterval(timer2);
            clearInterval(this.timer);
          }
          else {
            this.setState(prevState =>  ({
              lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                if(line) {
               if(line.size > 25) {
                return line.splice(0,3) || line.splice(0,line.size - 1) && line
                }
                else return line.shift()
              }
              })
            }))
          }
      }, 20)
        this.setState({
          relArray: new Immutable.List(),
          isAnimating: true
        })
      }
      clean() {
        let timer2 = setInterval(() => {
          if((this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size === 0) || !this.state.lines.get(this.state.lines.size - 1)) {
            
            clearInterval(timer2);
          }
          else {
            this.setState(prevState =>  ({
              lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                if(line) {
               if(line.size > 25) {
                return line.splice(0,3) || line.splice(0,line.size - 1) && line
                }
                else return line.shift()
              }
              })
            }))
          }
      }, 20)
      }
  
    handleMouseUp() {
      lineLength = 0;
      console.log(this.state.relArray.toJS())
      this.setState({ isDrawing: false });
      const listNumber = this.state.lines.size - 1;
      const pointNumber = this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size - 1;
      const lastPoint = this.state.lines.getIn([listNumber, pointNumber]);
      if(pointNumber > 8)
      lastPoint && !this.state.isAnimating && pointNumber && this.animateLine(lastPoint, this.state.relArray)
      else this.emptyOut();
    }
    animateLine (lastPoint, ptArray) {
      this.setState({
        isAnimating: true
      })
      let i = 0;
      let refPoint = lastPoint;
      this.timer = setInterval(() => {
        let collPt = [refPoint.get('x'),refPoint.get('y')];
        let collision = false;
        this.state.obstacles.map((item, index) => {
          if(collision) return;
          if(this.inside(collPt, item.points)) {
            clearInterval(this.timer);
            this.emptyOut();
            collision = true;
          }
        })
        // if(this.inside(collPt, targetPoint)) {
        //     this.state.lineColor !== 'white' && this.switchLevel();
        //     this.setState({
        //         lineColor: 'white'
        //     })
        //     document.querySelector('.tarDiv').classList.add("activeTar");
        //   }
        if(i >= ptArray.size - 1) {
          clearInterval(this.timer);
          if(refPoint.get('y') < window.innerHeight && refPoint.get('y') > 0) this.animateLine(refPoint, this.state.relArray)
          else {
          this.emptyOut();
        }
        } else if(!collision) {
          let item = ptArray.get(i);
          i++;
          if(!item) return;
          if(isNaN(item.slope)) return 0;
          let newX = refPoint.get('x');
          let newY = refPoint.get('y');
          if(item.slope === Infinity) newY -= item.dist;
          else if(item.slope === -Infinity) newY += item.dist;
          else if((item.xDir && !item.yDir) || (!item.xDir && !item.yDir)){
                newY += (item.dist * Math.sin(Math.atan(item.slope)));
                newX += (item.dist * Math.cos(Math.atan(item.slope)));
          }
          else if((!item.xDir && item.yDir) || (item.xDir && item.yDir)) {
              newY -= (item.dist * Math.sin(Math.atan(item.slope)));
                newX -= (item.dist * Math.cos(Math.atan(item.slope)));
          }
          refPoint = new Immutable.Map({ x: newX, y: newY })
          if(refPoint.get('x') > window.innerWidth - 10) this.setState({ propogationLogic: 'right' })
          if(refPoint.get('x') < 10) this.setState({ propogationLogic: 'left' })
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line && line.push(refPoint))
          }));
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
              if(line) {
              if(line.size > 25) {
               return line.splice(0,2) || line.splice(0,line.size) && line
               }
               else return line.shift()
              }
              })
          }));
          return 0;
        }
      }, 20)
    }
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if(animArray !== []){
            obstacles.map((item,index) => {
                if(this.counters[index] > item.resetDuration) this.counters[index] = 0;
                var pointIndex = this.counters[index] / gameStep;
                pointIndex >= animArray[index].length ? pointIndex = 0 : undefined;
                obstacles[index].points = animArray[index][pointIndex]
                this.counters[index] += gameStep;
            })
            this.setState({
              obstacles: obstacles
          })
          // this.forceUpdate()
        }
        },gameStep)
    }
    endGameLoop() {
        clearInterval(this.gameLoop)
        this.gameLoop = undefined;
    }
    render() {
        return (
            <div>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              <div
                id="jaz"
                className="drawArea"
                ref="drawArea"
              >
              <svg className="drawing">
              <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#DE6262" stopOpacity="1" />
      {/* <stop offset="10%" stopColor="rgba(243, 250, 223, 1)" stopOpacity="1" />
      <stop offset="20%" stopColor="rgba(238, 250, 200, 1)" stopOpacity="1" />
      <stop offset="30%" stopColor="rgba(226, 250, 147, 1)" stopOpacity="1" />
      <stop offset="40%" stopColor="rgba(222, 252, 131, 1)" stopOpacity="1" />
      <stop offset="50%" stopColor="rgba(221, 255, 120, 1)" stopOpacity="1" />
      <stop offset="60%" stopColor="rgba(207, 247, 86, 1)" stopOpacity="1" />
      <stop offset="70%" stopColor="rgba(197, 235, 70, 1)" stopOpacity="1" />
      <stop offset="80%" stopColor=" rgba(182, 230, 23, 1)" stopOpacity="1" /> */}
      <stop offset="100%" stopColor=" #FFB88C" stopOpacity="1" />
    </linearGradient>
              </defs>
    {this.state.lines.map((line, index) => (
          <DrawingLine key={index} line={line} stroke= {this.state.lineColor} strokeWidth={12} className="path" />
        ))}
                    {this.state.obstacles.map((item,index) => <polygon key={index} className="obstacle" fill= "url(#grad1)" points= {item.points.toString()} />)}
                    <polygon className="startPt" stroke= "url(#grad2)" points= {start.toString()} />
             </svg>
                    <div className="startDiv" style={{ height: startHeight, width: startWidth, top: startTop }} />
                    {this.state.isDrawing && <p className='lineLength'>{Math.round((lineLength / lineMax) * 100) + "%"}</p>}
              </div>
            </div>
          );
    }
}
function DrawingLine({ line, stroke, strokeWidth, className }) {
    if(line.size <= 0) return null;
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
    return <path className={className} d={pathData} stroke= {stroke} strokeWidth={strokeWidth} />;
  }