document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sound = new Audio('assets/sounds/click-sound.mp3');
    
    // Verifica si el sonido está silenciado al cargar la página
    const soundToggleButton = document.getElementById('sound-toggle');
    let isMuted = localStorage.getItem('isMuted') === 'true'; // Estado inicial

    // Función para actualizar el estado del botón y el audio
    function updateSoundState() {
        if (isMuted) {
            soundToggleButton.textContent = 'Activar sonido';
        } else {
            soundToggleButton.textContent = 'Silenciar';
        }
    }

    // Llamada inicial para establecer el texto del botón basado en el estado guardado
    updateSoundState();

    // Añadir un evento para alternar el estado de sonido
    soundToggleButton.addEventListener('click', function () {
        // Alternar estado de silenciado
        isMuted = !isMuted;
        localStorage.setItem('isMuted', isMuted.toString()); // Guardar en localStorage

        // Actualizar el texto del botón
        updateSoundState();

        // Aplicar el estado de mutear/activar el sonido en la página actual
        if (isMuted) {
            sound.muted = true;
        } else {
            sound.muted = false;
        }
    });

    // Función para reproducir sonido y redirigir
    function playSoundAndRedirect(url) {
        if (!prefersReducedMotion && !isMuted) {
            sound.play();
        }
        setTimeout(() => {
            window.location.href = url;
    
            // Enviar un mensaje al lector de pantalla que el contenido ha cambiado
            const screenAlert = document.getElementById('screen-alert');
            screenAlert.textContent = "La postal se ha enviado correctamente.";
    
            // Dar enfoque al contenedor para que el lector de pantalla lo lea
            screenAlert.focus();
        }, 300);
    }
    

    // Sonido al hacer clic en enlaces del menú o navegación
    document.querySelectorAll('a[href="index.html"], a[href="postal.html"], a[href="send.html"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            playSoundAndRedirect(link.href);
        });
    });

    // Postal.html: Imagen seleccionada visualmente
    const imageInputs = document.querySelectorAll('input[name="postal_image"]');
    if (imageInputs.length) {
        imageInputs.forEach(input => {
            input.addEventListener('change', function () {
                document.querySelectorAll('label[for^="img"] img').forEach(img => {
                    img.classList.remove('img-option-selected');
                });
                const selectedLabel = document.querySelector(`label[for="${this.id}"] img`);
                selectedLabel.classList.add('img-option-selected');

                if (!prefersReducedMotion && !isMuted) {
                    sound.play();
                }
            });
        });

        // Marcar visualmente la imagen seleccionada por defecto al cargar
        const checkedInput = document.querySelector('input[name="postal_image"]:checked');
        if (checkedInput) {
            const img = document.querySelector(`label[for="${checkedInput.id}"] img`);
            if (img) img.classList.add('img-option-selected');
        }
    }

    // Postal.html: Sonido al enviar formulario + redirección
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            if (!form.reportValidity()) {
                e.preventDefault(); // El navegador mostrará errores
                return;
            }
            e.preventDefault(); // Evitamos envío inmediato
            if (!prefersReducedMotion && !isMuted) {
                sound.play();
            }
            setTimeout(() => {
                window.location.href = "send.html";
            }, 300);
        });
    }
});
