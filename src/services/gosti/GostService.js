import { gosti } from "./GostPodaci";


async function get() {
    return {data: gosti}
}


export default{
    get
}