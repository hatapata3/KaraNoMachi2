import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree} from '@react-three/fiber'
import { KeyboardControls, PointerLockControls, useProgress } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Physics } from '@react-three/rapier'
import { Bloom, EffectComposer, DepthOfField, Noise, Vignette, BrightnessContrast, Glitch, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Interface } from './Interface.jsx'
import  Town  from './Town.jsx'
import Player from './Player.jsx'
import Drunk from './Drunk.jsx'
import useGame from './stores/useGame.jsx'
import circleIcon from './assets/svg/circle1.svg'
import meter from './assets/svg/meter.svg'
import title from './assets/svg/title.svg'
import graph from './assets/svg/graph.svg'
import texts from './assets/svg/text.svg'
import wave from './assets/svg/wave.svg'

// Loading page
function Loader()
{
    const {progress} = useProgress()
    const par = Math.round(progress)

return<>
    <div className='loadMenu'>
        <div className="loader">
            <div className='loaderTitle'>
                {/* <Title /> */}
                <img src={title} alt="" />
                <h1><span>Now</span>Loading...</h1>
                {/* <Title style={{transform: "rotate(180deg)"}} /> */}
                <img src={title} style={{transform: "rotate(180deg"}} alt="" />
            </div>
            <div className='loaderWrapper'>
                <div className="loaderBx" style={{paddingTop: "80px", width: "600px"}}>
                    <img src={graph} alt="" />
                </div>
                <div className="loaderBx" style={{width: "800px"}}>
                    <h2>{par} %</h2>
                    <img src={circleIcon} alt="" />
                    <img style={{transform: "translateY(0)"}} src={meter} alt="" />
                </div>
                <div className="loaderBx" style={{display: "block", width: "600px"}}>
                    {/* <Texts />
                    <Wave /> */}
                    <img width={550} src={texts} alt="" />
                    <img width={600} src={wave} alt="" />
                </div>
            </div>
        </div>
    </div>
</>
}


