//Global variables
let size = 3;
let puzzle = [];
let resultantPuzzle = [];
let goalStatus = false;
let children = [];
let parentChildRelationObject = [];
let rootNode = [];

let queue = [];
let reachedNodes = [];

// value to represent for the depth of DFS and for iterative deepening search
//6 is the default value
let acceptableDepth = 6;

//When the user clicks on submit button below method will be triggered
function formSubmit(e) {
    e.preventDefault();

    // adding some prototype function to insert in a specific array
    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

    //set input elements to the rootNode
    for (let i = 0; i < 9; i++) {
        if (document.getElementById(i).value == "" || document.getElementById(i).value == " " || document.getElementById(i).value == "E" || document.getElementById(i).value == "0") {
            rootNode[i] = 0;
        } else {
            rootNode[i] = parseInt(document.getElementById(i).value);
        }
    }

    //this sets the output matrix
    for (let i = 0; i < 9; i++) {
        if (document.getElementById(i + 9).value == "" || document.getElementById(i + 9).value == " " || document.getElementById(i + 9).value == "E" || document.getElementById(i + 9).value == "0") {
            resultantPuzzle[i] = 0;
        } else {
            resultantPuzzle[i] = parseInt(document.getElementById(i + 9).value);
        }
    }

    //set the input depth value
    if (document.getElementById("depthValue").value) {
        acceptableDepth = document.getElementById("depthValue").value;
    }

    let timeNode = document.getElementById("timeTaken");

    //To check if the input is the goal node
    goalReached(rootNode);
    if (goalStatus) {
        timeNode.innerHTML = "Root node is the goal node :)   "
    }

    let t0 = performance.now();

    //Below if else's are executed based on the user choice
    if (document.getElementById("bfs").checked == true) {
        breathFirstSearch();
    } else if (document.getElementById("dfs").checked == true) {
        depthFirstSearch();
    } else if (document.getElementById("ids").checked == true) {
        iterativeDeepeningSearch();
    } else if (document.getElementById("tilesOutOfPlace").checked == true) {
        tilesOutOfPlaceSearch();
    } else if (document.getElementById("manhattanDistance").checked == true) {
        manHattanDistance();
    } else if (document.getElementById("hueristicH").checked == true) {
        heuristicHSearch();
    } else if (document.getElementById("chebyshev").checked == true) {
        chebyshev();
    }


    let t1 = performance.now();

    //Adds the span element to the DOM element
    let spanElement = document.createElement('span')
    timeNode.innerHTML = "Time Taken to execute the code ---- ";

    spanElement.innerHTML = (t1 - t0) + " milliseconds."
    timeNode.appendChild(spanElement);
};


//will move element right if it is legal
function moveRight(pc, i) {
    if (i % size < size - 1) {
        let temp = pc.slice(0);
        let a = temp[i];
        let b = temp[i + 1];

        temp[i] = b;
        temp[i + 1] = a;

        children.push(temp);
    }
}

//will mode left the element if it is legal
function moveLeft(pc, i) {
    if (i % size > 0) {
        let temp = pc.slice(0);
        let a = temp[i];
        let b = temp[i - 1];

        temp[i] = b;
        temp[i - 1] = a;

        children.push(temp);

    }
}

//will mode up the element if it is legal
function moveUp(pc, i) {
    if (i - size >= 0) {
        let temp = pc.slice(0);
        let a = temp[i];
        let b = temp[i - 3];

        temp[i] = b;
        temp[i - 3] = a;

        children.push(temp);
    }
}

//will mode down the element if it is legal
function moveDown(pc, i) {
    if (i + size < pc.length) {
        let temp = pc.slice(0);
        let a = temp[i];
        let b = temp[i + 3];

        temp[i] = b;
        temp[i + 3] = a;

        children.push(temp);
    }
}


