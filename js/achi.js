class AchiConfig
{
    /**
     * Constructor of AchiConfig.
     * Store all of you're values in here.
     */
    constructor()
    {
        this.message = "achi v0.2";
        this.clearCol = [0,0,0,1];
        this.showLines = false;
        this.animate = false;
        this.alphaModifier = 0.50;
        this.zoom = 25;
    }
}

class AchiVertex
{
   /**
    * 
    * @param {Array} buffer - Set's VBO Data
    * @param {Array} indices - Set's IBO Data
    */
    constructor(buffer, indices)
    {
        this.vertex = buffer;
        this.indices = indices;
    }
}

class AchiColor
{
    /**
     * 
     * @param {number} red - Color RED
     * @param {number} green - Color GREEN
     * @param {number} blue - Color BLUE
     * @param {number} alpha - Color ALPHA
     */
    constructor( red, green, blue, alpha )
    {
        this.r = red / 255;
        this.g = green / 255;
        this.b = blue / 255;
        this.a = alpha / 255;
    }
}

class AchiShaderExperimental
{
    /**
     * 
     * @param {Array} vertex - This is an experimental shader structure. Do not use.
     */
    constructor(vertex)
    {
        let gl = ogl;
        this.vdata = vertex;
        let vs = gl.createShader(ogl.VERTEX_SHADER);
        ogl.shaderSource(vs, vertex);
        ogl.compileShader(vs);
        if(!ogl.getShaderParameter(vs, ogl.COMPILE_STATUS))
        {
            console.log("error.");
        }
    }
}

class AchiShader
{
    /**
     * 
     * @param {string} vertex - Vertex Shader Source
     * @param {string} fragment - Fragment Shader Source
     */
    constructor(vertex, fragment)
    {
        this.gl = ogl;
        let gl = this.gl;
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
        gl.compileShader(fs);
        let prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.validateProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        this.program = prog;
    }
    /**
     * 
     * @param {string} name - Target location in shader.
     * @param {number} val - Value to modify.
     */
    uniform_float(name, val)
    {
        let gl = this.gl;
        gl.uniform1f(gl.getUniformLocation(this.program, name), val);
    }
    /**
     * 
     * @param {string} name - Target location in shader.
     * @param {number} val - Value to modify.
     */
    uniform_matrix4f(name, val)
    {
        let gl = this.gl;
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name), gl.FALSE, val);
    }
    /**
     * Call this to bind our shader.
     */
    bind()
    {
        let gl = this.gl;
        gl.useProgram(this.program);
    }
    /**
     * Call this to unbind our shader.
     */
    unbind()
    {
        let gl = this.gl;
        gl.useProgram(null);
    }
}

class Achi
{
    /**
     * 
     * @param {Any} gl - WebGL Context.
     */
    constructor(gl)
    {
        this.gl = gl;
        this.options = new AchiConfig();
    }
    /**
     * Render Dat GUI.
     */
    gui()
    {
        let gui = new dat.GUI();
        gui.add(this.options, "message");
        gui.add(this.options, "showLines");
        gui.addColor(this.options, "clearCol");
        gui.add(this.options, "zoom");
    }
    /**
     * Tell's WebGL to clear our screen.
     */
    clear()
    {
        stats.begin();
        stats.end();
        let gl = this.gl;
        gl.clearColor(this.options.clearCol[0] / 255, this.options.clearCol[1] / 255, this.options.clearCol[2] / 255, this.options.clearCol[3] / 255);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.DEPTH_TEST);
    }
    /**
     * 
     * @param {AchiVertex} buffer - Add's a new AchiVertex buffer.
     */
    add(buffer)
    {
        let gl = this.gl;
        this.indices = buffer.indices;
        this.buffer = buffer.vertex;
    }
    /**
     * Create's VBO & IBO Data, ready to Render.
     */
    create()
    {
        let gl = this.gl;
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.buffer), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /**
     * Render's an example rectangle.
     * @param {number} x - X Position of quad
     * @param {number} y - Y Position of quad
     * @param {number} w - W Width of quad
     * @param {number} h - H Height of quad
     */
    quad(x, y, w, h)
    {
        this.add(new AchiVertex([
            x, y + h, 0.0,
            x + w, y + h, 0.0,
            x + w, y, 0.0,
            x, y, 0.0
        ], [ 
            0, 1, 2,
            3, 0, 2
        ]));
    }
    /**
     * Render's an example 3D rectangle.
     */
    cube3D()
    {
        this.add(new AchiVertex(
            [
                -1.0, 1.0, -1.0,   
                -1.0, 1.0, 1.0,    
                1.0, 1.0, 1.0,     
                1.0, 1.0, -1.0,    
        
                // Left
                -1.0, 1.0, 1.0,    
                -1.0, -1.0, 1.0,   
                -1.0, -1.0, -1.0,  
                -1.0, 1.0, -1.0,   
        
                // Right
                1.0, 1.0, 1.0,    
                1.0, -1.0, 1.0,   
                1.0, -1.0, -1.0,  
                1.0, 1.0, -1.0,   
        
                // Front
                1.0, 1.0, 1.0,    
                1.0, -1.0, 1.0,   
                -1.0, -1.0, 1.0,   
                -1.0, 1.0, 1.0,    
        
                // Back
                1.0, 1.0, -1.0,    
                1.0, -1.0, -1.0,   
                -1.0, -1.0, -1.0,  
                -1.0, 1.0, -1.0,   
        
                // Bottom
                -1.0, -1.0, -1.0,  
                -1.0, -1.0, 1.0,   
                1.0, -1.0, 1.0,    
                1.0, -1.0, -1.0
                ], [
                0, 1, 2,
                0, 2, 3,
        
                // Left
                5, 4, 6,
                6, 4, 7,
        
                // Right
                8, 9, 10,
                8, 10, 11,
        
                // Front
                13, 12, 14,
                15, 14, 12,
        
                // Back
                16, 17, 18,
                16, 18, 19,
        
                // Bottom
                21, 20, 22,
                22, 20, 23
                ]
        ));
    }
    /**
     * Begin's our rendering process.
     */
    begin()
    {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        // vec3 -> 3.
        gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(0);
    }
    /**
     * End's our rendering process.
     */
    end()
    {
        let gl = this.gl;
        gl.disableVertexAttribArray(0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    /**
     * Tell's WebGL to render all of our elements that we've pushed.
     */
    render(len = this.indices.length)
    {
        let gl = this.gl;
        if(this.options.showLines)
            gl.drawElements(gl.LINE_LOOP, len, gl.UNSIGNED_SHORT, 0);
        else
            gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
    }
    /**
     * Delete's the VBO & IBO buffer.
     */
    del()
    {
        let gl = this.gl;
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ibo);
    }
};