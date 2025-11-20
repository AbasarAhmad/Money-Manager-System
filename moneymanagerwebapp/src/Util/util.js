// Format numbers with Indian comma format
const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const numStr = num.toString();
    const parts = numStr.split('.');

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== '') {
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integerPart = formattedOtherNumbers + ',' + lastThree;
    } else {
        integerPart = lastThree;
    }

    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};

// Helper suffix
function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

const prepareIncomeLineChartData = (transactions = []) => {
    const grouped = {};

    transactions.forEach((item) => {
        const fullDate = new Date(item.date);
        const day = fullDate.getDate();
        const month = fullDate.toLocaleString("en-IN", { month: "short" });

        const label = `${day}${getDaySuffix(day)} ${month}`; // 👈 FIXED label format

        const dateKey = item.date; // YYYY-MM-DD

        if (!grouped[dateKey]) {
            grouped[dateKey] = {
                date: dateKey,
                label,
                totalAmount: 0,
                items: []
            };
        }

        grouped[dateKey].totalAmount += item.amount;
        grouped[dateKey].items.push(item);
    });

    // 🔥 Always sort by actual date (ascending)
    return Object.values(grouped).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
};

export {
    addThousandsSeparator,
    prepareIncomeLineChartData
};
