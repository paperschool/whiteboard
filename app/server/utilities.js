export const randomHex = () => {
    let r = randomInt({ min: 1, max: 225 }).toString(16);
    let g = randomInt({ min: 1, max: 225 }).toString(16);
    let b = randomInt({ min: 1, max: 225 }).toString(16);
    return `#${r}${g}${b}`;
}

export const randomInt = ({ min = 0, max = 1 }) => {
    return Math.round(random({ min, max }))
}

export const random = ({ min = 0, max = 1 }) => {
    return Math.random() * (max - min) + min;
}
