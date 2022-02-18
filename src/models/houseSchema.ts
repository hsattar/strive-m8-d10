import mongoose from 'mongoose'
import { IHouse } from '../types/houseInterface'

const { Schema, model } = mongoose

const houseSchema = new Schema<IHouse>({
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true }
})

export default model<IHouse>('House', houseSchema)