import { Node } from "../models/Node";

export enum Types {
    START,
    END,
    WALKABLE,
    NON_WALKABLE
}

export class PathFinding {
    
    constructor(){
        
    }

    static find(map: number[][]): Node | null{

        let firstElement = PathFinding.findStart(map);
        let lastElement = PathFinding.findEnd(map);
        return PathFinding.findBestPath(firstElement, lastElement, map); 

    }

    static findBestPath(firstElement: Node, lastElement:Node, map: number[][]): Node | null{

        var closedList: Node[] = [];
        var openList: Node[]= [];
        var isFinished: boolean = false;

        closedList.push(firstElement);

        while(!isFinished){
            
            openList = PathFinding.findValidAdjacents(map, closedList[closedList.length -1], closedList, openList, lastElement);
            if(openList.length > 0)closedList.push(openList.pop() as Node);
            isFinished = PathFinding.isObjectEqual(closedList[closedList.length-1],lastElement) || openList.length == 0;
        }

        if(openList.length > 0){
            return closedList[closedList.length-1];
        } else {
            return null;
        }
    }

    static findEnd(map:number[][]): Node {
        return PathFinding.findElement(map, Types.END);
    }

    static findStart(map:number[][]): Node {
        return PathFinding.findElement(map, Types.START);
    }

    static findElement(map:number[][], value:number): Node {

        let el = new Node(0,0);
        map.forEach((element, indexRow) => {
            element.forEach((element, indexCol) => {
                if(element == value){
                    el = new Node(indexRow, indexCol);
                }
            });
        });
        return el;
        
    }

    static getValueMove(node:Node, nodeNew:Node){
        if(node.getRow() != nodeNew.getRow() && node.getCol() != nodeNew.getCol()) return 14;
            else return 10;
    }

    static distanceBetweenNodes(nodeInitial:Node, nodeFinal:Node, val:number){
        let col = Math.abs(nodeFinal.getCol() - nodeInitial.getCol());
        let row = Math.abs(nodeFinal.getRow() - nodeInitial.getRow());
        return col*val + row*val;
    }

    static isObjectEqual(element:Node, element0:Node):boolean{
        return (element.getRow() == element0.getRow() && element.getCol() == element0.getCol());
    }

    static findAdjacents(map:number[][], node:Node) : Node[] {

        let adjacents: Node[] = [];

        let verify = [[-1,-1], [-1,0] , [-1, 1], [0,-1], 
                      [0,1], [1,-1], [1,0] , [1, 1]];

        let mapElements = map;
        
        for(let v = 0; v < verify.length; v++){

          var x = node.getRow() + verify[v][0];
          var y = node.getCol() + verify[v][1];

          if(x > -1 && y > -1 && x < mapElements.length && y < mapElements[x].length 
            && (mapElements[x][y] == Types.WALKABLE || mapElements[x][y] == Types.END )){
                adjacents.push(new Node(x, y));
          }
        }

        return adjacents;
    }


    static findValidAdjacents(map:number[][], node:Node, closedList:Node[], openList: Node[], lastElement:Node){
        
        let validAdjacents = PathFinding.findAdjacents(map, node).filter(
            (elementAdjacent) => {
                return closedList.some((element) => {
                    return !(PathFinding.isObjectEqual(element, elementAdjacent))
                })
            });

        let validAdjacentsOpenList = validAdjacents.filter(
            (elementAdjacent) => {
                return openList.some((element) => {
                    return (PathFinding.isObjectEqual(element, elementAdjacent))
                })
            });

        validAdjacentsOpenList.map((elementAdjacent) => {
            let validElement = openList.filter((element) => (PathFinding.isObjectEqual(element, elementAdjacent)))[0];
            if(( node.getG() + PathFinding.getValueMove(validElement, node)) < validElement.getG()){
                validElement.setG(PathFinding.getValueMove(validElement, node));
                validElement.setParent(node);
            }
        });

        let validAdjacentsNewOpenList = validAdjacents.filter(
            (elementAdjacent) => {
                return !openList.some((element) => {
                    return (PathFinding.isObjectEqual(element, elementAdjacent))
                })
            });


        validAdjacentsNewOpenList.forEach((element) => {
            element.setParent(node);
            element.setH(PathFinding.distanceBetweenNodes(element, lastElement, 10));
            element.setG(PathFinding.getValueMove(node, element));
            element.setValue(element.getG() + element.getH());
            openList.push(element);
            
        });
        
        openList.sort((a,b) => b.getValue() - a.getValue());
        
        return openList;  
      }

}