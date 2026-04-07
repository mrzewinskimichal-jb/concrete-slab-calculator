const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://mrzewinskimichal-jb.github.io',
    'https://mrzewinskimichal-jb.github.io/concrete-slab-calculator'
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Calculate route
app.post('/api/calculate', (req, res) => {
  try {
    const {
      slabLength = 10,
      thickness = 0.2,
      elasticity = 30000,
      poissonRatio = 0.2,
      supports = [{ position: 0, type: 'fixed' }],
      loads = [{ position: 5, magnitude: 100 }],
      numElements = 10
    } = req.body;

    // FEM calculation logic
    const numNodes = numElements + 1;
    const elementLength = slabLength / numElements;

    // Create stiffness matrix for each element
    const k_elem = (12 * elasticity * (thickness ** 3)) / (elementLength ** 3);

    // Global stiffness matrix
    const K = Array(numNodes).fill(0).map(() => Array(numNodes).fill(0));
    for (let i = 0; i < numElements; i++) {
      K[i][i] += k_elem;
      K[i][i + 1] -= k_elem;
      K[i + 1][i] -= k_elem;
      K[i + 1][i + 1] += k_elem;
    }

    // Load vector
    const F = Array(numNodes).fill(0);
    loads.forEach(load => {
      const nodeIndex = Math.round((load.position / slabLength) * numElements);
      if (nodeIndex >= 0 && nodeIndex < numNodes) {
        F[nodeIndex] += load.magnitude;
      }
    });

    // Apply boundary conditions (fixed supports)
    supports.forEach(support => {
      const nodeIndex = Math.round((support.position / slabLength) * numElements);
      if (nodeIndex >= 0 && nodeIndex < numNodes) {
        K[nodeIndex][nodeIndex] *= 1e10;
        F[nodeIndex] = 0;
      }
    });

    // Solve using Gaussian elimination
    const displacements = solveLinearSystem(K, F);

    // Calculate moments and reactions
    const moments = [];
    for (let i = 0; i < numElements; i++) {
      const moment = Math.abs((elasticity * (thickness ** 3) / 12) * (displacements[i + 1] - 2 * displacements[i] + (i > 0 ? displacements[i - 1] : displacements[i])) / (elementLength ** 2));
      moments.push(moment);
    }

    res.json({
      success: true,
      data: {
        displacements,
        moments,
        positions: Array.from({ length: numNodes }, (_, i) => (i * slabLength) / numElements),
        maxDisplacement: Math.max(...displacements.map(Math.abs)),
        maxMoment: Math.max(...moments)
      }
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Concrete Slab Calculator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      calculate: 'POST /api/calculate'
    }
  });
});

// Simple Gaussian elimination solver
function solveLinearSystem(A, b) {
  const n = A.length;
  const A_copy = A.map(row => [...row]);
  const b_copy = [...b];

  // Forward elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A_copy[k][i]) > Math.abs(A_copy[maxRow][i])) {
        maxRow = k;
      }
    }

    [A_copy[i], A_copy[maxRow]] = [A_copy[maxRow], A_copy[i]];
    [b_copy[i], b_copy[maxRow]] = [b_copy[maxRow], b_copy[i]];

    for (let k = i + 1; k < n; k++) {
      const factor = A_copy[k][i] / A_copy[i][i];
      for (let j = i; j < n; j++) {
        A_copy[k][j] -= factor * A_copy[i][j];
      }
      b_copy[k] -= factor * b_copy[i];
    }
  }

  // Back substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = b_copy[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= A_copy[i][j] * x[j];
    }
    x[i] /= A_copy[i][i];
  }

  return x;
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Concrete Slab Calculator API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});