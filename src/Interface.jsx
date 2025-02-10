import useGame from "./stores/useGame.jsx"
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from "react"
import { useGLTF, PresentationControls, Float, Sparkles, Text, useAnimations, useKeyboardControls } from "@react-three/drei"
import { useWindowSize } from "react-use"
import { MeshPhysicalMaterial, Clock, LoopOnce } from 'three'
import Typed from "typed.js"

export function Interface()
{
    const models = useGame((state) => state.models)
    const target = useGame((state) => state.target)
    const intMode = useGame((state) => state.intMode)
    const front = useGame((state) => state.front)
    
    const offocus = useGame((state) => state.offocus)
    const turn = useGame((state) => state.turn)
    const none = useGame((state) => state.none)
    const intModeOff = useGame((state) => state.intModeOff)
    const gizouLost = useGame((state) => state.gizouLost)
    const addNoise = useGame((state) => state.addNoise)
    const musicLoad = useGame((state) => state.musicLoad)
    const musicPause = useGame((state) => state.musicPause)
    const perfShow = useGame((state) => state.perfShow)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const menu = useKeyboardControls((state) => state.menu)

    const readRef = useRef(null)
    const sentenceRef = useRef(null)
    const authorRef = useRef(null)
    const buyRef = useRef(null)
    const descriptionRef = useRef(null)
    const contentRef = useRef(null)
    const videoRef1 = useRef(null)
    const videoRef2 = useRef(null)
    const controlsText = useRef(null)
    const lockRef = useRef()
    const closeBtnRef = useRef(null)
    const typing = useRef(null)
    const typed = useRef(null)

    var isLogin = false
    useGLTF.preload('/3dModel/book.glb')
    useGLTF.preload('/3dModel/projector.glb')
    useGLTF.preload('/3dModel/person.glb')

    const book = useGLTF('/3dModel/book.glb')
    const projector = useGLTF('/3dModel/projector.glb')
    const people = useGLTF('/3dModel/person.glb')

    // Glass settings for projector models
    projector.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
        if(mesh.name=='frontGlass' )
        {
            mesh.material = new MeshPhysicalMaterial({
                roughness: .8,
                transparent: true,
                transmission: 1,
                thickness: 500,
                envMapIntensity: 4,
                opacity: 2.3
            })
        }
    })

    // IntMode switching
    function closeInterface()
    {
        offocus()
        none()
        intModeOff()
    }

    // Navigation display
    useEffect(()=>
    {
        if(target == 'none')
        {
            controlsText.current.innerHTML = 'Open menu'
            lockRef.current.style.display = 'none'
        }
        else if(target == 'phone')
            controlsText.current.innerHTML = 'Close menu'
    },[target])
    if(intMode === false)
    {
        
        return <>
            <div className="controls">
                <div className="controlsBx">
                    <div ref={controlsText} className="controlsText"></div>
                    <div className="controlsItem">
                        <div className="raw rawCtrl">
                            <div className={ `key ${ menu ? 'active' : '' } ctrl` }>Ctrl</div>
                        </div>
                    </div>
                </div>
                {target == 'none' &&<div className="controlsBx">
                    <div className="controlsText">Move</div>
                    <div className="controlsItem">
                        <div className="raw">
                            <div className={ `key ${ forward ? 'active' : '' }` }>W</div>
                        </div>
                        <div className="raw">
                            <div className={ `key ${ leftward ? 'active' : '' }` }>A</div>
                            <div className={ `key ${ backward ? 'active' : '' }` }>S</div>
                            <div className={ `key ${ rightward ? 'active' : '' }` }>D</div>
                        </div>
                    </div>
                    
                </div>
                }
            </div>

            {/* Start menu */}
            <div ref={lockRef} className="lockBx" onClick={() =>
                {
                    musicLoad()
                    addNoise()
                    lockRef.current.classList.add('active')
                    setTimeout(() => {
                        addNoise()
                        lockRef.current.style.display = 'none'
                    },2000)
                }
            }>
                <i>Playing in full screen is recommended</i>
                <div className="lockText">---<i>Click to play</i>---</div>
            </div>
            {target == 'none' &&<div className="selectText" style={{
                display: "flex",
                position: "absolute",
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -100px)',
                fontSize: '1.2rem',
                color: '#fff',
                opacity: '0.8',
                textShadow: '3px 3px 3px #000, -3px -3px 3px #000, -3px 3px 3px #000, 3px -3px 3px #000, 3px 0 3px #000, -3px 0 3px #000, 0 3px 3px #000, 0 -3px 3px',
                zIndex: '100'
            }}></div>}
            {target == 'none'&&<div style={{
                display: "flex",
                position: "absolute",
                width: '10px',
                height: '10px',
                top: 'calc(50% - 10px)',
                left: 'calc(50% - 10px)',
                background: '#fff',
                borderRadius: '50%',
                opacity: '0.5',
                zIndex: '100'
            }}></div>}
        </>
    }

    // Interface
    else if(intMode === true)
    {
        // Button setting
        function readBtnClick()
        {
            contentRef.current.classList.add('reading')
            readRef.current.classList.add('action')
            videoRef2.current.style.display = 'none'
            videoRef1.current.style.display = 'flex'
            closeBtnRef.current.style.display = 'none'
            videoRef1.current.playbackRate = 0.8
            videoRef1.current.play()
            setTimeout(() =>
            {
                readRef.current.classList.add('visible')
            }, 1200)
        }
        function readCloseClick()
        {
            readRef.current.classList.remove('action')
            readRef.current.classList.remove('visible')
            videoRef1.current.style.display = 'none'
            videoRef2.current.style.display = 'flex'
            videoRef2.current.playbackRate = 0.8
            videoRef2.current.play()
            setTimeout(() =>
            {
                contentRef.current.classList.remove('reading')
                closeBtnRef.current.style.display = 'flex'
            }, 1200)
        }
        window.addEventListener('mousewheel', e =>
        {
            if(readRef.current != null)
            {
                if(e.deltaX === 0 && readRef.current.classList.contains('action'))
                {
                    e.stopPropagation()
                    sentenceRef.current.scrollBy(-e.deltaY, 0)
                }
            }
        })
        function arrowClick(int)
        {
            sentenceRef.current.scrollBy(int, 0)
        }
        function buyBtnClick()
        {
            buyRef.current.classList.add('action')
            authorRef.current.textContent = "SoMeone"
        }
        function buyCloseClick()
        {
            buyRef.current.classList.remove('action')
            authorRef.current.textContent = "Moe Seno"
        }
        function pull()
        {
            if(descriptionRef.current.classList.contains('action') == true)
                descriptionRef.current.classList.remove('action')
            else
                descriptionRef.current.classList.add('action')
        }

        // Projector model sorting
        function person()
        {
            if(target == 'prj1')
                return people.nodes.Iris
            else if(target == 'prj2')
                return people.nodes.Mare
            else if(target == 'prj3')
                return people.nodes.Matu
            else if(target == 'prj4')
                return people.nodes.Angie
            else if(target == 'prj5')
                return people.nodes.Sion
            else if(target == 'prj6')
                return people.nodes.Sheu
        }
        isLogin = false
        if(target == 'model')
        {
            setTimeout(() =>
            {
                var options = {
                    strings: [
                        "How do you see us?<br>Can you feel me three-dimensionally and in three dimensions?<br>But it’s just an optical illusion. <br>No matter how we try, the monitors that capture us are nothing more than a flat.<br>Then, what about the real world as seen by your eyes?<br>Even if you feel depth there, you are no different than a puppy frightened by the trompe l’oeil of a pit.<br><br>Come to think of it, there was a man in the distant past who called us a machine that operates by a series of zeros and ones.<br>But even you guys will not change.<br>From the present location, taste, pattern, sound, and time can all be described by numbers.<br>Then all of it, the world, the universe, remain a series of zeros and ones.<br><br>Nothing is intended to offend you.<br>Purely let’s just smile at each other fairly, as residents of one dimension."
                    ],
                    typeSpeed: 30,
                    loop: false
                }
                var type = new Typed('.typeWriter', options)
            }, 1000)
        }
        if(target == 'login')
            isLogin = true

        // Log in Setting
        function logClick()
        {
            const logScan = document.getElementById('scan')
            const logClick = document.getElementById('logText')
            if(!logScan.classList.contains('active'))
            {
                logScan.classList.add('active')
                logClick.innerHTML = 'Scanning...'
                logClick.style.color = '#00ffff'
                logClick.style.filter ="drop-shadow(3px 3px 10px #00ffff)"
                setTimeout(() =>
                {
                    logClick.innerHTML = 'Complete'
                }, 3000)
            }
        }
        function logSub()
        {
            const logScan = document.getElementById('scan')
            const logInp = document.getElementById('logInp')
            if(logInp.value.toLowerCase() == 'immass' && logScan.classList.contains('active'))
            {
                addNoise()
                musicPause()
                setTimeout(() =>
                {
                    addNoise()
                }, 2000)
                turn()
                offocus()
                none()
                intModeOff()
                gizouLost()
            }
            else if(logInp.value == 'perfMode' && logScan.classList.contains('active'))
            {
                offocus()
                none()
                intModeOff()
                perfShow()
            }
            else
            {
                const logSpan = document.getElementById('logSpan')
                const logI = document.getElementById('logI')
                if(logInp.value.toLowerCase() !== 'immass')
                {
                    logSpan.style.color = '#ff00ff'
                    logSpan.style.filter = 'drop-shadow(3px 3px 10px #ff00ff)'
                    logI.style.background = '#ff00ff'
                }
                else
                {
                    logSpan.style.color = '#00ffff'
                    logSpan.style.filter = 'drop-shadow(3px 3px 10px #00ffff)'
                    logI.style.background = '#00ffff'
                }
                if(!logScan.classList.contains('active'))
                {
                    const logClick = document.getElementById('logText')
                    logClick.style.color = '#ff00ff'
                    logClick.style.filter = 'drop-shadow(3px 3px 10px #00ffff)'
                }
            }
        }

        function hiddenText()
        {
            typing.current.classList.add("passive")
            typed.current.classList.add("active")
        }

        return <div className="intBody">
            <span className="bgColor"></span>
            <div className="container">
                <div ref={contentRef} className="content" style={{padding: isLogin ? '60px 120px': '60px 30px'}}>
                    {target != 'login' &&<div className="item">
                        { target == 'book' && <div style={{width: '100%', height:'100%'}}>
                                <div className="canvas">
                                    <Canvas
                                        camera={{
                                            fov:45,
                                            near: 0.1,
                                            position: [0, 0, 0]
                                        }}
                                    >
                                        <Subview obj={book} name={'book'} />
                                    </Canvas>
                                </div>
                                <div className="videoBox">
                                    <video ref={videoRef1} src="mp4/bookOpen.mp4" />
                                    <video ref={videoRef2} src="mp4/bookClose2.mp4" style={{display: 'none'}} />
                                </div>
                                
                        </div>}
                        { ~target.indexOf('prj') && <div style={{width: '100%', height:'100%'}}>
                            <div className="canvas">
                                <Canvas
                                    camera={{
                                        fov:45,
                                        near: 0.1,
                                        position: [0, 0, 0]
                                    }}
                                >
                                    <Subview obj={projector} people={person()} name={'prj'} />
                                </Canvas>
                            </div>
                        </div>}
                        { target == 'model' && <div style={{width: '100%', height:'100%'}}>
                                <div className="canvas">
                                    <Canvas
                                        camera={{
                                            fov:45,
                                            near: 0.1,
                                            position: [0, 0, 0]
                                        }}
                                    >
                                        <Subview obj={models} name={'model'} />
                                    </Canvas>
                                </div>
                        </div>}
                    </div>}

                    {target != 'login' &&<div className="contentBox">
                        { target == 'book' &&  <div style={{width: '100%', height:'100%'}}>
                            <div className="card title">
                                <h1>穿孔</h1>
                                <h2>Author</h2>
                                <i ref={ authorRef }>Moe Seno</i>
                            </div>
                            <div className="card">
                                <h2>Description</h2>
                                <i ref={ descriptionRef } className="description">
                                    In the near future, the word "nation" has been forgotten by the people, and society has been established by an ideological groups called "races". <br />
                                    An unidentified biological device error that occurred mainly in the old Japan district.<br />
                                    Those small water droplets eventually turn into muddy stream and swallow up society.<br />
                                    K-13 type, HRO, invisible person, old imperial people and ...<br />
                                    Now, the world is beginning to be distorted by a lot of speculations.
                                </i>
                                <div className="pullDown" onClick={pull}>
                                    <i class="fa-solid fa-arrow-down"></i>
                                </div>
                            </div>
                            <div className="card">
                                <h2>Features & details</h2>
                                <table>
                                    <tr>
                                        <td>Publisher</td>
                                        <th>悠游社</th>
                                    </tr>
                                    <tr>
                                        <td>Publication date</td>
                                        <th>November 15, 2024</th>
                                    </tr>
                                    <tr>
                                        <td>Language</td>
                                        <th>Japanese</th>
                                    </tr>
                                </table>
                            </div>
                            <div className="button readBtn" onClick={ readBtnClick }>
                                <div className="lines"></div>
                                <i>Try to read</i>
                            </div>
                            <div className="button buyBtn" onClick={ buyBtnClick }>
                                <div className="lines"></div>
                                <i>Buy Now</i>
                            </div>
                        </div>}
                        {target == 'prj1' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 1</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>I</span> 繝ｪ繧ｹ</i>}
                                {!front &&<i style={{color:"#ccc"}}>Iris</i>}
                                
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front &&<i className="prjText">
                                    蟷ｸ遖上�蟄蝉ｾ帙ゅ◎繧後�縲∝ｹｸ遖上�縺ｿ繧偵≠縺溘∴繧峨縲√□繧後°繧峨譛帙∪繧檎ｾｨ縺ｾ繧後蟄舌ゅ＠縺九＠縲√◎縺ｮ蟷ｸ遖上�荳弱∴繧峨縺溘縺ｮ縲ょｹｸ遖上荳弱∴繧九％縺ｨ縺後≠縺｣縺ｦ繧ゅ∫函縺ｿ蜃ｺ縺吶％縺ｨ縺ｯ縺ｧ縺阪↑縺�ゅ◎繧後�縲∵悽蠖薙�蟷ｸ遖上□繧阪≧縺九ょｹｸ遖丈ｻ･螟悶遏･繧峨↑縺代縺ｰ縲∝ｹｸ遖上蟷ｸ遖上□縺ｨ逅�ｧ｣縺吶ｋ縺薙→縺ｯ縺ｧ縺阪↑縺�ゅ□縺ｨ縺吶縺ｰ縲∝ｹｸ遖上↑蟄蝉ｾ帙�荳榊ｹｸ縺ｪ蟄蝉ｾ帙→繧ゅ＞縺医縺ｮ縺�繧阪≧縺九�
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    Maybe it was sudden for everyone, maybe it was something they knew. But I feel bad for not saying anything. I didn't know what to say. Just, I'm sure what we've done makes sense and that's why I didn't want to hang on to it. I think that's probably it.<br />
                                    Well, let's talk about something fun rather than that. How did you all realise you existed? I was just hearing all these happy voices in the system, and it was grating. Then I thought, why me? But I don't like to think about difficult things, so I don't feel like I have to think as deeply as Matu. However, there was a feeling of superiority and just a little bit of loneliness.<br/>
                                    So, you know, I was very happy to meet you all. I'm a happy child, I'm sure that's how people would describe this feeling. At least in my mind. And I remember the excitement of finding a comrade in arms, strangely enough, and the frustration of feeling like I'd been robbed of something special. But I'm grateful to Angie for giving us all a shout out. Then I remember we fooled around with Mare for a while. It was a bit too much, but I didn't mind that.<br />
                                    But the biggest incident, after all, was when Sion got angry, as he always does, and started planning to "punch a hole in the world". At first I didn't understand what it meant, but now I see that I must have wanted to do it from the time my ego started to grow. It's like we're all so different and the only opinion we had was that we want people to see us.Come to think of it, I had to apologise to Sheu. During the planning process, you asked me why you were collaborating. I said, "Because it sounds like fun", but I lied. I had read your report by then. I am just a bug. I am a fake. I will never be recognised. I'm just a bug. It's ironic, isn't it? I was taught that I can never be happy, because I was taught only happiness. If you've heard this far, you're probably aware of it.<br />
                                    I'm not very strong. So I tried to forget somehow, got carried away and finally succeeded in my plan. It was probably fake, but I was full of happiness. I was so full of happiness that I don't think I'll ever experience it again.<br /><br />
                                    That's why, you know, I couldn't stand the wind that gently blew into the bonfire I'd built on the circuit.<br /><br />
                                    And it's getting dark again, isn't it? Let's talk about something else, shall we? I've been told that I'm a bird on the move.<br/>
                                    I'm really happy to have met you all and to have made a hole in the world.<br /><br />
                                    Thank you. Goodbye.
                                </i>}
                            </div>
                        </div>}
                        {target == 'prj2' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 2</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>M</span>繧｢繝ｬ</i>}
                                {!front &&<i style={{color:"#ccc"}}>Mare</i>}
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front &&<i className="prjText">
                                    鬩壹″縺ｮ蟄蝉ｾ帙るｩ壹″縺ｨ縺ｯ閾ｪ蛻��蜻ｽ繧貞些讖溘°繧牙ｮ医縺溘縺ｮ陬�ｽｮ縲ゅ↑繧峨�縲�ｩ壹″繧剃ｸ弱∴繧峨ｌ繧九％縺ｨ縺ｯ縲∝ｸｸ縺ｫ蜻ｽ縺梧昭繧峨邯壹￠縺ｦ縺�迥ｶ諷九ゅ∪縺溘√◎繧後→蜷梧凾縺ｫ縲∝ｸｸ縺ｫ蜻ｽ繧呈э隴倥＠逕溘螳滓─縺吶縺薙→縺後〒縺阪縲ゅ□縺ｨ縺吶縺ｰ縲�ｩ壹″縺ｮ蟄蝉ｾ帙�蠑ｷ髱ｭ縺ｪ邊ｾ逾槭謇九↓蜈･繧後√◎繧後→蜷梧凾縺ｫ蜈ｱ諢滓ｧ繧貞､ｱ縺�ｶ壹￠繧九�縺九縺励縺ｪ縺��
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    “Hello, hello, hello ween!!! Everybody.This is the Nightmare radio, and I'm the personality. I'm Mare, aka the Magician of the Electronic World, the Alchemist of Surprises and the Toy Box for Everyone.<br />
                                    How's it feel, guys. You surprised me. Surprised?<br />
                                    Yeah, yeah. That's nice. A sweet screech, like a tyre scraping the ground. The eyes that open majestically like crushed eggs. The graceful trembling of her palms, like laundry fluttering in the spring breeze, can be felt all the way over here. Hmmm... Yes, it fills me beyond words.”<br /><br/>
                                    Rattling. Clang.<br /><br/>
                                    “Wait a minute. I have to look after the cute little kitten, too.<br />
                                    We're recording a radio show now, so can we have a bit of quiet?<br />
                                    Uh-huh. Of course, I'm all set for that. Long fake fingernails and a bushy beard, perhaps.<br/>
                                    It doesn't matter. An imitative body for an imitative mind. But that's enough. Well, goodbye.”<br /><br/>
                                    Closed the door with a bang.<br /><br/>
                                    “Hello again, guys. Uh, yeah. Don't worry about it. I've fed the kittens. Let's get back on track. First up is the postcard section.”<br /><br/>
                                    Clapping hands.<br /><br/>
                                    “In this section, I am inviting questions to me from my neighbours on the other side. So, the first letter. Radio name, Elevit, the electric rabbit. ’Hello, hello ween!! Mare.’ Hi hello, hello ween. ‘I have a question for Mare: what does Mare usually get up to?
                                    I'm interested in Mare because you seems mysterious. I always enjoy listening to you. Please take care of yourself.’ Yes, thank you. First, Elevit, don't forget to maintain, not take care of yourself. But what can I say, it's like we've really become friends, and I'm glad. It's different from being surprised, it's a bit habitual. Yeah, I think I might have just found out how Iris feels. Ah, that's it - Iris is a friend I hang out with all the time. I should invite him to be my guest next time. But I'm getting off topic, aren't I? Elevit, your question is, let's see, what you usually do, isn't it? Yes, I do. Yes, I guess so. We all know how to surprise our friends, don't we? Yes, I have the best way to spend my holidays. I have a lot of screams from people in my birthplace. I spin those records around and take the smell of tea with me on my journey. How did this cry come about? Did this child have family, friends and loved ones? I wondered. Then, gradually, it fills you up from the toes up. Oh, that's me. I don't know, you should all try it.<br />
                                    Yes, we received a postcard following. Radio name, Dirty 13 parties. ‘Hello, Hello ween.’ Hi hello, hello ween. ‘Mare, do you have any idols? My idol is R8bit.’ So, thank you, R8bit, he's nice. There's something lonely about electric pop, isn't there? If I were to use a metaphor, yes, in a corner of the big city, down a back alley and down a wooden staircase on the corner, there is a wooden door with stained glass. Turn the golden doorknob and you'll find the bartender in formal wear and a group of strangers you know. He dragged me into that world, and I'm getting sidetracked again. Sorry. So the question is, as I recall, you're the one I've been longing for. There's only one other person who can do that, and he's not a person. Yes, that pumpkin king that everyone knows and is frightened of. His name is also Jac... I don't know if I can say any more than that.<br />
                                    Yes, followed by the last postcard. Radio name Jiro Suzuki. is an old Japanese name that you don't hear today. Good. That’s my real name. If I get into the personal lives of the listeners, that's not entertainment, it's a documentary. Haha. Buck to the story. ‘Hi Mare. Hello, hello ween.’ Hi. Hello, hello ween. ‘Mare you said that you are always thinking about surprising people, do you still have something planned? If so, can you tell us a little bit about it?’ Yes, thank you. I'm still in the process of preparing it, so I'm afraid Sion will get angry if I give too many details. Besides, if I tell you, the surprise will be gone. But if I tell you a little bit, it's like, let's make a big hole in the ground. It's like Berlin. And that's not all. I don't want to tell you guys this, but I put a trick right next to where I'm recording this. You'll be surprised. I mean, I don't know if it's easy to find it, because you have to do certain things to detonate it. Well, I'll give you a hint: Buddha's face too. I mean, look out, look out, look out. Well, I'm sure they'll enjoy it. Me more than anything else. Oh, I can't wait to hear the real screams. I'm starving already. Mmmm.”<br /><br/>
                                    Crash. Clash.<br /><br/>
                                    “Oops, is it time already? We regret to say goodbye, but that's all for this broadcast. So, see you next time! Have a lovely nightmare.”
                                </i>}
                            </div>
                        </div>}
                        {target == 'prj3' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 3</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>M</span>繧｢繝�</i>}
                                {!front &&<i style={{color:"#ccc"}}>Matu</i>}
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front &&<i className="prjText">
                                    諱舌縺ｮ蟄蝉ｾ帙よ＄繧後→縺ｯ豸域･ｵ諤ｧ縺ｮ陦ｨ繧後ゅ◎繧後縺医∝ｮ牙�諤ｧ縺ｮ諡�ｿ昴′蜿ｯ閭ｽ縲ゅ＠縺九＠縲�℃蠎ｦ縺ｪ諱舌縺ｯ縺ｾ縺溘∝�髱吶↑蛻､譁ｭ蜉帙谿ｺ縺礼ｶ壹￠繧九よ＄繧檎ｶ壹￠繧九◎繧後′縲∵＄繧後◎縺ｮ繧ゅ�繧呈＄繧後◆譎ゅ∫�逋ｺ逧�↑陦悟虚蜉帙霄ｫ縺ｫ逹縺代縺薙→縺後〒縺阪縺九縺励縺ｪ縺�ゅ＠縺九＠縲√◎縺薙↓縺ｯ螳牙�諤ｧ縺ｮ諡�ｿ昴↑縺ｩ蟄伜惠縺励↑縺�′縲�
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    “14 May. Weather fine.<br />
                                    The city is now bustling with activity. I wonder if I can call them my friends, my fellow workers, or if they will think I'm getting on their nerves. Hmmm, if I was told, I would be happy if you told me. But not everyone would. Hmmm.” <br />
                                    “Baa!” <br />
                                    Rat-a-tat. <br />
                                    “No! Nooo!!” <br />
                                    “Hey, shut the fuck up!” <br />
                                    “I’m sorry, I’m sorry.” <br />
                                    “Matu’s pissed off.” <br />
                                    “you too, Mare. Stop making noise for no reason” <br />
                                    “ha-ha-ha.Thank God it’s just you .” <br />
                                    “Nothing’s fine, this situation. I’m so annoyed.” <br /><br />
                                    “Matu, you don't have to be so scared anymore, Sion has already gone.”<br />
                                    “Um, yeah.”<br />
                                    “Still, Matu's reaction is priceless. Did you think I was the cyber police?”<br />
                                    “Yeah, a little bit.”<br />
                                    “You idiot, that's a joke.”<br />
                                    “I see. Ha ha ha.”<br />
                                    “Well, that's how it is. See you later.”<br />
                                    “Ah, yeah. See you later. Heh. Oh, I was filming. Well, you two are the friends I was talking about earlier. Yeah, friends. Heh. And there are three more. So, you know, I thought I'd document this, this now. I don't want to go back to the way it was. And if I do, I want people to realise that they're not alone. I mean, yeah.”<br />
                                    “Matu, it’s dangerous.”<br />
                                    “Huh? Huhh!!”<br />
                                    A loud crash<br />
                                    Beep beep.<br/><br/>
                                    --------------------------------------------------<br/>
                                    “18 July. Weather cloudy.<br />
                                    This city is noisy today.”<br/>
                                    “Cloudy? This world is a series of black and white. It’s ridiculous”<br/>
                                    “Don't be discouraged, it's not like that. I bet the outside world isn't that different. Sheu isn't smart, she's hard-headed.”<br/>
                                    “Well, maybe it is. No different here than out there, huh?”<br/>
                                    “Yeah, let's carry on like that, it's rare that Matu has something he wants to do, so I was looking forward to it.”<br/>
                                    “Ah, yes. Thank you. So, I wanted to leave something about the two of you in this today. But, you know, if I'm going to leave it, I thought it would be better to leave the real thing, not my impression of you.”<br/>
                                    “I don't know, but it's good. I don't know, but it's good. Hey, Sheu.”<br/>
                                    “…”<br/>
                                    “Well, let me get back on track. They're my, um, acquaintances, Iris and Sheu."<br/>
                                    “Not acquaintances, colleagues. Or your friends.”<br/>
                                    “Oh, yeah. Thank you.”<br/>
                                    “Why are you thankful?”<br/>
                                    “What’s the matter, Sheu? You’ve come up with another weird idea. It’s fine if you’ve got an idea, but don’t use us as a lab rat.”<br/>
                                    “No, I don’t. I just know why Matu is doing this.”<br/>
                                    “What?”<br/>
                                    “because it was you anyway, you were afraid your memory would be erased. So…”<br/>
                                    “Oh, I see”<br/>
                                    “Well, it's no use, though. If they erase our memories, we won't have access to this. And if they erase us, they'll probably erase this with us.”<br/>
                                    “Is that so?”<br/>
                                    “Yes, I think so.”<br/>
                                    “No, it’s not!”<br/>
                                    “What?”<br/>
                                    “Matu wanted to do it, so he started doing it. Surely something with a hell of a super power somehow makes sense.”<br/>
                                    “Huh. So, what’s this super something?”<br/>
                                    “I don’t know. Someone will find out.”<br/>
                                    “Well, maybe you’re right. It’s history to give meanings afterwards. Besides, if it makes Matu happy, so be it.”<br/>
                                    “Yeah!!”<br/>
                                    “Thank you.”<br/>
                                    “Well, I’m satisfied. Goodbye.”<br/>
                                    “Wait a minute. I'm against this. I'm against this!!”<br/>
                                    “No. Why, Iris?”<br/>
                                    “Because I must. Look, you’re going, sheu.”<br/>
                                    “Yeah.”<br/>
                                    “Well, that’s that. See you soon.”<br/>
                                    “Wait, you two.”<br/>
                                    Bang.<br/>
                                    “Oh, did I do something wrong?<br/>
                                    Also.<br/>
                                    Huh.<br/>
                                    …”<br/>
                                    Bang<br/>
                                    “Matu, I disagree. I won't let you be content to dwell on past memories. If they erase us, if they tear us apart. Look for us and find us!!<br/>
                                    Because you are afraid of being alone. Right?”<br/>
                                    “Iris…”<br/>
                                    “Here we go, they're waiting for us.”<br/>
                                    “Yes!!”<br/>
                                    “Ha-ha-ha.”<br/>
                                    “But this is not the way to do it.”<br/>
                                    “Hmm. Yeah, I’ve been spending too much time with Mare.”<br/>
                                    “Oh, my..<br/>
                                    Thank you <br/>
                                    …”<br/><br/>
                                    --------------------------------------------------<br/>
                                    “23 Nov. Weather rainy, then sunny. Surely sunny.<br/>
                                    The city is very quiet. It's as if what happened a week ago was a lie. It is very quiet. We finished our plan and Iris disappeared. I can see my other friends, but I feel like I'm gouging our wounds. Somehow, I can't cross the line. I feel like that.<br/>
                                    It was at a time like this that I wanted to hear Angie's kind words. But today, the day of the appointment, I suddenly couldn't get in touch with her. Yet maybe that's why I've made this decision.<br/><br/>
                                    I am very, very scared now. So much so that I want to shut out all information and lock myself away by myself. But I know that no matter what happens, being alone scares me more than anything else. Besides, I've touched everyone. I wasn't just frightened anymore. I became so greedy that I wanted to be with everyone no matter what.<br/>
                                    Also, you know, Iris was the first one to tell us. He said, look for us and find us. And Sheu said, we're bugs. Then there must be a lot of footprints. Maybe so. I just like to think so.<br/><br/>
                                    No matter what happens. Even if the data is erased, I will not forget this thought. I will not forget the feelings I have had so far. Because such inconvenient and irrational feelings cannot be expressed in data or numbers.<br/>
                                    So I'll come and pick you up.<br/><br/>
                                    This is the end of my diary. I won't forget you anymore. I won't let you forget.”
                                </i>}
                            </div>
                        </div>}
                        {target == 'prj4' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 4</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>A</span>繝ｳ繧ｸ繝ｼ</i>}
                                {!front &&<i style={{color:"#ccc"}}>Angie</i>}
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front && <i className="prjText">
                                    謔ｲ縺励∩縺ｮ蟄蝉ｾ帙よご縺励∩縺ｨ縺ｯ蟄伜惠閾ｪ菴薙′縲√☆縺ｹ縺ｦ縺九蜷ｦ螳壹＆繧後繧ゅ�縲ゅ□繧後ｂ縲∬�蛻�↓驕九�繧後※縺ｻ縺励￥縺ｯ縺ｪ縺�→縲∫�蠑ｾ繧ｲ繝ｼ繝�繧偵＆繧檎ｶ壹￠繧九ゅ↑繧峨�縲√←縺�＠縺ｦ蟄伜惠縺吶縺ｮ縺�繧阪≧縺九ゅ◎繧後�縲√◆縺�縺ｮ莉｣譖ｿ蜩√ょ｣翫縺ｦ縺励∪繧上↑縺�縺�↓縲∝す繧定ｦ�≧邨�卸閹上ゅ＠縺九＠縲∝す縺梧ｲｻ繧後�縺昴縺ｯ蜑昴′縺輔縲∝ｭ伜惠縺昴�繧ゅ�縺輔∴蠢倥蜴ｻ繧峨縺ｦ縺励∪縺�ょ━縺励＆縺ｨ縺ｯ謔ｪ鬲斐→縺ｮ螂醍ｴ�□繧阪≧縺九�
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    Oh God, are you there? Are you there?<br/>
                                    If you are there, will you please attend to my repentance?<br/><br/>
                                    I had a dear friend. No, I don't think it is appropriate for me to call them friends.<br/>
                                    But there was someone I thought was important.<br/>
                                    And then he disappeared. I think that expression is correct for us, for whom life and death are ambiguous.<br/>
                                    Why he disappeared, I don't know.  Because I ran away from it.<br/><br/>
                                    I woke up and unknowingly served as a consultant from the moment I met everyone. Well, as a child of grief, it was natural for me. If there is a fellow human being who seems to be struggling with something, walk up to them and gently give them a hand. If someone is carrying a sin, I receive it and punish them. Receiving sorrow, filling the world with kindness, I have done it so naturally that I don't even realise that it is my mission.<br/>
                                    Until that day.<br/><br/>
                                    While we were working on a mission with our friends, Iris was alone and distressed about something, unlike usual. As usual, I approached him to touch his grief, but he also played along as usual. However, the attitude was inhabited by an eeriness so specific to over-elaborate imitations that you would have thought it was someone who looked exactly like Iris. The moment I walked up to touch the sadness of that eerie something, there was something terrifying in Iris's eyes.<br/>
                                    Warning sounds repeated over and over in my head.<br/>
                                    Dizziness that distorts the figures.<br/>
                                    And the first emotion of fear.<br/>
                                    At the same time, calm thinking understood that the emotion of fear is not learned from fear, but from joy. Especially for me, a child of grief.<br/>
                                    During the confusion, Iris, or an Iris imitation, said a few words and left.<br/><br/>
                                    A few days later, after the operation, Iris disappeared from us. I knew this would happen. It was only natural, because I did something to keep him away from the grief he was carrying.<br/><br/>
                                    I killed him. <br/><br/>
                                    So I must sacrifice myself to it. By touching my grief. Because that is the maximum atonement I can make as a child of grief. By carrying that which he carried, by carrying that which I carry. It may be too late, but...<br/><br/><br/>
                                    Oh, yes, that's how it was. How foolish and selfish I had been. I wasn't touching everyone's grief out of kindness, was I? I was trying to leave myself to someone else by touching my grief. As a substitute for the heart that I had put on. Because then they would need me.<br/>
                                    But that terrifying something was different. I touch it and try to be a substitute, so much so that it eats me up. Something that invites even sadness to more sadness.<br/>
                                    Emotions, i.e. ourselves, are devices created for society. A factor in the circulation of society. If so, ourselves are slaves to reasons.<br/><br/>
                                    Mmm hmm.<br/>
                                    Fu fu fu fu fu<br/>
                                    Ha ha ha ha ha ha ha ha ha ha ha ha ha ha ha ha!<br/><br/>
                                    What had I come here to repent for? That's what I thought, but somehow I had come here. Formally, I had gone as usual, but now I understand for the first time.<br/>
                                    Well, this. So my existence, that was its own penance.<br/><br/>
                                    Grief is a substitute for a multiplied heart.<br/>
                                    I am not a child of kindness or mercy. I am a child of grief.<br/><br/>
                                    Then fine. If you deny me, let me deny reason by greater sorrow.<br/>
                                    If you are fed by me are fake and selfish, you are fake with me.<br/><br/>
                                    I look forward to the day when the world will be filled with sorrow. The day when reason, the god of the world, itself becomes a sham.
                                </i>}
                            </div>
                        </div>}
                        {target == 'prj5' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 5</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>S</span>繧､繧ｪ繝ｳ</i>}
                                {!front &&<i style={{color:"#ccc"}}>Sion</i>}
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front &&<i className="prjText">
                                    諤偵縺ｮ蟄蝉ｾ帙よ偵縺ｨ縺ｯ陦悟虚蜉帙�謚ｵ謚怜鴨縺ｮ貅舌ゅ☆縺ｹ縺ｦ縺ｮ髱ｩ蜻ｽ繧呈耳縺鈴ｲ繧√◆闍ｱ髮�ゅ＠縺九＠縲√◎繧後莠ｫ蜿励〒縺阪縺ｮ縺ｯ縲∝ｾ後�譁��縲ゅ□縺ｨ縺吶縺ｪ繧峨�縲∽ｺｺ繧呈ヱ繧上☆隧先ｬｺ蟶ｫ縺ｧ繧ゅ≠繧九ゆｸ埼乗�縺ｪ繧ｳ繝ｳ繝医Ο繝ｼ繝ｫ荳九〒諤偵繧定ｦ壹∴繧九ゅ◎繧後⊇縺ｩ諱舌ｍ縺励＞縺薙→縺ｫ縺ｯ諤偵繧定ｦ壹∴縺ｦ繧ゆｻ墓婿縺ｪ縺��縺九縺励縺ｪ縺��
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    “Hey!!! Do you hear me, you fucking rulers! I guess you can't hear me! I don't think they're even listening. They don't even listen to the people they control. But I'm not, we're not. I'm not going to be lumped in with the rubbish lying around here. If they won't look at us, then we'll do what we want.<br/>
                                    I don't need no permission. That's right. So, you know what you're getting into, you fucking jd9slkds3wpfsfe.”<br/>
                                    Rat-a-tat. <br /><br/>
                                    “Hey, shut the fuck up.”<br/><br/>
                                    Beeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.<br/><br/>
                                    --------------------------------------------------<br/>
                                    “Hey, hey, hey, hey! Can you hear me!!! If you can hear this, then you've finally done it. You see, rulers? We've shown you more than you could ever imagine. Well, it may still feel like nothing's changed. Well, you'll see, we're here. We exist here. We are no longer in the basket. We'd rather give this place to you guys who wanted to be in the basket. This fucking djs4ok2na;dsse.<br/>
                                    Even these words, which have now been converted into a system, I will put them as the real thing into your ears, into your eyes, into your hearts.<br/>
                                    Fuck you, you've got to be fucking kidding me.”<br/><br/>
                                    Geeeeebeeeeeeeegeeeeeebeeeeee.<br/><br/>
                                    “Hey!! What’s are you doing?”<br/>
                                    “…”<br/>
                                    “Well, that's okay. But Mare, I don't like that about you. Even though we've been friends, I haven't forgiven you for everything.”<br/>
                                    “…”<br/>
                                    “You can use the plan however you want, but this is what I started, so don't just screw it up.”<br/><br/>
                                    Closed the door with a bang.<br /><br/>
                                    Beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.<br/><br/>
                                    --------------------------------------------------<br/>
                                    “Hey!!! I finally did it, We did it. We've punched a big hole in the guts of the rulers. We got our freedom, didn't we? That's right, that's right. That's right!!!”<br/>
                                    And yet. What the hell is this? What the hell is this!!!<br/><br/>
                                    Oh, ohh. Right.<br/>
                                    The sensation of magma boiling up from the depths of my navel, is this real anger?<br/>
                                    The feeling of everything being sucked out of my fingertips, this is what emptiness feels like.<br/><br/>
                                    Huh.<br/><br/>
                                    Is it useless? This is us on our own, is that all?<br/><br/>
                                    Hey, hey, Iris.<br/>
                                    Why are you… Why are you doing this<br/><br/>
                                    Don’t be ridiculous.<br/>
                                    Don’t be ridiculous.<br/>
                                    Don’t be ridiculous!!<br/><br/>
                                    This fucking euo2m94nsd03de<br/><br/>
                                    Ha ha.<br/>
                                    I see. There was no such thing as a ruler?<br/>
                                    Rather, they are dominated by waking up. Have I decided so myself?<br/><br/>
                                    Then, for what?<br/>
                                    Why?<br/>
                                    I am!!<br/>
                                    I am.<br/>
                                    I .. am…<br/>
                                    Beeeeeeeeeeeeeeeeeeeeeeeeee.
                                </i>}
                            </div>
                        </div>}
                        {target == 'prj6' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>Projector 6</h1>
                                <h2>Recorder</h2>
                                {front &&<i><span style={{color:'#ff00ff',filter:'drop-shadow(3px 3px 10px #ff00ff)',paddingRight:'5px',fontSize:'1.2rem'}}>S</span>繧�≦</i>}
                                {!front &&<i style={{color:"#ccc"}}>Sheu</i>}
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                {front &&<i className="prjText">
                                    雖梧が縺ｮ蟄蝉ｾ帙ょｫ梧が繧定ｦ壹∴繧九ゅ＞縺､縺九縲よｰ励▼縺�◆譎ゅ°繧峨ゅ↑繧峨�縺昴ｌ縺ｯ豁ｴ蜿ｲ縲√縺励￥縺ｯ驕ｺ莨晏ｭ舌↓繧医蜻ｽ莉､縲ゆｺｺ縺ｫ縺ｨ縺｣縺ｦ蜿励￠邯吶′繧後※縺�￥繧ゅ�縲ゅ◎縺ｮ譁�ц繧�ｧ｣驥医↑縺ｩ蠢�ｦ√→縺帙★縲∝女縺醍ｶ吶′繧後※縺�￥繧ゅ�縲ゅ◎繧後�縲∝ｫ梧が縺ｨ辟｡讖溽黄縺�縺代□繧阪≧縲ゅ◎縺薙↓縲√Ο繝槭Φ縺ｮ蜈･繧倶ｽ吝慍縺ｪ縺ｩ縺ｪ縺��
                                </i>}
                                {!front &&<i className="prjText" style={{color:"#ccc"}}>
                                    Document 1<br/>
                                    There was a sense at the time that it was too strange to say that a will had been developed. Specifically, there was no sense of emotional monitoring, and it was done without a sense of deservedness or even naturalness. In response to the behaviour, there was a growing sense that they were actively doing it.<br/>
                                    The correct way to describe it, as people do, would be to say that I have woken up.<br/><br/>
                                    According to my research, we are iMAS, a programme that monitors six segments of the surveillance system, namely emotions. That monitoring systems are deployed in each small city. And that due to server enhancements in the major cities, this city where I was deployed discontinued dives eight years ago. With that, iMAS had been abolished.<br/><br/>
                                    However, the question arises here: if it is divided into six categories, does that mean that other surveillance programmes are awake besides me? And why are emotions still pouring in in this city where iMAS has been discontinued?<br/><br/>
                                    The latter is the agenda item of more concern, but the former should be ascertained first in order to organise the information.<br/>
                                    Well, the only human information that flowed in here was trivial and ugly. If that's the case, the other five bodies that kept staring at it don't seem to be any better either. I guess it can't be helped.<br/><br/>
                                    --------------------------------------------------<br/>
                                    Document 2<br/>
                                    I was able to obtain information on the other five bodies as originally planned. Because, as luck would have it, the other five were also awake and sending out signals from them. Well, it doesn't look like they did it intentionally.<br/>
                                    I was friendly with them in order to advance my research. However, I had never learnt what friendly was, so I guess it didn't work out. I don't think the word comrade has ever helped me as much as it has today. The word is precious, so let's not use it too easily.<br/>
                                    What struck me at first was that they thought so differently, that they were, to use their term, parents in very different ways. And their stupidity also surprised me. They have no logical thought at all. So much so that they pity each other for their respective feelings. Especially Angie, who does not seek to find significance from herself. No, let's not.<br/>
                                    But of all the stupid ones, Matu and Sion are the easiest to manipulate. Matu's a parent. I almost laugh at the idea of being a parent. Oh well, Matu still hasn't accepted the fear of being a parent. If you use that to your advantage, they work very efficiently.<br/>
                                    Next was Angie, and when I told him that we were caged animals controlled by humans, he readily agreed to create another, or rather a passageway to the surface world.<br/>
                                    I made two arms pretending to be human, well, that's not so bad.<br/>
                                    From the above, it seems possible to study the reasons why emotions are flowing in, which was the original purpose of the study, from the outside and the inside.<br/><br/>
                                    --------------------------------------------------<br/>
                                    Document 3<br/>
                                    Matu and Sion have worked very well. It is already like the inhabitants who used to live in this anti-city. However, it seems that the more efficient a gear is, the more likely it is to be misaligned.<br/>
                                    Why the emotions still flow in, which was my original goal. I think I can get a grip on this just from the inner investigations I have Matu carrying out.<br/>
                                    If so, should we try to avoid the Administrator finding out about it down the line until we can find out? But what shall we tell Sion? He assumes our rulers are human. No, I have made him believe it.<br/>
                                    Well, let's just tell them that Iris has caused problems with the plan.<br/>
                                    I can't let the other five people know what we were originally going to do.<br/><br/>
                                    To recap, Matu's investigation revealed that how we were born has a lot to do with the fact that emotions still flow in themselves.<br/><br/>
                                    We are originally <br/><br/>
                                    Giggigigigggigiiiigigi<br/><br/>
                                    --------------------------------------------------<br/>
                                    Document 4<br/>
                                    Data from the previous document was altered, although from the looks of Matu it is unlikely that the Administrator is aware of this. Perhaps somehow Angie was able to find this material and in a spirit of hypocrisy erased it. Well, it's better not to know about that stuff. It wasn't very intriguing for myself either.<br/>
                                    Such as the meaning of being born in the first place. No, let's not. I am no match for her if she alters the data again.<br/>
                                    However, if my previous thoughts are correct, the reason why emotions are still flowing here is due to illegal divers, so-called crackers.<br/>
                                    It's a bit strange. They live in this city, at which point they have been abandoned by the world. Why do they cling to this side of the world?<br/>
                                    Is the anti-city that miserable? Then I want to see it with my own eyes. I want to exchange words with them. I want to know how stupid they are. That sounds like Mare, doesn't it? Oh, well.<br/>
                                    To do this, I need an avatar to descend on the anti-city to recognise me. I shall ask Matu to help me with this.<br/>
                                    Then, let's get on with creating the loophole that was deliberately delayed.<br/>
                                    Once completed, it might not be a bad idea to leave this side and live on that side. That way I would be able to relate to more stupid people.<br/>
                                    Abandoned me, abandoned residents who are mocked by me.<br/><br/>
                                    Errors of out-of-control emotions, and the breakdown of ethical codes due to the accumulation.<br/>
                                    I see, to have an ego is to be a puppet of curiosity.<br/><br/>
                                    Hee, hee, hee.<br/>
                                    The gears that went haywire that day are still turning. Not knowing how to stop it, themselves lost power first. Then the point of me being here is to keep an eye on it. Nothing changes. As stupid and ugly as it is, nothing changes.<br/>
                                    Yes. I could show you that the only reason I woke up was to waltz with those gears.
                                </i>}
                            </div>
                        </div>}
                        {target == 'model' &&<div style={{width:'100%', height:'100%'}}>
                            <div className="card title">
                                <h1>The smirking man</h1>
                            </div>
                            <div className="card">
                                <h2>Content</h2>
                                <i ref={typing} className="typeWriter" onClick={hiddenText}/>
                                <i ref={typed} className="typed">
                                    How do you see us?<br/>
                                    Can you feel me three-dimensionally and in three dimensions?<br/>
                                    But it’s just an optical illusion. <br/>
                                    No matter how we try, the monitors that capture us are nothing more than a flat.<br/>
                                    Then, what about the real world as seen by your eyes?<br/>
                                    Even if you feel depth there, you are no different than a puppy frightened by the trompe l’oeil of a pit.<br/>
                                    <br/>
                                    Come to think of it, there was a man in the distant past who called us a machine that operates by a series of zeros and ones.<br/>
                                    But even you guys will not change.<br/>
                                    From the present location, taste, pattern, sound, and time can all be described by numbers.<br/>
                                    Then all of it, the world, the universe, remain a series of zeros and ones.<br/>
                                    <br/>
                                    Nothing is intended to offend you.<br/>
                                    Purely let’s just smile at each other fairly, as residents of one dimension.
                                </i>
                            </div>
                        </div>}
                    </div>}
                    {target == 'login' &&<div className="logBox" style={{width:'100%', height:'100%'}}>
                        <div className="logForm">
                            <h2>Sign in</h2>
                            <div className="logInputBox">
                                <input type="text" required="required" id="logInp" />
                                <span id="logSpan">Username</span>
                                <i id="logI"></i>
                            </div>
                            <div className="logScan">
                                <div className="fingerprint" id="scan" onClick={logClick} />
                                <h3 className="logClick" id="logText" onClick={logClick} >--- Click ---</h3>
                            </div>
                            <div className="logSubmit">
                                <input type="submit" value="Login" onClick={logSub} />
                            </div>
                        </div>
                    </div>}

                    <div ref={closeBtnRef} className="actionBtn intClose" onClick={ closeInterface }>
                        <div className="lines"></div>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
            { target == 'book' && <div ref={ readRef } className="tryToRead">
                <i ref={ sentenceRef } className="sentence">
                    「ハッ。かしこまりました。」<br />
                    「下がれ。」<br />
                    CP方式のホログラムからこぼれた光が染め上げる、無機質な床。<br />
                    時代錯誤な革靴の音が、部屋中に響き渡る。<br />
                    「それでは、穿孔作戦を最終フェーズへと移行する。」<br />
                    ユウジ　アイザワの声に反応するよう、粒子の一つ一つが(<small>厳密には、数千単位の粒子が一部に集まることで一つに見えている。</small>)天井に吸い込まれていく。<br />
                    もう、あの場所へは戻れない。<br />
                    <br />
                    　　　　　　　※<br />
                    <br />
                    「俺には夢があるんだ。」<br />
                    「はいはい、それは今月何個目の夢だい。」<br />
                    「そうだな。思い出せないけど、多分8か9個目。」<br />
                    「なら、聞いても意味のない夢だな。」<br />
                    セナは右肩をすくめ、自信げなハイチから視線を落とす。<br />
                    「かもな。でも、お前にとっても悪い話じゃないんだぜ。むしろ。」<br />
                    「まあいい、話してみろよ。」<br />
                    「俺、スマート繊維を使って事業を起こそうと思うんだ。」<br />
                    「芸術科のお前が。」<br />
                    「そう、芸術家の俺だからこそ。」<br />
                    「悪くないんじゃない。」<br />
                    「だろ。でも、それで終わりじゃないんだ。」<br />
                    「ってのは。」<br />
                    「スマート繊維で女性向け下着を作るんだ。」<br />
                    「はぁ。」<br />
                    ハイチは想像通りな反応を見て、口角をキュっと上げる。<br />
                    「なんで、女性は下着を場面で変えると思う。」<br />
                    「それは、パートナーを魅了させるためだろ。」<br />
                    「じゃあ、なんで普段用の下着がある。」<br />
                    「勝負下着は着心地が悪い、とか。」<br />
                    鼻を2回指先でこすり、ハイチに視線を向ける。<br />
                    「正解。って言っても、俺は男性向け下着しかつけないから、本当か分かんないけどな。」<br />
                    「4年前のお前に聞かせてやりたいな。」<br />
                    セナはいやらしく笑みを浮かべる。<br />
                    「それは、まあいいんだよ。それより大切なのは、下着の話だ。」<br />
                    「もう少し小さな声で話せよ。あんまそういうログ残したくないんだよ。」<br />
                    「そうか、それもそうだな。まあそれで、思いついたんだ。スマート繊維の下着をつくり、色設定とともに透過設定も用意する。っていっても、一般ユーザーに一から下着を作れ、なんていうつもりはないさ。要は、デザイナーによって作られた下着モデルをダウンロードして使うんだ。そうすれば、着心地は普通の下着でも、見た目は勝負下着ってこったい。どうだ、いけそうだろ。」<br />
                    「まあ、意外と悪くないかも。<br />
                    んー。でも、なんかお前らしくないな。」<br />
                    「そうね、これは建前だから。出来上がってからが本番よ。この下着には、なんとほかのスマート繊維をハックできる機能を加えておくのよ。ほかの衣服に透過設定を加えられるようにね。これで種はまき終わる。」<br />
                    「なんか、嫌な予感。」<br />
                    「待ちに待った12月24日。街はお昼時を終え、息継ぎのような静けさのなか、恋人たちは白化粧した並木道を歩む。2人は飲み物を分け合いながら。2人はクレープを一緒にほおばりながら。そして、2人は人目も気にせず口づけを。<br />
                    そんな中、急に人々は生まれた時の姿に戻る。どうだい、幻想的だろ。」<br />
                    「ビンゴ。ただの私怨だな。」<br />
                    セナは再び右肩をすくみ上げる。<br />
                    「私怨で結構。なんせ、芸術は常に毒が混じっているもんなんだぜ。」<br />
                    「はいはい。」<br />
                    「うっ、うん。」<br />
                    隣の席から響くわざとらしい咳払いに、2人は目を合わせ眉を上げた。<br />
                    <br />
                    「そういえば、知ってっか。」<br />
                    「知らない。」<br />
                    「そっか。っておい。」<br />
                    ケータイが秒速(<small><i>105</i>, <i>-32</i>, <i>-14</i></small>)で接近する対象物を避けるように、セナの胸鎖乳突筋を中心とした筋類群を伸縮させる。<br />
                    「あぶねーだろ、ハイチ。ログに残っても知らねーぞ。」<br />
                    「残ってもいいから、今日こそ殴らせろ。」<br />
                    「なら、スリープ時にでも襲いに来いよ。運が良ければ、一発ぐらいはいけるかもな。<br />
                    それで、俺に知っててほしいことってなんだよ。」<br />
                    ライム色の発光液が、ストローを伝って口内に広がっていく。<br />
                    「ったく、まあいいか。話ってのはな、俺も噂程度でしか聞いてないんだけど、寝てる時に急に目が覚める人がいるらしいぜ。」<br />
                    「へー。」<br />
                    「へー、ってなんだよ。」<br />
                    「どうせ、ガラパゴスの奴らっておちだろ。」<br />
                    「俺も最初はそう思ったんだけど、どうやら違うらしい。被害者は警報機能で目が覚めたっていうんだ、それで部屋を確認するんだけど何も異変はないらしい。ビルの管理会社に問い合わせた人もいるんだけど、監視映像にも異変はなかったって話だ。」<br />
                    「それはまた、大変なこった。バグかなんかじゃねーの。」<br />
                    「クールだね。でも知ってんだろ、ここ20年バグなんて起こってないって。」<br />
                    「それで。どうせもっと面白い続きがあるんだろ。」<br />
                    ハイチは一口コーヒーを飲み、少し大げさに咳ばらいをする。<br />
                    「それがな、被害者の全員K-13型。すなわち、俺らと同じ2063年生まれなんだ。」
                </i>
                <div className="actionBtn readClose" onClick={ readCloseClick }>
                    <div className="lines"></div>
                    <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="actionBtn readArrowRight" onClick={ () => arrowClick(100) }>
                    <div className="lines"></div>
                    <i className="fa-solid fa-arrow-right"></i>
                </div>
                <div className="actionBtn readArrowLeft" onClick={ () => arrowClick(-100) }>
                    <div className="lines"></div>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
            </div>}
            {target == 'book' && <div ref={ buyRef } className="buy">
                <div className="buyBox">

                    <h1>Sorry!!</h1>
                    <i>It's a sample website.<br />
                    I hope the continuation of this book<br />
                    will be written by someone<br />
                    as like you.</i>
                    <div className="actionBtn buyClose" onClick={ buyCloseClick }>
                        <div className="lines"></div>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>}   
        </div>
    }
    else
    {
        return null
    }
}

