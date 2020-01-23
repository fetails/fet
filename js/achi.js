class AchiConfig
{
    constructor()
    {
        this.message = "achi v0.2";
        this.clearCol = [0,0,0,1];
        this.showLines = false;
        this.animate = false;
        this.alphaModifier = 0.50;
    }
}

class AchiVertex
{
    constructor(buffer)
    {
        this.vertex = buffer;
    }
}

class AchiShaderExperimental
{
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
    uniform_float(name, val)
    {
        let gl = this.gl;
        gl.uniform1f(gl.getUniformLocation(this.program, name), val);
    }
    uniform_matrix4f(name, val)
    {
        let gl = this.gl;
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name), gl.FALSE, val);
    }
    bind()
    {
        let gl = this.gl;
        gl.useProgram(this.program);
    }
    unbind()
    {
        let gl = this.gl;
        gl.useProgram(null);
    }
}

class Achi
{
    constructor(gl)
    {
        this.gl = gl;
        this.options = new AchiConfig();
    }
    gui()
    {
        let gui = new dat.GUI();
        gui.add(this.options, "message");
        gui.add(this.options, "showLines");
        gui.addColor(this.options, "clearCol");
    }
    clear()
    {
        stats.begin();
        stats.end();
        let gl = this.gl;
        gl.clearColor(this.options.clearCol[0] / 255, this.options.clearCol[1] / 255, this.options.clearCol[2] / 255, this.options.clearCol[3] / 255);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    add(buffer)
    {
        let gl = this.gl;
        this.buffer = buffer.vertex;
        this.vbo = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.buffer), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    begin()
    {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(0);
    }
    end()
    {
        let gl = this.gl;
        gl.disableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    render()
    {
        let gl = this.gl;
        if(this.options.showLines)
            gl.drawArrays(gl.LINE_LOOP, 0, 3);
        else
            gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    del()
    {
        let gl = this.gl;
        gl.deleteBuffer(this.vbo);
    }
};