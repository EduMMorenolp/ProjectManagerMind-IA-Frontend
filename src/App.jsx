import { useState } from 'react'
import './styles/main.css'

// Importar componentes features
import { SourcesPanel } from './components/features/Documents'
import { ChatPanel } from './components/features/Chat'
import { StudyPanel } from './components/features/Study'

// Importar componentes layout
import { ConnectionTest } from './components/layout'

// Importar componentes UI
import { SettingsIcon } from './components/ui/Icons'

// Importar contextos
import { StudyProvider } from './contexts'

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  return (
    <StudyProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1>ProjectManagerMind IA</h1>
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
              <div className="sources-panel">
                <SourcesPanel 
                  selectedFiles={selectedFiles} 
                  setSelectedFiles={setSelectedFiles}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </div>
              
              <div className="study-panel">
                <StudyPanel 
                  selectedFiles={selectedFiles} 
                  selectedProject={selectedProject}
                />
              </div>
              
              <div className="chat-panel">
                <ChatPanel 
                  selectedFiles={selectedFiles} 
                  selectedProject={selectedProject}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </StudyProvider>
  );
}

export default App;