//This will call methods which implement left, right, down, up legal moves
function puzzleExpander(puzzle) {
    let index;
    //trying to reset the children for every loop
    children = []

    for (let i = 0; i < puzzle.length; i++) {

        if (puzzle[i] == 0) {
            index = i;
        }
    }
    moveRight(puzzle, index);
    moveLeft(puzzle, index);
    moveUp(puzzle, index);
    moveDown(puzzle, index);
}

//Used to find the solution using breathfirst search
function breathFirstSearch() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;
    while (queue.length != 0 && !goalStatus && count < 1500) {
        let addToQueue = true;
        let presentNode = queue[0];
        reachedNodes.push(presentNode);
        puzzleExpander(presentNode);

        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if add to queue variable is true
                    if (addToQueue) {
                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode
                        parentChildRelationObject.push(parent)

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result cannot be obtained";
        console.log("No result");
    }

}

//function to find the solution using depth first search
function depthFirstSearch() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;


    while (queue.length != 0 && !goalStatus && count < 150000) {

        let addToQueue = true;
        let depthExceeded = false;
        let presentNode = queue[0];
        let parentDepth = 0;
        reachedNodes.push(presentNode);


        //For DFS search


        for (let obj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[obj].value) == JSON.stringify(presentNode)) {
                parentDepth = parentChildRelationObject[obj].depth;
            }
        }

        if (parentDepth + 1 <= acceptableDepth) {
            puzzleExpander(presentNode);
        }

        if (children.length != 0 && !goalStatus && count < 150000) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if add to queue variable is true
                    if (addToQueue && !depthExceeded) {
                        //should not add if the depth is exceeded the input limit
                        if (parentDepth + 1 <= acceptableDepth) {
                            let val = children[i].slice(0);
                            queue.insert("1", val);
                            let parent = [];
                            parent["value"] = val;
                            parent["parent"] = presentNode;
                            parent["depth"] = parentDepth + 1;
                            parentChildRelationObject.push(parent)
                        }

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        console.log(parentChildRelationObject);
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result is not obtained for given depth";
        console.log("No result");
    }

}

//This calculates the solution iterative deepening search
function iterativeDeepeningSearch() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;


    while (queue.length != 0 && !goalStatus && count < 1500) {

        let addToQueue = true;
        let depthExceeded = false;
        let presentNode = queue[0];
        let parentDepth = 0;
        reachedNodes.push(presentNode);

        for (let obj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[obj].value) == JSON.stringify(presentNode)) {
                parentDepth = parentChildRelationObject[obj].depth;
            }
        }
        puzzleExpander(presentNode);


        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if add to queue variable is true
                    if (addToQueue) {
                        //should not add if the depth is exceeded the input limit

                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode;
                        parent["depth"] = parentDepth + 1;
                        parentChildRelationObject.push(parent)
                    }

                }
                //If one of the child is the goal status there is no need to check for the others
                if (goalReached(children[i])) {
                    break;
                }
                ;
            }
        }

        //This will remove the first element of an array
        queue.shift();
        // sorting queue based on the parent depth
        sortingBasedOnDepth();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result is not obtained for given depth";
        console.log("No result");
    }

}

//Used to find the solution using the number of tiles out from original position
function tilesOutOfPlaceSearch() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;
    while (queue.length != 0 && !goalStatus && count < 1500) {
        let addToQueue = true;
        let presentNode = queue[0];
        reachedNodes.push(presentNode);

        //To add the depth for root elemnet
        let parentDepth = 0;

        //to know about the element depth
        for (let obj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[obj].value) == JSON.stringify(presentNode)) {
                parentDepth = parentChildRelationObject[obj].depth;
            }
        }


        puzzleExpander(presentNode);

        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if add to queue variable is true
                    if (addToQueue) {
                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode;
                        parent["depth"] = parentDepth + 1;
                        parent["tilesOutOfSpace"] = outOfSpaceCount(val);
                        debugger;
                        parent["minMoves"] = calcMinMoves(val)
                        parentChildRelationObject.push(parent)

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();

        sortingBasedOnTilesOutOfSpace();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        //This will trace the chain from the result to root matrix and attaches it to the DOM
        printNode(pathFolowed);
    } else {
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result cannot be obtained";
        console.log("No result");
    }

}

