// @ts-check

import { drawCircles, drowBorder, drowLines, generateCoordinates, getContainer } from "./utils.js";
import { setCanvasSize, getIntermidiate } from './utils.js';


const canvas = document.getElementsByTagName("canvas")[0]

const CONSTANTS = {
    CIRCLE_RADIUS: 10,
    TRANSITION_DURATION: 250,
    TRANSITION_FPS: 120
}

let transitonFinished = true
let transitionID = 0

const transition = (previousPoints) => (canvas) => {
    const container = getContainer(window.innerHeight, window.innerWidth)
    const newPoints = generateCoordinates(container, CONSTANTS.CIRCLE_RADIUS)
        .map(([x, y]) => [x + CONSTANTS.CIRCLE_RADIUS, y])

    const count = CONSTANTS.TRANSITION_DURATION / 1000 * CONSTANTS.TRANSITION_FPS



    const animate = (count, previousPoints, newPoints) => {
        let i = 1

        const easeInOut = (k) => .5*(Math.sin((k - .5)*Math.PI) + 1)
        
        return () => {
            if (i >= count) {
                draw(canvas, newPoints)
                transitonFinished = true
                return
            }

            const intemediatePoints = getIntermidiate(previousPoints, newPoints, i / count, easeInOut)
            draw(canvas, intemediatePoints)
            i++
        }
    }

    transitonFinished = false
    transitionID = setInterval(animate(count, previousPoints, newPoints), 1000 / CONSTANTS.TRANSITION_FPS)

    return transition(newPoints);
}

const draw = (canvas, prePoints = undefined) => {
    const container = getContainer(window.innerHeight, window.innerWidth)
    
    const ctx = canvas.getContext('2d')
    setCanvasSize(canvas, container.height, container.width)
    
    drowBorder(ctx, container, 'black')
    const points = prePoints ?? generateCoordinates(container, CONSTANTS.CIRCLE_RADIUS)
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


