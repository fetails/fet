var init_webgl = function()
            {
                var canv = document.getElementById("webglex");
                var GL = canv.getContext("webgl2");
                if(!GL)
                {
                    document.getElementById("welcome").innerHTML += "<br />Sorry, but your browser does not support WebGL 2.";
                };
    
                let clr = new ColRGB(102, 184, 130);
                let lineclr = new ColRGB(65, 65, 65);
                GL.clearColor(clr.r, clr.g, clr.b, 1);
                GL.clear(GL.COLOR_BUFFER_BIT | GL.COLOR_DEPTH_BUFFER_BIT );
                GL.viewport(0, 0, canv.width, canv.height);
                let strides = new vertex_t();
                let vertex_buffer = GL.createBuffer();
    
                GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
               
                // Använd Float32Array from WebASM/WebAssembly->WebKIT
                GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(strides.verts), GL.STATIC_DRAW);
                console.log("[WebGL] Buffer data has been bound.");
    
                // Av-bind buffern. (Un-Bind)
                GL.bindBuffer(GL.ARRAY_BUFFER, null);
    
                // ----- IBO ------ //
    
                let index_buffer = GL.createBuffer();
    
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
    
                // Typ samma princip som ovanför, fast att vi använder unsigned int ist för float.
                GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(strides.indexes), GL.STATIC_DRAW);
    
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    
                // Draw.
                var vertCode =
                '#version 300 es\n' +
                'in vec3 coords;\n' +
                'out vec3 send_coords;\n' +
                '\n' +
                'void main() {\n' +
                   ' gl_Position = vec4(coords, 1.0);\n' +
                   ' send_coords = coords;\n' +
                '}';
    
                var fragCode =
                '#version 300 es\n'+
                'precision mediump float;\n'+
                '\n' +
                'out vec4 outColor;  // you can pick any name\n' +
                'in vec3 send_coords;\n' +
                '\n'+
                'void main() {\n'+
                '    outColor = vec4(send_coords.x + 0.25, send_coords.y + 0.25, 0.75, 1);\n'+
                '}\n';
    
                let shady = new shader_t(GL, vertCode, fragCode);
                
                GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
                GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
                GL.enableVertexAttribArray(0);
               
                GL.useProgram(shady.program);
                GL.drawElements(GL.TRIANGLES, strides.indexes.length, GL.UNSIGNED_SHORT, 0);
                GL.useProgram(null);
                
                GL.disableVertexAttribArray(null);
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
                GL.bindBuffer(GL.ARRAY_BUFFER, null);
    
            };