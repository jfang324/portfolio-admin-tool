import mongoose from 'mongoose'

export interface Demo {
    id: string
    order: number
    title: string
    description: string
    technologies: string[]
    gallery: {
        id: string
        link: string
    }[]
    links: {
        github: string
        live: string | undefined
    }
}

export interface DemoDocument extends Demo, mongoose.Document {
    _id: mongoose.Types.ObjectId
    id: string
}
