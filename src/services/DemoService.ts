import { Demo, DemoDocument } from '@/interfaces/Demo'
import DemoModel from '@/models/Demo'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import mongoose from 'mongoose'

const bucketName = process.env.BUCKET_NAME || ''

/**
 * Maps a Mongoose DemoDocument to a Demo
 * @param demoDocument - The Mongoose DemoDocument to map
 * @returns The mapped Demo
 */
function mapDemoDocumentToDemo(demoDocument: DemoDocument): Demo {
    if (
        !demoDocument ||
        !demoDocument.id ||
        demoDocument.order == undefined ||
        !demoDocument.title ||
        !demoDocument.description ||
        !demoDocument.technologies ||
        !demoDocument.gallery ||
        !demoDocument.links
    ) {
        throw new Error('Invalid demo document')
    }

    return {
        id: demoDocument.id,
        order: demoDocument.order,
        title: demoDocument.title,
        description: demoDocument.description,
        technologies: demoDocument.technologies,
        gallery: demoDocument.gallery,
        links: demoDocument.links,
    }
}

export class DemoService {
    private connection: mongoose.Connection
    private s3Client: S3Client

    constructor(connection: mongoose.Connection, s3Client: S3Client) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        if (!s3Client) {
            throw new Error('No S3 client')
        }

        this.connection = connection
        this.s3Client = s3Client

        // Initialize models
        DemoModel(this.connection)
    }

    /**
     * Gets all demos from the database
     * @returns An array of Demos
     */
    async getAllDemos(): Promise<Demo[]> {
        const demoModel = DemoModel(this.connection)

        try {
            const allDemos = await demoModel.find().sort({ order: 1 })

            return allDemos.map((demo) => mapDemoDocumentToDemo(demo))
        } catch (error) {
            console.error(`Error getting all demos:: ${error}`)
            throw new Error('Failed to get all demos')
        }
    }

    /**
     * Creates a new demo in the database
     * @param demo - The demo to create
     * @returns The created demo
     */
    async createOneDemo(demo: Partial<Demo>): Promise<Demo> {
        const demoModel = DemoModel(this.connection)

        try {
            const newDemo = await demoModel.create(demo)

            return mapDemoDocumentToDemo(newDemo)
        } catch (error) {
            console.error(`Error creating a demo:: ${error}`)
            throw new Error('Failed to create a demo')
        }
    }

    /**
     * Deletes a demo from the database
     * @param id - The ID of the demo to delete
     * @returns The deleted demo
     */
    async deleteOneDemo(id: string): Promise<Demo> {
        const demoModel = DemoModel(this.connection)

        try {
            const deletedDemo = await demoModel.findOneAndDelete({ id })

            return mapDemoDocumentToDemo(deletedDemo)
        } catch (error) {
            console.error(`Error deleting a demo:: ${error}`)
            throw new Error('Failed to delete a demo')
        }
    }

    /**
     * Updates a demo in the database
     * @param demo - The demo to update
     * @returns The updated demo
     */
    async updateOneDemo(demo: Demo): Promise<Demo> {
        const demoModel = DemoModel(this.connection)

        try {
            const updatedDemo = await demoModel.findOneAndUpdate({ id: demo.id }, demo)

            return mapDemoDocumentToDemo(updatedDemo)
        } catch (error) {
            console.error(`Error updating a demo:: ${error}`)
            throw new Error('Failed to update a demo')
        }
    }

    async uploadImage(demoId: string, image: File): Promise<Demo> {
        const demoModel = DemoModel(this.connection)

        try {
            const imageId = crypto.randomBytes(16).toString('hex')
            const params = {
                Bucket: bucketName,
                Key: imageId,
                Body: Buffer.from(await image.arrayBuffer()),
                ContentType: image.type,
            }

            await this.s3Client.send(new PutObjectCommand(params))

            const updatedDemo = await demoModel.findOneAndUpdate(
                { id: demoId },
                { $push: { gallery: { id: imageId, link: `https://${bucketName}.s3.amazonaws.com/${imageId}` } } },
                { new: true }
            )

            return mapDemoDocumentToDemo(updatedDemo)
        } catch (error) {
            console.error(`Error uploading an image:: ${error}`)
            throw new Error('Failed to upload an image')
        }
    }

    async deleteImage(demoId: string, imageId: string): Promise<Demo> {
        const demoModel = DemoModel(this.connection)

        try {
            await this.s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: imageId }))

            const updatedDemo = await demoModel.findOneAndUpdate(
                { id: demoId },
                { $pull: { gallery: { id: imageId } } },
                { new: true }
            )

            return mapDemoDocumentToDemo(updatedDemo)
        } catch (error) {
            console.error(`Error deleting an image:: ${error}`)
            throw new Error('Failed to delete an image')
        }
    }
}
