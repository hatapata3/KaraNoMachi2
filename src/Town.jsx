import { Html, useGLTF, useFBX, useAnimations, shaderMaterial } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import clVertexShader from './shaders/vertex.glsl'
import clFragmentShader from './shaders/circleLight/fragment.glsl'
import plFragmentShader from './shaders/plane/fragment.glsl'
import fieldFragmentShader from './shaders/field/fragment.glsl'
import React, { useEffect, useRef, useMemo } from "react"
import { useFrame, useThree, extend } from "@react-three/fiber"
import useGame from "./stores/useGame.jsx"
import * as THREE from 'three'
import About from './About.jsx'

// Shader material setting
const ClMaterial = shaderMaterial(
    {
        uTime: 0
    },
    clVertexShader,
    clFragmentShader
)
extend({ ClMaterial })
const PlMaterial = shaderMaterial(
    {
        uTime: 0
    },
    clVertexShader,
    plFragmentShader,
)
extend({ PlMaterial })
const FieldMaterial = shaderMaterial(
    {
        uTime: 0,
        uResolution: {x: 500, y: 500}
    },
    clVertexShader,
    fieldFragmentShader,
)
extend({ FieldMaterial })

export default function Town()
{
    const { camera } = useThree()

    const target = useGame((state) => state.target)
    const gizouNum = useGame((state) => state.gizouNum)
    const punishment = useGame((state) => state.punishment)
    const front = useGame((state) => state.front)
    const objPos = useGame((state) => state.objPos)
    const menu = useGame((state) => state.menu)
    const focus = useGame((state) => state.focus)
    const offocus = useGame((state) => state.offocus)
    const intModeOn = useGame((state) => state.intModeOn)
    const drunk = useGame((state) => state.drunk)
    const sober = useGame((state) => state.sober)
    const gizouLost = useGame((state) => state.gizouLost)
    const modelSet = useGame((state) => state.modelSet)
    const addNoise = useGame((state) => state.addNoise)
    const turn = useGame((state) => state.turn)
    const musicPlay = useGame((state) => state.musicPlay)
    const musicPause = useGame((state) => state.musicPause)
    const punish = useGame((state) => state.punish)
    const approve = useGame((state) => state.approve)

    const objectRef = useRef()
    const clRef = useRef()
    const clMaterial = useRef()
    const modelRef = useRef()
    const plMaterial1 = useRef()
    const plMaterial2 = useRef()
    const fieldMaterial = useRef()
    const text2 = useRef()
    const text1 = useRef()
    const phoneGRef = useRef()
    const phoneRef = useRef()
    const htmlRef = useRef()
    const handRef = useRef()
    const bookRef = useRef()
    const projectorsRef = useRef([])
    const drinkRef = useRef()
    const glassRef = useRef()
    const skeltonRef = useRef()
    const loginRef = useRef()
    const trainRef1 = useRef()
    const trainRef2 = useRef()
    const fieldRef = useRef()
    const phoneG2Ref = useRef()
    const firstUpdate = useRef(true)
    const sightGuid = useRef(false)
    const phoneType = useRef(true)
    const animated = useRef(false)
    const animating = useRef(false)

    var glassPos = new THREE.Vector3()
    var randomNum = 0
    var skeltonNum = 0
    const selectText = document.querySelector('.selectText')

    // Object setting
    const town = useGLTF('./3dModel/town.glb')
    let circleLight = town.nodes.circleLight
    let train = town.nodes.train
    let book = town.nodes.book
    let drink = town.nodes.vendingMachine
    let login = town.nodes.login
    let field = town.nodes.field

    const townPhysic = useGLTF('./3dModel/townPhysic.glb')
    const modelAll = useGLTF('./3dModel/Lee.glb')
    const model = modelAll.scene
    const phone = useGLTF('./3dModel/phone.glb')
    const hand = useFBX('./3dModel/hand.fbx')
    const glass = useFBX('./3dModel/glass.fbx')
    const skelton = useGLTF('./3dModel/skelton.glb')
    const gizou = useGLTF('./3dModel/gizou.glb')

    const animations = useAnimations(hand.animations, hand)
    const action1 = animations.actions[ "action1" ]
    const action2 = animations.actions[ "action2" ]
    const action3 = animations.actions[ "action3" ]
    const glassAnimations = useAnimations(glass.animations, glass)
    const glassAction = glassAnimations.actions[ "drinkAnimation" ]

    const { actions } = useAnimations(skelton.animations, skeltonRef)

    // Projector placement
    function Projectors()
    {
        const list = []
        for(let i=1; i<7; i++)
        {
            const name = 'projector' + i
            const projector = town.nodes[name]
            projectorsRef.current[i] = React.createRef()
            list.push(<mesh
                key={i}
                ref={projectorsRef.current[i]}
                geometry={ projector.geometry }
                material={ projector.material }
                position={ projector.position }
                rotation={ projector.rotation }
                scale={ projector.scale }
                onPointerOver={ () => pointerOver('prj', i) }
                onPointerOut={ () => pointerOut('prj', i) }
                onClick={ () => changeMenu('prj', i) }
            />)
        }
        return(
            list
        )
    }


    if(firstUpdate.current)
    {
        // Town object setting
        town.scene.children.forEach((mesh) =>
        {
            mesh.castShadow=true
            if(mesh.name=='circleLight' || mesh.name=='book' || mesh.name=='vendingMachine' || ~mesh.name.indexOf('projector') || mesh.name=='login' || mesh.name=='train' || mesh.name=='field')
                mesh.isMesh=false
            else if(mesh.name=='capsuleGlass')
            {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    roughness: 0.2,
                    transparent: true,
                    // transmission: 1,
                    thickness: 1000,
                    envMapIntensity: 4,
                    opacity: 0.3
                })
            }
            else if(mesh.name == 'drinkGlass')
            {
                mesh.material = new THREE.MeshPhysicalMaterial({
                    roughness: .5,
                    transparent: true,
                    // transmission: 1,
                    thickness: 1000,
                    envMapIntensity: 4,
                    opacity: .3,
                })
            }
        })
        townPhysic.scene.children[0].isMesh=false

        // Model material setting
        modelAll.scene.children[0].children[0].castShadow = true
        modelAll.scene.children[0].children[0].material = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            color: 0x00ffff,
            emissiveIntensity: 1,
            wireframe: true,
        })
        modelSet(modelAll)

        // glass transparent setting
        glass.castShadow=true
        glass.children[0].castShadow=true
        glass.children[0].material[1]= new THREE.MeshPhysicalMaterial({
            roughness: 0,
            transparent: true,
            transmission: 1,
            thickness: 1000,
            envMapIntensity: 4,
            opacity: 0.5,
            emissiveIntensity: 1,
            reflectionRation: 0.8,
        })
        glass.children[0].material[2]= new THREE.MeshPhysicalMaterial({
            roughness: 0.2,
            transparent: true,
            transmission: 1,
            thickness: 1000,
            envMapIntensity: 4,
            opacity: 0.2,
            color: 0xffffff,
            reflectionRation: 0.8,
        })
        gizou.scene.castShadow=true
    }
    useFrame((state, delta) =>
    {
        // Model and material movement setting
        const et = state.clock.elapsedTime
        clMaterial.current.uTime += delta
        plMaterial1.current.uTime += delta
        plMaterial2.current.uTime += delta
        fieldMaterial.current.uTime += delta
        modelRef.current.rotation.y = et * .8
        modelRef.current.position.y = Math.sin(et) * 0.5 + 2.0
        trainRef1.current.position.z -= delta *10
        trainRef2.current.position.z += delta*10

        // object visible setting
        if(state.camera.position.z < -22 && plMaterial1.current.visible==false)
        {
            plMaterial1.current.visible=true
            text1.current.style.opacity=1
        }else if(state.camera.position.z > -22 && plMaterial1.current.visible==true)
        {
            plMaterial1.current.visible=false
            text1.current.style.opacity=0
        }
        if(state.camera.position.x > 25 && plMaterial2.current.visible==false)
        {
            plMaterial2.current.visible=true
            text2.current.style.opacity=1
        }else if(state.camera.position.x < 25 && plMaterial2.current.visible==true)
        {
            plMaterial2.current.visible=false
            text2.current.style.opacity=0
        }
        if(state.camera.position.z < -3 && clRef.current.visible == false)
        {
            clRef.current.visible = true
            modelRef.current.visible = true
        }
        else if(state.camera.position.z > -3 && clRef.current.visible == true)
        {
            clRef.current.visible = false
            modelRef.current.visible = false
        }
    })

    // model animation Setting
    useEffect(() =>
    {
        if(!firstUpdate.current && !animated.current)
        {
            setInterval(() =>
            {
                if(skeltonNum < 0.34)
                {
                    actions["coin"]
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                else if(skeltonNum < 0.67)
                {
                    actions['neck']
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                else if(skeltonNum < 1)
                {
                    actions['gun']
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                skeltonNum = Math.random()
            }, 8000)

            setInterval(() =>
            {
                if(randomNum < 0.33)
                {
                    action1
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                else if(randomNum < 0.66)
                {
                    action2
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                else
                {
                    action3
                        .reset()
                        .setLoop(THREE.LoopOnce)
                        .play()
                }
                randomNum = Math.random()
            }, Math.random() * 3000 + 3000)

            trainRef2.current.rotation.x = 3.14
            trainRef2.current.position.y = 13
            setInterval(() =>
            {
                trainRef1.current.position.z = 26
            }, 18000)
            setInterval(() =>
            {
                trainRef2.current.position.z = -52
            }, 15000)

            animated.current = true

            fieldRef.current.visible = false
            
        }
    })

    useEffect(() =>
    {
        // Phone mode setting
        const state = useGame.getState()
        if( firstUpdate.current )
        {
            firstUpdate.current = false
        }
        else if(state.target == 'phone')
        {
            if(gizouNum > 2 && camera.position.x < 0 && camera.position.z > 4)
            {
                phoneType.current = false
                punish()
                musicPause()
            }
            else if(punishment)
                phoneType.current = false
            else
                phoneType.current = true

            camera.lookAt(objPos.x, 1.282, objPos.z)
            var rad = (objPos.y - camera.position.y)  / 0.032
            if(rad<0)
                rad *=-1
            phoneGRef.current.setRotationFromQuaternion(camera.quaternion)
            phoneGRef.current.position.set(objPos.x , 1.27, objPos.z)
            phoneG2Ref.current.position.z -= Math.sin(rad) * 0.0289 - ( Math.abs(Math.sin(rad * 2)) * 0.014)
            if(Math.sin(rad) > 0.9995)
                phoneG2Ref.current.position.y -= Math.sin(rad) * 0.0116

            sightGuid.current = true
        }
        else if(state.target == 'none' && sightGuid.current)
        {
            if(!phoneType.current)
            {
                camera.lookAt(-7.3, 0.5, 6.6)
                sightGuid.current = false
            }
            else
            {
                camera.lookAt(objPos)
                sightGuid.current = false
            }
        }
        else if(!state.front)
        {
            // Front and back world's setting 
            setTimeout(() =>
            {
                fieldRef.current.visible = true
            }, 2000)
        }
    },[target])

    // Pointer action
    function pointerOver(name, int)
    {
        if(name == 'book' && front && camera.position.x > bookRef.current.position.x -8 && camera.position.x < bookRef.current.position.x +8)
        {
            bookRef.current.material.emissiveIntensity=10
            if(selectText != null)
                selectText.textContent = 'Click here for details'
        }
        else if(name == 'prj' && camera.position.x > projectorsRef.current[int].current.position.x -5 && camera.position.x < projectorsRef.current[int].current.position.x +5 && camera.position.z > projectorsRef.current[int].current.position.z -5 && camera.position.z < projectorsRef.current[int].current.position.z +5)
        {
            projectorsRef.current[int].current.material.emissiveIntensity=10
            if(selectText != null)
                selectText.textContent = 'Click here for details'
        }
        else if(name == 'drink' && camera.position.x > -5 && camera.position.x < 1.2 && camera.position.z < -17 && front)
        {
            drinkRef.current.material.emissiveIntensity=10
            if(selectText != null)
                selectText.textContent = 'Click here for drank'
        }
        else if(name == 'model' && camera.position.z < -10 && front)
        {
            if(selectText != null)
                selectText.textContent = 'Click here for details'
        }
        else if(name == 'login' && camera.position.x<-5 && camera.position.z < -18)
        {    
            loginRef.current.material.emissiveIntensity=10
            if(front && selectText != null)
                selectText.textContent = 'Click here for diving'
            else if(selectText != null)
                selectText.textContent = 'Click here for rising'
        }
        
    }
    function pointerOut(name, int)
    {
        if(name == 'book' && front)
        {
            bookRef.current.material.emissiveIntensity=1
            if(selectText != null)
            selectText.textContent = ''
        }
        else if(name == 'prj')
        {
            projectorsRef.current[int].current.material.emissiveIntensity=1
            if(selectText != null)
                selectText.textContent = ''
        }
        else if(name=='drink' && front)
        {
            drinkRef.current.material.emissiveIntensity=1
            if(selectText != null)
                selectText.textContent = ''
        }
        else if(name=='model' && front)
        {
            if(selectText != null)
                selectText.textContent = ''
        }
        else if(name=='login')
        {
            loginRef.current.material.emissiveIntensity=1
            if(selectText != null)
                selectText.textContent = ''
        }
    }
    function changeMenu(name, int)
    {
        if(name == 'book' && front && camera.position.x > bookRef.current.position.x -8 && camera.position.x < bookRef.current.position.x +8)
        {
            selectText.textContent = ''
            menu(name)
            focus()
            intModeOn()
        }
        else if(name == 'prj' && camera.position.x > projectorsRef.current[int].current.position.x -5 && camera.position.x < projectorsRef.current[int].current.position.x +5 && camera.position.z > projectorsRef.current[int].current.position.z -5 && camera.position.z < projectorsRef.current[int].current.position.z +5)
        {
            selectText.textContent = ''
            const prjName = name + int
            menu(prjName)
            focus()
            intModeOn()
        }
        else if(name == 'model' && camera.position.z < -10 && front)
        {
            selectText.textContent = ''
            menu(name)
            focus()
            intModeOn()
        }
        else if(name == 'login' && camera.position.x<-5 && camera.position.z < -18 && !front)
        {
            selectText.textContent = ''
            addNoise()
            setTimeout(() =>
            {
                addNoise()
                turn()
                fieldRef.current.visible = false
                musicPlay()
            }, 2000)
        }
        else if(name == 'login' && camera.position.x<-5 && camera.position.z < -18)
        {
            selectText.textContent = ''
            menu(name)
            focus()
            intModeOn()
        }
    }
    function drinking()
    {
        if(camera.position.x > -5 && camera.position.x < 1.2 && camera.position.z < -17 && !animating.current && front)
        {
            selectText.textContent = ''
            const drinkColor = {r:Math.floor(Math.random()*1000)/1000, g:Math.floor(Math.random()*1000)/1000, b:Math.floor(Math.random()*1000)/1000}
            camera.getWorldDirection(glassPos)
            glassPos.multiplyScalar(.6)
            glassPos.add(camera.position)
            
            animating.current = true
            glassRef.current.position.set(glassPos.x, glassPos.y - .1, glassPos.z)
            glassRef.current.setRotationFromQuaternion(camera.quaternion)
            glassRef.current.children[0].material[1].color.setRGB(drinkColor.r, drinkColor.g, drinkColor.b)
            glassRef.current.children[0].material[1].emissive.setRGB(drinkColor.r, drinkColor.g, drinkColor.b)
            glassRef.current.visible = true
            glassAction
                .reset()
                .setLoop(THREE.LoopOnce)
                .play()
            focus()
            
            // drinkingAnimation
            setTimeout(() =>
            {
                drunk()
                glassRef.current.visible = false
                animating.current = false
                offocus()
            }, 2300)
            setTimeout(() =>
            {
                sober()
            }, 20000)
        }
    }

    // Gizou display setting
    function Gizou({ position, rotation, ...props })
    {
        const scene = useMemo(() =>
        {
            return gizou?.scene?.clone(true)
        }, [gizou])

        if(gizouNum > 3)
        {
            setTimeout(() =>
            {
                gizouLost()
                musicPlay()
                approve()
            }, 10000)
        }
        return <primitive object={scene} position={position} rotation-y={rotation} {...props} />
    }

    return<>
        <group ref = {objectRef}>
        <primitive object={ town.scene } />
        <mesh 
            ref = {clRef}
            geometry={ circleLight.geometry }
            position={ circleLight.position }
            rotation={ circleLight.rotation }
            scale={ circleLight.scale }
        >
            <clMaterial ref={clMaterial} />
        </mesh>
        <mesh 
            ref={trainRef1}
            geometry={train.geometry}
            material={train.material}
            position={train.position}
            rotation={train.rotation}
            scale={train.scale}
        />
        <mesh 
            ref={trainRef2}
            geometry={train.geometry}
            material={train.material}
            position={train.position}
            rotation={train.rotation}
            scale={train.scale}
        />

        <mesh
            ref={modelRef}
            geometry={modelAll.nodes.Scene.children[0].children[0].geometry}
            material={modelAll.nodes.Scene.children[0].children[0].material}
            position={ [-.45, 3, -17.5] }
            rotation={ model.rotation }
            scale={ .16 } 
            onPointerOver={ () => pointerOver('model') }
            onPointerOut={ () => pointerOut('model') }
            onClick={ () => changeMenu('model') }
        />

        <group position={ [ 30, 4, 6.2] } rotation={[ 0 , -Math.PI * 0.5, 0 ]} scale={[5, 8, 0]}>
            <mesh>
                <planeGeometry />
                <plMaterial
                    ref={plMaterial2}
                    transparent={true}
                    visible={false}
                    opacity={0}
                />
                <Html
                    ref={text2}
                    wrapperClass="label"
                    center
                    distanceFactor={8}
                >
                    NO ENTRY
                </Html>
            </mesh>
        </group>
        <group position={ [ 0.5, 4, -26.5] } rotation={[ 0, 0, 0 ]} scale={[11, 8, 0]}>
            <mesh>
                <planeGeometry />
                <plMaterial
                    ref={plMaterial1}
                    transparent={true}
                    visible={false}
                    opacity={0}
                />
            </mesh>
            <Html
                    ref={text1}
                    wrapperClass="label"
                    center
                    distanceFactor={8}
                >
                    NO ENTRY
                </Html>
        </group>
        <primitive ref={glassRef} object={glass} scale={.01} visible={false} />
        <mesh
            ref={bookRef}
            geometry={ book.geometry }
            material={ book.material }
            position={ book.position }
            rotation={ book.rotation }
            scale={ book.scale }
            onPointerOver={ () => target =='none' && pointerOver('book') }
            onPointerOut={ () => target == 'none' && pointerOut('book') }
            onClick={ () => target == 'none' && changeMenu('book') }
        />
        <mesh
            ref={drinkRef}
            geometry={ drink.geometry }
            material={ drink.material }
            position={ drink.position }
            rotation={ drink.rotation }
            scale={ drink.scale }
            onPointerOver={ () => target == 'none' && pointerOver('drink') }
            onPointerOut={ () => target == 'none' && pointerOut('drink') }
            onClick={ drinking }
        />
        { gizouNum == 1 && <Gizou position={[-13.6, 3.9, 5.9]} rotation-y={0.3} />
        }
        { gizouNum == 2 && <>
            <Gizou position={[-13.6, 3.9, 5.9]} rotation-y={0.3} />
            <Gizou position={[-14, 0.5, 7.8]} rotation-y={3} />
        </>}
        { gizouNum == 3 && <>
            <Gizou position={[-13.6, 3.9, 5.9]} rotation-y={0.3} />
            <Gizou position={[-14, 0.5, 7.8]} rotation-y={3} />
            <Gizou position={[-10, 0.5, 6]} rotation-y={-1.5} />
        </>}
        { gizouNum == 4 && <>
            <Gizou position={[-7.3, 0.5, 7.5]} rotation-y={1.9} />
            <Gizou position={[-7.3, 0.5, 6.6]} rotation-y={1.5} />
            <Gizou position={[-7.3, 0.5, 5.7]} rotation-y={1.1} />
            <Gizou position={[-8.7, 0.5, 7.2]} rotation-y={1.7} />
            <Gizou position={[-8.7, 0.5, 6]} rotation-y={1.3} />
            <Gizou position={[-10, 0.5, 6.5]} rotation-y={1.5} />
            <Gizou position={[-10, 0.5, 7.7]} rotation-y={1.9} />
            <Gizou position={[-11.3, 0.5, 7.2]} rotation-y={1.7} />
            <Gizou position={[-11.3, 0.5, 6.2]} rotation-y={1.3} />
            <Gizou position={[-12.6, 0.5, 6.8]} rotation-y={1.5} />
            <Gizou position={[-12.6, 0.5, 7.7]} rotation-y={1.9} />
            <Gizou position={[-12.6, 0.5, 6]} rotation-y={1.3} />
            <Gizou position={[-14, 0.5, 7.2]} rotation-y={1.8} />
            <Gizou position={[-14, 0.5, 6.3]} rotation-y={1.3} />
            <Gizou position={[-13.6, 3.9, 5.9]} rotation-y={1.4} />
            <Gizou position={[-13.6, 7.3, 6.0]} rotation-y={1.4} />
            <Gizou position={[-12.1, 10, 5.6]} rotation-y={1.2} />
        </>}
        <primitive ref={skeltonRef} object={skelton.scene} />
        </group>
        { target == 'phone' && <group ref={phoneGRef}>
            <group ref={phoneG2Ref}>
                <primitive ref={phoneRef} object={phone.scene} scale={.0085} />
                <Html
                    ref={htmlRef}
                    transform
                    castShadow
                    distanceFactor={0.87}
                    position={[.205, 0, -8]}
                    style={{ height: 1820, width: 850, background: 'black', position: 'relative', borderRadius: 100, overflow: "hidden"}}
                >
                    <About type={phoneType} />
                </Html>
                <primitive ref={handRef} object={hand} scale={.0004} />
            </group>
        </group> 
        }
        <mesh 
            ref={loginRef}
            geometry={login.geometry}
            material={login.material}
            position={login.position}
            rotation={login.rotation}
            scale={login.scale}
            onPointerOver={ () => target == 'none' && pointerOver('login') }
            onPointerOut={ () => target == 'none' && pointerOut('login') }
            onClick={ () => target == 'none' && changeMenu('login') }
        />
        <mesh
            ref = { fieldRef }
            geometry = { field.geometry }
            position = { field.position }
            rotation = { field.rotation }
            scale = { field.scale }
        >
            <fieldMaterial
                ref={fieldMaterial}
                transparent={true}
            />
        </mesh>
        <Projectors/>
        <RigidBody type="fixed" colliders="trimesh">
            <primitive object={ townPhysic.scene } />
        </RigidBody>
    </>

}
