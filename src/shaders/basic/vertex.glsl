uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    vUv = uv;
    vec3 newPosition = position;
    vec4 color = texture2D( uTexture, vUv );
    newPosition.xy = color.xy;

    // newPosition.z += sin( uTime + position.x * 10.0 ) * 0.5;

    vec4 modelViewPosition = modelViewMatrix * vec4( newPosition, 1.0 );

    gl_PointSize = ( 1.0 / - modelViewPosition.z );

    gl_Position = projectionMatrix * modelViewPosition;
}