// manhattan distance and depth are used before applying the sorting
function manHattanDistance() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;

    while (queue.length != 0 && !goalStatus && count < 1500) {
        let addToQueue = true;
        let presentNode = queue[0];
        reachedNodes.push(presentNode);

        //To add the depth for root element
        let parentDepth = 0;

        //to know about the element depth
        for (let obj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[obj].value) == JSON.stringify(presentNode)) {
                parentDepth = parentChildRelationObject[obj].depth;
            }
        }
        puzzleExpander(presentNode);

        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if addToQueue variable is true
                    if (addToQueue) {
                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode;
                        //parent["tilesOutOfSpace"] = outOfSpaceCount(val);
                        parent["depth"] = parentDepth + 1;
                        parent["minMoves"] = calcMinMoves(val)
                        //parent["score"] = calcSeqScore(val);
                        parentChildRelationObject.push(parent)

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();

        sortingBasedOnManhattanDist();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result cannot be obtained";
        console.log("No result");
    }

}

//Used to find the solution using heuristic search function H
function heuristicHSearch() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;

    while (queue.length != 0 && !goalStatus && count < 1500) {
        let addToQueue = true;
        let presentNode = queue[0];
        reachedNodes.push(presentNode);

        //Applies legal moves
        puzzleExpander(presentNode);

        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if addToQueue variable is true
                    if (addToQueue) {
                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode;
                        //parent["tilesOutOfSpace"] = outOfSpaceCount(val);
                        //parent["depth"] = parentDepth + 1;
                        parent["minMoves"] = calcMinMoves(val)
                        parent["score"] = calcSeqScore(val);
                        parentChildRelationObject.push(parent)

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();

        sortingBasedOnHueristicH();
    }

    //If goal state is reached then try to trace back and print the matrix
    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        //After too many trails if the solution is still not found
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result cannot be obtained";
        console.log("No result");
    }

}

//computes the solution based on chebyshev solution
function chebyshev() {

    queue = [];
    reachedNodes = [];
    parentChildRelationObject = [];
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";

    // reset every time
    goalStatus = false;
    queue.push(rootNode);
    let count = 0;
    while (queue.length != 0 && !goalStatus && count < 1500) {
        let addToQueue = true;
        let presentNode = queue[0];
        reachedNodes.push(presentNode);
        puzzleExpander(presentNode);

        if (children.length != 0 && !goalStatus && count < 1500) {
            // check whether the node is already present in queue
            for (let i = 0; i < children.length; i++) {

                if (!goalStatus && count < 1500) {
                    addToQueue = true;

                    for (let j = 0; j < queue.length; j++) {
                        if (JSON.stringify(queue[j]) === JSON.stringify(children[i])) {
                            console.log('Already exists');
                            addToQueue = false;
                            count = count + 1;

                        }
                    }
                    //This will check  whether the children is in the reachedNodes or not
                    if (addToQueue) {
                        for (let k = 0; k < reachedNodes.length; k++) {
                            if (JSON.stringify(reachedNodes[k]) === JSON.stringify(children[i])) {
                                console.log('Already exists');
                                addToQueue = false;
                            }
                        }
                    }

                    //Add that child to the queue if add to queue variable is true
                    if (addToQueue) {
                        let val = children[i].slice(0);
                        queue.push(val);
                        let parent = [];
                        parent["value"] = val;
                        parent["parent"] = presentNode;
                        //parent["tilesOutOfSpace"] = outOfSpaceCount(val);
                        parent["chebyshev"] = calcChebyshevDistance(val)
                        parentChildRelationObject.push(parent)

                    }
                    //If one of the child is the goal status there is no need to check for the others
                    if (goalReached(children[i])) {
                        break;
                    }
                    ;
                }
            }

        }

        //This will remove the first element of an array
        queue.shift();

        sortingBasedChebyshevDistace();
    }

    if (goalStatus == true) {

        let pathFolowed = tracePath();
        console.log("goalReached");
        console.log(pathFolowed);
        printNode(pathFolowed);
    } else {
        let resultMatrix = document.getElementById("resultMatrix");
        resultMatrix.innerHTML = "The result cannot be obtained";
        console.log("No result");
    }

}

