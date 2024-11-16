import './App.css';
import Greeting from './components/greeting';
import buffCat from './image/cookCat.jpg';
import bufferCat from './image/cookCatt.jpg';

import { useState, useEffect } from 'react';
import { loadData, searchByTitle, searchByIngredients, getCaloriesFromApiPer100g, gramsToCalories, showRandomRecipe } from './utils/dataLoader';



function App() {
  const [recipes, setRecipes] = useState([]);
  const [queryTitle, setQueryTitle] = useState('');
  const [queryIngredients, setQueryIngredients] = useState('');
  const [caloriesResult, setCaloriesResult] = useState('');
  const [randomRecipe, setRandomRecipe] = useState(null);

  // Load recipes on initial render
  useEffect(() => {
    async function fetchData() {
      const data = await loadData();
      setRecipes(data);
    }
    fetchData();
  }, []);

  const handleSearchByTitle = async () => {
    const result = await searchByTitle(queryTitle, recipes);
    setRecipes(result);
  };

  const handleSearchByIngredients = async () => {
    const result = await searchByIngredients(queryIngredients, recipes);
    setRecipes(result);
  };

  const handleGetCalories = async (ingredient, grams) => {
    const caloriesPer100g = await getCaloriesFromApiPer100g(ingredient);
    if (typeof caloriesPer100g === 'number') {
      const calories = gramsToCalories(grams, caloriesPer100g);
      setCaloriesResult(`${grams} grams of ${ingredient} contains ${calories.toFixed(2)} calories.`);
    } else {
      setCaloriesResult(`Could not retrieve calorie data for ${ingredient}.`);
    }
  };

  const handleRandomRecipe = () => {
    setRandomRecipe(showRandomRecipe(recipes));
  };

  return (
    <div className="App">
      <div className = "navbar">
        <a href="#home">Home</a>
        <a href="#recipes">Recipes</a>
        <a href="#contact">Contact</a>
      </div>

      <header className="App-header">
        <Greeting />
        <div className="button-container">
          {/* Button for "Find a Recipe" */}
          <button className="find-recipe-button" onClick = {handleRandomRecipe}>
            Here is a Random Recipe
          </button>
          
          {/* Search by Title */}
          <input
            type="text"
            placeholder="Search by title..."
            value={queryTitle}
            onChange={(e) => setQueryTitle(e.target.value)}
          />
          <button onClick={handleSearchByTitle}>Search by Title</button>

          {/* Search by Ingredients */}
          <input
            type="text"
            placeholder="Search by ingredients..."
            value={queryIngredients}
            onChange={(e) => setQueryIngredients(e.target.value)}
          />
          <button onClick={handleSearchByIngredients}>Search by Ingredients</button>

          {/* Calories per 100g */}
          <input
            type="text"
            placeholder="Enter ingredient for calories (e.g., Apple)"
            id="calorie-ingredient"
          />
          <input
            type="number"
            placeholder="Enter grams"
            id="calorie-grams"
          />
          <button onClick={() => handleGetCalories(document.getElementById('calorie-ingredient').value, document.getElementById('calorie-grams').value)}>
            Get Calories
          </button>

          {/* Display Calorie Results */}
          {caloriesResult && <p>{caloriesResult}</p>}

          {/* Link for the picture of a cat */}
          <a
            className="App-link"
            href="https://unsplash.com/images/animals/cat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Here are pictures of CATS :3
          </a>
        </div>
      </header>

      {/* Left image */}
      <div className = "left-side">
        <img src = {buffCat} alt = "Left Side" />
      </div>

      {/* Right image */}
      <div className="right-side">
        <img src = {bufferCat} alt = "Right Side" />
      </div>

      {/* Display Recipes */}
      <div>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe.Title}</h3>
                <p>{recipe.Ingredients}</p>
                <p>{recipe.Instructions}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      {/* Display Random Recipe */}
      {randomRecipe && (
        <div>
          <h2>{randomRecipe.Title}</h2>
          <p>{randomRecipe.Ingredients}</p>
          <p>{randomRecipe.Instructions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>© 2024 The Cooking Cat App</p>
        <a href="https://www.example.com/privacy">Privacy Policy</a>
      </div>
    </div>
  );
}

export default App;
