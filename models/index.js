const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: "Exercise"
    }]
});

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    muscleGroup: {
        type: String,
        required: true,
    },
    reps: {
        type: Number,
        required: true
    }
});

const Workout = mongoose.model("Workout", workoutSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = { Workout, Exercise };