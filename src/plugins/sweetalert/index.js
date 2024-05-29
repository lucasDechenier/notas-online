import Swal from 'sweetalert2'

export default {
  alertSuccess: ({title = "Success!", text = ''} = {}) => {
    Swal.fire({
      icon: 'success',
      position: 'top-end',
      text: text,
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      title: title,
      showConfirmButton: false,
      type: 'success'
    })
  },
  alertError: ({title = "Error!", text = ''} = {}) => {
    Swal.fire({
      icon: 'error',
      position: 'top-end',
      text: text,
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      title: title,
      showConfirmButton: false,
      type: 'error',
    })
  },
  alertInfo: ({title = "Info!", text = ''} = {}) => {
    Swal.fire({
      icon: 'info',
      position: 'top-end',
      text: text,
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      title: title,
      showConfirmButton: false,
      type: 'info',
    })
  },

  confirm(options, callbackSuccess, callbackError) {
    options = Object.assign({
      title: "Atenção!",
      text: "Você tem certeza que deseja tomar essa ação?",
      showCancelButton: true,
      confirmButtonColor: "primary",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      reverseButtons: true
    }, options);

    Swal.fire(options).then((result) => {
      if (result.value) {
        callbackSuccess()
      } else if (callbackError) {
        callbackError(result)
      }
    })
  }
}