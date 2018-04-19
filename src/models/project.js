import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: String,
    user: {
        $type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    desc: String,
    geo: {
        type: {
            $type: String,
            enum: ['Point', 'LineString', 'Polygon'],
            default: 'Polygon'
        },
        coordinates: mongoose.SchemaTypes.Mixed
    }
}, { timestamps: true, typeKey: '$type' });

export default mongoose.model('Project', projectSchema);
