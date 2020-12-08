# program

| class |
| :---- |
| [`ProgramWrapper`](#class-programwrapper) |
| [`ProgramLoader`](#class-programloader) |

`class ProgramWrapper`
-------------------

This class wraps a WebGLProgram
and stores its attributes and uniforms

| method | description |
| :----- | :---------- |
| `constructor(glContext, name)` | Create a webgl program from the given webgl context and sets a name |
| `get glContext()` | Get the webgl context associated with the program |
| `get glProgram()` | Get the WebGLProgram instance referenced by this object |
| `get name()` | Get the name of this program |
| `use()` | Use this program for rendering |
| `getAttributeLocation(name)` | Return the location for the requested attribute name |
| `getUniformLocation(name)` | Return the location for the requested uniform name |
| `getUniformBlockIndex(name)` | Return the index for the requested uniform block name |
| `uniformBlockBinding(name, index)` | Call `gl.uniformBlockBinding` to bind uniform block to given index |
| `queryAttributes()` | Query the GPU for all the attributes of the current program and stores the data |
| `queryUniforms()` | Query the GPU for all the uniforms of the current program and stores the data |
| `queryUniformBlocks()` | Query the GPU for all the uniform blocks of the current program and stores the data |

`class ProgramLoader`
-------------------

This class loads the shaders and creates the programs

<table>
<tr style="text-align:left;"><th> method </th><th> description </th></tr>
<tr><td> <code>constructor(app)</code> </td><td> Create an instance that references the given app </td></tr>
<tr><td> <code>async loadShader(url, type, name=url)</code> </td><td> Create and compile a shader loading the source code from url<br> Fails if the shader name is already taken </td></tr>
<tr><td> <code>addShaderSource(src, type, name)</code> </td><td> Create and compile a shader with the given source code<br> Fails if the shader name is already taken </td></tr>
<tr><td> <code>addProgram(name, shaderNames)</code> </td><td> Create a program in the app object, attach the shaders with the given names, link the program and detach the sahders.<br> Fails if the specified name is already taken in the app object or if a shader needed is not present </td></tr>
<tr><td> <code>async loadFromJSON(url)</code> </td><td> Load a json from url and uses it to load shaders and programs. calling loadFromObject method </td></tr>
<tr><td><code>async loadFromObject(obj)</code></td>
<td>Load shaders and programs from an object with the following structure:  
<pre lang="js">
{
  path     : "path/to/shaders",
  shaders  : [ { type : "VERTEX_SHADER", url : "vertex.glsl" }, ... ],
  programs : [ { name : "myProg", shaders : ["vertex.glsl", "fragment.glsl"] }, ... ]
}
</pre>
Fails if a shader can't be loaded</td></tr>
<tr><td> <code>deleteShaders()</code> </td><td> Call deleteShader for every shader previously loaded </td></tr>
<tr><td> <code>checkShaders()</code> </td><td> Check all shaders for compile errors Log the shader info log in the console. Return the number of compile errors.<br> Useful only for debug </td></tr>
<tr><td> <code>checkPrograms()</code> </td><td> Check all programs of this loader for link errors Log the program info log in the console. Return the number of link errors.<br> Useful only for debug </td></tr>
<tr><td> <code>validatePrograms()</code> </td><td> Validate all programs of this loader and check for errors Log the program info log in the console. Return the number of errors.<br> Useful only for debug </td></tr>
</table>
