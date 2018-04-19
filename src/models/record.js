import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    entity: {
        $type: mongoose.SchemaTypes.ObjectId,
        ref: 'Entity'
    },
    data: mongoose.SchemaTypes.Mixed
}, { timestamps: true, typeKey: '$type' });

recordSchema.index({ entity: 1, createdAt: -1 });

export default mongoose.model('Record', recordSchema);
