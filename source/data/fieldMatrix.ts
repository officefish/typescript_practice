class FieldMatrix {

    public static EMPTY: number = 0;
    public static FULL: number = 1;
    public static TRANSFORMED: number = 2;

    public static rows: number;
    public static lines: number;

    public static getMatrix (rows: number, lines: number): number[][] {
        let matrix: number[][] = [];
        FieldMatrix.rows = rows;
        FieldMatrix.lines = lines;
        for (let i: number = 0; i < rows; i ++) {
            matrix[i] = [];
            for (let j: number = 0; j < lines; j ++) {
                matrix[i][j] = FieldMatrix.EMPTY;
            }
        }
        return matrix;
    }
}

export default FieldMatrix;

