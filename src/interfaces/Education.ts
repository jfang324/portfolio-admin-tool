import mongoose from 'mongoose'

export interface Education {
    id: string
    order: number
    school: string
    degree: string
    graduationYear: number
    gpa: number
}

export interface EducationDocument extends Education, mongoose.Document {
    _id: mongoose.Types.ObjectId
    id: string
}