export default function App()
{
    const domContent = useRef()
    const perfMode = useGame((state) => state.perfMode)

    
    return <>
    <Suspense fallback ={<Loader />}>
    <KeyboardControls
            map={ [
                { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
                { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
                { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
                { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
                { name: 'menu', keys: [ 'Control' ] },
            ] }
        >
            <Canvas
                camera={ {
                    fov: 45,
                    near: 0.001,
                    far: 200,
                    rotation: [0, 1.55, 0]
                }}
                
            >
                    <color args={ [ '#101420' ]} attach='background' />
                    {perfMode &&<Perf position='top-left' />}
                    <fog attach='fog' color='#101420' near={10} far={20} />
                    <Physics>
                        <Lights />
                        <Town />
                        <Player />
                    </Physics>
                    <Effecter />
                    <Controls />
            </Canvas>
            <MusicPlayer />
            <Interface />
        </KeyboardControls>
        </Suspense>
    </>
}

function Lights()
{
    const flashRef = useRef()
    useFrame((state) =>
    {
        if(Math.random() > 0.98 || flashRef.current.power > 100)
        {
            if(flashRef.current.power < 100)
            {
                
                flashRef.current.position.set(
                    Math.random() * 40,
                    200 + Math.random() * 100,
                    Math.random() * 40,
                )
            }
                flashRef.current.power = 50 + Math.random() * 500
        }
    })

    return <>
        <ambientLight intensity={.5} />
        <pointLight
            ref={flashRef}
            color="#062d89"
            intensity={Math.PI}
            distance={500}
            decay={.3}
            position={[ 0,200,0 ]}
        />
    </>
}

function Effecter()
{
    const alc = useGame((state) => state.alc)
    const front = useGame((state) => state.front)
    const noise = useGame((state) => state.noise)
    const firstUpdate = useRef(true)
    const glitchRef = useRef(null)

    useEffect(() =>
    {
        if(firstUpdate.current)
        {
            firstUpdate.current=false
        }
        else if(alc > 1)
        {
            glitchRef.current.delay.y = 1.0 / alc
            glitchRef.current.duration.y = 0.3 * alc
            glitchRef.current.strength.y = 0.4 * alc
        }
    }, [alc])

    return <EffectComposer>
        <BrightnessContrast 
            brightness={ 0.3 }
            contrast={ 0.6 }
            opacity={ 0.3 }
        /> 
        <DepthOfField
            focusDistance={0.0}
            focalLength={0.15}
            bokehScale={6}
        />
        <Bloom
            mipmapBlur
            intensity={ .5 }
            luminanceThreshold={ 0.8 }
            luminanceSmoothing={ 0.3 }
        />
        <Noise 
            premultiply 
            opacity={0.7} 
            blendFunction={ BlendFunction.SOFT_LIGHT } 
        />
        <Vignette 
            eskil={false} 
            offset={0.2} 
            darkness={0.8} 
        />
        <HueSaturation
            hue={0}
            saturation={0.25}
        />
        <Drunk
            BlendFunction={ BlendFunction.DARKEN }
        />
        {alc > 0 &&<Glitch
            ref={glitchRef}
            delay={[ 0, 1 ]}
            duration={[ 0.1, 0.3 ]}
            strength={[ 0.2, 0.4 ]}
            distortion={[ 0.1, 0.5 ]}
        />}
        {!front &&<Glitch
            delay={[ 0.3, 2 ]}
            duration={[ 0.1, 0.1 ]}
            strength={[ 0.2, 0.4 ]}
            distortion={[ 0.1, 0.8 ]}
            mode={ GlitchMode.SPORADIC }
        />}
        {noise &&
            <Glitch
            strength={[ 0, 0.9 ]}
            distortion={[ 0.1, 0.5 ]}
            ratio={.3}
            columns={.2}
            mode={ GlitchMode.CONSTANT_WILD }
        />
        }
    </EffectComposer>
}

function Controls()
{
    const move = useGame((state) => state.move)
    const firstUpdate = useRef(true)
    const active = useRef(true)
    const controlsRef = useRef()

    useEffect(() =>
    {
        if(firstUpdate.current)
            firstUpdate.current = false
        else if( !move )
        {
            controlsRef.current.unlock()
            active.current = false
        }
        else
        {
            // Automated fps mode
            setTimeout(() =>
            {
                controlsRef.current.lock()
            }, 100)
            active.current = true
        }
        // Disable fps operation during intMode
        window.addEventListener('click', () =>
        {    
            if( !active.current )
            {
                controlsRef.current.unlock()
            }

        })
    }, [move])

    return <PointerLockControls ref={controlsRef} pointerSpeed={.4} />
}


function MusicPlayer()
{
    const musicState = useGame((state) => state.musicState)
    const musicPlay = useGame((state) => state.musicPlay)
    const target = useGame((state) => state.target)
    const front = useGame((state) => state.front)
    const gizouNum = useGame((state) => state.gizouNum)
    const punishment = useGame((state) => state.punishment)

    const wrapper = useRef()
    const track_name = useRef()
    const track_artist = useRef()

    const playpause_btn = useRef()

    const curr_time = useRef()
    const total_duration = useRef()
    const curr_track = useRef()


    const track_index = useRef(0)
    const isPlaying = useRef(false)
    const updateTimer = useRef(null)
    const firstUpdate = useRef(true)
    const btnPause = useRef(false)

    const [curValue, setCurValue] = useState(0)
    const [volValue, setVolValue] = useState(25)

    const music_list = useRef([
        {
            name: '廻想のレコード',
            artist: 'BGMer',
            music: 'bgm/bgm1.mp3'
        },
        {
            name: 'Strange Noob',
            artist: 'J4U',
            music: 'bgm/bgm2.mp3'
        },
        {
            name: 'Be Kinder',
            artist: 'Zodd',
            music: 'bgm/bgm3.mp3'
        },
        {
            name: '眠れる世界樹',
            artist: 'BGMer',
            music: 'bgm/bgm4.mp3'
        },
        {
            name: 'Lo0hcs',
            artist: 'J4U',
            music: 'bgm/bgm5.mp3'
        }
    ])

    function loadTrack(track_index)
    {
        clearInterval(updateTimer.current)
        reset()

        curr_track.current.src = music_list.current[track_index].music
        curr_track.current.load()

        track_name.current.textContent = music_list.current[track_index].name
        track_artist.current.textContent = music_list.current[track_index].artist

        curr_track.current.volume = volValue / 100

        updateTimer.current = setInterval(setUpdate, 1000)

        curr_track.current.addEventListener('ended', nextTrack)
        random_bg_color()
    }
    // background color of music player
    function random_bg_color()
    {
        let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e']
        let a 

        function populate(a)
        {
            for(let i=0; i<6; i++)
            {
                let x = Math.round(Math.random() * 14)
                let y = hex[x]
                a+= y
            }
            return a
        }
        let Color1 = populate('#')
        let Color2 = populate('#')
        var angle = '-45deg'

        let gradient = 'linear-gradient(' + angle + ',' + Color1 + 'aa,' + Color2 + 'aa)'
        wrapper.current.style.background = gradient
    }
    function reset()
    {
        curr_time.current.textContent = "00:00"
        total_duration.current.textContent = "00:00"
        setCurValue(0)
    }
    function playpauseTrack()
    {
        isPlaying.current ? pauseTrack() : playTrack()
        btnPause.current = !btnPause.current 
    }
    function playTrack()
    {
        curr_track.current.play()
        isPlaying.current = true
        playpause_btn.current.innerHTML = '<i class="fa-solid fa-circle-pause fa-4x"></i>'
    }
    function pauseTrack()
    {
        curr_track.current.pause()
        isPlaying.current = false
        playpause_btn.current.innerHTML = '<i class="fa-solid fa-circle-play fa-4x"></i>'
    }
    function nextTrack()
    {
        if(track_index.current < music_list.current.length - 1)
            track_index.current += 1
        else
            track_index.current = 0
        loadTrack(track_index.current)
        playTrack()
    }
    function prevTrack()
    {
        if(track_index.current > 0)
            track_index.current -= 1
        else
            track_index.current = music_list.current.length -1
        loadTrack(track_index.current)
        playTrack()
    }
    function seekTo(e)
    {
        setCurValue(e.target.valueAsNumber)
        let seekto = curr_track.current.duration * (curValue / 100)
        curr_track.current.currentTime = seekto
    }
    function setVolume(e)
    {
        setVolValue(e.target.valueAsNumber)
        curr_track.current.volume = volValue / 100
    }
    // Change of notation information
    function setUpdate()
    {
        let seekPosition = 0
        if(!isNaN(curr_track.current.duration))
        {
            seekPosition = curr_track.current.currentTime * (100 / curr_track.current.duration)
            setCurValue(seekPosition)

            let currentMinutes = Math.floor(curr_track.current.currentTime / 60)
            let currentSeconds = Math.floor(curr_track.current.currentTime - currentMinutes * 60)
            let durationMinutes = Math.floor(curr_track.current.duration / 60)
            let durationSeconds = Math.floor(curr_track.current.duration - durationMinutes * 60)

            if(currentSeconds < 10) currentSeconds = "0" + currentSeconds
            if(durationSeconds < 10) durationSeconds = "0" + durationSeconds
            if(currentMinutes < 10) currentMinutes = "0" + currentMinutes
            if(durationMinutes < 10) durationMinutes = "0" + durationMinutes

            curr_time.current.textContent = currentMinutes + ":" + currentSeconds
            total_duration.current.textContent = durationMinutes + ":" + durationSeconds
        }
    }

    useEffect(() =>
    {
        if(!firstUpdate.current && target == 'phone' && front && !punishment)
            wrapper.current.classList.add('active')
            
        else
            wrapper.current.classList.remove('active')
    }, [target, punishment])

    // Change the status of the music player by musicState
    useEffect(() =>
    {
        if(firstUpdate.current)
            firstUpdate.current = false
        else if(musicState == 'load')
        {
            loadTrack(track_index.current)
            musicPlay()
        }
        else if(musicState == 'play' && !btnPause.current)
            playTrack()
        else if(musicState == 'pause')
            pauseTrack()
    }, [musicState])




    return<div className='musicPlayer'>
        <div ref={wrapper} className='musicWrapper'>
            <audio ref={curr_track} />
            <div className='musicDetails'>
                <div ref={track_name} className="track-name">Track Name</div>
                <div ref={track_artist} className="track-artist">Track Artist</div>
            </div>
            <div className="slider_container">
                <div ref={curr_time} className="current-time">00:00</div>
                <input type="range" min="1" max="100" value={curValue} className="seek_slider" onChange={e => seekTo(e)} />

                <div ref={total_duration} className="total-duration">00:00</div>
            </div>
            <div className="slider_container">
                <i className="fa-solid fa-volume-low"></i>
                <input type="range" min="1" max="100" step="1" value={volValue} className="volume_slider" onChange={e => setVolume(e)}  />
                <i className="fa-solid fa-volume-high"></i>
            </div>
            <div className='musicButtons'>
                <div className="prev-track" onClick={prevTrack}>
                    <i className="fa-solid fa-backward-step fa-2x"></i>
                </div>
                <div ref={playpause_btn} className="playpause-track" onClick={playpauseTrack}>
                    <i className="fa-solid fa-circle-play fa-4x"></i>
                </div>
                <div className="next-track" onClick={nextTrack}>
                    <i className="fa-solid fa-forward-step fa-2x"></i>
                </div>
            </div>
        </div>
    </div>
}