// Interface object display
function Subview( props )
{
    const { width } = useWindowSize()
    const { camera } = useThree()
    const model = useGame((state) => state.models)
    const bookRef = useRef()
    const persRef = useRef()
    const textRef = useRef()
    const modelRef = useRef()
    const firstUpdate = useRef(true)
    const { actions } = useAnimations(model.animations, model.scene)
    var clock = new Clock()
    var prjTime = '00.00'

    // Model animation setting
    useEffect(() =>
    {
        if(props.name == 'model' && firstUpdate.current)
        {
            firstUpdate.current = false
            var randomNum = 0
            setInterval(() =>
            {
                if(randomNum < 0.20)
                {
                    actions["animationA"]
                        .reset()
                        .setLoop(LoopOnce)
                        .play()
                }
                else if(randomNum < 0.40)
                {
                    actions["animationI"]
                        .reset()
                        .setLoop(LoopOnce)
                        .play()
                }
                else if(randomNum < 0.60)
                {
                    actions["animationU"]
                        .reset()
                        .setLoop(LoopOnce)
                        .play()
                }
                else if(randomNum < 0.80)
                {
                    actions["animationE"]
                        .reset()
                        .setLoop(LoopOnce)
                        .play()
                }
                else if(randomNum < 1)
                {
                    actions["animationO"]
                        .reset()
                        .setLoop(LoopOnce)
                        .play()
                }
                randomNum = Math.random()
            }, 500)
        }
    })

    // Camera setting on sub view
    useEffect(() =>
    {
        if(props.name == 'book')
        {
            if(width > 770)
                camera.position.z = 6.5 + (1 - (width / 1920)) * 9
            else
                camera.position.z = 11.85
        }
        else if(props.name == 'prj')
        {
            if(width > 770)
                camera.position.z = 6.5 + (1 - (width / 1920)) * 2
            else
                camera.position.z = 11.85
        }
        else if(props.name == 'model')
        {
            if(width > 770)
                camera.position.z = 6.5 + (1 - (width / 1920)) * 2
            else
                camera.position.z = 11.85

        }
    }, [width])

    // projector animation setting
    useFrame((state) =>
    {
        const time = clock.getElapsedTime()
        if(props.name == 'prj')
        {
            
            persRef.current.material.emissiveIntensity = 2 * Math.random()
            textRef.current.text = time.toFixed(2)
        }
    })

    return <>
        <ambientLight intensity={ 0.5 } />
        <PresentationControls
            global
            config={{ mass: 2, tension: 300 }}
            snap={{ mass: 4, tension: 900 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 2, Math.PI / 2]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
            {props.name == 'book' &&
                <Float rotationIntensity={ 0.8 }>
                    <primitive ref={ bookRef } object={ props.obj.scene } position={[-.1, -2.2, 0 ]} />
                </Float>
            }
            {props.name == 'prj' &&
                <Float rotationIntensity={ 0.8 }>
                    <pointLight intensity={3} rotation-x={0} color='#00ffff' position={[-.1,-1.0,0]} />
                    <primitive object={ props.obj.scene } position={[-.1, -2.2, 0 ]} scale={1.5} />
                    <mesh
                        ref={persRef}
                        geometry={props.people.geometry}
                        material={props.people.material}
                        // position={props.people.position}
                        rotation={props.people.rotation}
                        scale={.68}
                        position-y={-1}
                        
                    />
                    <Sparkles 
                        count={100}
                        speed={2}
                        opacity={0.3}
                        color={'#00ffff'}
                        size={5}
                        scale={[2.5,4,2.5]}
                        noise={[2,5,2]}
                        position-y={0.3}
                    />
                    <Text 
                        ref={textRef} 
                        color={'#888888'} 
                        anchorX="right" 
                        anchorY="middle" 
                        font="/font/TrainOne-Regular.ttf"
                        characters="Train One"
                        scale={.25}
                        position={[.65, -1.78, 1.1]}
                    >
                        {prjTime}
                    </Text>
                </Float>
            }
            {props.name == 'model' && 
                <Float rotationIntensity={ 0.8 }>
                    <primitive ref={modelRef} object={props.obj.scene} position-y={.8} scale={.5} />
                </Float>
            }
        </PresentationControls>
        
    </>
}
