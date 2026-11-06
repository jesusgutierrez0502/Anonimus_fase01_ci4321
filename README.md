 # Proyecto Fase
Juego en 3D hecho con WebGL2 y TypeScript. Un tanque sobre un campo plano dispara un proyectil a la vez contra tres objetivos que flotan sobre el suelo.

## Integrantes

Jesús Gutiérrez

## Requisitos

- Node.js 18 o superior
- npm
- Un navegador con soporte de WebGL2

## Cómo correrlo

1. Instalar las dependencias:

   ```
   npm install
   ```

2. Iniciar el servidor de desarrollo:

   ```
   npm run dev
   ```

3. Abrir `http://localhost:5173` en el navegador.

## Controles

| Tecla         | Acción                                          |
| ------------- | ----------------------------------------------- |
| `←` `→`       | Mover la torreta a izquierda y derecha          |
| `↑` `↓`       | Subir y bajar el ángulo del cañón (5° a 90°)    |
| `1` `2` `3`   | Elegir el nivel de fuerza                       |
| `F`           | Pasar al siguiente nivel de fuerza              |
| `Espacio`     | Disparar, solo si la bala está disponible       |
| `R`           | Reiniciar el juego                              |

El nivel de fuerza se ve en las tres barras de la cara trasera del cuerpo de la torreta. El nivel *n* enciende las *n* barras inferiores.


## Estructura

```
index.html            página
src/main.ts           contexto WebGL, cámara, luz y game loop
src/scene.ts          escena: suelo, torreta, objetivos y bala
src/tank.ts           torreta: jerarquía, movimiento, elevación e indicador de fuerza
src/projectile.ts     bala: lanzamiento, vuelo y colisiones
src/physics.ts        fórmula de la trayectoria parabólica
src/target.ts         objetivo
src/scene-node.ts     nodo del árbol de jerarquía
src/mesh.ts           buffers y VAO de cada primitiva
src/geometry.ts       generación de cubo, esfera y cilindro
src/input.ts          teclado
src/constants.ts      valores de ajuste
src/vendor/ff/        FF (solo lectura, no se modifica)
``
