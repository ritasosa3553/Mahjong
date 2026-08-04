<div align="center">

# 🀄 Mahjong Solitario

**Empareja fichas libres y despeja el tablero. Un clásico de concentración y paciencia, directo en tu navegador.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*Sin dependencias ni instalaciones. Solo abre `index.html` y juega.* ✨

</div>

---

## 🎮 ¿De qué trata el juego?

Es un **Mahjong Solitaire** clásico: en el tablero hay **144 fichas** apiladas en 5 capas formando la silueta de una tortuga 🐢.

El objetivo es **vaciar el tablero** emparejando fichas con el mismo símbolo. Solo puedes retirar una ficha si está **libre**:

- ✅ No tiene ninguna ficha encima.
- ✅ Está libre por el lado izquierdo **o** por el derecho (no por ambos).

¡Concentración, memoria y un poco de estrategia son la clave! 🧠

---

## 🚀 Cómo jugar

1. **Elige tus fichas** 🎨 — Antes de cada partida se abre un selector: marca los emojis y caracteres chinos que quieras usar. Las 144 fichas se reparten en **72 pares** entre los símbolos elegidos (mínimo 2). Cuantos más elijas, más variedad; cuantos menos, más repeticiones y partidas más fáciles de reconocer.

2. **Haz clic en una ficha libre** para seleccionarla y después en **otra ficha libre con el mismo símbolo** para eliminarlas como pareja. 🖱️

3. **Vacía el tablero** 🏆 — Elimina todas las fichas antes de quedarte sin movimientos.

> 💡 **Tip:** los pares disponibles se marcan al usar la **Pista** 📌, y si te bloqueas siempre puedes **Barajar** 🔀.

---

## 🕹️ Controles

| Botón | Función |
| ----- | ------- |
| **Nueva** | Abre el selector para comenzar una nueva partida |
| **Deshacer** ↩️ | Revierte tu último movimiento |
| **Barajar** 🔀 | Remezcla las fichas restantes (cuenta las barajadas) |
| **Pista** 📌 | Ilumina un par de fichas disponible |
| **Guardar** 💾 | Guarda la partida actual |
| **Cargar** 📂 | Restaura la partida guardada |
| **🔊 / 🔇** | Activa o silencia el sonido |
| **− / +** 🔍 | Ajusta el tamaño de las fichas (zoom) |
| **Tema** 🎨 | Cambia el aspecto visual del juego |

### 📊 Marcadores
- **Pares** — pares restantes sobre el total.
- **Tiempo** ⏱️ — cronómetro de la partida.
- **Barajadas** 🔀 — número de veces que barajaste.

---

## 📱 Móvil

En pantallas pequeñas el menú se oculta durante la partida para dejar todo el espacio al tablero. Toca el botón flotante **☰** para abrir los controles (Pista, Nueva, etc.) cuando los necesites.

---

## 🎨 Temas

| Tema | Estilo |
| ---- | ------ |
| ☀️ **Claro** | Minimalista luminoso |
| 🌙 **Oscuro** | Minimalista oscuro |
| 🌌 **Noche** | Morado nocturno |
| 🀄 **Clásico** | Fondo verde de mesa de mahjong |
| 🪵 **Madera** | Calidez de madera |

El tema, el zoom, el sonido, la selección de fichas y tu partida guardada se **recuerdan** entre sesiones. 💾

---

## 🛠️ Detalles técnicos

- **Tecnologías:** HTML, CSS y JavaScript puro (sin frameworks ni librerías externas).
- **Tablero:** layout clásico de tortuga (144 posiciones, 5 capas).
- **Reparto garantizado:** el tablero se genera con un algoritmo de búsqueda con retroceso (backtracking) que asegura que siempre haya una solución. ✅
- **Guardado:** se usa `localStorage` del navegador.
- **Sonido:** efectos generados con la Web Audio API.

### ▶️ Cómo ejecutarlo
Abre `index.html` en cualquier navegador moderno. No se requiere servidor ni instalación.

---

<div align="center">

Hecho con ❤️ y mucha paciencia.

¡Que tengas buena partida! 🍀

</div>
