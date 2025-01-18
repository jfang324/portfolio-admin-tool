import { ProjectDocument } from '@/interfaces/Project'
import mongoose, { Schema } from 'mongoose'

const projectSchema: Schema<ProjectDocument> = new Schema(
    {
        id: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    { collection: 'Projects' }
)

projectSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.id = this._id.toString()
    }
    next()
})

projectSchema.post('findOneAndDelete', async function (doc: ProjectDocument) {
    if (doc) {
        try {
            const BulletPointModel = mongoose.model('BulletPoint')

            if (BulletPointModel) {
                await BulletPointModel.deleteMany({ projectId: doc._id })
            }
        } catch (error) {
            console.error(`Error deleting bullet points of a project: ${error}`)
        }
    }
})

export default function ProjectModel(connection: mongoose.Connection) {
    return mongoose.models.Project || connection.model<ProjectDocument>('Project', projectSchema)
}
