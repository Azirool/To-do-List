
module.exports = function () {
    const currentDate = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    
    return currentDate.toLocaleDateString("en-US", options);
}
