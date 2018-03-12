// This is the main JS file.
window.onload = init;

const FLATNESS = 0.001;

var WIDTH; //Current canvas width
var HEIGHT; //Current canvas height
var mouse = {x:0, y:0};
var gravity = 0.01;
var bounce_factor = 0.8;


// Renders the frame.
function render(){
    setTimeout(function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        blob_world.init_blob_world();
        blob_world.render();
        blob_world.free_fall(gravity);
        //blob_world.evolve(HEIGHT, WIDTH);

        requestAnimFrame(render);
    }, 100);
}


function init(){

    // Initialize WebGL.
    canvas = document.getElementById("gl-canvas");
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    canvas.onclick = getMousePosition;

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl){
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0,WIDTH, HEIGHT);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Initialize shaders and attribute pointers.
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var blob = new Blob(vec4(0.5,0.5,0,1), 0.25, 6);
    blob_world = new BlobWorld(blob, gl, program);

    //blob_world.init_blob_world();

    // Start rendering.
    render();

}

function getMousePosition(event) {
    //var blob = blob_world.get_blob();
    mouse.x = event.clientX - canvas.offsetLeft; //Get the x-coordinate of the mouse
    mouse.y = event.clientY - canvas.offsetTop; //Get the y-coordinate of the mouse

    //For testing purposes
    console.log("Pixel x " + mouse.x);
    console.log("Pixel y " + mouse.y);

    //Convert the pixel to WebGL coordinates
    var pixel_x = ((mouse.x / canvas.width * canvas.width) - canvas.width / 2);
    var pixel_y = ((canvas.height - mouse.y) / canvas.height * canvas.height) - canvas.height / 2;
    var point_clicked = vec2((Math.floor(pixel_x)) / (canvas.width / 2), (Math.floor(pixel_y)) / (canvas.height / 2));

    //For testing purposes
    console.log("Transformed point clicked " + point_clicked);

    //Set WebGL coordinates for mouse.x and mouse.y
    mouse.x = point_clicked[0];
    mouse.y = point_clicked[1];

    //Set the new positions of each vertex
    blob_world.new_position(mouse);

    //For testing purposes
    var coords = "X coords: " + mouse.x + ", Y coords: " + mouse.y;
    console.log(coords); //Print the coordinates to the console
}