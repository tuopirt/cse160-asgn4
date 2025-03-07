class Cube{
    constructor(){
      this.type = 'cube';
      this.color = [1.0,1.0,1.0,1.0];
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -2;
    }

    
    render(){

      var rgba = this.color;

      //pass the texture num
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      this.normalMatrix.setInverseOf(this.matrix).transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      //this is for texture
      //front
      //drawTriangle3DUVNormal( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0 ], [0,0,-1, 0,0,-1, 0,0,-1] );
      //drawTriangle3DUVNormal( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1 ], [0,0,-1, 0,0,-1, 0,0,-1] );
      



      // // Front of Cube
      // drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0],[0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
      // drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0],[0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
      drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
      drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

      // // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      // // Top
      // drawTriangle3DUVNormal([1,1,0, 1,1,1, 0,1,0],[1,0, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);
      // drawTriangle3DUVNormal([0,1,1, 1,1,1, 0,1,0],[0,1, 1,1, 0,0], [0,1,0, 0,1,0, 0,1,0]);
      drawTriangle3DUVNormal([0,1,0, 1,1,0, 1,1,1], [0,0, 1,0, 1,1], [0,1,0, 0,1,0, 0,1,0]);
      drawTriangle3DUVNormal([0,1,0, 1,1,1, 0,1,1], [0,0, 1,1, 0,1], [0,1,0, 0,1,0, 0,1,0]);

      // // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      // // Right
      // drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1],[0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
      // drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1],[0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);
      drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1], [0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);
      drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 0,1], [1,0,0, 1,0,0, 1,0,0]);

      // // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
      // // Left
      // drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1],[1,0, 0,0, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
      // drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1],[1,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
      drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
      drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);

      // // gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
      // // Bottom
      // drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0],[0,1, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
      // drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1],[0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
      drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
      drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

      // // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
      // // Back
      // drawTriangle3DUVNormal([1,0,1, 0,0,1, 0,1,1],[0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
      // drawTriangle3DUVNormal([1,0,1, 1,1,1, 0,1,1],[0,1, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
      drawTriangle3DUVNormal([0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
      drawTriangle3DUVNormal([0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1]);

      // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);



      // // Front face
      // drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
      // drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

      // // Back face
      // drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1]);
      // drawTriangle3DUV([0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 0,1]);

      // // Top face
      // drawTriangle3DUV([0,1,0, 1,1,0, 1,1,1], [0,0, 1,0, 1,1]);
      // drawTriangle3DUV([0,1,0, 1,1,1, 0,1,1], [0,0, 1,1, 0,1]);

      // // Bottom face
      // drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
      // drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);

      // // Left face
      // drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 0,1]);
      // drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [0,0, 1,0, 1,1]);

      // // Right face
      // drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0,0, 1,0, 1,1]);
      // drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 0,1]);


    }

    renderfast(){
      
      var rgba = this.color;

      //pass the texture num
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      var allverts = [];
      var alluv = [];

      // Front face
      allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
      alluv = alluv.concat( [0,0, 1,1, 1,0]);
      allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);
      alluv = alluv.concat( [0,0, 0,1, 1,1]);

      // Back face
      allverts = allverts.concat([0,0,1, 1,0,1, 1,1,1]);
      alluv = alluv.concat( [0,0, 1,0, 1,1]);
      allverts = allverts.concat([0,0,1, 1,1,1, 0,1,1]);
      alluv = alluv.concat( [0,0, 1,1, 0,1]);

      // Top face
      allverts = allverts.concat([0,1,0, 1,1,0, 1,1,1]);
      alluv = alluv.concat( [0,0, 1,0, 1,1]);
      allverts = allverts.concat([0,1,0, 1,1,1, 0,1,1]);
      alluv = alluv.concat( [0,0, 1,1, 0,1]);

      // Bottom face
      allverts = allverts.concat([0,0,0, 1,0,1, 1,0,0]);
      alluv = alluv.concat( [0,0, 1,1, 1,0]);
      allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);
      alluv = alluv.concat( [0,0, 0,1, 1,1]);

      // Left face
      allverts = allverts.concat([0,0,0, 0,1,1, 0,0,1]);
      alluv = alluv.concat( [0,0, 1,1, 0,1]);
      allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1]);
      alluv = alluv.concat( [0,0, 1,0, 1,1]);

      // Right face
      allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);
      alluv = alluv.concat( [0,0, 1,0, 1,1]);
      allverts = allverts.concat([1,0,0, 1,1,1, 1,1,0]);
      alluv = alluv.concat( [0,0, 1,1, 0,1]);

      drawTriangle3DUV(allverts, alluv);
    }
  }
