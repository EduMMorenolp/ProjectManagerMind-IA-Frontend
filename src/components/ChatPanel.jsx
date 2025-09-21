import React, { useState, useRef, useEffect } from 'react';

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
    if (input.trim() === '' || isProcessing) return;
    
    // Añadir mensaje del usuario
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Simular respuesta de la API (en una implementación real, llamar a la API)
    setTimeout(() => {
      const assistantMessage = { 
        type: 'assistant', 
        text: `Esta es una respuesta simulada basada en ${selectedFiles.length} archivos seleccionados. En una implementación real, este texto vendría de la respuesta de la API procesando los documentos seleccionados con la consulta del usuario.` 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
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
          placeholder="Pregunta algo sobre tus documentos..."
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={input.trim() === '' || isProcessing}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;