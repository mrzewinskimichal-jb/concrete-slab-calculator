function createElementStiffnessMatrix(E, A, L) {
    const k = (E * A) / L;
    return [[k, -k], [-k, k]];
}

function assembleGlobalStiffness(numElements, elementStiffnessMatrices) {
    const globalStiffness = new Array(numElements + 1).fill(0).map(() => new Array(numElements + 1).fill(0));
    for (let i = 0; i < numElements; i++) {
        const k = elementStiffnessMatrices[i];
        globalStiffness[i][i] += k[0][0];
        globalStiffness[i][i + 1] += k[0][1];
        globalStiffness[i + 1][i] += k[1][0];
        globalStiffness[i + 1][i + 1] += k[1][1];
    }
    return globalStiffness;
}

function createLoadVector(force, numElements) {
    const loadVector = new Array(numElements + 1).fill(0);
    loadVector[1] = force;
    return loadVector;
}

function applyBoundaryConditions(K, F, fixedNodes) {
    fixedNodes.forEach(node => {
        for (let i = 0; i < K.length; i++) {
            K[node][i] = 0;
            K[i][node] = 0;
        }
        K[node][node] = 1;
        F[node] = 0;
    });
}

function solveSystem(K, F) {
    const n = F.length;
    for (let k = 0; k < n; k++) {
        for (let i = k + 1; i < n; i++) {
            const factor = K[i][k] / K[k][k];
            for (let j = k; j < n; j++) {
                K[i][j] -= factor * K[k][j];
            }
            F[i] -= factor * F[k];
        }
    }
    const displacements = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        displacements[i] = F[i];
        for (let j = i + 1; j < n; j++) {
            displacements[i] -= K[i][j] * displacements[j];
        }
        displacements[i] /= K[i][i];
    }
    return displacements;
}

function calculateInternalForces(K, displacements) {
    const internalForces = K.map(row => row.reduce((sum, k, j) => sum + k * displacements[j], 0));
    return internalForces;
}

function calculateReactions(E, A, L, fixedNodes, displacements) {
    const R = createElementStiffnessMatrix(E, A, L);
    const reactions = new Array(fixedNodes.length).fill(0);
    fixedNodes.forEach((node, index) => {
        reactions[index] = R[0][0] * displacements[node];
    });
    return reactions;
}

// Export functions
module.exports = {
    createElementStiffnessMatrix,
    assembleGlobalStiffness,
    createLoadVector,
    applyBoundaryConditions,
    solveSystem,
    calculateInternalForces,
    calculateReactions
};