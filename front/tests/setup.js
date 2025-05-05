// Ce fichier configure l'environnement de test pour les composants React
import '@testing-library/jest-dom';

// Configuration globale pour les tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Si vous avez besoin de mocker des objets globaux comme localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};