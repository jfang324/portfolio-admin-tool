'use client'
import { DemoEntry } from '@/components/DemoEntry'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Demo } from '@/interfaces/Demo'
import { ApiClient } from '@/services/ApiClient'
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function Page() {
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const [demos, setDemos] = useState<Demo[]>([])

    useEffect(() => {
        const fetchDemos = async () => {
            try {
                const fetchedDemos = await apiClient.getDemos()

                setDemos(fetchedDemos)
            } catch (error) {
                console.error(`Error fetching demos: ${error}`)
            }
        }

        fetchDemos()
    }, [apiClient])

    const handleCreateDemo = async () => {
        const demo = {
            order: demos.length,
            title: 'Default Demo Title',
            description: 'Default Demo Description',
            technologies: [],
            gallery: [],
            links: {
                github: 'Default Demo GitHub',
                live: undefined,
            },
        }

        try {
            const newDemo = await apiClient.createDemo(demo)

            setDemos((prevDemos) => [...prevDemos, newDemo])
            toast({ title: 'Success', description: `Created Demo: ${newDemo.id} with default fields` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create a demo' })
            console.error(`Error creating a demo: ${error}`)
        }
    }

    const handleDeleteDemo = async (id: string) => {
        try {
            const deletedDemo = await apiClient.deleteDemo(id)

            setDemos((prevDemos) => prevDemos.filter((demo) => demo.id !== id))
            toast({ title: 'Success', description: `Deleted Demo: ${deletedDemo.title}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete a demo' })
            console.error(`Error deleting a demo: ${error}`)
        }
    }

    const handleUpdateDemo = async (updatedDemo: Demo) => {
        try {
            await apiClient.updateDemo(updatedDemo)

            setDemos((prevDemos) => prevDemos.map((demo) => (demo.id === updatedDemo.id ? updatedDemo : demo)))
            toast({ title: 'Success', description: `Updated Demo: ${updatedDemo.title}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update a demo' })
            console.error(`Error updating a demo: ${error}`)
        }
    }

    const handleRefreshDemos = (updatedDemo: Demo) => {
        setDemos((prevDemos) => prevDemos.map((demo) => (demo.id === updatedDemo.id ? updatedDemo : demo)))
    }

    const handleRearrangeDemos = (demos: Demo[]) => {
        try {
            const shiftedDemos = demos.map((demo, idx) => ({ ...demo, order: idx }))

            Promise.all(shiftedDemos.map((demo) => apiClient.updateDemo(demo)))

            setDemos(shiftedDemos)
            toast({ title: 'Success', description: `Rearranged Demos` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to rearrange demos, refresh the page' })
            console.error(`Error rearranging demos: ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full sm:w-2/5">
            <DragDropContext
                onDragEnd={(result: any) => {
                    if (!result.destination || result.destination.index === result.source.index) return

                    const shiftedDemos = Array.from(demos)
                    const [removed] = shiftedDemos.splice(result.source.index, 1)
                    shiftedDemos.splice(result.destination.index, 0, removed)

                    handleRearrangeDemos(shiftedDemos)
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
                        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-1">
                            {demos.map((demo) => (
                                <Draggable
                                    key={demo.id}
                                    draggableId={demo.id.toString()}
                                    index={demo.order}
                                    isDragDisabled={false}
                                >
                                    {(provided: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <DemoEntry
                                                demo={demo}
                                                handleDeleteDemo={handleDeleteDemo}
                                                handleUpdateDemo={handleUpdateDemo}
                                                handleRefreshDemos={handleRefreshDemos}
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
            <Button onClick={() => handleCreateDemo()}>Create a New Demo</Button>
        </div>
    )
}
