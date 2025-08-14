import moment from 'moment'

export const getNowMoment = () => {
  return moment().format('h:mm A')
}
