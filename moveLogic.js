export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
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
    
    // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
    // gameState.board.snakes contains an array of enemy snake objects, which includes their coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
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
        if (gameState.board.snakes.id != gameState.you.id && gameState.board.snakes[s].body.length > gameState.you.body.length){
            let head = gameState.board.snakes[s].body[0];
            if (head.x+1 == myHead.x-1 && head.y == myHead.y){
                moveSafety.left = false;
            }
            if (head.x-1 == myHead.x+1 && head.y == myHead.y){
                moveSafety.right = false;
            }
            if (head.y+1 == myHead.y-1 && head.x == myHead.x){
                moveSafety.down = false;
            }
            if (head.y-1 == myHead.y+1 && head.x == myHead.x){
                moveSafety.up = false;
            }
        }
    }

    // Are there any safe moves left?
    
    //Object.keys(moveSafety) returns ["up", "down", "left", "right"]
    //.filter() filters the array based on the function provided as an argument (using arrow function syntax here)
    //In this case we want to filter out any of these directions for which moveSafety[direction] == false
    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
        return { move: "down" };
    }
    
    // Choose a random move from the safe moves
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    
    // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
    // gameState.board.food contains an array of food coordinates https://docs.battlesnake.com/api/objects/board
    
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}