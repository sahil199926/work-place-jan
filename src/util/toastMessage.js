
export default function toastMessage({ message, type}) {
  if(type==='success'){
    alert(message)
  }
  else if(type==='error'){
    alert(message)
  }
  else if(type==='warning'){
    alert(message)
  }

  else{
    alert(message)
  }
}