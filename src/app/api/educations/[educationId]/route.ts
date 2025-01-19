import connectToDb from '@/lib/db'
import { EducationService } from '@/services/EducationService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { educationId: string } }) {
    const { educationId } = await params

    if (!educationId) {
        return NextResponse.json({ error: 'No education ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const educationService = new EducationService(connection)
        const deletedEducation = await educationService.deleteOneEducation(educationId)

        return NextResponse.json(deletedEducation, { status: 200 })
    } catch (error) {
        console.error(`Error deleting an education: ${error}`)
        return NextResponse.json({ error: 'Failed to delete an education' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { educationId: string } }) {
    const { educationId } = await params

    if (!educationId) {
        return NextResponse.json({ error: 'No education ID provided' }, { status: 400 })
    }

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
        const updatedEducation = await educationService.updateOneEducation(education)

        return NextResponse.json(updatedEducation, { status: 200 })
    } catch (error) {
        console.error(`Error updating an education: ${error}`)
        return NextResponse.json({ error: 'Failed to update an education' }, { status: 500 })
    }
}
