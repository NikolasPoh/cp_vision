import { createStore } from 'vuex'
import axios from "axios"

const store = createStore({
    state(){
        return {
            url_api: 'https://192.168.1.51:3000/'
            // url_api: process.env.VUE_APP_SERVER
        }
    },
    getters: {
        getUrlApi: state => {
            return state.url_api
        },
        request: (state, getters) => async (method, path, formData) => {
            try{
                const {data} = await axios({
                    method,
                    url: encodeURI(getters.getUrlApi + path),
                    data: formData,

                })
                return data
            } catch (e) {
                console.warn(e)
                return false
            }
        },

    }
})

export default store