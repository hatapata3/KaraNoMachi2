import { forwardRef, useState } from "react";
import { BlendFunction, Effect } from "postprocessing"
import { Uniform } from "three"
import useGame from "./stores/useGame.jsx"

// Effect that distort the screen horizon
export default forwardRef(function Drunk(props, ref)
{
    const effect = new DrunkEffect(props)

    return <primitive ref={ ref } object={ effect } />
})

const fragmentShader = /* glsl */`
uniform float frequency;
uniform float amplitude;
uniform float offset;

void mainUv(inout vec2 uv)
{
    uv.y += sin(uv.x * frequency + offset) * amplitude;
}
`

class DrunkEffect extends Effect
{
    constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN })
    {
        const alc = useGame((state) => state.alc)
        super(
            'DrunkEffect',
            fragmentShader,
            {
                blendFunction,
                uniforms: new Map([
                    [ 'frequency', new Uniform(alc * 2.0) ],
                    [ 'amplitude', new Uniform(alc * 0.1) ],
                    [ 'offset', new Uniform(0) ]
                ])
            }
        )
    }
    update(renderer, inputBuffer, deltaTime)
    {
        this.uniforms.get('offset').value += deltaTime
    }
}