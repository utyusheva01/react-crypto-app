import {Layout, Select, Space, Button, Modal, Drawer} from "antd";
import {useCrypto} from "../../context/crypto-context.jsx";
import {useEffect, useState} from "react";
import CoinInfoModal from "../CoinInfoModal.jsx";
import AddAssetForm from "../AddAssetForm.jsx";

const headerStyle = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

export default function AppHeader() {
    const [select, SetSelect] = useState(false)
    const [coin, SetCoin] = useState(null)
    const [modal, SetModal] = useState(false)
    const [drawer, SetDrawer] = useState(false)


    const {crypto} = useCrypto()
    useEffect(() => {
        const keypress = event => {
            if (event.key === "/") {
                SetSelect(prev => !prev)
            }
        }
        document.addEventListener("keypress", keypress)

        return () => document.removeEventListener("keypress", keypress)
    }, [])

    function handleSelect(value) {
        console.log(value)
        SetModal(true)
        SetCoin(crypto.find(c => c.id === value))
    }

    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{
                    width: '250px',
                }}
                open={select}
                onSelect={handleSelect}
                onClick={() => SetSelect(prev => !prev)}
                value=" press / to open"
                options={crypto.map(coin => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img
                            style={{width: 20}}
                            src={option.data.icon}
                            alt={option.data.label}/>
                        {option.data.label}
                    </Space>
                )}
            />
            <Button type="primary" onClick={() => SetDrawer(true)}>Add Asset</Button>

            <Modal
                open={modal}
                onCancel={() => SetModal(false)}
                footer={null}
            >
                <CoinInfoModal coin={coin}/>
            </Modal>

            <Drawer
                width={600}
                title="Add Asset"
                onClose={() => SetDrawer(false)}
                open={drawer}
                destroyOnClose
            >
               <AddAssetForm onClose={() => SetDrawer(false)}/>
            </Drawer>
        </Layout.Header>
    )
}