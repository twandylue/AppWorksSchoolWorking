const getFactors = (number) => {
    const factors = [];
    let i = 2;
    while (number > 1) {
        if (number % i === 0) {
            factors.push(i);
            number = number / i;
            continue;
        }
        i++;
    }
    return factors;
};

module.exports = {
    getFactors
};
