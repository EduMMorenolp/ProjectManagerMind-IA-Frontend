import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/index.jsx';
import { processDocuments } from '../services/api';

const ChatPanel = ({ selectedFiles }) => {
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
    
    // Añadir mensaje del usuario
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Enviar la consulta a la API con los archivos seleccionados
      const response = await processDocuments({
        files: selectedFiles,
        query: input,
        documentType: 'consulta'
      });
      
      // Añadir respuesta del asistente
      const assistantMessage = { 
        type: 'assistant', 
        text: response.result || `No se pudo procesar tu consulta. Por favor, intenta de nuevo.` 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al procesar la consulta:', error);
      // Mostrar mensaje de error
      const errorMessage = { 
        type: 'system', 
        text: `Ocurrió un error al procesar tu consulta. ${error.message || 'Por favor, intenta de nuevo más tarde.'}` 
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