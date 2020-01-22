class ColRGB
            {
                constructor(red, green, blue)
                {
                    this.r = red / 255;
                    this.g = green / 255;
                    this.b = blue / 255;
                }
            }
    
            // Skapar IBO & VBO Objekt.
            class vertex_t
            {
                constructor()
                {
                    this.verts = [
                        0.0, 0.5, 0.0,
                        -0.5, -0.5, 0.0,
                        0.5, -0.5, 0.0
                    ];
    
                    this.indexes = [
                        0, 1, 2
                    ];
                }
            }
    
            class shader_t
            {
                constructor(gl, vertexC, fragmentC)
                {
                    this.vertex = gl.createShader(gl.VERTEX_SHADER);
                    this.fragment = gl.createShader(gl.FRAGMENT_SHADER);
    
                    gl.shaderSource(this.vertex, vertexC);
                    gl.shaderSource(this.fragment, fragmentC);
    
                    gl.compileShader(this.vertex);
                    if(!gl.getShaderParameter(this.vertex, gl.COMPILE_STATUS))
                    {
                        console.log("[WebGL] Error compiling vertex: ", gl.getShaderInfoLog(this.vertex));
                    };
    
                    gl.compileShader(this.fragment);
                    if(!gl.getShaderParameter(this.fragment, gl.COMPILE_STATUS))
                    {
                        console.log("[WebGL] Error compiling fragment: ", gl.getShaderInfoLog(this.fragment));
                    };
    
                    let program = gl.createProgram();
                    gl.attachShader(program, this.vertex);
                    gl.attachShader(program, this.fragment);
                    gl.linkProgram(program);
                    gl.validateProgram(program);
                    gl.deleteShader(this.vertex);
                    gl.deleteShader(this.fragment);
    
                    this.program = program;
    
                    console.log("[WebGL] Created shaders.");
                }
            }