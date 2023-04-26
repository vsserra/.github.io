const timers = {
    "timer-mp": null,
    "timer-replica-mp": null,
    "timer-defesa": null,
    "timer-treplica-defesa": null,
};

function parseTime(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        alert('Formato de tempo inválido.');
        return null;
    }

    return hours * 3600 + minutes * 60 + seconds;
}

function startTimer(timerId) {
    const timerElement = document.getElementById(timerId);
    const inputElementId = `input-${timerId}`;
    const inputElement = document.getElementById(inputElementId);
    const alertInputElement = timerElement.parentElement.querySelector('.input-alert');

    if (!timers[timerId]) {
        if (timerElement.textContent || inputElement.value) {
            let totalSeconds = parseTime(timerElement.textContent || inputElement.value);
            let alertTime = null;
            if (alertInputElement.value !== "") {
                alertTime = parseTime(alertInputElement.value);
            }

            if (totalSeconds !== null) {
                setTimer(timerElement, totalSeconds, alertTime);
            }
        } else {
            alert('Nenhum tempo fornecido. Por favor, insira um tempo no formato hh:mm:ss.');
        }
    }
}

function stopTimer(timerId) {
    clearInterval(timers[timerId]);
    timers[timerId] = null;
}

function resetTimer(timerId, inputElementId) {
    const confirmation = confirm('Tem certeza de que deseja zerar a contagem?');
    if (!confirmation) {
        return;
    }

    stopTimer(timerId);

    const timerElement = document.getElementById(timerId);
    timerElement.textContent = '';
    const inputElement = document.getElementById(inputElementId);
    inputElement.value = '';
    const alertInputElement = timerElement.parentElement.querySelector('.input-alert');
    alertInputElement.value = ''; // linha adicionada para zerar o campo "alerta"
}

function playSound() {
    const audio = new Audio('beep.mp3');
    audio.play();
}

function setTimer(timerElement, totalSeconds, alertTime) {
    clearInterval(timers[timerElement.id]);
    let currentTime = totalSeconds;

    const updateTimer = () => {
        const hours = Math.floor(currentTime / 3600);
        const minutes = Math.floor((currentTime % 3600) / 60);
        const seconds = currentTime % 60;

        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (currentTime === alertTime) {
            playSound();
        }

        if (currentTime <= 0) {
            clearInterval(timers[timerElement.id]);
            timers[timerElement.id] = null;
            return;
        }

        currentTime--;
    };

    timers[timerElement.id] = setInterval(updateTimer, 1000);
    updateTimer();
}