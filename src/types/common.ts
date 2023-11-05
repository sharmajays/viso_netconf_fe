type staticIp = {
    con_name: string
    static_ip: ipAddress,
    subnet_mask: number,
    gateway_ip: ipAddress
}

type ipAddress = {
    network_id_1: number,
    network_id_2: number,
    network_id_3: number,
    host_id: number
}

export type { staticIp, ipAddress }