//This is used for counting the number of tiles out of space for each array
function outOfSpaceCount(val) {
    let count = 0;
    for (let i = 0; i < resultantPuzzle.length; i++) {
        if (!resultantPuzzle[i] == 0) {
            if (val[i] != resultantPuzzle[i]) {
                count++
            }
        }
    }
    return count
}

//sorting after adding the depth and tiles out of space
function sortingBasedOnTilesOutOfSpace() {
    let tilesOutOfSpaceValue = [];
    for (let i = 0; i < queue.length; i++) {
        for (let relationObj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[relationObj].value) == JSON.stringify(queue[i])) {
                tilesOutOfSpaceValue.push({
                    num: parentChildRelationObject[relationObj].tilesOutOfSpace + parentChildRelationObject[relationObj].depth,
                    val: queue[i]
                });
            }
        }
    }

    // use slice() to copy the array and not just make a reference
    let sortedQueue = tilesOutOfSpaceValue.slice(0);
    sortedQueue.sort(function (a, b) {
        return a.num - b.num;
    });

    //just get the queue out
    queue.length = 0;
    for (let i = 0; i < sortedQueue.length; i++) {
        queue.push(sortedQueue[i].val);
    }
}

//Sorting for iterative deepening search
function sortingBasedOnDepth() {
    let tilesOutOfSpaceValue = [];
    for (let i = 0; i < queue.length; i++) {
        for (let relationObj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[relationObj].value) == JSON.stringify(queue[i])) {
                tilesOutOfSpaceValue.push({
                    num: parentChildRelationObject[relationObj].depth,
                    val: queue[i]
                });
            }
        }
    }

    // use slice() to copy the array and not just make a reference
    let sortedQueue = tilesOutOfSpaceValue.slice(0);
    sortedQueue.sort(function (a, b) {
        return a.num - b.num;
    });

    //just get the queue out
    queue.length = 0;
    for (let i = 0; i < sortedQueue.length; i++) {
        queue.push(sortedQueue[i].val);
    }
}

//sorting based on the Manhattan distance (we will add manhattan distance and depth)
function sortingBasedOnManhattanDist() {
    let valuesTobeSorted = [];
    for (let i = 0; i < queue.length; i++) {
        for (let relationObj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[relationObj].value) == JSON.stringify(queue[i])) {
                valuesTobeSorted.push({
                    num: parentChildRelationObject[relationObj].depth + parentChildRelationObject[relationObj].minMoves,
                    val: queue[i]
                });
            }
        }
    }

    // use slice() to copy the array and not just make a reference
    let sortedQueue = valuesTobeSorted.slice(0);
    sortedQueue.sort(function (a, b) {
        return a.num - b.num;
    });

    //just get the queue out
    queue.length = 0;
    for (let i = 0; i < sortedQueue.length; i++) {
        queue.push(sortedQueue[i].val);
    }
}

