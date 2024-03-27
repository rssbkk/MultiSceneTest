uniform sampler2D uTexture;
uniform float uParticleGranularity;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D( uTexture, vUv );

    gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.3 );
    //gl_FragColor = color;

}