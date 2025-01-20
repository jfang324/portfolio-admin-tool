'use client'
import { EducationEntry } from '@/components/EducationEntry'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Education } from '@/interfaces/Education'
import { ApiClient } from '@/services/ApiClient'
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function Page() {
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const [educations, setEducations] = useState<Education[]>([])
    const [draggable, setDraggable] = useState<boolean>(true)

    useEffect(() => {
        const fetchEducations = async () => {
            try {
                const fetchedEducations = await apiClient.getEducations()
                setEducations(fetchedEducations)
            } catch (error) {
                console.error(`Error fetching educations: ${error}`)
                toast({ title: 'Error', description: 'Failed to fetch educations' })
            }
        }

        fetchEducations()
    }, [apiClient, toast])

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

            setEducations([...educations, newEducation])
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

            setEducations(
                educations.map((education) => (education.id === updatedEducation.id ? updatedEducation : education))
            )
            toast({ title: 'Success', description: `Updated Education: ${updatedEducation.school}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update an education' })
            console.error(`Error updating an education: ${error}`)
        }
    }

    const handleRearrangeEducations = async (rearrangedEducations: Education[]) => {
        try {
            const shiftedEducations = rearrangedEducations.map((education, idx) => ({ ...education, order: idx }))

            Promise.all(shiftedEducations.map((education) => apiClient.updateEducation(education)))

            setEducations(shiftedEducations)
            toast({ title: 'Success', description: `Rearranged Educations` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to rearrange educations, refresh the page' })
            console.error(`Error rearranging educations: ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            <DragDropContext
                onDragEnd={(result: any) => {
                    if (!result.destination || result.destination.index === result.source.index) return

                    const rearrangedEducations = Array.from(educations)
                    const [removed] = rearrangedEducations.splice(result.source.index, 1)
                    rearrangedEducations.splice(result.destination.index, 0, removed)

                    handleRearrangeEducations(rearrangedEducations)
                }}
            >
                <Droppable
                    droppableId="droppable"
                    direction="vertical"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={true}
                >
                    {(provided: any) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-col gap-2 w-full sm:w-2/5 "
                        >
                            {educations.map((education) => (
                                <Draggable
                                    key={education.id}
                                    draggableId={education.id.toString()}
                                    index={education.order}
                                    isDragDisabled={!draggable}
                                >
                                    {(provided: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <EducationEntry
                                                education={education}
                                                handleDeleteEducation={handleDeleteEducation}
                                                handleUpdateEducation={handleUpdateEducation}
                                                handleLockEducations={setDraggable}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button className="text-xs" onClick={handleCreateProject}>
                Add Education
            </Button>
        </div>
    )
}
