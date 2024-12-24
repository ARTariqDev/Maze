import Maze from "./Maze";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <h1>Wilson`s Maze Generator</h1>
      <Maze rows={15} cols={15} />
    </div>
  );
};

export default App;
