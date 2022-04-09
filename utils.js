// @ts-check

export const drowBorder = (ctx, container, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath()
    ctx.moveTo(container.left, container.top)
    ctx.lineTo(container.left, container.top + container.height)
    ctx.stroke();

    ctx.beginPath()
    ctx.moveTo(container.left, container.top + container.height - 1)
    ctx.lineTo(container.left + container.width, container.top + container.height - 1)
    ctx.stroke()
}

export const generateCoordinates = (container, pointsCount = 10) => {
    const getRandomY = (min, max) => {
        const randomFloat = Math.random()

        const delta = max - min
        const randomInDelta = delta * randomFloat
        const randomInBounds = randomInDelta + min

        return randomInBounds
    }
    
    const deltaX = container.width / (pointsCount + 1)
    const startX = deltaX + container.left

    const minPointY = container.top + container.pointOffsetY
    const maxPointY = container.top + container.height - container.pointOffsetY 

    const points = Array(pointsCount).fill(1).map((_, index) => [deltaX * index + startX, getRandomY(minPointY, maxPointY)])

    return points
}

export const drawCircles = (ctx, points, color = 'black', radius = 10) => {
    ctx.strokeStyle = color
    ctx.fillStyle = 'white'
    points.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    })
}


export const drowLines = (ctx, points = [[]], color = 'black') => {
    ctx.strokeStyle = color
    
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    points.slice(1).forEach(([x, y]) => {
        ctx.lineTo(x, y)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(x, y)
    })
    
    ctx.closePath()
}

export const getContainer = (height, width) => {
    return {
        height: height * 0.6,
        width: width * 0.6,
        left: width * 0,
        top: height * 0,
        pointOffsetY: height * 0.1
    }
}

export const setCanvasSize = (canvas, height, width) => {
    canvas.width = width;
    canvas.height = height;
}

export const getIntermidiate = (previousPoints, newPoints, k, timing = (k) => k) => (
  newPoints.map((newPoint, index) => {
    const oldPoint = previousPoints[index]

    return oldPoint.map((coordinate, index) => {
      const newCoordinate = newPoint[index]
      return coordinate + (newCoordinate - coordinate) * timing(k)
    })
  })
)
// export const getIntermidiate = (previousPoints, newPoints, mergeResult, k, timing = (k) => k) => {
//     const [newPointsPositions, oldPointsTargets, stretch] = mergeResult

//     const originalPoints = stretch ? newPoints : previousPoints
//     const mainPoints = !stretch ? newPoints : previousPoints
//     const deltaSign = stretch ? -1 : 1
//     console.log(mainPoints)
//     console.log(originalPoints)
//     console.log(newPointsPositions)
//     console.log(oldPointsTargets)

//     const intermidiatePoints = originalPoints
//         .map(([originalX, originalY], index) => {
//             if (newPointsPositions[index] === -1) return [originalX, originalY]
//             const [x, y] = mainPoints[newPointsPositions[index]]
//             const deltaY = deltaSign * (y - originalY)
//             const deltaX = deltaSign * (x - originalX)

//             return [originalX + deltaX * timing(k), originalY + deltaY * timing(k)]
//         })
//         .map(([originalX, originalY], index, array) => {
//             if (oldPointsTargets[index] === -1) return [originalX, originalY]
//             const [x, y] = array[newPointsPositions[oldPointsTargets[index]]]
//             const deltaY = deltaSign * (y - originalY)
//             const deltaX = deltaSign * (x - originalX)
        
//             const position = stretch ? 1 - timing(k) : timing(k)
//             // const position = timing(k)
            
//             return [originalX + deltaX * position, originalY + deltaY * position]
//         })
//     return intermidiatePoints
// }

export const getRandom = (min, max, step = 1) => {
    const delta = max - min

    const randomNumber = Math.floor(Math.random() * (delta)) * step + min

    return randomNumber
}

const getUniqueRandoms = (count, max) => {
    const tmp = new Set()
    while (tmp.size !== count) {
        tmp.add(getRandom(0, max - 1))
    }

    return [...tmp].sort()
}

/**
 * 
 * @param {[number, number][][]} arrs 
 */
