import { EducationDocument } from '@/interfaces/Education'
import mongoose, { Schema } from 'mongoose'

const educationSchema: Schema<EducationDocument> = new Schema(
    {
        id: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
            min: [0, 'Order must be greater than 0'],
        },
        school: {
            type: String,
            required: true,
        },
        degree: {
            type: String,
            required: true,
        },
        graduationYear: {
            type: Number,
            required: true,
        },
        gpa: {
            type: Number,
            required: true,
            min: [0, 'GPA must be greater than 0'],
            max: [4, 'GPA must be less than 4'],
        },
    },
    { collection: 'Educations' }
)

educationSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.id = this._id.toString()
    }
    next()
})

export default function EducationModel(connection: mongoose.Connection) {
    return mongoose.models.Education || connection.model<EducationDocument>('Education', educationSchema)
}
