import { useState } from 'react'
import './App.css'

// Importar componentes
import SourcesPanel from './components/SourcesPanel'
import ChatPanel from './components/ChatPanel'
import StudyPanel from './components/StudyPanel'
import ConnectionTest from './components/ConnectionTest'
import { MenuIcon, SettingsIcon } from './components/icons/index.jsx'

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

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
          <button 
            className="settings-button" 
            onClick={() => setShowConnectionTest(!showConnectionTest)}
            title="Prueba de conexión"
          >
            <SettingsIcon className="settings-icon" />
          </button>
        </div>
      </header>

      <main className="app-main">
        {showConnectionTest ? (
          <ConnectionTest />
        ) : (
          <>
            <div className={`sources-panel ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <SourcesPanel 
                selectedFiles={selectedFiles} 
                setSelectedFiles={setSelectedFiles}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            </div>
            
            <div className="chat-panel">
              <ChatPanel 
                selectedFiles={selectedFiles} 
                selectedProject={selectedProject}
              />
            </div>
            
            <div className="study-panel">
              <StudyPanel 
                selectedFiles={selectedFiles} 
                selectedProject={selectedProject}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
