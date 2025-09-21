import React from 'react';
import { AddIcon, SearchIcon, CheckIcon, PdfIcon, DocIcon } from './icons/index.jsx';

const SourcesPanel = ({ selectedFiles, setSelectedFiles }) => {
  const handleFileSelect = (fileName) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter(file => file !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === mockFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockFiles.map(file => file.name));
    }
  };

  // Archivos de ejemplo - en una implementación real, estos vendrían de la API
  const mockFiles = [
    { name: 'S1 relevamiento.pdf', type: 'pdf' },
    { name: 'S2 Informe PP2.pdf', type: 'pdf' },
    { name: 'S3 Objetivos.pdf', type: 'pdf' },
    { name: 'S4 Diagramas.pdf', type: 'pdf' }
  ];

  return (
    <div className="sources-panel-container">
      <div className="sources-header">
        <h2>Fuentes</h2>
        <div className="sources-actions">
          <button className="icon-button">
            <AddIcon className="icon" />
          </button>
          <button className="icon-button">
            <SearchIcon className="icon" />
          </button>
        </div>
      </div>

      <div className="select-all-container">
        <div className="select-all-checkbox">
          <button 
            className={`checkbox-button ${selectedFiles.length === mockFiles.length ? 'selected' : ''}`}
            onClick={handleSelectAll}
          >
            {selectedFiles.length === mockFiles.length && <CheckIcon className="check-icon" />}
          </button>
          <span>Seleccionar todas las fuentes</span>
        </div>
      </div>

      <div className="files-list">
        {mockFiles.map((file, index) => (
          <div 
            key={index} 
            className={`file-item ${selectedFiles.includes(file.name) ? 'selected' : ''}`}
            onClick={() => handleFileSelect(file.name)}
          >
            <div className="file-checkbox">
              <button className={`checkbox-button ${selectedFiles.includes(file.name) ? 'selected' : ''}`}>
                {selectedFiles.includes(file.name) && <CheckIcon className="check-icon" />}
              </button>
            </div>
            <div className="file-icon">
              {file.type === 'pdf' ? <PdfIcon className="file-type-icon" /> : <DocIcon className="file-type-icon" />}
            </div>
            <div className="file-name">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesPanel;