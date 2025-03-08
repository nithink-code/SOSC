document.addEventListener('DOMContentLoaded', function() {
    const workoutForm = document.getElementById('workout-form');

    // Load workouts from local storage (if any)
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

    if (workoutForm) {
        workoutForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const workoutType = document.getElementById('workout-type').value;
            const duration = document.getElementById('duration').value;
            const date = document.getElementById('date').value;

            const workout = {
                type: workoutType,
                duration: duration,
                date: date
            };

            workouts.push(workout);
            localStorage.setItem('workouts', JSON.stringify(workouts));

            workoutForm.reset();

            // Display success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Workout added successfully!';
            successMessage.style.color = 'green';
            workoutForm.appendChild(successMessage);

            setTimeout(function() {
                successMessage.remove();
            }, 3000);

            // Update progress display if on progress page.
            if (window.location.pathname.endsWith('progress.html')) {
                displayProgress();
            }
        });
    }

    // Function to display progress
    function displayProgress() {
        const progressList = document.getElementById('progress-list');
        const workoutCountDisplay = document.getElementById('workout-count');
        progressList.innerHTML = ''; // Clear the list

        let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

        if (workouts.length === 0) {
            progressList.innerHTML = '<li>No workout data available.</li>';
            workoutCountDisplay.textContent = 'Total Workouts: 0';
            return;
        }

        workouts.forEach((workout, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${workout.date}: ${workout.type} - ${workout.duration} minutes`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                workouts.splice(index, 1);
                localStorage.setItem('workouts', JSON.stringify(workouts));
                displayProgress();
            });

            listItem.appendChild(deleteButton);
            progressList.appendChild(listItem);
        });

        // Update workout count
        workoutCountDisplay.textContent = `Total Workouts: ${workouts.length}`;
    }

    // Call displayProgress if on progress.html
    if (window.location.pathname.endsWith('progress.html')) {
        displayProgress();
    }
});