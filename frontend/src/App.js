import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';


function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}

export default App;






