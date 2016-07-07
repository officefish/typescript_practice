import Point from "./../geom/point";

class StreamNode {

    // channel statuses
    public static BLACK: number = 0;
    public static CYAN: number = 1;
    public static YELLOW: number = 2;
    public static MAGENTA: number = 3;

    // link to position in original field
    public point: Point;

    // actual statuses channels
    protected cyan: boolean = false;
    protected yellow: boolean = false;
    protected magenta: boolean = false;
    protected black: boolean = false;

    // current channel
    public channel: number;

    /*
     * @ point - position in field
     * @ channel - node stream channel
     * @ full - if it is a entry point 
    */
    constructor(point: Point, channel: number, full: boolean = false) {
        this.point = point;
        this.channel = channel;
        if (full) {
            this.cyan = true;
            this.yellow = true;
            this.black = true;
            this.magenta = true;
        } else {
            this.registerChannel(channel);
        }

    }

    // register channel status, if it is a connection node or entry node several channels can be marked
    public registerChannel (channel: number): void {
        switch (channel) {
            case StreamNode.BLACK:
                this.black = true;
                break;
            case StreamNode.CYAN:
                this.cyan = true;
                break;
            case StreamNode.YELLOW:
                this.yellow = true;
                break;
            case StreamNode.MAGENTA:
                this.magenta = true;
                break;
            default:
                break;
        }
    }

    // check if it is a native or foreign channel
    public varifyChannel (channel: number): boolean {
        switch (channel) {
            case StreamNode.BLACK:
                return this.black === true;
            case StreamNode.CYAN:
                return this.cyan === true;
            case StreamNode.YELLOW:
                return this.yellow === true;
            case StreamNode.MAGENTA:
                return this.magenta === true;
            default:
                throw "can not identify channel";
        }
    }
}

class CMYK  {

    // matrix of field points, points can be full/empty/transformed
    private matrix: number[][];

    // matrix of stream nodes
    private nodes: StreamNode[][];

    // start point fo analize
    private sourcePoint: Point;

    // status of contrur, if we find connection, we will register it
    private connection: boolean = false;

    /*
     * @source:Point - start point for analyze
     * @matrix:number [][] - matrix of points and there states
     */
    public getStream (source: Point, matrix: number[][]): Point[] {

        // register sourcePoint 
        this.sourcePoint = source;

        // list of all points of cursor
        let responseStream: Point[] = [source];

        // no connections, contur is not closed at the moment
        this.connection = false;

        // sync matrix of points with matrix of stream nodes 
        this.syncMatrixes(matrix);

        // create a node for source point
        let sourceNode: StreamNode = new StreamNode(source, 0, true);

        // register node in matrix of nodes
        this.nodes[source.x][source.y] = sourceNode;

        // init nearest neighbors
        let neighbors: StreamNode[] = this.censur(source, 0, true);

        // init loop stream
        let stream: StreamNode[] = [];

        // add nearest neighbors into stream
        stream = stream.concat(neighbors);

        // run loop
        while (stream.length) {

            // extract some node 
            sourceNode = stream.pop();

            // register point of contur
            responseStream.push(sourceNode.point);

            // add neighbors of this point to stream 
            stream = stream.concat(this.censur(sourceNode.point, sourceNode.channel));
        };


        if (this.connection) {
            // if contur is closed return list of cursor points
            return responseStream;
        } else {
            return undefined;
        }
    }

    /*
     *  Sync matrix of points and matrix of stream nodes
     *  @matrix number[][] - number of points in field    
     */
    private syncMatrixes (matrix: number[][]): void {
        this.matrix = matrix;
        let rows: number = matrix.length;
        let lines: number  = matrix[0].length;
        this.nodes = [];
        for (let i: number = 0; i < rows; i ++) {
            this.nodes[i] = [];
            for (let j: number = 0; j < lines; j ++) {
                this.nodes[i][j] = undefined;
            }
        }
    }

    /*
     * Register new nodes, the nearest neighbors of actual stream node
     * 
     * @source - actual stream position
     * @channel - actual direction of analyze 
     * @increment - channel flag, let register the start point, or point of channel direction
     */
    private censur (source: Point, channel: number, increment: boolean = false): StreamNode[] {
        let stream: StreamNode[] = [];
        let xPosition: number = source.x - 1;
        let yPosition: number = source.y;
        let _channel: number = channel;

        // push left neighbor to stream if it not out of matrix border 
        if (source.x > 0) {
           this.pushToStream(xPosition, yPosition, stream, _channel);
        }
        // change chanel for start point registration 
        if (increment) {
            _channel ++;
        }

        // push right neighbor 
        if (source.x < this.nodes.length - 1) {
            xPosition += 2;
            this.pushToStream(xPosition, yPosition, stream, _channel);
        }
        if (increment) {
            _channel ++;
        }

        // push up neighbor
        if (source.y > 0) {
            xPosition = source.x;
            yPosition -= 1;
            this.pushToStream(xPosition, yPosition, stream, _channel);
        }
        if (increment) {
            _channel ++;
        }

        // push down neighbor
        if (source.y < this.nodes[0].length - 1) {
            xPosition = source.x;
            yPosition += 2;
            this.pushToStream(xPosition, yPosition, stream, _channel);
        }
        return stream;
    }

    /*
     * Register new node for analyze if it doesn't analized yet
     * If it does we varifyChannel, if the channel is the same of parameter channel,
     * it mean that this is parent node, who create this one, and we ignore it. 
     * If the chanels are not the same, we found the connection and contur is closed 
     * If the status of point is empty, we ignore this point, and don't register new node 
     * 
     * @ xPosition - point X
     * @ yPosition - point Y
     * @ stream - stream of nodes which used in node
     * @ channel - actual direction channel
     */
    private pushToStream (xPosition: number, yPosition: number, stream: StreamNode[], channel: number): void {
        // new node
        let node: StreamNode;

        // there is no point in field (empty status) 
        if (this.matrix[xPosition][yPosition] !== 1) {
            // ignore it
            return;
        }
        // this node is already created
        if (this.nodes[xPosition][yPosition] !== undefined) {
            node = this.nodes[xPosition][yPosition];

            // check if this a parent node
            if (node.varifyChannel(channel)) {
                // ignore if it is
                return;
            } else {
                // Congratulattions! We found the connection
                this.connection = true;
                // add one mode channel status to node
                node.registerChannel(channel);

                // here we also can add the point of this node to coonections list ...
                // I don't need it, so I didn't 
            }
        } else {
            // register new node and add it in loop stream
            let point = new Point(xPosition, yPosition);
            node = new StreamNode(point, channel);
            this.nodes[xPosition][yPosition] = node;
            stream.push(node);
        }
    }
}

export default CMYK;

 