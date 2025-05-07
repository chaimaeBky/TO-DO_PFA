const fs = require('fs');
const path = require('path');

// Remplacez __dirname par :
const lcovPath = path.join(process.cwd(), 'coverage', 'lcov.info');
const outputPath = path.join(process.cwd(), 'coverage', 'lcov-clean.info');
const lcovContent = fs.readFileSync(lcovPath, 'utf8')
  .split('\n')
  .filter(line => {
    // Supprime les entrées vides et fichiers de config
    if (line.includes('(empty-report)')) return false
    if (line.includes('.config.')) return false
    if (line.includes('main.jsx')) return false
    return true
  })
  .join('\n')

fs.writeFileSync(outputPath, lcovContent)
console.log('Fichier LCOV nettoyé généré avec succès')