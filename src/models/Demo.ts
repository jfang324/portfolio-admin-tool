import { DemoDocument } from '@/interfaces/Demo'
import mongoose, { Schema } from 'mongoose'

const demoSchema = new Schema<DemoDocument>(
    {
        id: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        technologies: {
            type: [String],
            required: true,
        },
        gallery: {
            type: [
                {
                    id: String,
                    link: String,
                },
            ],
            required: true,
        },
        links: {
            type: {
                github: String,
                live: String,
            },
            required: true,
        },
    },
    { collection: 'Demos' }
)

demoSchema.pre('save', function (next) {
    if (this.isNew) {
        this.id = this._id.toString()
    }
    next()
})

export default function DemoModel(connection: mongoose.Connection) {
    return mongoose.models.Demo || connection.model<DemoDocument>('Demo', demoSchema)
}
