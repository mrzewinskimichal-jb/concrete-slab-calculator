import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DiagramViewer = ({ bendingMoments, shearForces, reactions }) => {
    const maxMoment = Math.max(...bendingMoments);
    const maxShear = Math.max(...shearForces);

    const data = bendingMoments.map((moment, index) => ({
        index,
        bendingMoment: moment,
        shearForce: shearForces[index],
    }));

    return (
        <div>
            <h2>Bending Moment and Shear Force Diagrams</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" label="Distance (m)" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bendingMoment" stroke="#8884d8" name="Bending Moment" />
                    <Line type="monotone" dataKey="shearForce" stroke="#82ca9d" name="Shear Force" />
                </LineChart>
            </ResponsiveContainer>
            <div>
                <h3>Reactions Table</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Direction</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reactions.map((reaction, index) => (
                            <tr key={index}>
                                <td>{reaction.direction}</td>
                                <td>{reaction.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Max Values</h3>
                <p>Max Bending Moment: {maxMoment} Nm</p>
                <p>Max Shear Force: {maxShear} N</p>
            </div>
        </div>
    );
};

export default DiagramViewer;
