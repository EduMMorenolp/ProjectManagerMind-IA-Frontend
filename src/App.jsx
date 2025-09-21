import { useState } from 'react'
import './App.css'

// Importar componentes
import SourcesPanel from './components/SourcesPanel'
import ChatPanel from './components/ChatPanel'
import StudyPanel from './components/StudyPanel'
import { MenuIcon, SettingsIcon } from './components/icons/index.jsx'

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para manejar la vista en dispositivos móviles
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <button className="menu-button" onClick={toggleMobileMenu}>
            <MenuIcon className="menu-icon" />
          </button>
          <h1>Notebook IA</h1>
        </div>
        <div className="header-right">
          <button className="settings-button">
            <SettingsIcon className="settings-icon" />
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className={`sources-panel ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <SourcesPanel 
            selectedFiles={selectedFiles} 
            setSelectedFiles={setSelectedFiles}
          />
        </div>
        
        <div className="chat-panel">
          <ChatPanel selectedFiles={selectedFiles} />
        </div>
        
        <div className="study-panel">
          <StudyPanel selectedFiles={selectedFiles} />
        </div>
      </main>
    </div>
  );
}

export default App;
