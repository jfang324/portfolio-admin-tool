import mongoose from 'mongoose'

export interface BulletPoint {
    id: string
    order: number
    text: string
    projectId: mongoose.Types.ObjectId | string
}

export interface BulletPointDocument extends BulletPoint, mongoose.Document {
    _id: mongoose.Types.ObjectId
    id: string
}
