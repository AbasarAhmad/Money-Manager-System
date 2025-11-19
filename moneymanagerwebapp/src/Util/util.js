const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const numStr = num.toString();
    const parts = numStr.split('.');

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers != '') {
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integerPart = formattedOtherNumbers + ',' + lastThree;
    } else {
        integerPart = lastThree;
    }

    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};

export { addThousandsSeparator };  // ← THIS IS REQUIRED
