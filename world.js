// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_NormalMatrix;
    void main() {
       gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
       v_UV = a_UV;
       //v_Normal = a_Normal;
       v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
       v_VertPos = u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1; //more textures added later on
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_whichTexture;
    uniform vec3 u_lightPos;
    uniform vec3 u_cameraPos;
    varying vec4 v_VertPos;
    uniform bool u_lightON;
    void main() {

      if (u_whichTexture == -3) {
        gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);                 //use normal
      } else if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;                           //use color
      } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);                 //use uv debug color
      } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);                 //use texture               DUP       //sky
      } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);         //ground
      }else if (u_whichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);         //wall
      }else if (u_whichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);         //diamond
      }else {
        gl_FragColor = vec4(1, 0.2, 0.2, 1);                 //error redish
      }

      vec3 lightVector = u_lightPos-vec3(v_VertPos);

      float r = length(lightVector);
      

      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N,L),0.0);

      vec3 R = reflect(-L,N);
      vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
      float specular = pow(max(dot(E,R), 0.0), 10.0) * 0.5;  

      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;

      if(u_lightON){
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0); 
      }


    }`



//globals
let canvas;
let gl;
let a_Position;
let a_UV;

var a_Normal;

let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;           // dup    //sky
let u_whichTexture;

var u_lightPos;
let u_cameraPos;

let u_Sampler1; //ground
let u_Sampler2; //wall
let u_Sampler3; //diamond

var g_camera = new Camera();

var u_lightON;
var u_NormalMatrix;


//start webGL
function setupWebGL() {
    // Get the canvas element and WebGL rendering context
    canvas = document.getElementById('example');

    //changing this so it doesnt lag
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
    
}

//Initialize shaders
function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return false;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return false;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return false;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return false;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return false;
    }


    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return false;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return false;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return false;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return false;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get u_lightPos');
        return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get u_cameraPos');
        return;
    }

      // Get the storage location of u_Sampler      //dup this for more
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
      return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
    }

    u_lightON = gl.getUniformLocation(gl.program, 'u_lightON');
    if(!u_lightON){
        console.log('Failed to create the u_lightON object');
        return;
    }
    
    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('Failed to get the storage location of u_NormalMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


let g_moveleg = 0;
let g_legAng = 0;
let g_normal = 0;
let g_globalAng = 0;
let g_yellowAnime = false;
var g_lightPos = [0,1,2];
var g_lightON = true;

//passes for HTML
function forHTML(){
  //light
  document.getElementById('lightx').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[0] = this.value/100; RenderShapes();}});
  document.getElementById('lighty').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[1] = this.value/100; RenderShapes();}});
  document.getElementById('lightz').addEventListener('mousemove', function(ev) { if(ev.buttons == 1){ g_lightPos[2] = this.value/100; RenderShapes();}});

  //moves leg
  document.getElementById('moveLegSlide').addEventListener('mousemove', function() { g_moveleg = this.value; RenderShapes(); });
  
  //camera
  document.getElementById('angSlide').addEventListener('mousemove', function() { g_globalAng = this.value; RenderShapes(); });

  //animate
  document.getElementById('NormalOn').onclick = function() {g_normal = true};
  document.getElementById('NormalOff').onclick = function() {g_normal = false};

  document.getElementById('light_on').onclick = function() {g_lightON = true;};
  document.getElementById('light_off').onclick = function() {g_lightON = false;};

}

//start diff textures
function initTextures() {
  // Create the image object
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an Image
  image.src = 'sky.jpg';

  //add more texture later TEXTURE1 instead of TEXTURE0
  //image.onload = function(){ sendTextureToTEXTURE1(image); };
  // src
  //image.src = 'sky.jpg';

  var image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
  image1.src = 'grass2.png';


  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  image2.onload = function(){ sendTextureToTEXTURE2(image2); };
  //image2.src = 'stone.jpg';
  image2.src = 'stone.jpg';



  var image3 = new Image();
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  image3.onload = function(){ sendTextureToTEXTURE3(image3); };
  image3.src = 'diamond.png';




  return true;
}



//dup this for more textures later
function sendTextureToTEXTURE0(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
  // Activate texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  console.log("finished loading Texture0");
}



function sendTextureToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //change gl.TEXTUREx
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  //change u_Samplerx, x
  gl.uniform1i(u_Sampler1, 1);

  console.log("finished loading Texture1");
}

function sendTextureToTEXTURE2(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //change gl.TEXTUREx
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  //change u_Samplerx, x
  gl.uniform1i(u_Sampler2, 2);

  console.log("finished loading Texture2");
}


function sendTextureToTEXTURE3(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //change gl.TEXTUREx
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  //change u_Samplerx, x
  gl.uniform1i(u_Sampler3, 3);

  console.log("finished loading Texture3");
}


let LOCK = false;

// main
function main() {
    //startups
    setupWebGL();

    connectVariablesToGLSL();

    forHTML();

    document.onkeydown = keydown;

    initTextures();

    //Mousem move
    mouseMove();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    requestAnimationFrame(tick);
  }


  //mouse move camera
  function mouseMove() {
    //click to use/unuse
    canvas.onclick = function() {
      if (!LOCK) {
          canvas.requestPointerLock();
      } else {
          document.exitPointerLock();
      }
    };
    document.addEventListener("pointerlockchange", function () {
      LOCK = document.pointerLockElement === canvas;
    });

    //not locked
    document.addEventListener("mousemove", function (event) {
      if (LOCK) {
          g_camera.mouseLook(event.movementX, event.movementY);
          RenderShapes();
      }
    });
  }


  var g_startTime = performance.now()/1000.0;
  var g_seconds = performance.now()/1000.0-g_startTime;
  function tick(){
    g_seconds = performance.now()/1000.0-g_startTime;

    updateAnimeAng();

    RenderShapes();

    requestAnimationFrame(tick);
  }

  function updateAnimeAng(){
    g_lightPos[0] =cos(g_seconds);
  }


  var g_eye = [0,0,3];
  var g_at = [0,0,-100];
  var g_up = [0,1,0];


  //read key inputs
  function keydown(ev){
    if (ev.keyCode==68) { //right
      //g_eye[0] += 0.2;
      g_camera.right();
    } else if (ev.keyCode==65) { //left
      //g_eye[0] -= 0.2;
      g_camera.left();
    } else if (ev.keyCode==83) { //back
      //g_eye[2] += 0.2;
      g_camera.backward();
    } else if (ev.keyCode==87) { //for
      //g_eye[2] -= 0.2;
      //console.log("pre",g_camera.at.elements);
      g_camera.forward();
    

    } else if (ev.keyCode==32) { //up
      g_camera.upward();
    } else if (ev.keyCode==16) { //down
      console.log(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],  
        g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
        g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]
      );
      g_camera.downward();


    } else if (ev.keyCode==69) { //pan right
      //console.log("panRight");
      g_camera.panRight();
    } else if (ev.keyCode==81) { //pan left
      //console.log("panLeft");
      g_camera.panLeft();
    }




    RenderShapes();
    //console.log(ev.keyCode);
  }




  //renders our point
  function RenderShapes(){
    //projection Matrix (this is like the video setting)
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 100); //(degree, aspect ratio, nearplane)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    //view Matrix (this is like the camera)
    var viewMat = new Matrix4();

    viewMat.setLookAt(
      g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],  
      g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
      g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    //global rotation
    var globalRotMat = new Matrix4().rotate(g_globalAng,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //drawMap();
    
    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1],g_lightPos[2]);
    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
    gl.uniform1i(u_lightON, g_lightON);

    //light
    var light = new Cube();
    light.color=[2,2,0,1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1],g_lightPos[2]);
    light.matrix.translate(.5, .5,.5);
    light.matrix.scale(-.1,-.1,-.1);
    //light.matrix.translate(.5, .5,.5);
    light.render();

    // var spotlight = new Cube();
    // spotlight.color=[2,2,0,1];
    // //spotlight.matrix.translate(g_lightPos[0], g_lightPos[1],g_lightPos[2]);
    // spotlight.matrix.translate(-2, .5,.5);
    // spotlight.matrix.scale(-.1,-.1,-.1)
    // spotlight.render();


    //ground
    var floor = new Cube();
    floor.color = [1.0,0.0,0.0,1.0];
    //set this
    floor.textureNum = 1;
    floor.matrix.translate(0,-2.49,0.0);
    floor.matrix.scale(10,0,10);
    floor.matrix.translate(-0.5,0,-0.5);
    floor.render();

    //sky
    var sky = new Cube();
    sky.color = [1.0,0.0,0.0,1.0];
    //set this
    sky.textureNum = 0;
    if (g_normal) sky.textureNum = -3;
    sky.matrix.scale(-12,-12,-12);
    sky.matrix.translate(-0.5,-0.5,-0.5);
    sky.render();

    //treasure
    var tre = new Cube();
    if (g_normal) tre.textureNum = -3;
    tre.color = [0.0,1.0,1.0,1.0];
    tre.matrix.translate(-2,-1,0.5);
    //make it follow normal when animated
    //tre.normalMatrix.setInverseOf(tre.matrix).transpose()
    tre.render();

    var sph = new Sphere();
    if (g_normal) sph.textureNum = -3;
    sph.matrix.translate(2, .75, -1.25);
    sph.render();

  }
  



  //convert hex code to our color code
  function HextoColor() {
    var hexInput = document.getElementById("hexInput").value.trim();
    // Convert hex to RGB
    var r = parseInt(hexInput.slice(1, 3), 16) / 255;
    var g = parseInt(hexInput.slice(3, 5), 16) / 255;
    var b = parseInt(hexInput.slice(5, 7), 16) / 255;

    // Update our global var
    g_selectedColor = [r, g, b, 1.0];
    console.log(r,g,b);
  } 


  
  
//getting the coord
function CoordtoGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y])
}


//References:
// GPT for calcualting mouse move camera