import { BulletPointDocument } from '@/interfaces/BulletPointDocument'
import mongoose, { Schema } from 'mongoose'

const bulletPointSchema: Schema<BulletPointDocument> = new Schema(
    {
        order: {
            type: Number,
            required: true,
            unique: true,
        },
        text: {
            type: String,
            required: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
    },
    { collection: 'BulletPoints' }
)

export default (connection: mongoose.Connection) =>
    mongoose.models.BulletPoint || connection.model<BulletPointDocument>('BulletPoint', bulletPointSchema)
