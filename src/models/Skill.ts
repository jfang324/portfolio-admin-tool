import { SkillDocument } from '@/interfaces/Skill'
import mongoose, { Schema } from 'mongoose'

const skillSchema: Schema<SkillDocument> = new Schema(
    {
        id: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { collection: 'Skills' }
)

skillSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.id = this._id.toString()
    }
    next()
})

export default function SkillModel(connection: mongoose.Connection) {
    return mongoose.models.Skill || connection.model<SkillDocument>('Skill', skillSchema)
}
