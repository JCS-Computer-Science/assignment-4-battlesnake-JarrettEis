export default function move(gameState){
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    const myTail = gameState.you.body[gameState.you.body.length-1];
    const center = {
        x:  Math.floor(gameState.board.width-1)/2,
        y:  Math.floor(gameState.board.height-1)/2
    }
    const nearMid = myHead.x>1 && myHead.x<gameState.board.width-2 && myHead.y>1 && myHead.y<gameState.board.height-2;
    let targetMoves = {
        up: false,
        down: false,
        left: false,
        right: false
    }
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    let pathSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    if (myNeck.x < myHead.x || 0 == myHead.x) {moveSafety.left = false;} 
    if (myNeck.x > myHead.x || gameState.board.width == myHead.x+1) {moveSafety.right = false;} 
    if (myNeck.y < myHead.y || 0 == myHead.y) {moveSafety.down = false; } 
    if (myNeck.y > myHead.y|| gameState.board.height == myHead.y+1) {moveSafety.up = false;}
    for(let s = 0; s < gameState.board.snakes.length; s++){
        for(let i = 0; i < gameState.board.snakes[s].body.length-1; i++){
            let body = gameState.board.snakes[s].body[i];
            if (body.x == myHead.x-1 && body.y == myHead.y) {
                moveSafety.left = false;
            } else if (body.x == myHead.x+1 && body.y == myHead.y){
                moveSafety.right = false;
            } else if (body.y == myHead.y-1 && body.x == myHead.x){
                moveSafety.down = false;
            } else if (body.y == myHead.y+1 && body.x == myHead.x){ 
                moveSafety.up = false;
            }
        }
        //deal with head on collisions
        if (gameState.board.snakes[s].id != gameState.you.id && gameState.board.snakes[s].body.length >= gameState.you.body.length){
            let head = gameState.board.snakes[s].body[0];
            let adjacent = {
                left: {x: myHead.x-1, y: myHead.y},
                right: {x: myHead.x+1, y: myHead.y},
                up: {x: myHead.x, y: myHead.y+1},
                down: {x: myHead.x, y: myHead.y-1}
            };
            for (let direction in adjacent) {
                let square = adjacent[direction];
                if ((head.x == square.x - 1 && head.y == square.y) ||
                    (head.x == square.x + 1 && head.y == square.y) ||
                    (head.x == square.x && head.y == square.y - 1) ||
                    (head.x == square.x && head.y == square.y + 1)) {
                    pathSafety[direction] = false;
                }
            }
        }
    }
    function moveTo(pos){
        let xDis = pos.x - myHead.x;
        let yDis = pos.y - myHead.y;
            if (xDis < 0) {targetMoves.left = true;} else if (xDis > 0){targetMoves.right = true;}
            if (yDis < 0) {targetMoves.down = true;} else if (yDis > 0){targetMoves.up = true;}
    }
 
    let isHungry = gameState.you.health < 20  || gameState.you.body.length%2 != 0;
    if(nearMid == false && gameState.you.health>8 && gameState.you.body.length > 4){isHungry = false};
    if (isHungry && gameState.board.food.length > 0){
        let closestFood = gameState.board.food[0];
        let targetFood = {
            distanceTotal: Math.abs(closestFood.x - myHead.x) + Math.abs(closestFood.y - myHead.y),
            distanceX: closestFood.x - myHead.x,
            distanceY: closestFood.y - myHead.y
        }
        for (let i = 1; i < gameState.board.food.length; i++) {
            let food = gameState.board.food[i];
            let d = Math.abs(food.x - myHead.x) + Math.abs(food.y - myHead.y);
            if (d < targetFood.distanceTotal) {
                closestFood = food;
                targetFood = {
                    distanceTotal: d,
                    distanceX: food.x - myHead.x,
                    distanceY: food.y - myHead.y,
                }
            }
        }
        moveTo(closestFood);
    } else if (nearMid){
        moveTo(myTail);
    } else {
        moveTo(center);
    }
    let initialPath = {
        visited: 0,
        risk: 0
    }
    function floodPath(x,y,path){
        const directions = {
            up: {x: x ,y: y+1},
            down: {x: x ,y: y-1},
            left: {x: x-1 ,y: y},
            right: {x: x+1 ,y: y}
        };
        let floodSafety = {
            up: true,
            down: true,
            left: true,
            right: true
        }
        if (0 == x) {floodSafety.left = false;}
        if (gameState.board.width == x+1) {floodSafety.right = false;} 
        if (0 == y) {floodSafety.down = false;} 
        if (gameState.board.height == y+1) {floodSafety.up = false;}
        for(let s = 0; s < gameState.board.snakes.length; s++){
            for(let i = 0; i < gameState.board.snakes[s].body.length-1; i++){
                let body = gameState.board.snakes[s].body[i];
                if (body.x == x-1 && y == y) {
                    floodSafety.left = false;
                } else if (body.x == x+1 && body.y == y){
                    floodSafety.right = false;
                } else if (body.y == y-1 && body.x == x){
                    floodSafety.down = false;
                } else if (body.y == y+1 && body.x == x){ 
                    floodSafety.up = false;
                }
            }
            //deal with risk of being blocked off
            if (gameState.board.snakes[s].id != gameState.you.id && gameState.board.snakes[s].body.length >= gameState.you.body.length){
                let head = gameState.board.snakes[s].body[0];
                for (let direction in directions) {
                    let square = directions[direction];
                    if ((head.x == square.x - 1 && head.y == square.y) ||
                        (head.x == square.x + 1 && head.y == square.y) ||
                        (head.x == square.x && head.y == square.y - 1) ||
                        (head.x == square.x && head.y == square.y + 1)) {
                        path.risk++
                    }}}}
        //base case:
        if(path.visited.length>gameState.you.body.length || (floodSafety.down == false && floodSafety.up == false && floodSafety.left && floodSafety.right == false)){
            return path;
        }
    }
    let safeMoves = Object.keys(moveSafety).filter(
        direction => moveSafety[direction] && pathSafety[direction]
    );
    // Fallback to moveSafety only if nothing passes both checks
    if (safeMoves.length === 0) {
        safeMoves = Object.keys(moveSafety).filter(
            direction => moveSafety[direction]
        );
    }
    // Prioritize targetMoves if any of them are safe
    const prioritizedMoves = Object.keys(targetMoves).filter(
        direction => targetMoves[direction] && safeMoves.includes(direction)
    );
    const nextMove = (prioritizedMoves.length > 0)
        ? prioritizedMoves[Math.floor(Math.random() * prioritizedMoves.length)]
        : safeMoves[Math.floor(Math.random() * safeMoves.length)];
    return { move: nextMove };
}