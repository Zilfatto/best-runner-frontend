import React from 'react';
import { ToastContainer } from 'react-toastify';
import Trainings from './components/Trainings';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <ToastContainer />
            <Trainings />
        </>
    );
}

export default App;
