import mongoose from 'mongoose'

export interface BulletPoint {
    order: number
    text: string
    projectId: string | mongoose.Types.ObjectId
}

export interface BulletPointDocument extends BulletPoint, mongoose.Document {
    _id: mongoose.Types.ObjectId
}
