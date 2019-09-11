const fetch = require("node-fetch");

const url = "http://carbonateapiprod.azurewebsites.net/api/v1/mealprovidingunits/3d519481-1667-4cad-d2a3-08d558129279/dishoccurrences";
const subStr = "köttbull";

async function isMeatballsToday() {
    let resp = await fetch(url);
    let json = await resp.json();

    let dishNames = json.reduce((acc, dish) => {
        const swedishDishes = dish.displayNames.filter(dispName => 
            dispName.displayNameCategory.displayNameCategoryName === "Swedish");

        return acc.concat(swedishDishes.map(d => d.dishDisplayName));
    }, []);

    return dishNames.some(dishName => dishName.toLowerCase().includes(subStr));
}

module.exports = isMeatballsToday;
