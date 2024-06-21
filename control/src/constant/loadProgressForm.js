
/**
 * Realiza una solicitud HTTP con seguimiento del progreso de carga.
 * @param {string} url - La URL de destino.
 * @param {object} options - Opciones de configuración para la solicitud.
 * @param {function} onProgress - Función de devolución de llamada para seguimiento del progreso.
 * @returns {Promise<Response>} - Una promesa que se resuelve con la respuesta de la solicitud.
 */

export async function loadFileProgress(url, options = {}, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open(options.method || 'GET', url);
  
      // Establecer los encabezados
      if (options.headers) {
        for (let key in options.headers) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      }
  
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText, headers: xhr.getAllResponseHeaders() }));
        } else {
          reject(new Error(`Error en la solicitud: ${xhr.status}`));
        }
      };
  
      xhr.onerror = () => reject(new Error('Error en la solicitud'));
  
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = onProgress;
      }
  
      xhr.send(options.body);
    });
  }