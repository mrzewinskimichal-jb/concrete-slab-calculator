import React, { useState } from 'react';

const InputForm = () => {
    const [length, setLength] = useState(0);
    const [thickness, setThickness] = useState(0);
    const [elasticity, setElasticity] = useState(0);
    const [supports, setSupports] = useState([]);
    const [loads, setLoads] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for calculation will go here
        console.log('Calculating with:', { length, thickness, elasticity, supports, loads });
    };

    const addSupport = (support) => {
        setSupports([...supports, support]);
    };

    const addLoad = (load) => {
        setLoads([...loads, load]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Length: 
                    <input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Thickness: 
                    <input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Elasticity: 
                    <input type="number" value={elasticity} onChange={(e) => setElasticity(e.target.value)} />
                </label>
            </div>
            <div>
                <h3>Add Supports</h3>
                <button type="button" onClick={() => addSupport('Pin')}>Add Pin Support</button>
                <button type="button" onClick={() => addSupport('Fixed')}>Add Fixed Support</button>
                <button type="button" onClick={() => addSupport('Roller')}>Add Roller Support</button>
                <pre>{JSON.stringify(supports, null, 2)}</pre>
            </div>
            <div>
                <h3>Add Loads</h3>
                <button type="button" onClick={() => addLoad('Point')}>Add Point Load</button>
                <button type="button" onClick={() => addLoad('Distributed')}>Add Distributed Load</button>
                <button type="button" onClick={() => addLoad('Moment')}>Add Moment Load</button>
                <pre>{JSON.stringify(loads, null, 2)}</pre>
            </div>
            <button type="submit">Calculate</button>
        </form>
    );
};

export default InputForm;
