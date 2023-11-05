import axios from "axios";
import { useEffect, useState } from "react";
import { staticIp, ipAddress } from "../types/common";

const ExistingCons = () => {
  
  const [connames, setconnames] = useState<string[]>([])
  const [staticIp, setStaticIp] = useState<ipAddress>({network_id_1: 0, network_id_2: 0, network_id_3: 0,host_id: 0})
  const [gatewayIp, setGatewayIp] = useState<ipAddress>({network_id_1: 0, network_id_2: 0, network_id_3: 0,host_id: 0})
  const [addConnameAndSubnet, setAddConnameAndSubnet] = useState<{con_name: string, subnet_mask: number}>({con_name: "", subnet_mask: 0})
  const [selectedConname, setSelectedConname] = useState<string>("")

  const fetchConNames = async() =>{
    try {
      const data = await axios.get("http://192.168.1.81:3000/staticIp/fetchConNames")
      const cnames = data?.data?.data?.conNames?.length ? data?.data?.data?.conNames : []
      if(cnames?.length){
        let conames = cnames
        conames.splice(conames.indexOf("VISO_DHCP"), 1)
        conames = ["Select Network", ...conames]
        setconnames(conames)
      }
      else{
        setconnames(["No Network Found"])
      }
    }
    catch(e){
      setconnames(["No Network Found"])
    }
  }

  const handleChange1=(e: any)=>{
    setSelectedConname(e?.target?.value)
  }

  const handleAddConnameAndSubnet=(e: any)=>{
    e.preventDefault();
    const { name, value } = e.target;
    setAddConnameAndSubnet((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const handleStaticIp=(e: any)=>{
    e.preventDefault();
    const { name, value } = e.target;
    setStaticIp((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const handleGatewayIp=(e: any)=>{
    e.preventDefault();
    const { name, value } = e.target;
    setGatewayIp((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const setNetwork = async()=>{
    try{
      await axios.post(
        "http://192.168.1.81:3000/staticIp/activateCon",
        {
          conName: selectedConname
        }
      )
    }
    catch(e){
      alert(`FAILED TO SET CONNECTION ${setSelectedConname}`)
    }
  }

  const addNetwork = async(e: any)=>{
    e.preventDefault()
    try{
      const data: staticIp = {
        "con_name": addConnameAndSubnet.con_name,
        "static_ip": staticIp,
        "subnet_mask": addConnameAndSubnet.subnet_mask,
        "gateway_ip": gatewayIp
      }
      await axios.post(
        "http://192.168.1.81:3000/staticIp/setStaticIp",
        data
      )
    }
    catch(e){
      alert("FAILED TO ADD NETWORK")
    }
  }

  const activateDHCP=async()=>{
    try{
      await axios.post(
        "http://192.168.1.81:3000/dhcp/activateDhcp"
      )
    }
    catch(e){
      alert("FAILED TO ACTIVATE DHCP")
    }
  }

  useEffect(()=>{
    fetchConNames()
  })

  return (
  <>

  <h4>Set Static IP</h4>
  <select onChange={handleChange1}>
    {
      connames.map(c=> ["Select Network", "No Network Found"].includes(c) ? <option value={c} disabled>{c}</option>: <option value={c}>{c}</option>)
    }
  </select><br/>
  <button onClick={setNetwork}>Set Network</button>

  <h4>Add Static IP</h4>
  <form onSubmit={addNetwork}> 
    Enter Name: <input type="string" name="con_name" value={addConnameAndSubnet.con_name} onChange={handleAddConnameAndSubnet}></input><br/>
    Enter Subnet Mask: <input type="number" name="subnet_mask" value={addConnameAndSubnet.subnet_mask} min={0} max={24} onChange={handleAddConnameAndSubnet}></input><br/>
    Enter Static IP: <input type="number" min={10} max={299} name="network_id_1" value={staticIp.network_id_1} onChange={handleStaticIp}></input>
    <input type="number" min={0} max={299} name="network_id_2" value={staticIp.network_id_2} onChange={handleStaticIp}></input>
    <input type="number" min={0} max={299} name="network_id_3" value={staticIp.network_id_3} onChange={handleStaticIp}></input>
    <input type="number" min={0} max={299} name="host_id" value={staticIp.host_id} onChange={handleStaticIp}></input><br/>
    Enter Gateway IP: <input type="number" min={10} max={299} name="network_id_1" value={gatewayIp.network_id_1} onChange={handleGatewayIp}></input>
    <input type="number" min={0} max={299} name="network_id_2" value={gatewayIp.network_id_2} onChange={handleGatewayIp}></input>
    <input type="number" min={0} max={299} name="network_id_3" value={gatewayIp.network_id_3} onChange={handleGatewayIp}></input>
    <input type="number" min={0} max={299} name="host_id" value={gatewayIp.host_id} onChange={handleGatewayIp}></input><br/>
    <button type="submit" onClick={addNetwork}>Add Network</button>
  </form>

  <h4>Set DHCP</h4>
  <button onClick={activateDHCP}>Activate DHCP</button>

  </>
  );
};
  
export default ExistingCons;
  