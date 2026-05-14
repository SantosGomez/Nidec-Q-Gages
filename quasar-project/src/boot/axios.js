import { boot } from 'quasar/wrappers'
import axios from 'axios'


const api = axios.create({ baseURL: 'http://localhost:3000' })
// const api = axios.create({ baseURL: 'http://10.119.17.87:3000' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api } 