export default function move(gameState){
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
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
    let isHungry = true;
    let closestFood = gameState.board.food[0];
    let targetFood = {
        distanceTotal: Math.abs(closestFood.x - myHead.x) + (closestFood.y - myHead.y),
        distanceX: closestFood.x - myHead.x,
        distanceY: closestFood.y - myHead.y,
    }
    if (myNeck.x < myHead.x || 0 == myHead.x) {
        moveSafety.left = false;
    } 
    if (myNeck.x > myHead.x || gameState.board.width == myHead.x+1) {
        moveSafety.right = false;
    } 
    if (myNeck.y < myHead.y || 0 == myHead.y) {
        moveSafety.down = false; 
    } 
    if (myNeck.y > myHead.y|| gameState.board.height == myHead.y+1) {
        moveSafety.up = false;
    }
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
        if (gameState.board.snakes.id != gameState.you.id && gameState.board.snakes[s].body.length >= gameState.you.body.length){
            let head = gameState.board.snakes[s].body[0];
            if (head.x+1 == myHead.x-1 && head.y == myHead.y){
                pathSafety.left = false;
            }
            if (head.x-1 == myHead.x+1 && head.y == myHead.y){
                pathSafety.right = false;
            }
            if (head.y+1 == myHead.y-1 && head.x == myHead.x){
                pathSafety.down = false;
            }
            if (head.y-1 == myHead.y+1 && head.x == myHead.x){
                pathSafety.up = false;
            }
        }
    }
    if (isHungry){
        for (let i = 1; i < gameState.board.food.length; i++){
            let d = Math.abs(gameState.board.food[i].x - myHead.x) + (gameState.board.food[i].y - myHead.y);
            if (d<=targetFood.distanceTotal){
                closestFood = gameState.board.food[i];
                targetFood = {
                    distanceTotal: Math.abs(closestFood.x - myHead.x) + (closestFood.y - myHead.y),
                    distanceX: closestFood.x - myHead.x,
                    distanceY: closestFood.y - myHead.y,
                };
            };
        };
        if (Math.abs(targetFood.distanceX) > Math.abs(closestFood.distanceY)){
            if (targetFood.distanceX<0){
                targetMoves.left = true;
            }else{
                targetMoves.right = true;
            }
        } else {
            if (targetFood.distanceY<0){
                targetMoves.down = true;
            }else{
                targetMoves.up = true;
            }
        }
    };
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
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