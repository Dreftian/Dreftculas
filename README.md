# Dreftculas - High Performance Particle Engine

![Dreftculas Banner](assets/banner.png)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Performance](https://img.shields.io/badge/Performance-High-brightgreen.svg)](#-caracteristicas)
[![Open Source](https://img.shields.io/badge/Open%20Source-Public-orange.svg)](#-contribucion)

**Un motor de animacion de texto basado en particulas, optimizado para la web moderna.**  
*Transforma palabras en flujos dinamicos de energia con precision y fluidez.*

</div>

---

## Descripcion

**Dreftculas** es una biblioteca ligera de JavaScript que utiliza el poder de HTML5 Canvas para crear animaciones de texto hipnoticas. Las particulas no solo forman palabras, sino que "viven" en un estado de flujo constante, morphing de una esfera geometrica a un texto legible con transiciones suaves y fisicas realistas.

Este proyecto ha sido disenado pensando en el rendimiento, permitiendo manejar hasta **14,000+ particulas** simultaneamente sin comprometer la tasa de frames.

---

## Caracteristicas Principales

- **Motor de Morphing Dinamico**: Transiciones fluidas entre estados (Esfera <-> Texto).
- **Optimizacion Inteligente**: Ajuste automatico del conteo de particulas y tamano de fuente segun la resolucion del dispositivo.
- **Soporte High-DPI**: Renderizado nitido en pantallas Retina y 4K mediante escalado de DPR (devicePixelRatio).
- **Envoltura de Texto Avanzada**: Soporta oraciones largas y palabras complejas con un sistema de wrapText personalizado.
- **Interaccion en Tiempo Real**:
  - Enter: Aplica el nuevo texto instantaneamente.
    - Escape: Limpia la pantalla y regresa al estado de reposo.
    - **Rendimiento de Grado Profesional**: Implementacion eficiente en Vanilla JS, sin dependencias externas.

    ---

    ## Tecnologias

    - **Lenguaje**: JavaScript (ES6+)
    - **Renderizado**: HTML5 Canvas API (2D Context)
    - **Tipografia**: Inter / Sans-serif
    - **Estilos**: CSS3 Moderno (Glassmorphism & Gradients)

    ---

    ## Instalacion y Uso

    1. **Clona el repositorio**:
       ```bash
          git clone https://github.com/Dreftian/Dreftculas.git
             ```

             2. **Abre el proyecto**:
                Simplemente abre index.html en tu navegador favorito.

                3. **Personalizacion**:
                   Puedes ajustar las constantes de rendimiento en script.js:
                      ```javascript
                         let COUNT = 14000; // Ajusta segun la potencia deseada
                            ```

                            ---

                            ## Contribucion

                            Las contribuciones son lo que hacen a la comunidad de codigo abierto un lugar increible para aprender, inspirar y crear!

                            1. Dale una Star al proyecto
                            2. Haz un Fork del proyecto
                            3. Crea tu Feature Branch (git checkout -b feature/AmazingFeature)
                            4. Haz Commit de tus cambios (git commit -m 'Add some AmazingFeature')
                            5. Haz Push a la rama (git push origin feature/AmazingFeature)
                            6. Abre un Pull Request

                            ---

                            ## Licencia

                            Distribuido bajo la Licencia MIT. Consulta LICENSE para mas informacion.

                            ---

                            <div align="center">

                            Desarrollado con amor por [Dreftian](https://github.com/Dreftian)

                            </div>
                            
