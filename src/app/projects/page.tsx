'use client'
import { ProjectEntry } from '@/components/ProjectEntry'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { BulletPoint } from '@/interfaces/BulletPoint'
import { Project } from '@/interfaces/Project'
import { ApiClient } from '@/services/ApiClient'
import { set } from 'mongoose'
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function Page() {
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const [projects, setProjects] = useState<Project[]>([])
    const [bulletPoints, setBulletPoints] = useState<Record<string, BulletPoint[]>>({})
    const [draggable, setDraggable] = useState<boolean>(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetchedProjects = await apiClient.getProjects()
                const fetchedBulletPoints = await Promise.all(
                    fetchedProjects.map((project) => apiClient.getBulletPoints(project.id))
                )
                const bulletPointsMap: Record<string, BulletPoint[]> = {}

                for (const project of fetchedProjects) {
                    bulletPointsMap[project.id] = fetchedBulletPoints[fetchedProjects.indexOf(project)]
                }

                setProjects(fetchedProjects)
                setBulletPoints(bulletPointsMap)
            } catch (error) {
                console.error(`Error fetching projects: ${error}`)
                toast({ title: 'Error', description: 'Failed to fetch projects' })
            }
        }

        fetchProjects()
    }, [apiClient, toast])

    const handleCreateProject = async () => {
        const project = {
            order: projects.length,
            name: 'Default Project Name',
            link: 'Default Project Link',
        }

        try {
            const newProject = await apiClient.createProject(project)

            setProjects([...projects, newProject])
            setBulletPoints({ ...bulletPoints, [newProject.id]: [] })
            toast({ title: 'Success', description: `Created Project: ${newProject.id} with default fields` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create a project' })
            console.error(`Error creating a project: ${error}`)
        }
    }

    const handleDeleteProject = async (id: string) => {
        try {
            const deletedProject = await apiClient.deleteProject(id)
            const shiftedProjects = projects
                .filter((project) => project.id !== id)
                .map((project, idx) => ({
                    ...project,
                    order: idx,
                }))

            await Promise.all(shiftedProjects.map((project) => apiClient.updateProject(project)))

            setProjects(shiftedProjects)
            toast({ title: 'Success', description: `Deleted Project: ${deletedProject.name}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete a project' })
            console.error(`Error deleting a project: ${error}`)
        }
    }

    const handleUpdateProject = async (updatedProject: Project) => {
        try {
            await apiClient.updateProject(updatedProject)

            setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)))
            toast({ title: 'Success', description: `Updated Project: ${updatedProject.name}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update a project' })
            console.error(`Error updating a project: ${error}`)
        }
    }

    const handleCreateBulletPoint = async (projectId: string) => {
        const bulletPoint = {
            order: bulletPoints[projectId].length,
            text: 'Default Bullet Point Text',
            projectId,
        }

        try {
            const newBulletPoint = await apiClient.createBulletPoint(bulletPoint)

            setBulletPoints({
                ...bulletPoints,
                [projectId]: [...bulletPoints[projectId], newBulletPoint],
            })
            toast({ title: 'Success', description: `Created Bullet Point: ${newBulletPoint.id} with default fields` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create a bullet point' })
            console.error(`Error creating a bullet point: ${error}`)
        }
    }

    const handleDeleteBulletPoint = async (projectId: string, bulletPointId: string) => {
        try {
            const deletedBulletPoint = await apiClient.deleteBulletPoint(projectId, bulletPointId)
            const shiftedBulletPoints = bulletPoints[projectId]
                .filter((bulletPoint) => bulletPoint.id !== bulletPointId)
                .map((bulletPoint, idx) => ({
                    ...bulletPoint,
                    order: idx,
                }))

            await Promise.all(shiftedBulletPoints.map((bulletPoint) => apiClient.updateBulletPoint(bulletPoint)))

            setBulletPoints({ ...bulletPoints, [projectId]: shiftedBulletPoints })
            toast({ title: 'Success', description: `Deleted Bullet Point: ${deletedBulletPoint.text}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete a bullet point' })
            console.error(`Error deleting a bullet point: ${error}`)
        }
    }

    const handleUpdateBulletPoint = async (updatedBulletPoint: BulletPoint) => {
        try {
            await apiClient.updateBulletPoint(updatedBulletPoint)

            setBulletPoints({
                ...bulletPoints,
                [updatedBulletPoint.projectId as string]: bulletPoints[updatedBulletPoint.projectId as string].map(
                    (bulletPoint) => (bulletPoint.id === updatedBulletPoint.id ? updatedBulletPoint : bulletPoint)
                ),
            })
            toast({ title: 'Success', description: `Updated Bullet Point: ${updatedBulletPoint.text}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update a bullet point' })
            console.error(`Error updating a bullet point: ${error}`)
        }
    }

    const handleRearrangeProjects = async (rearrangedProjects: Project[]) => {
        try {
            const shiftedProjects = rearrangedProjects.map((project, idx) => ({ ...project, order: idx }))

            Promise.all(shiftedProjects.map((project) => apiClient.updateProject(project)))

            setProjects(shiftedProjects)
            toast({ title: 'Success', description: `Rearranged Projects` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to rearrange projects, refresh the page' })
            console.error(`Error rearranging projects: ${error}`)
        }
    }

    const handleRearrangeBulletPoints = async (projectId: string, rearrangedBulletPoints: BulletPoint[]) => {
        try {
            const shiftedBulletPoints = rearrangedBulletPoints.map((bulletPoint, idx) => ({
                ...bulletPoint,
                order: idx,
            }))

            Promise.all(shiftedBulletPoints.map((bulletPoint) => apiClient.updateBulletPoint(bulletPoint)))

            setBulletPoints({ ...bulletPoints, [projectId]: shiftedBulletPoints })
            toast({ title: 'Success', description: `Rearranged Bullet Points` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to rearrange bullet points, refresh the page' })
            console.error(`Error rearranging bullet points: ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            <DragDropContext
                onDragEnd={(result: any) => {
                    if (!result.destination || result.destination.index === result.source.index) return

                    const rearrangedProjects = Array.from(projects)
                    const [removed] = rearrangedProjects.splice(result.source.index, 1)
                    rearrangedProjects.splice(result.destination.index, 0, removed)

                    handleRearrangeProjects(rearrangedProjects)
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
                            className="flex flex-col gap-2 w-full sm:w-2/5"
                        >
                            {projects.map((project) => (
                                <Draggable
                                    key={project.id}
                                    draggableId={project.id.toString()}
                                    index={project.order}
                                    isDragDisabled={!draggable}
                                >
                                    {(provided: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ProjectEntry
                                                project={project}
                                                bulletPoints={bulletPoints[project.id] || []}
                                                handleDeleteProject={handleDeleteProject}
                                                handleUpdateProject={handleUpdateProject}
                                                handleCreateBulletPoint={handleCreateBulletPoint}
                                                handleDeleteBulletPoint={handleDeleteBulletPoint}
                                                handleUpdateBulletPoint={handleUpdateBulletPoint}
                                                handleLockProjects={setDraggable}
                                                handleRearrangeBulletPoints={handleRearrangeBulletPoints}
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
                Create a New Project
            </Button>
        </div>
    )
}
