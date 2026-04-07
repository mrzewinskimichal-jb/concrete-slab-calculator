import React, { useState } from 'react';
import InputForm from './InputForm';
import DiagramViewer from './DiagramViewer';

const App: React.FC = () => {
    const [slabConfiguration, setSlabConfiguration] = useState({});
    const [loads, setLoads] = useState([]);
    const [supports, setSupports] = useState([]);

    const handleConfigurationChange = (configuration: any) => {
        setSlabConfiguration(configuration);
    };

    const handleLoadChange = (newLoads: any) => {
        setLoads(newLoads);
    };

    const handleSupportChange = (newSupports: any) => {
        setSupports(newSupports);
    };

    return (
        <div style={{
            background: 'linear-gradient(to right, #e66465, #9198e5)',
            minHeight: '100vh',
            padding: '20px',
            color: '#ffffff'
        }}>
            <h1>Concrete Slab Calculator</h1>
            <InputForm 
                onConfigurationChange={handleConfigurationChange} 
                onLoadChange={handleLoadChange} 
                onSupportChange={handleSupportChange} 
            />
            <DiagramViewer 
                slabConfiguration={slabConfiguration} 
                loads={loads} 
                supports={supports} 
            />
        </div>
    );
};

export default App;