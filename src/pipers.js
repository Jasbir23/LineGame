import React from 'react';
import './App.css';
import Immutable from "immutable";
var height = window.innerHeight,
    width= window.innerWidth;
    var startHeight = 60,
    startWidth = width,
    startTop= height - 60,
    lineMax = height / 2;

export default class Pipers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lines: new Immutable.List(),
            relArray : new Immutable.List(),
            isDrawing: false,
            lineColor: "#23A6D5",
            start: [[0, height],[width, height], [width, height-60], [0,height-60]],
            opponents: new Immutable.List(),
            drawingLine: new Immutable.List(),
            explosives: []
          };
    }
    componentDidMount() {
        this.startGameLoop();
          document.querySelector(".drawArea").style.height = height + "px";
          document.querySelector(".drawArea").style.width = width + "px";
          this.refs.drawArea.addEventListener('touchmove', (event) => this.handleMouseMove(event), false)
          this.refs.drawArea.addEventListener('touchend', (event) => this.handleMouseUp(event), false)
          this.refs.drawArea.addEventListener('touchstart', (event) => this.handleMouseDown(event), false)
        }
        startGameLoop(){
            var gameStep = 0;
            setInterval(() => {
                this.state.explosives.length > 20 ? this.state.explosives = [] : null;
                !this.state.isDrawing && this.setState({
                    lines: this.animateLines(this.state.lines),
                    opponents: this.animateLines(this.state.opponents)
                })
            }, 20)
        }
        checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
                // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
                var denominator, a, b, numerator1, numerator2, result = {
                    x: null,
                    y: null,
                    onLine1: false,
                    onLine2: false
                };
                denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
                if (denominator == 0) {
                    return result;
                }
                a = line1StartY - line2StartY;
                b = line1StartX - line2StartX;
                numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
                numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
                a = numerator1 / denominator;
                b = numerator2 / denominator;
            
                // if we cast these lines infinitely in both directions, they intersect here:
                result.x = line1StartX + (a * (line1EndX - line1StartX));
                result.y = line1StartY + (a * (line1EndY - line1StartY));
            /*
                    // it is worth noting that this should be the same as:
                    x = line2StartX + (b * (line2EndX - line2StartX));
                    y = line2StartX + (b * (line2EndY - line2StartY));
                    */
                // if line1 is a segment and line2 is infinite, they intersect if:
                if (a > 0 && a < 1) {
                    result.onLine1 = true;
                }
                // if line2 is a segment and line1 is infinite, they intersect if:
                if (b > 0 && b < 1) {
                    result.onLine2 = true;
                }
                // if line1 and line2 are segments, they intersect if both of the above are true
                return result;
            }
        animateLines(newLines) {
            newLines.map((line, index) => {
                if(!line.isAlive) {
                    newLines = newLines.delete(index)
                    this.state.explosives.push({
                        point: line.line.get(line.line.size - 1)
                    })
                }
            })
            newLines.map((line, index) => {
                if (line.isDrawing) return
                var newLine = {
                    ...line
                };
                var mainLine = line.line;
                var refPoint = mainLine.get(mainLine.size - 1)
                var relObj = line.relArray.get(line.relArrayPointer)
                let newX = refPoint.get('x');
                let newY = refPoint.get('y');
                if (newLine.isAlive) {
                    if(!relObj) return;
                    if(isNaN(relObj.slope)) return;
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
                    var point = new Immutable.Map({ x: newX, y: newY })
                    newLine = {
                                    line:newLine.line.push(point),
                                    length:newLine.length,
                                    relArray:newLine.relArray,
                                    relArrayPointer:newLine.relArrayPointer >=newLine.relArray.size - 1 ? 0 :newLine.relArrayPointer + 1,
                                    isAlive:newLine.isAlive,
                                    isDrawing:newLine.isDrawing
                                }
                                newLine.line = newLine.line.size > 25 ? newLine.line.splice(0,2) :newLine.line.shift()
                }

                // if(line.type === 'opponent') {
                //     this.state.lines.map((item,index) => {
                //         line.line.map((item2, index2) => {
                //             if(index2 === 0) return;
                //         if(this.checkLineIntersection(
                //                 item.line.get(item.line.size - 1).get('x'), 
                //                 item.line.get(item.line.size - 1).get('y'),
                //                 item.line.get(item.line.size - 2).get('x'),
                //                 item.line.get(item.line.size - 2).get('y'),
                //                 item2.get('x'),
                //                 item2.get('y'),
                //                 line.line.get(index2 - 1).get('x'),
                //                 line.line.get(index2 - 1).get('y')
                //          )
                //         ) {
                //             newLine.isAlive = false
                //             console.log('collision')
                //         }
                //         })
                //     })
                // }
                if(newX > width - 5 || newX < 0 || newY > height || newY < 0)
                {
                    newLine.isAlive = false;
            }
                newLines = newLines.updateIn([index], line => {
                        return newLine
                    })
            })
            return newLines
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
            // if(this.state.lines.size !== 0) return
            var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
            if (!this.inside(touchPoint,this.state.start)) return;
            const point = this.relativeCoordinatesForEvent(mouseEvent);
              this.setState(prevState => ({
                lines: prevState.lines.push({
                    length: 0,
                    line: new Immutable.List([point]),
                    relArray: new Immutable.List(),
                    relArrayPointer: 0,
                    isAlive: true,
                    isDrawing: true
                }),
                isDrawing: true,
                lineColor: "#23A6D5"
              }));
          }
          handleMouseMove = (mouseEvent) => {
            if (!this.state.isDrawing) {
                return;
              }
            const point = this.relativeCoordinatesForEvent(mouseEvent);
              const listNumber = this.state.lines.size - 1;
              const lineObj = this.state.lines.get(listNumber);
              const prevPoint = lineObj && lineObj.line.get(lineObj.line.size - 1)
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

                  if(this.state.lines.get(this.state.lines.size - 1).length + dist > lineMax) return this.handleMouseUp()
            this.setState(prevState =>  ({
              lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                  return {
                      line: line.line.push(point),
                      length: line.length + dist,
                      relArray: line.relArray.concat(newSeg),
                      relArrayPointer: 0,
                      isAlive: true,
                      isDrawing: true
                  }
                }),
            }));
          } else this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                return {
                    line: line.line.push(point),
                    length: 0,
                    relArray: line.relArray,
                    relArrayPointer: 0,
                    isAlive: true,
                    isDrawing: true
                }
              })
          }));
          }
          handleMouseUp() {
            const listNumber = this.state.lines.size - 1;
            const lineObj = this.state.lines.get(listNumber);
            this.state.isDrawing &&
            this.setState(prevState =>  ({
                isDrawing: false,
                lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                    return {
                        line: line.line,
                        length: line.length,
                        relArray: line.relArray,
                        relArrayPointer: 0,
                        isAlive: lineObj && lineObj.line.size > 8 ? true : false,
                        isDrawing: false,
                    }
                  }),
              }));
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
        {this.state.lines.map((line, index) => (
              <DrawingLine id={index} key={index} line={line.line} stroke= {line.isDrawing ? 'grey': this.state.lineColor} className="path" />
            ))}
            {this.state.opponents.map((line, index) => {
                return <DrawingLine key = {index} id={index} line={line.line} stroke= {'orange'} className="path" />
              {/* </div> */}
            })}
                 </svg>
                {
                     this.state.explosives.map((item, index) => {
                        return <div key={index} className="expParticle" style = {{ top : item.point.get('y'), left: item.point.get('x'), position: "absolute" }} />
                     })
                 }
                    <div className="startDiv" style={{ height: startHeight, width: startWidth, top: startTop }} />
                  </div>
                </div>
              );
        }
}
function DrawingLine({ line, className, stroke, id }) {
    if(line.size <= 0) return null;
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
    return <path id = {id} className={className} d={pathData} stroke= {stroke} strokeWidth={8} />;
  }