import './App.css';
import Greeting from './components/greeting';

function App() {
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
          <button className="find-recipe-button">
            Find a Recipe
          </button>
          
          {/* Link for the picture of a cat */}
          <a
            className="App-link"
            href="https://unsplash.com/images/animals/cat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Here is a picture of a cat :3
          </a>
        </div>
      </header>

      {/* Footer */}
      <div className="footer">
        <p>© 2024 My Recipe App</p>
        <a href="https://www.example.com/privacy">Privacy Policy</a>
      </div>
    </div>
  );
}

export default App;
