import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      
      <div className="not-found-actions">
        <Link to="/" className="return-home-btn">
          Volver al inicio
        </Link>
      </div>
      
      <div className="not-found-links">
        <h3>Páginas disponibles:</h3>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/upload">Subir Documentos</Link></li>
          <li><Link to="/projects">Proyectos</Link></li>
          <li><Link to="/document-types">Tipos de Documentos</Link></li>
          <li><Link to="/health">Estado del Sistema</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound;