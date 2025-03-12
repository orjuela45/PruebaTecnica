function showToast(message, isError = false) {
  const toast = document.getElementById('messageToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastTitle || !toastMessage) {
    console.error('Elementos de toast no encontrados');
    return;
  }

  toastTitle.textContent = isError ? 'Error' : 'Éxito';
  toastMessage.textContent = message;
  
  toast.classList.remove('bg-danger', 'text-white', 'bg-success');
  if (isError) {
      toast.classList.add('bg-danger', 'text-white');
  } else {
      toast.classList.add('bg-success', 'text-white');
  }
  
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}