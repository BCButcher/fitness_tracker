let alertTimeout = 0;

function writeExercises(id) {
    $("#exerciseList").html("");
    $.ajax({
        url: `/populate/${id}`,
        method: "GET",
        success: result => {
            for (exercise of result[0].exercises) {
                $("#exerciseList").append(`<li class="col-6">${exercise.name} (Muscle Group: ${exercise.muscleGroup}) (Reps: ${exercise.reps})</li>`)
            }
        }
    })
}

function writeExerciseForm(buttonTarget) {
    $("#getInShape").append(`<h2>Add Muscle Group to ${$(buttonTarget).text()}</h2>
    <form action="/add" method="post">
        <div class="form-group>
            <label for="exerciseName">Exercise Name</label>
            <input class="form-control" type="text" name="exerciseName">
        </div>
        <div class="form-group>
            <label for="muscleGroup">Muscle Group</label>
            <input class="form-control" type="text" name="muscleGroup">
        </div>
        <div class="form-group">
            <label for="exerciseReps">Reps</label>
            <input class="form-control" type="number" name="exerciseReps">
        </div>
        <button class="btn btn-primary" id="addExercise">Add to Fitness Routine</button>
    </form>`);
}

function writeAllWorkouts(response) {
    $("#getInShape").html('<h2>Choose your Routine</h2>')
    for (routine of response) {
        $("#getInShape").append(`<button class="btn btn-success fitnessBtn" value="${routine._id}">${routine.name}</button>`)
    }
    $(".fitnessBtn").click(event => {
        let workoutID = $(event.currentTarget).val();
        $("#getInShape").html(`<h2>Current Routine</h2><ul id="exerciseList" class="row"</ul>`)
        writeExercises(workoutID)
        writeExerciseForm(event.currentTarget).val();
        $("#addExercise").click((event) => {
            event.preventDefault();
            let muscGrp = $("input[name*='muscleGroup']").val()
            let numReps = $("input[name*='exerciseReps']").val()
            let newExercise = {
                workout: workoutID,
                muscGrp: $("input[name*='muscleGroup']").val().trim(),
                name: $("input[name*='exerciseName']").val().trim(),
                reps: (numReps > 0) ? numReps : undefined
            }
            $.ajax({
                url: "/add",
                data: newExercise,
                method: "POST",
                success: result => {
                    clearTimeout(alertTimeout);
                    if (result.errors != undefined) {
                        if (result.errors.name) {
                            $(".alert-warning").text("What exercise would you like to contribute?").attr('style', 'display:block;')
                        } else if (result.errors.muscGrp) {
                            $(".alert-warning").text("What muscle group would you like to add?").attr('style', 'display:block;')
                        } else if (result.errors.reps) {
                            $(".alert-warning").text("How many reps would you like to add?").attr('style', 'display:block;')
                        }
                        alertTimeout = setTimeout(() => {
                            $(".alert-warning").attr('style', 'display:none;')
                        }, 4000)
                    } else {
                        writeExercises(result._id);
                    }
                }
            })
        })
    })
}

$("#loadWorkout").click(() => {
    $.ajax({
        url: "/workouts",
        method: "GET",
        success: result => {
            writeAllWorkouts(result);
        }
    })
});

$("#getInShape").click(() => {
    $("#getInShape").html(`
    <form action="/submit" method="post">
        <div class="form-group">
            <label for="workoutName">Name of the routine</label>
            <input class="form-control" type="text" name="workoutName">
        </div>
        <button class="btn btn-primary" id="createWorkout">Submit</button>
    </form>`);
    $("#createWorkout").click((event) => {
        event.preventDefault();
        $.ajax({
            url: "/submit",
            data: { name: $("input[name*='workoutName']").val().trim() },
            method: "POST",
            success: (result) => {
                clearTimeout(alertTimeout);
                if (result != 'Workout validation failed') {
                    location.reload();
                } else {
                    $(".alert-warning").text("Please add the name of your routine.").attr('style', 'display: block;')
                    alertTimeout = setTimeout(() => {
                        $(".alert-warning").attr('style', 'display:none;')
                    }, 4000)
                }
            }
        })
    })
});