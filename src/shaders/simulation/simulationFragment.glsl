uniform sampler2D uCurrentPosition;
uniform float uProgress;
uniform float uTime;
uniform sampler2D uOriginalPosition;
uniform sampler2D uOriginalPosition1;
uniform vec3 uMousePosition;

uniform float uParticleFriction;
uniform float uParticleReformation;
uniform float uParticleRepellant;

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec2 position = texture2D( uCurrentPosition, vUv ).xy;
    vec2 original = texture2D( uOriginalPosition, vUv ).xy;
    vec2 original1 = texture2D( uOriginalPosition1, vUv ).xy;

    vec2 finalOriginal = mix(original, original1, uProgress);

    // Particle Speed
    vec2 velocity = texture2D( uCurrentPosition, vUv ).zw;

    // Particle friction
    velocity *= uParticleFriction; // 0.99

    // Shape Reformation Force
    vec2 direction = normalize( finalOriginal - position );
    float particleDistance = length( finalOriginal - position );
    if( particleDistance > 0.01 )
    {
        velocity += direction * uParticleReformation; // 0.001
    }

    // Mosue Repellant Force
    float mouseDistance = distance( position, uMousePosition.xy );
    float maxDistance = 0.1;
    if( mouseDistance < maxDistance )
    {
        vec2 direction = normalize( position - uMousePosition.xy );
        velocity += direction * ( 1.0 - mouseDistance / maxDistance ) // this is the important part
        * uParticleRepellant; // 0.001
    }

    // Particle Lifespan
    float offset = rand(vUv);
    float lifespan = 20.0;

    // Deptermine age of particle
    float age = mod( uTime + lifespan * offset, lifespan );
    if( age < 0.1)
    {
        velocity = vec2( 0.0, 0.001 );
        position.xy = finalOriginal;
    }

    position.xy += velocity;

    gl_FragColor = vec4(position, velocity);
}