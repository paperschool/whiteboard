export const getCurvePoints = ({
    points = [],
    tension = 1,
    numOfSegments = 16
}) => {

    // tension vectors
    let t1 = { x: 0, y: 0 };
    let t2 = { x: 0, y: 0 };

    let _points = [], res = [],    // clone array
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _points = points.slice(0);


    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 points + 1e point before and after
    for (i = 1; i < (_points.length - 2); i++) {
        for (t = 0; t <= numOfSegments; t++) {

            // calc tension vectors

            t1.x = (_points[i + 1].x - _points[i - 1].x) * tension
            t2.x = (_points[i + 2].x - _points[i].x) * tension

            t1.y = (_points[i + 1].y - _points[i - 1].y) * tension
            t2.y = (_points[i + 2].y - _points[i].y) * tension


            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            // calc x and y cords with common control vectors
            // and store in array
            res.push({
                x: c1 * _points[i].x + c2 * _points[i + 1].x + c3 * t1.x + c4 * t2.x,
                y: c1 * _points[i].y + c2 * _points[i + 1].y + c3 * t1.y + c4 * t2.y
            });
        }
    }

    return res;
}

export const getCurvePoints2 = ({
    points = [],
    tension = 1,
    numOfSegments = 1
}) => {

    // tension vectors
    const t1 = { x: 0, y: 0 };
    const t2 = { x: 0, y: 0 };

    // clone array so we don't change the original
    const _points = points.slice(0);
    const res = [];

    res.push(_points[0])

    for (let pi = 1; pi < (_points.length - 2); pi++) {

        t1.x = (_points[pi + 1].x - _points[pi - 1].x) * tension;
        t1.y = (_points[pi + 1].y - _points[pi - 1].y) * tension;

        t2.x = (_points[pi + 2].x - _points[pi].x) * tension;
        t2.y = (_points[pi + 2].y - _points[pi].y) * tension;

        res.push({
            x: (_points[pi].x * 1) + (_points[pi + 1].x * 1) + (t1.x * 1) + (t2.x * 1),
            y: (_points[pi].y * 1) + (_points[pi + 1].y * 1) + (t1.y * 1) + (t2.y * 1)
        });
    }

    res.push({
        x: _points[_points.length - 1].x,
        y: _points[_points.length - 1].y
    })

    return res;
}

export const finiteDifferenceCurve = ({ points }) => {

    const _points = points.splice(0)
    const result = []


    for (let pi = 1; pi < _points.length - 1; pi++) {



        result.push({
            x: 0,
            y: 0
        })

    }

    return result;

}

export const lineSmooth = ({ points, tensionA = 0.85, tensionB = 0.15 }) => {

    const result = [];

    // store first point if present
    if (points.length > 0) {
        result.push(points[0])
    }

    for (let pi = 0; pi < points.length - 1; pi++) {
        const a = points[pi]
        const b = points[pi + 1]

        result.push({
            x: tensionA * a.x + tensionB * b.x,
            y: tensionA * a.y + tensionB * b.y
        })
        result.push({
            x: tensionB * a.x + tensionA * b.x,
            y: tensionB * a.y + tensionA * b.y
        })
    }

    return result;
}

export const lineSmooth2 = ({ points }) => {

    const result = [];

    // store first point if present
    if (points.length > 0) {
        result.push(points[0])
    }

    for (let pi = 0; pi < points.length - 1; pi++) {
        const a = points[pi]
        const b = points[pi + 1]

        result.push({
            x: tensionA * a.x + tensionB * b.x,
            y: tensionA * a.y + tensionB * b.y
        })
        result.push({
            x: tensionB * a.x + tensionA * b.x,
            y: tensionB * a.y + tensionA * b.y
        })
    }

    return result;
} 