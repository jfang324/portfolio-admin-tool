'use client'
import { EducationEntry } from '@/components/EducationEntry'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Education } from '@/interfaces/Education'
import { ApiClient } from '@/services/ApiClient'
import { useEffect, useMemo, useState } from 'react'

export default function Page() {
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const [educations, setEducations] = useState<Education[]>([])

    useEffect(() => {
        const fetchEducations = async () => {
            try {
                const fetchedEducations = await apiClient.getEducations()
                setEducations(fetchedEducations)
            } catch (error) {
                console.error(`Error fetching educations: ${error}`)
            }
        }

        fetchEducations()
    }, [apiClient])

    const handleCreateProject = async () => {
        const education = {
            order: educations.length,
            school: 'Default School',
            degree: 'Default Degree',
            graduationYear: 9999,
            gpa: 4.0,
        }

        try {
            const newEducation = await apiClient.createEducation(education)

            setEducations((prevEducations) => [...prevEducations, newEducation])
            toast({ title: 'Success', description: `Created Education: ${newEducation.id} with default fields` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create an education' })
            console.error(`Error creating an education: ${error}`)
        }
    }

    const handleDeleteEducation = async (id: string) => {
        try {
            const deletedEducation = await apiClient.deleteEducation(id)
            const shiftedEducations = educations
                .filter((education) => education.id !== id)
                .map((education, idx) => ({
                    ...education,
                    order: idx,
                }))

            await Promise.all(shiftedEducations.map((education) => apiClient.updateEducation(education)))

            setEducations(shiftedEducations)
            toast({ title: 'Success', description: `Deleted Education: ${deletedEducation.school}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete an education' })
            console.error(`Error deleting an education: ${error}`)
        }
    }

    const handleUpdateEducation = async (updatedEducation: Education) => {
        try {
            await apiClient.updateEducation(updatedEducation)

            setEducations((prevEducations) =>
                prevEducations.map((education) => (education.id === updatedEducation.id ? updatedEducation : education))
            )
            toast({ title: 'Success', description: `Updated Education: ${updatedEducation.school}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update an education' })
            console.error(`Error updating an education: ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            {educations.map((education) => (
                <EducationEntry
                    key={education.id}
                    education={education}
                    handleDeleteEducation={handleDeleteEducation}
                    handleUpdateEducation={handleUpdateEducation}
                />
            ))}
            <Button className="text-xs" onClick={handleCreateProject}>
                Add Education
            </Button>
        </div>
    )
}
