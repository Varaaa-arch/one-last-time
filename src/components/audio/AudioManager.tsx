"use client";
import { Howl } from 'howler';

let ambience: Howl | null = null 

export const startAmbience = () => {
    if (ambience) return
    ambience = new Howl({
        src: [
            "https://qzjxfmdilqdybxkhhpdk.supabase.co/storage/v1/object/public/sounds/until-i-found-you.mp3",
        ],
        loop: true,
        volume: 0.45,
        html5: true
    })
    ambience.play()
} 

export const stopAmbience = () => {
    if (!ambience) return 
    ambience.fade(0.45, 0, 1500)
    setTimeout(() => {
        ambience?.stop()
        ambience = null
    }, 1500)
}