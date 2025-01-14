import mongoose from 'mongoose'

export interface Project {
    order: number
    name: string
    link: string
}

export interface ProjectDocument extends Project, mongoose.Document {
    _id: mongoose.Types.ObjectId
}
