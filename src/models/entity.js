import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
    name: String,
    project: { $type: mongoose.SchemaTypes.ObjectId, index: true },
    user: mongoose.SchemaTypes.ObjectId,
    access: { $type: Number, index: true },
    desc: String,
    location: {
        type: { $type: String, enum: ['Point', 'LineString', 'Polygon'], default: 'Point' },
        coordinates: { $type: [Number], index: '2dsphere' }
    },
    type: { $type: Number, index: true },
    info: mongoose.SchemaTypes.Mixed
}, { timestamps: true, typeKey: '$type' });

export default mongoose.model('Entity', entitySchema);
