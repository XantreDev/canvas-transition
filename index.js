// @ts-check

import { easeInOutBack } from "./easings.js";
import { drawCircles, drowBorder, drowLines, generateCoordinates, getContainer, mergePoints } from "./utils.js";
import { setCanvasSize, getIntermidiate, getRandom } from './utils.js';


const canvas = document.getElementsByTagName("canvas")[0]

const CONSTANTS = {
    CIRCLE_RADIUS: 10,
    TRANSITION_DURATION: 600,
    TRANSITION_FPS: 90
}

let transitonFinished = true
let transitionID = 0

const transition = (previousPoints) => (canvas) => {
    const container = getContainer(window.innerHeight, window.innerWidth)
    const pointCount = (() => {
      let tmp = getRandom(2, 10) 
      while(tmp === previousPoints.length) {
        tmp = getRandom(2, 10)
      }
      return tmp
    })()

    const newPoints = generateCoordinates(container, pointCount)
        .map(([x, y]) => [x + CONSTANTS.CIRCLE_RADIUS, y])

    const frameCount = CONSTANTS.TRANSITION_DURATION / 1000 * CONSTANTS.TRANSITION_FPS


    // @ts-ignore
    const { newPoints: exacNewPoints, oldPoints } =  mergePoints(previousPoints, newPoints)
    // const collapsedNew = exacNewPoints.filter((value, index, arr) => (
    //   index === 0 || value[0] !== arr[index-1][0] || value[1] !== arr[index-1][0] 
    // ))
    console.log(newPoints, exacNewPoints)


    // const animatedPoints = []
    // for (let item of previousPoints) {

    // }
    
    const animate = (count, oldPoints, exacNewPoints) => {
        let i = 1

        return () => {
            if (i >= count) {
                // draw(canvas, newPoints)
                transitonFinished = true
                return
            }

            const intemediatePoints = getIntermidiate(oldPoints, exacNewPoints, i / count, easeInOutBack)
            draw(canvas, intemediatePoints)
            i++
        }
    }

    transitonFinished = false
    transitionID = setInterval(animate(frameCount, oldPoints, exacNewPoints), 1000 / CONSTANTS.TRANSITION_FPS)

    return transition(newPoints);
}

const draw = (canvas, prePoints = undefined) => {
    const container = getContainer(window.innerHeight, window.innerWidth)
    
    const ctx = canvas.getContext('2d')
    setCanvasSize(canvas, container.height, container.width)
    
    drowBorder(ctx, container, 'black')
    const points = prePoints ?? generateCoordinates(container, 10)
    const accuratePoints = points.map(([x, y]) => [x + CONSTANTS.CIRCLE_RADIUS, y])
    
    drowLines(ctx, accuratePoints, 'black')
    drawCircles(ctx, accuratePoints, 'green', CONSTANTS.CIRCLE_RADIUS)
    
    return transition(accuratePoints);
}

let translateLast = draw(canvas)
canvas.addEventListener('click', _ => {
    if (transitonFinished === true && transitionID === 0){
        translateLast = translateLast(canvas)
    }
})
setInterval(_ => {
    if (transitonFinished === true && transitionID !== 0){
        clearInterval(transitionID)
        transitionID = 0
    } 
}, 200)

const lastTimeout = [0, 0]
window.addEventListener('resize', _ => {
    if (lastTimeout[0] !== 0) {
        clearTimeout(lastTimeout[0])
        clearTimeout(lastTimeout[1])
        lastTimeout[0] = 0
        lastTimeout[1] = 0
    }
    lastTimeout[0] = setTimeout(_ => translateLast = draw(canvas), 100)
    lastTimeout[1] = setTimeout(() => {
        lastTimeout[0] = 0
        lastTimeout[1] = 0
    }, 200)
})


