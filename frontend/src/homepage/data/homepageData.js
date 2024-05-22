export const homepageData = async () => {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/stela-editor/list_content_all/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de la página de inicio');
        }

        const data = await response.json();

        let isEmpty = true;
        for (const [key, value] of Object.entries(data)) {
            if (value.length > 0) {
                isEmpty = false;
                break;
            }
        }

        // Devolver null si está vacío
        if (isEmpty) {
            console.warn("Advertencia: No hay datos disponibles para la página de inicio.");
            return null;
        }

        // Organizar los datos por sección
        const homepageData = {};
        for (const [key, value] of Object.entries(data)) {
            homepageData[key] = value;
        }

        return homepageData;
    } catch (error) {
        console.error("Error al obtener los datos de la página de inicio:", error);
        return null; // O manejar el error de otra manera
    }
};