import mongoose, { Schema } from 'mongoose';

/**
 * Systemlog Model
 */
const systemlogSchema = new Schema({
    timestamp: Number,
    message: String,
    initialStart: Boolean,
});

const SystemlogModel = mongoose.model('SystemLog', systemlogSchema);

export default SystemlogModel;
