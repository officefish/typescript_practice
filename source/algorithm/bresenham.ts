import Point from "./../geom/point";

class Bresenham {
    private _points: Point[];

    public generatePoints(x0: number, y0: number, x1: number, y1: number): Point[] {
        this._points = [];
        let steep: boolean = false;
        let temp: number;
        let dx: number;
        let dy: number;
        let derror2: number;
        let error2: number;
        let x: number;
        let y: number;

        if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
            temp = x0; x0 = y0; y0 = temp; // swap
            temp = x1; x1 = y1; y1 = temp;
            steep = true;
        }

        if (x0 > x1) {
            temp = x0; x0 = x1; x1 = temp; // swap
            temp = y0; y0 = y1; y1 = temp;
        }

        dx = x1 - x0;
        dy = y1 - y0;
        derror2 = Math.abs(dy * 2);
        error2 = 0;

        y = y0;

        for (x = x0; x < x1; x ++) {
            if (steep) {
                this._points.push(new Point(y, x));
            } else {
                this._points.push(new Point(x, y));
            }
            error2 += derror2;
            if (error2 > dx) {
                y += (y1 > y0 ? 1 : -1);
                error2 -= dx * 2;
            }

        }
        return this._points;
    }
}

export default Bresenham;

