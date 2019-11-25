
import { Notify } from 'quasar'

export default (m: string, type: string = 'info', timeout: number = 700) => {
  if (!m || m.trim() === '') return 0
  let color = 'white'
  let textColor = 'faded'
  let icon = 'info'
  if (type === 'warn') {
    color = 'warning'
    textColor = 'grey-1'
    icon = 'warning'
  }
  if (type === 'err') {
    color = 'negative'
    textColor = 'grey-1'
    icon = 'error'
  }
  if (type === 'ok') {
    color = 'positive'
    textColor = 'grey-1'
    icon = 'info'
  }
  Notify.create({
    message: m,
    timeout: timeout, // in milliseconds; 0 means no timeout
    color: color,
    textColor: textColor, // if default 'white' doesn't fits
    icon: icon,
    position: 'top', // 'top', 'left', 'bottom-left' etc
    actions: [
      {
        icon: 'close' // optional
      }
    ]
  })
}
