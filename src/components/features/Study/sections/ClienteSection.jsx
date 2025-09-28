import React from 'react';

const ClienteSection = ({ clientInfo, setClientInfo }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>👤 Información del Cliente</h3>
        <p className="section-description">Ingresa los datos del cliente y sus requerimientos</p>
      </div>
      
      <div className="client-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre del Cliente/Empresa</label>
            <input 
              type="text" 
              placeholder="Ej: Clínica Seprise"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Tipo de Negocio</label>
            <input 
              type="text" 
              placeholder="Ej: Servicios de salud, consultorio médico"
              value={clientInfo.business}
              onChange={(e) => setClientInfo({...clientInfo, business: e.target.value})}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Descripción de la Empresa</label>
          <textarea 
            placeholder="¿Qué hace la empresa? ¿Cuál es su actividad principal?"
            rows="3"
            value={clientInfo.description}
            onChange={(e) => setClientInfo({...clientInfo, description: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Historia y Contexto</label>
          <textarea 
            placeholder="Historia de la empresa, situación actual, problemas identificados..."
            rows="4"
            value={clientInfo.history}
            onChange={(e) => setClientInfo({...clientInfo, history: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>¿Qué Necesita/Quiere el Cliente?</label>
          <textarea 
            placeholder="Requerimientos, necesidades específicas, objetivos que busca cumplir..."
            rows="4"
            value={clientInfo.needs}
            onChange={(e) => setClientInfo({...clientInfo, needs: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default ClienteSection;