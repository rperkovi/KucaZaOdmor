import { gosti } from "./GostiPodaci";


async function get() {
    return {data: gosti}
}


export default{
    get
}