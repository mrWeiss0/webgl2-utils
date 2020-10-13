# event

| class |
| :---- |
| [`EventHandler`](#class-eventhandler) |
| [`KeyboardEventHandler extends EventHandler`](#class-keyboardeventhandler-extends-eventhandler) |
| [`MouseEventHandler extends EventHandler`](#class-mouseeventhandler-extends-eventhandler) |

`class EventHandler`
--------------------

This class implements an Observable event handler for different event types.
Observers can register to an handler and must implement a method for each
type of event they want to observe, with the name of the event type.

| method | description |
| :----- | :---------- |
| `constructor(target, ...types)` | Creates an instance listening on `target` to events of the given `types` |
| `get enabled()` | If it's true the instance is listening to events and will notify observer, otherwise incoming events are ignored |
| `set enabled(en)` | Set the enabled flag |
| `register(ob)` | Register an observer |
| `unregister(ob)` | Unregister the observer if it was previously registered |

`class KeyboardEventHandler extends EventHandler`
----------------------------------------------

Listens to the following keyboard events:
`keydown`, `keyup`, `blur`.
Target must be able to get keyboard focus, for example having `tabIndex >= 0`.

The object stores the state of the pressed keys
accessible with the `key` method.

| method | description |
| :----- | :---------- |
|`constructor(target)` | Create a new instance listening on `target` |
|`key(code)` | Return true if the specified key is currently pressed.<br> Keys are identified by the key code as in standard `KeyboardEvent.code` |

`class MouseEventHandler extends EventHandler`
-------------------------------------------------

Listens to the following mouse events:
`click`, `dblclick`, `auxclick`, `mousedown`, `mouseup`, `mousemove`, `contextmenu`, `wheel`, `mouseenter`, `mouseleave`.

The object stores the state of the pressed `buttons`
and mouse position `x` and `y`, corresponding to
`MouseEvent.offsetX` and `MouseEvent.offsetY`.

Property `hideMenu` can be set to true to prevent
context menu from showing on `contextmenu` event.

| method | description |
| :----- | :---------- |
| `constructor(target)` | Create a new instance listening on `target` |
| `get x()` | The current mouse X coordinate relative to target |
| `get y()` | The current mouse Y coordinate relative to target |
| `get buttons()` | The currently pressed buttons represented as in `MouseEvent.buttons` |
| `get hideMenu()` | If true, the context menu won't show up when `contextmenu` events are fired. Observers are still notified of the event |
| `set hideMenu(hide)` | Set the hideMenu property |
| `setCursor(cur)` | Change the css property `cursor` of target |

