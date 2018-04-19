import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
    name: String,
    project: {
        $type: mongoose.SchemaTypes.ObjectId,
        index: true,
        ref: 'Project'
    },
    user: {
        $type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    access: { $type: Number, index: true },
    desc: String,
    location: {
        type: { $type: String, enum: ['Point', 'LineString', 'Polygon'], default: 'Point' },
        coordinates: { $type: [Number], index: '2dsphere' }
    },
    type: { $type: Number, index: true },
    info: mongoose.SchemaTypes.Mixed
}, { timestamps: true, typeKey: '$type' });

entitySchema.index({ project: 1, type: 1 });

export default mongoose.model('Entity', entitySchema);
