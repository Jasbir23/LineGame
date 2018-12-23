import React from 'react';
import './App.css';
import Immutable from "immutable";
import all from "./brickLevels";
var height = window.innerHeight,
    width= window.innerWidth;
    var startHeight = 40,
    startWidth = 40,
    startTop= height - 80,
    lineMax = height / 3,
    lineLength= 0,
    levelNo=0;
    var allLevels = [];

export default class Bricks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lines: new Immutable.List(),
            relArray : new Immutable.List(),
            isDrawing: false,
            lineColor: "pink",
            isAlive: false,
            start: [[width/2 - 20, height - 40],[width/2 + 20, height- 40], [width/2 + 20, height-80], [width/2 - 20,height-80]],
            arr: [],
            relPointer: 0
        }
    }
    componentDidMount() {
          document.querySelector(".drawArea").style.height = height + "px";
          document.querySelector(".drawArea").style.width = width + "px";
          this.resetLevel();
          this.refs.drawArea.addEventListener('touchmove', (event) => this.handleMouseMove(event), false)
          this.refs.drawArea.addEventListener('touchend', (event) => this.handleMouseUp(event), false)
          this.refs.drawArea.addEventListener('touchstart', (event) => this.handleMouseDown(event), false)
        }
        changeLevel(){
            levelNo >= allLevels.length - 1 ? levelNo = 0 : levelNo++;
            this.resetLevel()
        }
        resetLevel(){
        allLevels = all(height, width);
            this.setState({
                arr: allLevels[levelNo].balls
            });
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
            if (!this.inside(touchPoint,this.state.start)) return;
            clearInterval(this.interval)
            const point = this.relativeCoordinatesForEvent(mouseEvent);
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
            if (!this.state.isDrawing) {
              return;
            }
            if(lineLength > lineMax) this.handleMouseUp()
            var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
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
          handleMouseUp() {
              if(!this.state.isDrawing) return;
            lineLength = 0;
            var size = this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size;
            if(size > 8)
                this.setState({ isDrawing: false, isAlive: true } , () => this.startTimer());
            else
            this.setState({
                lines: new Immutable.List(),
                relArray : new Immutable.List(),
                isDrawing: false,
                lineColor: "#23A6D5",
                isAlive: false
              })
          }
          startTimer() {
              var relPointer = 0
            var refPoint = this.state.lines.get(this.state.lines.size - 1).get(this.state.lines.get(this.state.lines.size - 1).size - 1),
            relObj = this.state.relArray.get(relPointer)
              this.interval = setInterval(() => {
                  if(!this.state.isAlive) {
                      clearInterval(this.interval)
                      this.setState({
                        lines: new Immutable.List(),
                        relArray : new Immutable.List(),
                        isDrawing: false,
                        lineColor: "#23A6D5",
                        isAlive: false
                      })
                    }
                relObj = this.state.relArray.get(relPointer)
                relPointer ++;
                if(relPointer > this.state.relArray.size) relPointer = 0
                if(!relObj) return;
                if(isNaN(relObj.slope)) return 0;
                let newX = refPoint.get('x');
                    let newY = refPoint.get('y');
                    if(relObj.slope === Infinity) newY -= relObj.dist;
                    else if(relObj.slope === -Infinity) newY += relObj.dist;
                    else if((relObj.xDir && !relObj.yDir) || (!relObj.xDir && !relObj.yDir)){
                            newY += (relObj.dist * Math.sin(Math.atan(relObj.slope)));
                            newX += (relObj.dist * Math.cos(Math.atan(relObj.slope)));
                    }
                    else if((!relObj.xDir && relObj.yDir) || (relObj.xDir && relObj.yDir)) {
                        newY -= (relObj.dist * Math.sin(Math.atan(relObj.slope)));
                            newX -= (relObj.dist * Math.cos(Math.atan(relObj.slope)));
                    }
                    var isAlive = newX < width && newX > 0 && newY > 0 && newY < height;
                    isAlive = this.detectCollision(refPoint) ? isAlive : false;
                    refPoint = new Immutable.Map({ x: newX, y: newY })
                    !isAlive && this.resetLevel()
                    this.setState(prevState =>  ({
                        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line && line.push(refPoint)),
                        isAlive: isAlive
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
              },15)
          }
          detectCollision(refPoint) {
              let isAlive = true;
              let change = false;
            this.state.arr.map((item, index) => {
                if(refPoint.get('x') > item.style.left &&
                refPoint.get('x') < item.style.left + 40 &&
                refPoint.get('y') > item.style.top &&
                refPoint.get('y') < item.style.top + 40) {
                    change = true;
                    item.type === 'pop' ? item.popped = true : isAlive = false
                }
            })
            change &&
            this.setState({
                arr: this.state.arr
            })
            return isAlive
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
                {
                    this.state.arr.map((item,index) => {
                            if(item.popped) {
                                return null}
                            return <div className = "brick"
                            style= {item.style} key= {index} />
                        })
                }
                <svg className="drawing">
                {this.state.lines.map((line, index) => (
                    <DrawingLine key={index} line={line} stroke= {this.state.lineColor} strokeWidth={8} className="path" />
                    ))}
                </svg>
                <div className="startDiv" style={{ height: startHeight, width: startWidth, top: startTop, borderRadius: 20 }} />
                <span 
                style = {{
                    position: 'absolute',
                    top: 20,
                    left: width - 40,
                    height: 40,
                    width: 40
                }}
                onClick={e => this.changeLevel()}
                >>></span>
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