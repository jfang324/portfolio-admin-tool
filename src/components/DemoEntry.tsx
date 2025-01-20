import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Demo } from '@/interfaces/Demo'
import { ApiClient } from '@/services/ApiClient'
import { CheckCheck, Pencil, Trash2, X } from 'lucide-react'
import { set } from 'mongoose'
import { useState } from 'react'

interface DemoEntryProps {
    demo: Demo
    handleDeleteDemo: (id: string) => void
    handleUpdateDemo: (demo: Demo) => void
    handleRefreshDemos: (demo: Demo) => void
}

export const DemoEntry = ({ demo, handleDeleteDemo, handleUpdateDemo, handleRefreshDemos }: DemoEntryProps) => {
    const { toast } = useToast()
    const [editing, setEditing] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(demo.title)
    const [description, setDescription] = useState<string>(demo.description)
    const [technologies, setTechnologies] = useState<string[]>(demo.technologies)
    const [gallery, setGallery] = useState<typeof demo.gallery>(demo.gallery)
    const [links, setLinks] = useState<typeof demo.links>(demo.links)
    const [image, setImage] = useState<File | undefined>(undefined)
    const apiClient = new ApiClient()

    const handleUploadImage = async () => {
        try {
            if (!image) {
                toast({ title: 'Error', description: 'No image provided' })
                return
            }

            const updatedDemo = await apiClient.uploadImage(demo.id, image)

            toast({ title: 'Success', description: `Uploaded Image: ${image.name}` })
            handleRefreshDemos(updatedDemo)
            setGallery((prevGallery) => [...prevGallery, updatedDemo.gallery[updatedDemo.gallery.length - 1]])
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to upload an image' })
            console.error(`Error uploading an image: ${error}`)
        }
    }

    const handleDeleteImage = async (imageId: string) => {
        try {
            const updatedDemo = await apiClient.deleteImage(demo.id, imageId)

            toast({ title: 'Success', description: `Deleted Image: ${imageId}` })
            handleRefreshDemos(updatedDemo)
            setGallery((prevGallery) => prevGallery.filter((image) => image.id !== imageId))
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete an image' })
            console.error(`Error deleting an image: ${error}`)
        }
    }

    return (
        <div className="border border-black rounded p-4 flex flex-col gap-3 w-full text-xs">
            <div className="flex flex-col gap-2">
                {editing ? (
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex flex-row gap-1">
                            <CheckCheck
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false)
                                    handleUpdateDemo({
                                        ...demo,
                                        title,
                                        description,
                                        technologies,
                                        gallery,
                                        links,
                                    })
                                }}
                            />
                            <X
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false)
                                    setTitle(demo.title)
                                    setDescription(demo.description)
                                    setTechnologies(demo.technologies)
                                    setGallery(demo.gallery)
                                    setLinks(demo.links)
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 justify-center w-full px-3 pb-3">
                            <div className="grid w-full items-center gap-1.5">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    className="border-black text-xs"
                                    defaultValue={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label className="font-bold">Description</Label>
                                <Textarea
                                    className="border-black"
                                    defaultValue={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label className="font-bold">Technologies</Label>
                                <Textarea
                                    className="border-black"
                                    defaultValue={technologies.join(', ')}
                                    onChange={(e) => setTechnologies(e.target.value.split(', '))}
                                />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label className="font-bold">Gallery</Label>
                                {gallery.map((galleryImage) => (
                                    <div
                                        className="flex flex-row w-full items-center justify-between gap-2 text-xs border border-black rounded-lg"
                                        key={galleryImage.id}
                                    >
                                        <div className="px-3">{galleryImage.link}</div>
                                        <Button
                                            className="text-xs sm:w-1/12"
                                            onClick={() => handleDeleteImage(galleryImage.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex flex-row w-full items-center border border-black rounded-lg">
                                    <Input
                                        id="picture"
                                        type="file"
                                        className="border border-none p-1.5"
                                        onChange={(e) => {
                                            setImage(e.target.files?.[0])
                                        }}
                                    />
                                    <Button className="text-xs sm:w-1/12" onClick={handleUploadImage}>
                                        Upload
                                    </Button>
                                </div>
                            </div>
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">GitHub</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={links.github}
                                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                                />
                            </div>
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">Live</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={links.live || ''}
                                    onChange={(e) => setLinks({ ...links, live: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex flex-row gap-1">
                            <Pencil
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(true)
                                }}
                            />
                            <Trash2
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    handleDeleteDemo(demo.id)
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full px-3">
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">Title</Label>
                                <div> {title}</div>
                            </div>
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">Description</Label>
                                <div> {description}</div>
                            </div>
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">Technologies</Label>
                                <div> {technologies.join(', ')}</div>
                            </div>
                            <div className="grid w-full items-start gap-1.5">
                                <Label className="font-bold">Gallery</Label>
                                <div>
                                    {' '}
                                    {gallery
                                        .map((galleryImage) => galleryImage.link)
                                        .map((link) => (
                                            <div key={link}>{link}</div>
                                        ))}
                                </div>
                            </div>
                            {links.github && (
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label className="font-bold">GitHub</Label>
                                    <div> {links.github}</div>
                                </div>
                            )}
                            {links.live && (
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label className="font-bold">Live</Label>
                                    <div> {links.live}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
