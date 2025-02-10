import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
{
    return {
        alc: 0,                // Strength of alcohol effects
        move: true,            // Player is ready to move
        front: true,           // Front and back world's switcher
        noise: false,          // With or without noise effects
        target: 'none',        // Player's target of action
        intMode: false,        // Switcher of interface mode
        gizouNum: 0,           // Number of gizou model
        punishment: false,     // gizou's punishment
        models: null,          // Handover of model data
        musicState: null,      // State of music function
        perfMode: false,       // Display of performance information
        objPos: [0, 0, 0],     // Cell phone display location

        // Move
        focus: () =>
        {
            set((state) =>
            {
                if(state.move === true)
                    return { move: false }
                    

                return{}
            })
        },
        offocus: () =>
        {
            set((state) =>
            {
                if(state.move === false)
                    return { move: true }

                return {}
            })
        },

        // Front
        turn: () =>
        {
            set((state) =>
            {
                return {front: !state.front}
            })
        },

        // Noise
        addNoise: () =>
        {
            set((state) =>
            {
                return {noise: !state.noise}
            })
        },

        // Target
        phone: () =>
        {
            set((state) =>
            {
                if(state.target === 'none')
                {
                    return { target: 'phone' }
                }

                return {}
            })
        },
        menu: (obj) =>
        {
            set((state) =>
            {
                if(state.target === 'none')
                    return { target: obj }
                return {}
            })
        },
        none: () =>
        {
            set((state) =>
            {
                if(state.target != 'none')
                    return { target: 'none' }

                return {}
            })
        },

        // ObjPos
        cameraSet: (objPos) =>
        {
            set((state) =>
            {
                return{ objPos: objPos}
                
            })
        },

        // IntMode
        intModeOn: () =>
        {
            set((state) =>
            {
                if(state.intMode === false)
                    return { intMode: true }
                
                return {}
            })
        },
        intModeOff: () =>
        {
            set((state) =>
            {
                if(state.intMode === true)
                    return { intMode: false }
                
                return {}
            })
        },

        // Alc
        drunk: () =>
        {
            set((state) =>
            {
                return { alc: state.alc+1 }
            })
        },
        sober: () =>
        {
            set((state) =>
            {
                if(state.alc > 0)
                    return { alc: state.alc-1 }
                
                return {}
            })
        },

        // GizouNum
        gizouAdd: () =>
        {
            set((state) =>
            {
                if(state.gizouNum < 4)
                    return { gizouNum: state.gizouNum+1 }
                
                return {}
            })
        },
        gizouLost: () =>
        {
            set((state) =>
            {
                if(state.gizouNum != 0)
                    return { gizouNum: 0 }
                
                return {}
            })
        },

        // Punishment
        punish: () =>
        {
            set((state) =>
            {
                if(state.punishment === false)
                    return { punishment: true }

                return{}
            })
        },
        approve: () =>
        {
            set((state) =>
            {
                if(state.punishment === true)
                    return { punishment: false }
                
                return {}
            })
        },

        // Model
        modelSet: (model) =>
        {
            set((state) =>
            {
                if(state.models == null)
                    return { models: model}
                
                return {}
            })
        },

        // MusicState
        musicLoad: () =>
        {
            set((state) =>
            {
                if(state.musicState !== 'load')
                    return { musicState: 'load'}
                
                return {}
            })
        },
        musicPlay: () =>
        {
            set((state) =>
            {
                if(state.musicState !== 'play')
                    return { musicState: 'play' }
                
                return {}
            })
        },
        musicPause: () =>
        {
            set((state) =>
            {
                if(state.musicState !== 'pause')
                    return { musicState: 'pause' }
                
                return {}
            })
        },
        
        // perfMode
        perfShow: () =>
        {
            set((state) =>
            {
                return {perfMode: !state.perfMode}
            })
        },

    }
}))