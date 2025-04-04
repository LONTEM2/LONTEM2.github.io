function showTrailer() {
    playAlert();
}
function playAlert() {
    Swal.fire({
        title: 'Brak dostępu',
        text: 'Zwiastun dostępny za '+daysUntil("2025-05-05")+'.',
        icon: 'error',
        confirmButtonText: 'OK',
    });
}
function daysUntil(targetDate) {
    const currentDate = new Date();
    const endDate = new Date(targetDate);
    const timeDifference = endDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return `${daysDifference} dni`;
}
