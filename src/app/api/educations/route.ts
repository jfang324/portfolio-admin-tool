import connectToDb from '@/lib/db'
import { EducationService } from '@/services/EducationService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const connection = await connectToDb()
        const educationService = new EducationService(connection)
        const educations = await educationService.getAllEducations()

        return NextResponse.json(educations, { status: 200 })
    } catch (error) {
        console.error(`Error getting all educations: ${error}`)
        return NextResponse.json({ error: 'Failed to get all educations' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const education = await request.json()

    if (!education) {
        return NextResponse.json({ error: 'No education provided' }, { status: 400 })
    }

    if (
        education.order === undefined ||
        !education.school ||
        !education.degree ||
        !education.graduationYear ||
        !education.gpa
    ) {
        return NextResponse.json({ error: 'Education is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const educationService = new EducationService(connection)
        const newEducationDocument = await educationService.createOneEducation(education)

        return NextResponse.json(newEducationDocument, { status: 200 })
    } catch (error) {
        console.error(`Error creating a new education: ${error}`)
        return NextResponse.json({ error: 'Failed to create a new education' }, { status: 500 })
    }
}
