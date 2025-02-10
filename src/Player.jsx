import * as THREE from "three"
import { useEffect, useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import useGame from "./stores/useGame.jsx"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()


export default function Player() {
    const move = useGame((state) => state.move)
    const focus = useGame((state) => state.focus)
    const offocus = useGame((state) => state.offocus)
    const phone = useGame((state) => state.phone)
    const none = useGame((state) => state.none)
    const cameraSet = useGame((state) => state.cameraSet)
    const gizouAdd = useGame((state) => state.gizouAdd)
    const gizouLost = useGame((state) => state.gizouLost)

    const ref = useRef(null)
    const { camera } = useThree()
    const [ subscribeKeys, get,] = useKeyboardControls()
    
    var objPos = new THREE.Vector3()
    var dist = .05
    var focusControle = false

    // Phone function switcher
    useEffect(() =>
    {
        const unsubscribeMenu = subscribeKeys(
            (state) => state.menu,
            (value) =>
            {
                
                const state = useGame.getState()
                if(value && state.move && state.target === 'none' && state.alc == 0 )
                {
                    focus()
                    phone()
                    camera.getWorldDirection(objPos)
                    objPos.multiplyScalar(dist)
                    objPos.add(camera.position)
                    
                    cameraSet(objPos)
                }else if(value && !state.move && state.target === 'phone')
                {
                    offocus()
                    none()
                    focusControle = false
                    if(camera.position.x < 0 && camera.position.z > 4 && state.front)
                        gizouAdd()
                    else if(!state.punishment)
                        gizouLost()
                }
                
            }
        )
        return () =>
        {
            unsubscribeMenu()
        }
    }, [])

    useEffect(() => {
        if (!ref.current) {
            console.warn("ref.current is null! Waiting for initialization...");
        }
    }, [ref.current]);

    // Player movement setting
    useFrame((state) => {
        // if (move && ref.current) {  // <- ref.current が null でないことを確認
        //     const { forward, backward, leftward, rightward } = get();
    
        //     const velocity = ref.current.linvel ? ref.current.linvel() : { x: 0, y: 0, z: 0 };  // <- `linvel()` が存在するか確認
    
        //     // update camera
        //     const { x, y, z } = ref.current.translation ? ref.current.translation() : { x: 0, y: 0, z: 0 };
        //     camera.position.set(x, y, z);
    
        //     // movement
        //     frontVector.set(0, 0, backward - forward);
        //     sideVector.set(leftward - rightward, 0, 0);
        //     direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);
    
        //     if (ref.current.setLinvel) {  // <- `setLinvel()` が存在するか確認
        //         ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
        //         console.log(direction);
        //     }
            
        // }
        if (move && ref.current) {  // <- ref.current が null でないことを確認
            const { forward, backward, leftward, rightward } = get();
    
            const pos = ref.current.translation()
            camera.position.copy(pos)

            frontVector.set(0, 0, -forward + backward)
            sideVector.set(rightward - leftward, 0, 0)
            direction.addVectors(frontVector, sideVector)
            direction.normalize()
            direction.multiplyScalar(SPEED)
            direction.applyEuler(camera.rotation)
            

            ref.current.setLinvel({
                x: direction.x,
                y: 0,
                z: direction.z
            })
            console.log(pos);
            
            
        }
    })
    return (
        <RigidBody ref={ref} colliders={false} mass={1} friction={0} restitution={0} type="dynamic" position={ [ 29, 1.4, 6.5 ] } enabledRotations={[false, false, false]}>
            <CapsuleCollider args={[1, 0.3]} />
        </RigidBody>
    )
}