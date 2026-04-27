export const separateTimeDate = (dataEpoch: string, type: "hora" | "data") => {
    const match = dataEpoch.match(/^(\d{2})-(\d{2})-(\d{4}) (.+)$/);
    let formattedDate = dataEpoch;
    if (match) {
        formattedDate = `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
    }

    const converted = (formattedDate);
    if (type === "hora") {
        return converted.split(",")[1].trim().slice(0, 5);
    }
    if (type === "data") {
        const [month, day, year] = converted.split(",")[0].split("/");
        return `${day}/${month}/${year}`;
    }
};