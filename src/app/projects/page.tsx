'use client'
import { ProjectEntry } from '@/components/ProjectEntry'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { BulletPoint, BulletPointDocument } from '@/interfaces/BulletPointDocument'
import { Project, ProjectDocument } from '@/interfaces/ProjectDocument'
import { ApiClient } from '@/services/ApiClient'
import { useEffect, useState } from 'react'

export default function Page() {
    const { toast } = useToast()
    const apiClient = new ApiClient()
    const [projects, setProjects] = useState<ProjectDocument[]>([])
    const [bulletPoints, setBulletPoints] = useState<Record<string, BulletPoint[]>>({})

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetchedProjects = await apiClient.getProjects()

                const fetchedBulletPoints = await Promise.all(
                    fetchedProjects.map((p) => apiClient.getBulletPoints(p._id.toString()))
                )
                const bulletPointsMap: Record<string, BulletPoint[]> = {}

                for (const project of fetchedProjects) {
                    bulletPointsMap[project._id.toString()] = fetchedBulletPoints[fetchedProjects.indexOf(project)]
                }

                setProjects(fetchedProjects)
                setBulletPoints(bulletPointsMap)
            } catch (error) {
                console.error('Error fetching projects::', error)
            }
        }

        fetchProjects()
    }, [])

    const handleCreateProject = async () => {
        const project: Project = {
            order: projects.length,
            name: 'Default Project Name',
            link: 'Default Project Link',
        }

        try {
            const newProject = await apiClient.createProject(project)

            setProjects((prevProjects) => [...prevProjects, newProject])
        } catch (error) {
            console.error('Error creating a project::', error)
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        try {
            const deletedProject = await apiClient.deleteProject(projectId)
            const shiftedProjects = projects
                .filter((p) => p._id.toString() !== projectId)
                .map((p, idx) => ({ ...p, order: idx } as ProjectDocument))

            await Promise.all(shiftedProjects.map((p) => apiClient.updateProject(p)))
            setProjects(shiftedProjects)

            toast({ title: 'Success', description: `Deleted project ${deletedProject.name}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete a project' })
        }
    }

    const handleUpdateProject = async (updatedProject: ProjectDocument) => {
        try {
            await apiClient.updateProject(updatedProject)

            setProjects((prevProjects) =>
                prevProjects.map((p) => (p._id.toString() === updatedProject._id.toString() ? updatedProject : p))
            )
            toast({ title: 'Success', description: `Updated project ${updatedProject.name}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update a project' })
        }
    }

    const handleCreateBulletPoint = async (projectId: string) => {
        const bulletPoint: BulletPoint = {
            order: bulletPoints[projectId].length,
            text: 'Default Bullet Point Text',
            projectId,
        }

        try {
            const newBulletPoint = await apiClient.createBulletPoint(bulletPoint)

            setBulletPoints((prevBulletPoints) => ({
                ...prevBulletPoints,
                [projectId]: [...prevBulletPoints[projectId], newBulletPoint],
            }))
        } catch (error) {
            console.error('Error creating a bullet point::', error)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            {projects.map((p, idx) => (
                <ProjectEntry
                    key={idx}
                    project={p}
                    bulletPoints={bulletPoints[p._id.toString()]}
                    handleDeleteProject={handleDeleteProject}
                    handleUpdateProject={handleUpdateProject}
                    handleCreateBulletPoint={handleCreateBulletPoint}
                />
            ))}
            <Button onClick={handleCreateProject}>Create a new project</Button>
        </div>
    )
}
