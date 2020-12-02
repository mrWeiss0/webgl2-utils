# webgl2-utils

| module |
| :---- |
| [`event`](event/) |
| [`matrix`](matrix/) |
| [`program`](program/) |

| class |
| :---- |
| [`App`](#class-app) |

| function | description |
| :----- | :---------- |
| `async loadFile(url)` | Fetch file from url and but the promise is rejected if response status is not ok |


`class App`
-------------------

Abstract class App

Subclasses must implement update() and draw() methods

| method | description |
| :----- | :---------- |
| `constructor(canvas, timeStep = 0)` | Creates an instance of App and gets the webGL rendering context associated with the canvas |
| `get canvas()` | Get the current canvas |
| `get lag()` | Get the time ahead of update.<br> If time step is non zero, when draw is called lag is the residual time of the frame lower than the time step hence not updated.<br> If time step is variable (`timeStep == 0`) when draw is called lag is always 0. |
| `get timeStep()` | Get the time step |
| `set timeStep(dt)` | Set the time step to a non negative value |
| `getProgram(name)` | Get the instance of ProgramWrapper from the name |
| `getProgramLoader()` | Create a ProgramLoader instance for the current app |
| `initMouse()` | Initialize the mouse event listener for the current canvas |
| `get mouse()` | Get the mouse event handler if present |
| `initKeyboard()` | Initialize the keyboard event listener for the current canvas |
| `get keyboard()` | Get the keyboard event handler if present |
| `run()` | Initialize and run the loop |
| `stop()` | Stop the loop |
| `update(dt)` | Logic update function<br> Called every `timeStep` milliseconds with fixed time step if it is non zero, otherwise it is called every frame with a variable time step.<br><br> `dt` : time elapsed since last update |
| `draw()` | Rendering function called once per frame |
