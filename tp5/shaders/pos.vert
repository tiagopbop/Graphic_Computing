#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float normScale;

varying vec4 pos;
uniform float timeFactor;


void main() {
	vec3 offset=vec3(0.0,0.0,0.0);

	offset=aVertexNormal*normScale*0.1*sin(timeFactor);

	vec4 vertex=vec4(aVertexPosition.x + normScale*0.1*sin(timeFactor) + sin(timeFactor), aVertexPosition.y, aVertexPosition.z, 1.0);

	gl_Position = uPMatrix * uMVMatrix * vertex;


	pos= uPMatrix * uMVMatrix * vertex
;
}
