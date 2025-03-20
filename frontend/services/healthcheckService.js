// src/services/healthcheckService.js

/**
 * Servicio para manejar las verificaciones de noticias y textos
 */
const healthcheckService = {
    /**
     * Verifica un texto o URL y devuelve el resultado del análisis
     * @param {string} text - El texto o URL a verificar
     * @param {string} type - El tipo de contenido ('Texto', 'URL', 'Twitter')
     * @returns {Promise<Object>} - Resultado del análisis
     */
    async checkContent(text, type) {
      try {
        const response = await fetch('/api/healthcheck/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: text, type }),
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error verificando contenido:', error);
        throw error;
      }
    },
  
    /**
     * Registra interacción del usuario con un resultado (útil, no útil, compartir)
     * @param {number} noticiaId - ID de la noticia
     * @param {string} tipoInteraccion - Tipo de interacción ('marcar_confiable', 'marcar_dudosa', 'compartir')
     * @returns {Promise<Object>} - Resultado de la operación
     */
    async registerInteraction(noticiaId, tipoInteraccion) {
      try {
        const response = await fetch('/api/healthcheck/interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ noticiaId, tipoInteraccion }),
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error registrando interacción:', error);
        throw error;
      }
    }
  };
  
  export default healthcheckService;