//sorting after adding the manhattendistance and 3* sequence number
function sortingBasedOnHueristicH() {
    let valuesTobeSorted = [];
    for (let i = 0; i < queue.length; i++) {
        for (let relationObj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[relationObj].value) == JSON.stringify(queue[i])) {
                valuesTobeSorted.push({
                    num: 3 * (parentChildRelationObject[relationObj].score) + parentChildRelationObject[relationObj].minMoves,
                    val: queue[i]
                });
            }
        }
    }

    // use slice() to copy the array and not just make a reference
    let sortedQueue = valuesTobeSorted.slice(0);
    sortedQueue.sort(function (a, b) {
        return a.num - b.num;
    });

    //just get the queue out
    queue.length = 0;
    for (let i = 0; i < sortedQueue.length; i++) {
        queue.push(sortedQueue[i].val);
    }
}

//sorting by taking chebeshev distance into consideration
function sortingBasedChebyshevDistace() {
    let valuesTobeSorted = [];
    for (let i = 0; i < queue.length; i++) {
        for (let relationObj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[relationObj].value) == JSON.stringify(queue[i])) {
                valuesTobeSorted.push({
                    num: parentChildRelationObject[relationObj].chebyshev,
                    val: queue[i]
                });
            }
        }
    }

    // use slice() to copy the array and not just make a reference
    let sortedQueue = valuesTobeSorted.slice(0);
    sortedQueue.sort(function (a, b) {
        return a.num - b.num;
    });

    //just get the queue out
    queue.length = 0;
    for (let i = 0; i < sortedQueue.length; i++) {
        queue.push(sortedQueue[i].val);
    }
}

//To print the input and outpu along with the intermediate states.
function printNode(res) {
    let k = 0;
    console.log("Inside the printNode function")

    res.push(rootNode)
    res = res.reverse();
    let resultMatrix = document.getElementById("resultMatrix");
    //This will clear the DOM child every time
    resultMatrix.innerHTML = "";
    for (let i = 0; i < res.length; i++) {
        let divElement = document.createElement("div");
        for (let j = 0; j < res[i].length; j++) {
            let spanElement = document.createElement('span')
            if (res[i][j] == 0) {
                spanElement.innerHTML = " "
            } else {
                spanElement.innerHTML = res[i][j]
            }
            divElement.appendChild(spanElement);
            divElement.classList.add("eachResult");
        }
        resultMatrix.appendChild(divElement);
    }
    let nodesTraversed = document.createElement("div");
    nodesTraversed.classList.add("tracePath");

    nodesTraversed.innerHTML = "Number of nodes created: " + parentChildRelationObject.length + "     Reached Nodes:  " + reachedNodes.length + "    Nodes in queue:  " + queue.length;
    resultMatrix.appendChild(nodesTraversed);
}

//This function will test the result
function goalReached(puzzle) {

    if (JSON.stringify(puzzle) === JSON.stringify(resultantPuzzle)) {
        console.log('They are equal!');
        goalStatus = true;
    }
}

//Trace the path back to the root matrix
function tracePath() {

    let initial = resultantPuzzle;
    let finalResult = [];
    let i = 0;
    while (i < 1000) {

        for (let obj in parentChildRelationObject) {
            if (JSON.stringify(parentChildRelationObject[obj].value) == JSON.stringify(initial)) {
                finalResult.push(parentChildRelationObject[obj].value);
                initial = parentChildRelationObject[obj].parent;
            }
        }
        i = i + 1;
    }
    return finalResult;
}

//Calculates minimum number of moves to goal state
function calcMinMoves(arr) {
    let count = 0;
    for (let i = 0; i < resultantPuzzle.length; i++) {
        for (let j = 0; j < resultantPuzzle.length; j++) {
            if (arr[i] == resultantPuzzle[j] && arr[i] != 0) {
                count = count + Math.abs((Math.floor(i % 3) - Math.floor(j % 3))) + Math.abs((Math.floor(i / 3) - Math.floor(j / 3)));
            }
        }
    }
    return count;
}

