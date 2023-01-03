var VERTEX_SHADER = `
    attribute vec4 a_Position;
    uniform mat4 u_modelMatrix;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main()
    {
        gl_Position = u_modelMatrix * a_Position;
        v_color = a_color;
    }
`;
var FRAGMENT_SHADER = `
    precision mediump float;
    varying vec4 v_color;
    void main()
    {
        gl_FragColor = v_color; 
    }
`;
var ANGLE_SET = 45.0;
function main()
{
    var canvas = document.getElementById('myCanvas');
    var gl = canvas.getContext('webgl');
    if(!gl)
    {
        console.log('failed with gl');
        return;
    }
    if(!initShaders(gl,VERTEX_SHADER,FRAGMENT_SHADER))
    {
        console.log('failed with initShader');
        return;
    }
    canvas.onmousedown = function(ev)     
    {
        click(ev,gl,canvas);
    }
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
function click(ev,gl,canvas)
{
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x-rect.left)-(canvas.width/2))/(canvas.width/2);
    y = ((canvas.height/2)-(y-rect.top))/(canvas.height/2);
    var n = initBuffers(gl,x,y);
    var u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');
    var modelMatrix = new Matrix4();
    var currentAngle = 0.0;
    var tick = function()
    {
        currentAngle = Animate(currentAngle);
        draw(gl,n,currentAngle,u_modelMatrix,modelMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}
function draw(gl,n,currentAngle,u_modelMatrix,modelMatrix)
{
    modelMatrix.setRotate(currentAngle,0,0,1);
    modelMatrix.translate(0.2,0,1);
    gl.uniformMatrix4fv(u_modelMatrix,false,modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
var g_last = Date.now();
function Animate(currentAngle)
{
    var now = Date.now();
    var elapse = now - g_last;
    now = g_last;
    var newAngle = currentAngle + ( ANGLE_SET * elapse ) / 1000.0;
    return newAngle %= 360.0;
}
function initBuffers(gl,x,y)
{
    var vertices = new Float32Array
    (
        [
            x    ,y+0.2,1.0,0.0,0.0,
            x-0.2,y-0.2,0.0,1.0,0.0,
            x+0.2,y-0.2,0.0,0.0,1.0
        ]
    );
    var n = 3;
    var createBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,createBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var FSIZES = vertices.BYTES_PER_ELEMENT;
    //path the position values
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position < 0)
    {
        console.log('out of range');
        return -1;
    }
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZES * 5,0);
    gl.enableVertexAttribArray(a_Position);
    //path the color values
    var a_color = gl.getAttribLocation(gl.program,'a_color');
    if(a_color < 0)
    {
        console.log('Not found');
        return -1;
    }
    gl.vertexAttribPointer(a_color,3,gl.FLOAT,false,FSIZES * 5,FSIZES * 2);
    gl.enableVertexAttribArray(a_color);
    return n;
}
var ANGLE_SET2;
function up()
{
    ANGLE_SET += 10;
}
function down()
{
    ANGLE_SET -= 10;
}
function stop()
{
    ANGLE_SET2 = ANGLE_SET;
    ANGLE_SET = 0.0;
}
function Continue()
{
    if(ANGLE_SET == 0.0)
    {
        ANGLE_SET = ANGLE_SET2;
    }
    else
    {
        window.alert('The Triangle Already Moving');
    }
}
