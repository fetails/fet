let config = function()
{
    this.version = "v0.3 - unstable";
    this.clear_color = [20, 20, 20, 1.0];
    this.modifier = 0.00;
    this.zoom = -5;
    this.draw_lines = false;
};

let AchiObject = function(url = "john.doe")
{
    return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function()
            {
                if(this.status >= 200 && this.status < 300)
                {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }                        
            };
            xhr.onerror = function()
            {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
};

let AchiNormalObject = async function(url, cb)
{
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function()
    {
        if(xhr.status < 200 || xhr.status > 299)
        {
            cb("error.");
        } else {
            cb(null, xhr.responseText);
        }
    };
    xhr.send();
}
class AchiShader
{
    /**
    * @param {AchiObject} vertex - Path to vertex shader
    * @param {AchiObject} fragment - Path to fragment shader
    * @param {Achi} achi - Achi Context
    */
    constructor(achi, vertex, fragment)
    {
        this.gl = achi.gl;
        let vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vs, vertex);
        this.gl.compileShader(vs);
        let fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fs, fragment);
        this.gl.compileShader(fs);
        let prog = this.gl.createProgram();
        this.gl.attachShader(prog, vs);
        this.gl.attachShader(prog, fs);
        
        this.gl.linkProgram(prog);
        this.gl.validateProgram(prog);
        
        this.gl.deleteShader(vs);
        this.gl.deleteShader(fs);
        this.program = prog;
    }
    /**
    * Bind's the shader
    */
    begin()
    {
        this.gl.useProgram(this.program);
    }
    /**
    * Unbind's the shader
    */
    end()
    {
        this.gl.useProgram(null);
    }
    uniform_mat4(name, val)
    {
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, val);
    }
    send_float(name, val)
    {
        let sender = val;
        this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), sender);
    }
    
}
class AchiBuffer
{
    constructor(vertices, indices)
    {
        this.vertices = vertices;
        this.indices = indices;
    }
}
class Achi
{
    /**
    * @param {string} canvasId - Canvas ID
    */
    constructor(canvasId, fix_screen = true)
    {
        this.canvas = document.querySelector(canvasId);
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.buffer = [];
        this.indices = [];
        this.gl = this.canvas.getContext("webgl2");
        if(!this.gl)
        {
            alert("[Achi] Error! Your browser does not support WebGL2. :(");
            return;
        };
       
       // === Dat GUI === //
        this.config = new config();
        let gui = new dat.GUI();
        
        gui.add(this.config, "version");
        gui.addColor(this.config, "clear_color");
        gui.add(this.config, "draw_lines");
        gui.add(this.config, "zoom");
        if(fix_screen)
        {
            window.addEventListener("resize", () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            });
        }
    }
    /**
    * Clear's the screen.
    */
    clear()
    {
        this.gl.clearColor(this.config.clear_color[0] / 255, this.config.clear_color[1] / 255, this.config.clear_color[2] / 255, this.config.clear_color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
    * Begin's the render sequence
    */
    begin()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, this.gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.enableVertexAttribArray(0);
    }
    /**
    * End's the render sequence
    */
    end()
    {
        this.gl.disableVertexAttribArray(0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    /**
    * @param {AchiBuffer} achiBuffer - AchiBuffer -> Store vertices & indices.
    */
    buff(achiBuffer)
    {
        this.buffer.push(achiBuffer.vertices);
        this.indices.push(achiBuffer.indices);
    }
    /**
    * Create's the VBO & IBO to store data which we will later use to draw our elements.
    */
    create(show_example = false)
    {
        
        if(show_example)
        {
            this.buff(new AchiBuffer([
                0.0, 0.0, 0.0,
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0
            ],[
                0, 1, 2,
                1, 2, 3
            ]));
        };
        this.sorted_indices = [].concat.apply([], this.indices);
        this.sorted_buffers = [].concat.apply([], this.buffer);
        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.sorted_buffers), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.ibo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.sorted_indices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /**
    * Render's our elements.
    */
    render()
    {
        this.gl.drawElements(this.config.draw_lines == true ? this.gl.LINE_LOOP : this.gl.TRIANGLES, this.sorted_indices.length, this.gl.UNSIGNED_SHORT, 0);
        //this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
}

function replaceStr(str, find, replace) {
    for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'gi'), replace[i]);
    }
    return str;
}

let loadObj = async function()
{
    let file = await AchiObject("vendor/obj/cube.obj");
    let spl = file;

    let find = ["v", "vn", "n", "f", "//", " "];
    let replace = ["", "", "", "", ",", " "];
    spl = replaceStr(spl, find, replace);

    console.log(spl);
};