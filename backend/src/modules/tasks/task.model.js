import mongoose from 'mongoose';
import { TASK_STATUS } from '../../constants.js';

const taskSchema = new mongoose.Schema({

    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        index:true
    },
    title:{
        type: String,
        required:true,
        trim:true,
        maxlength:120,
        minlength:5
    },
    description:{
        type: String,
        required:true,
        minlength:20
    },
    status:{
        type:String,
        enum: Object.values(TASK_STATUS),
        default: TASK_STATUS.OPEN,
        index:true

    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
    },
    repositoryUrl:{
        type: String,
        default:""
    },
    githubIssueUrl:{
        type: String,
        default:""
    },
    branchName:{
        type: String,
        default:""
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true

    }

},
{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema);

export default Task;