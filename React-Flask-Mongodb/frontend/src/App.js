import './App.css';
import { Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Analysis from './components/Analysis ';
import ContactUs from './components/ContactUs';
import Mainpage from './components/Mainpage';
import Barchart from './components/Barchart';
import Piechart from './components/Piechart';

function App() {


  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Mainpage />} />
        <Route path="home" element={<Home />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="analysis/barchart" element= {<Barchart />}/>
        <Route path="analysis/piechart" element= {<Piechart />}/>
        <Route path="contactus" element={<ContactUs />} /> 
      </Route>
    </Routes>
  );
}

export default App;
