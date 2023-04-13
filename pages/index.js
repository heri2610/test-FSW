import { Table, Box,  Modal, Button, Title,Input, Notification, Card, Text,Group,Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios'
export default function Home() {
  const [data, setData] = useState([])
  const [message, setMessage] = useState(null)
  const [opened, { open, close }] = useDisclosure(false);
  const [detail, setDetail] = useState(null)
  const [title, setTitle] = useState(null)
  const [baru, setBaru] = useState(null)
  const [error, setError] = useState(null)
  const handleDetail = (detail) => {
    setTitle("Detail Data")
    setDetail(detail)
  }
  const handleUpdate = (item) => {
    setTitle("Update Data")
    setDetail(item)
  }
  const handleadd = (item) => {
    setTitle("Tambah Data")
    setDetail(item)
  }
  const updat = async () => {
    const data = {
      productName: baru.productName || detail.productName,
      amount: baru.amount || detail.amount,
      customerName: baru.customerName || detail.customerName,
      status: baru.product_status == "SUCCESS" ? 1 : 0 || detail.status,
      transactionDate: baru.transactionDate || detail.transactionDate,
      createBy: baru.createBy || detail.createBy,
      createOn: baru.createOn || detail.createOn,
    }
    try {
      await axios.put(`https://smiling-teal-duck.cyclic.app/api/${detail.id}`, {...data});
      setMessage("Berhasil Mengubah Data");
    } catch (error) {
      setError("Gagal Mengubah Data");
    }
    setTimeout(() => {
      setMessage(null);
      setError(null)
    }, 700);
  }
  const add = async () => {
    const data = {
      productName: baru.productName,
      amount: baru.amount,
      customerName: baru.customerName,
      status: baru.product_status == "SUCCESS" ? 1 : 0 ,
      transactionDate: baru.transactionDate,
      createBy: baru.createBy ,
      createOn: baru.createOn ,
    }
    try {
      await axios.post(`https://smiling-teal-duck.cyclic.app/api`, {...data});
      setMessage("Berhasil Menambah Data");
    } catch (error) {
      setError("Gagal Menambah Data");
    }
    setTimeout(() => {
      setMessage(null);
      setError(null)
    }, 700);
  }
  const handleDelete = async(id) => {
    try {
      await axios.delete(`https://smiling-teal-duck.cyclic.app/api/${id}`);
      const response = await axios.get('https://smiling-teal-duck.cyclic.app/api');
        const { data } = await response.data
        setData(data);
      setMessage("Berhasil Mengahapus Data");
      reload()
    } catch (error) {
      setError("Gagal Mengahapus Data");
    }
    setTimeout(() => {
      setMessage(null);
      setError(null)
    }, 700);
  }
  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        const response = await axios.get('https://smiling-teal-duck.cyclic.app/api');
        const { data } = await response.data
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinceData();
  }, []);
  const rows = data.map((item) => (
    <tr key={item.id}>
      <td>{item.createOn?.split('T')[0]}</td>
      <td>{item.productName}</td>
      <td>{item.customerName}</td>
      <td sx={{ padding: 0, }}>
        <div style={{display:"flex"}}>
        <div onClick={()=>handleDetail(item)}>
        <Button radius="md" size="md" compact variant="outline"  onClick={open}>
          Detail
          </Button>
        </div>
        <div onClick={()=>handleUpdate(item)}>
        <Button radius="md" size="md" sx={{marginLeft:"5px", marginRight:"5px"}} color="yellow" compact variant="outline" onClick={open}>
            update
          </Button>
        </div>
          <div onClick={()=>handleDelete(item.id)}>
        <Button radius="md" size="md" color="red" sx={{ marginRight:0}} compact variant="outline">
            delete
      </Button>
          </div>
          </div>
        </td>
    </tr>
  ));
  return (
    <>
    <Box sx={{ margin: "50px", }}>
      <Title order={2} align="center" sx={{marginBottom:"20px"}}>List Data</Title>
      <div onClick={handleadd} style={{marginLeft:"auto", marginBottom:"8px"}}>
        <Button radius="md" size="md" compact variant="outline"  onClick={open}>
          Tambah Data
          </Button>
        </div>
        {message &&
                <Notification icon={<IconCheck size="1.1rem" />} color="teal" title="Berhasil">
                {message}
              </Notification>
      }
        {error &&
             <Notification icon={<IconX size="1.1rem" />} color="red">
             uuups! {error}
           </Notification>
      }
      <Table striped highlightOnHover withBorder withColumnBorders fontSize="md">
      <thead>
        <tr>
          <th>Di Buat Pada</th>
          <th>Nama Product</th>
          <th>Nama Pembeli</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  </Box>
      

      <Modal opened={opened} onClose={close} title={title}>
        <div onClose={()=> setDetail(null)}>
          {title == "Detail Data" && 
          <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{detail?.productName}</Text>
            <Badge color="pink" variant="light">
              {detail?.product_status?.name}
            </Badge>
          </Group>
          <Box>
          <Text size="sm" >
            Nama Pembeli:   {detail?.customerName}
                </Text>
                <Text size="sm" >
                Tanggal Pembelian:  {detail?.transactionDate?.split("T")[0]}
            </Text>
                <Text size="sm" >
                Di Buat Oleh:  {detail?.createBy}
            </Text>
                <Text size="sm" >
                Di Buat Pada:  {detail?.createOn?.split("T")[0]}
            </Text>
          </Box>
        </Card>
          }
          {title == "Update Data" && 
            <>
            <form onSubmit={updat}>
            <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Status Pembayaran"
              
                >
              <Input id="input-demo" placeholder="Status" value={baru?.product_status ||  detail?.product_status?.name} onChange={(e) => setBaru({ ...baru, product_status: e.target.value })} />
                </Input.Wrapper>
            <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Nama Product"
              
                >
                  <Input id="input-demo" placeholder="Malika" value={baru?.productName || detail?.productName} onChange={(e) => setBaru({ ...baru, productName: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Nama Pembeli"
              
                >
                  <Input id="input-demo" placeholder="mamati" value={baru?.customerName || detail?.customerName} onChange={(e) => setBaru({ ...baru, customerName: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Harga"
              
                >
                  <Input id="input-demo" placeholder="mamati" value={baru?.amount || detail?.amount} onChange={(e) => setBaru({ ...baru, amount: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Tanggal Pembelian"
              
                >
                  <Input id="input-demo" placeholder="26-10-2001" value={baru?.transactionDate || detail?.transactionDate?.split("T")[0]}
              type="date" onChange={(e) => setBaru({ ...baru, transactionDate: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Di Buat Oleh"
                  
                >
                  <Input id="input-demo" placeholder="suhe" value={baru?.createBy || detail?.createBy} onChange={(e) => setBaru({ ...baru, createBy: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Di Buat Pada"
                  
                >
                  <Input id="input-demo" type="date" placeholder="05-10-2001" value={baru?.createOn || detail?.createOn?.split("T")[0]} onChange={(e) => setBaru({ ...baru, createOn: e.target.value })}/>
              </Input.Wrapper>
              <Button variant='outline' type='submit'>Ubah</Button>
              </form>
              </>
          }
        {title == "Tambah Data" && 
            <>
            <form onSubmit={add}>
            <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Status Pembayaran"
              
                >
              <Input id="input-demo" placeholder="Status" onChange={(e) => setBaru({ ...baru, product_status: e.target.value })} />
                </Input.Wrapper>
            <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Nama Product"
              
                >
                  <Input id="input-demo" placeholder="Malika"  onChange={(e) => setBaru({ ...baru, productName: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
              label="Nama Pembeli"
              
                >
                  <Input id="input-demo" placeholder="mamati"  onChange={(e) => setBaru({ ...baru, customerName: e.target.value })}/>
              </Input.Wrapper>
              <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Harga"
              
                >
                  <Input id="input-demo" placeholder="333"  onChange={(e) => setBaru({ ...baru, amount: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Tanggal Pembelian"
              
                >
                  <Input id="input-demo" placeholder="26-10-2001" 
              type="date" onChange={(e) => setBaru({ ...baru, transactionDate: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Di Buat Oleh"
                  
                >
                  <Input id="input-demo" placeholder="suhe"  onChange={(e) => setBaru({ ...baru, createBy: e.target.value })}/>
                </Input.Wrapper>
                <Input.Wrapper
                  id="input-demo"
                  withAsterisk
                  label="Di Buat Pada"
                  
                >
                  <Input id="input-demo" type="date" placeholder="05-10-2001"  onChange={(e) => setBaru({ ...baru, createOn: e.target.value })}/>
              </Input.Wrapper>
                <Button variant='outline' type='submit'>Tambah</Button>
              </form>
              </>
          }
       </div>
      </Modal>
      </>
  )
}