//Calculates the chebyshev score
function calcChebyshevDistance(arr) {
    let count = 0;
    for (let i = 0; i < resultantPuzzle.length; i++) {
        for (let j = 0; j < resultantPuzzle.length; j++) {
            if (arr[i] == resultantPuzzle[j] && arr[i] != 0) {
                count = count + 2 * Math.max(Math.abs((Math.floor(i % 3) - Math.floor(j % 3))), Math.abs((Math.floor(i / 3) - Math.floor(j / 3))));
            }
        }
    }
    return count;
}

//calculate the sequence score
/*
There should be a better way to do this method but due to time constraint i did it with each element individually
*/

function calcSeqScore(val) {

    let score = 0;
    for (let i = 0; i < resultantPuzzle.length; i++) {

        // skipping the value of 0 in the input
        if (val[i] != 0) {
            if (i == 0 || i == 1) {
                if (val[i] == 8) {
                    val[i + 1] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[i + 1] ? "" : (score = score + 2)
                }
            } else if (i == 2) {

                if (val[i] == 8) {
                    val[5] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[5] ? "" : (score = score + 2)
                }

            } else if (i == 5) {

                if (val[i] == 8) {
                    val[8] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[8] ? "" : (score = score + 2)
                }

            } else if (i == 8) {

                if (val[i] == 8) {
                    val[7] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[7] ? "" : (score = score + 2)
                }

            } else if (i == 7) {

                if (val[i] == 8) {
                    val[6] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[6] ? "" : (score = score + 2)
                }

            } else if (i == 6) {

                if (val[i] == 8) {
                    val[3] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[3] ? "" : (score = score + 2)
                }

            } else if (i == 3) {

                if (val[i] == 8) {
                    val[0] == 1 ? "" : (score = score + 2)
                } else {
                    val[i] + 1 == val[0] ? "" : (score = score + 2)
                }
            }
        } else {
            i == 4 ? "" : score = score + 1;
        }
    }
    return score;
}


//This is to uncheck other checkboxes when one of them is clicked.
// Its better I use radio but i just like the look and feel of check boxes so used it
//In order to disable when one of them is clicked

const checkboxBFS = document.getElementById("bfs");
const checkboxDFS = document.getElementById("dfs");
const checkboxIDS = document.getElementById("ids")
const checkboxTOS = document.getElementById("tilesOutOfPlace");
const checkboxMANH = document.getElementById("manhattanDistance");
const checkboxH = document.getElementById("hueristicH");
const checkboxCHE = document.getElementById("chebyshev");


checkboxBFS.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxIDS.checked = false;
        checkboxTOS.checked = false;
        checkboxMANH.checked = false;
        checkboxH.checked = false;
        checkboxCHE.checked = false;
    }
})

checkboxDFS.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxBFS.checked = false;
        checkboxIDS.checked = false;
        checkboxTOS.checked = false;
        checkboxMANH.checked = false;
        checkboxH.checked = false;
        checkboxCHE.checked = false;
    }
})

checkboxIDS.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxBFS.checked = false;
        checkboxTOS.checked = false;
        checkboxMANH.checked = false;
        checkboxH.checked = false;
        checkboxCHE.checked = false;
    }
})

checkboxTOS.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxIDS.checked = false;
        checkboxBFS.checked = false;
        checkboxMANH.checked = false;
        checkboxH.checked = false;
        checkboxCHE.checked = false;
    }
})

checkboxMANH.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxIDS.checked = false;
        checkboxTOS.checked = false;
        checkboxBFS.checked = false;
        checkboxH.checked = false;
        checkboxCHE.checked = false;
    }
})

checkboxH.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxIDS.checked = false;
        checkboxTOS.checked = false;
        checkboxMANH.checked = false;
        checkboxBFS.checked = false;
        checkboxCHE.checked = false;
    }
})


checkboxCHE.addEventListener('change', (event) => {
    if (event.target.checked) {
        checkboxDFS.checked = false;
        checkboxIDS.checked = false;
        checkboxTOS.checked = false;
        checkboxMANH.checked = false;
        checkboxBFS.checked = false;
        checkboxH.checked = false;
    }
})