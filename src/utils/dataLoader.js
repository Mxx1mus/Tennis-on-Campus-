import axios from 'axios';

const API_KEY = 'FtiBqTvtyNcF7FrO5c3oSg==aLg0Iw2qa5daSY7e';
const API_URL = 'https://api.calorieninjas.com/v1/nutrition?query=';

// Load the dataset
async function loadData() {
    const filePath = "/content/Food Ingredients and Recipe Dataset with Image Name Mapping.csv";
    const response = await fetch(filePath);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const recipes = rows.slice(1).map(row => {
        return headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
        }, {});
    });
    return recipes;
}

// Load data
let df = await loadData();

async function getCaloriesFromApiPer100g(ingredient) {
    const headers = {
        'X-Api-Key': API_KEY
    };
    try {
        const response = await axios.get(`${API_URL}${ingredient}`, { headers });
        const data = response.data;

        if (data.items && data.items.length > 0) {
            const calories = data.items[0].calories || 'Calories not found';
            return calories;
        } else {
            return `No calorie data found for '${ingredient}'.`;
        }
    } catch (error) {
        return `Error fetching data for ${ingredient}: ${error.response ? error.response.status : error.message}`;
    }
}

function gramsToCalories(grams, caloriesPer100g) {
    const calories = (grams / 100) * caloriesPer100g;
    return calories;
}

// Function to search by title with a limit and show more functionality
async function searchByTitle(title) {
    const filteredTitle = df.filter(recipe => recipe.Title.toLowerCase().includes(title.toLowerCase()));
    if (filteredTitle.length > 0) {
        console.log("\nResults:");
        const maxResults = 5;  // Initial results to display
        let displayed = 0;

        while (displayed < filteredTitle.length) {
            const batch = filteredTitle.slice(displayed, displayed + maxResults);
            for (const row of batch) {
                console.log(`\n${row.Title}`);

                while (true) {
                    const action = prompt("\nDo you want to see the ingredients (i), instructions (u), or next (n), or exit (e)? ").trim().toLowerCase();
                    if (action === 'i') {
                        console.log(`\nIngredients: ${row.Ingredients}`);
                    } else if (action === 'u') {
                        console.log(`\nInstructions: ${row.Instructions}`);
                    } else if (action === 'n') {
                        break;  // Exit to the main menu
                    } else if (action === 'e') {
                        return false; // Exit the program
                    } else {
                        console.log("Invalid choice, please try again.");
                    }
                }
            }
            displayed += maxResults;

            if (displayed < filteredTitle.length) {
                const showMore = prompt("\nDo you want to see more results? (y/n): ").trim().toLowerCase();
                if (showMore !== 'y') {
                    break;
                }
            } else {
                console.log("\nNo more results to show.");
            }
        }
    } else {
        console.log("No recipes found with that title.");
    }
}

// Function to search by multiple ingredients
async function searchByIngredients(ingredients) {
    const ingredientsList = ingredients.split(",").map(ingredient => ingredient.trim()).filter(ingredient => ingredient);

    if (ingredientsList.length === 0) {
        console.log("No ingredients provided.");
        return;
    }

    let filteredIngredient = df;
    for (const ingredient of ingredientsList) {
        filteredIngredient = filteredIngredient.filter(recipe => recipe.Ingredients.toLowerCase().includes(ingredient.toLowerCase()));
    }

    if (filteredIngredient.length > 0) {
        console.log("\nResults:");
        const maxResults = 5;  // Initial results to display
        let displayed = 0;

        while (displayed < filteredIngredient.length) {
            const batch = filteredIngredient.slice(displayed, displayed + maxResults);
            for (const row of batch) {
                console.log(`\n${row.Title}`);

                while (true) {
                    const action = prompt("\nDo you want to see the ingredients (i), instructions (u), or next (n), or exit (e)? ").trim().toLowerCase();
                    if (action === 'i') {
                        console.log(`\nIngredients: ${row.Ingredients}`);
                    } else if (action === 'u') {
                        console.log(`\nInstructions: ${row.Instructions}`);
                    } else if (action === 'n') {
                        break;  // Exit to the main menu
                    } else if (action === 'e') {
                        return false; // Exit the program
                    } else {
                        console.log("Invalid choice, please try again.");
                    }
                }
            }
            displayed += maxResults;

            if (displayed < filteredIngredient.length) {
                const showMore = prompt("\nDo you want to see more results? (y/n): ").trim().toLowerCase();
                if (showMore !== 'y') {
                    break;
                }
            } else {
                console.log("\nNo more results to show.");
            }
        }
    } else {
        console.log("No recipes found with those ingredients.");
    }
}

// Function to show a random recipe
function showRandomRecipe() {
    const randomIndex = Math.floor(Math.random() * df.length);
    const recipe = df[randomIndex];
    console.log(`\nRandom Recipe: ${recipe.Title}`);
    console.log(`Ingredients: ${recipe.Ingredients}`);
    console.log(`Instructions: ${recipe.Instructions}`);
}

async function mainMenu() {
    while (true) {
        console.log("\nRecipe Finder Menu:");
        console.log("1. Search by Title");
        console.log("2. Search by Ingredient");
        console.log("3. Show Random Recipe");
        console.log("4. Get Calories per 100g");
        console.log("5. Get Calories for Specific Grams");
        console.log("6. Exit");

        const choice = prompt("\nChoose an option (1/2/3/4/5/6): ");

        if (choice === "1") {
            const title = prompt("\nEnter a recipe title to search: ");
            await searchByTitle(title);
        } else if (choice === "2") {
            const ingredient = prompt("\nEnter an ingredient or multiple separated by commas to search: ");
            await searchByIngredients(ingredient);
        } else if (choice === "3") {
            showRandomRecipe();
        } else if (choice === "4") {
            const ingredient = prompt("\nEnter a food item to get calories per 100g: ");
            const calories = await getCaloriesFromApiPer100g(ingredient);
            console.log(`\nCalories for ${ingredient} per 100g: ${calories}`);
        } else if (choice === "5") {
            const ingredient = prompt("\nEnter a food item to get calories for specific grams: ");
            const grams = parseFloat(prompt("Enter the number of grams: "));
            const caloriesPer100g = await getCaloriesFromApiPer100g(ingredient);
            if (typeof caloriesPer100g === 'number') {
                const calories = gramsToCalories(grams, caloriesPer100g);
                console.log(`\n${grams} grams of ${ingredient} contains ${calories.toFixed(2)} calories.`);
            } else {
                console.log(`Could not retrieve calorie data for ${ingredient}.`);
            }
        } else if (choice === "6") {
            console.log("Goodbye!");
            break;
        } else {
            console.log("Invalid option, please try again.");
        }
    }
}

export {loadData, getCaloriesFromApiPer100g, gramsToCalories, searchByTitle, searchByIngredients, showRandomRecipe };
// Run the program
//mainMenu();