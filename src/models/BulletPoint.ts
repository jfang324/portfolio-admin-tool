import { BulletPointDocument } from '@/interfaces/BulletPoint'
import mongoose, { Schema } from 'mongoose'

const bulletPointSchema: Schema<BulletPointDocument> = new Schema(
    {
        id: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
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

bulletPointSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.id = this._id.toString()
    }
    next()
})

export default function BulletPointModel(connection: mongoose.Connection) {
    return mongoose.models.BulletPoint || connection.model<BulletPointDocument>('BulletPoint', bulletPointSchema)
}
