import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './screens/homePage';
import GamePage from './screens/gamePage';
import LiveGamePage from './screens/liveGamePage';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/live-game" element={<LiveGamePage />} />
      </Routes>
    </Router>
  );
}
export default App