const sortOnLength = (arrs) => [...arrs].sort((a, b) => a.length - b.length)

/**
 * 
 * @param {([number, number])[]} oldPoints 
 * @param {([number, number])[]} newPoints 
 */
export const mergePoints = (oldPoints, newPoints) => {
  const [lessPoints, morePoints] = sortOnLength([oldPoints, newPoints])
  const xDeltas = lessPoints.map(([x]) => morePoints.map(([xM]) => Math.abs(xM - x)))
  const xTargets = xDeltas.map(arr => arr.indexOf(Math.min(...arr)))

  const tmp = Array(morePoints.length).fill()
  // xTargets.forEach((targetIndex, index) => {
  //   tmp[targetIndex] = lessPoints[index]
  // })

  let i = 0
  const result = tmp.map((_, index) => {
    if (index < xTargets[i])
      return lessPoints[i]
    else if (index === xTargets[i]) {
      return lessPoints[i++]  
    }
    else {
      return lessPoints.slice(-1)[0]
    }
  })

  // console.log(morePoints, result)
  // console.dir(result)
  return {
    oldPoints: oldPoints.length <= newPoints.length ? result : morePoints,
    newPoints: oldPoints.length <= newPoints.length ? morePoints : result
  }

  // tmp.map((value, index) => {
  //   if (xTargets[i] > index) {
      
  //   } else {
  //     return value
  //   }
  // })
  // const result = tmp.map((item, index) => {
  //   if (item && typeof item[0] === 'number') {
  //     return item
  //   }

    
  //   const [xM] = morePoints[index]

  // })

    
}

// export const mergePoints = (oldPoints, newPoints) => {
//     // if (previousPoints.length >= newPoints.length) {
//     const [maximal, minimal] = oldPoints.length >= newPoints.length 
//         ? [oldPoints.length, newPoints.length] 
//         : [newPoints.length, oldPoints.length]
    
//     const targetIndexes = Array(maximal).fill(-1)
//     // let selected = 0
//     const newPointsPositions = getUniqueRandoms(minimal, maximal)
    
//     let lastIndex = 0
//     newPointsPositions.forEach((value, index) => {
//         targetIndexes[value] = lastIndex++
//     })
//     const firstNew = targetIndexes.findIndex((element) => element !== -1)
//     const lastNew = targetIndexes.length - 1 - targetIndexes.reverse().findIndex((element) => element !== -1)
//     console.log(firstNew, lastNew)
//     targetIndexes.reverse()

//     const oldPointsTargets = new Array(maximal).fill(-1).map((value, index) => {
//         if (targetIndexes[index] !== -1)
//         {
//             return value
//         }

//         if (index < firstNew) {
//             return firstNew
//         }
//         if (index > lastNew) {
//             return lastNew
//         }

//         const leftOrRight = getRandom(-1, 1, 2) 
//         // console.log(leftOrRight)

//         let delta = leftOrRight
//         while (targetIndexes[delta + index] === -1){
//             delta += leftOrRight
//         }

//         return index + delta
//     })

//     return [targetIndexes, oldPointsTargets, maximal === newPoints.length ? true : false]

//         // const targetIndexes = Array(oldPoints.length).fill(-1)
//         // // let selected = 0
//         // const newPointsPositions = getUniqueRandoms(newPoints.length, oldPoints.length)
//         // newPointsPositions.forEach((value, index) => {
//         //     targetIndexes[value] = value
//         // })
        
//         // const oldPointsTargets = new Array(targetIndexes.length).fill(-1).map((value, index) => {
//         //     if (newPointsPositions[index] !== -1)
//         //     {
//         //         return value
//         //     }

//         //     const leftOrRight = Math.floor(Math.random() * 2) - 1

//         //     if (newPointsPositions[index + leftOrRight] !== undefined) {
//         //         return index + leftOrRight
//         //     }

//         //     if (newPointsPositions[index + leftOrRight] === undefined) {
//         //         return index - leftOrRight
//         //     }
//         // })

//         // return [newPointsPositions, oldPointsTargets]
//     // }

//     // else {
//     // }
// }