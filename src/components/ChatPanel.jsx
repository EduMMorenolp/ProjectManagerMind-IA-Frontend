import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/index.jsx';
import { chatWithDocuments } from '../services/api';

const ChatPanel = ({ selectedFiles, selectedProject }) => {
  const [messages, setMessages] = useState([
    { type: 'system', text: 'Bienvenido al asistente de documentos IA. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isProcessing || selectedFiles.length === 0) return;
    
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const response = await chatWithDocuments({
        query: input,
        projectId: selectedProject?.id,
        documentIds: selectedFiles // Assuming selectedFiles contains document IDs
      });
      
      const assistantMessage = { 
        type: 'assistant', 
        text: response.response || 'No se pudo procesar tu consulta.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al procesar la consulta:', error);
      const errorMessage = { 
        type: 'system', 
        text: `Error: ${error.response?.data?.message || error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="chat-panel-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message assistant loading">
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedFiles.length > 0 
            ? "Pregunta algo sobre tus documentos..." 
            : "Selecciona documentos para hacer consultas..."}
          disabled={isProcessing || selectedFiles.length === 0}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={input.trim() === '' || isProcessing || selectedFiles.length === 0}
        >
          <SendIcon className="send-icon" />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;