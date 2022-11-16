import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import { MARKET_CONTRACT_ADDRESS } from "./constants";
import { fetchCardsOf, getBalance } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faWallet } from "@fortawesome/free-solid-svg-icons";
import { Alert, Container, Card, Nav, Button, Modal, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './market.css';
import logo from './images/logo.png';
import rock from './images/Rock2.png';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x000000000000000000000000"

function App() {
  // Global Data
  // 1. address
  const [myAddress, setMyAddress] = useState(
    () => JSON.parse(window.localStorage.getItem("myAddress")) || DEFAULT_ADDRESS
  );
  useEffect(() => {
    window.localStorage.setItem("myAddress", JSON.stringify(myAddress));
  }, [myAddress]);

  // 2. 잔고
  const [myBalance, setMyBalance] = useState(
    () => JSON.parse(window.localStorage.getItem("myBalance")) || "0"
  );
  useEffect(() => {
    window.localStorage.setItem("myBalance", JSON.stringify(myBalance));
  }, [myBalance]);

  // 3. NFT
  const [nfts, setNfts] = useState([]);
  const [tool, setTool] = useState(rock);

  // UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  // 1. Tab 메뉴
  const [tab, setTab] = useState('WALLET'); // MARKET, MINT, WALLET
  // 2. mintInput
  // const [mintImageUrl, setMintImageUrl] = useState("");
  // 3. Modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => { },
    elseConfirm: () => { }
  });

  // NFT 갤러리 행
  const rows = nfts.slice(nfts.length / 2);

  // function
  // 1. fetchMarketNFTs
  const fetchMarketNFTs = async () => {
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  }

  // 2. fetchMyNFTs
  const fetchMyNFTs = async () => {
    if (myAddress === DEFAULT_ADDRESS) {
      alert('NO ADDRESS');
      return;
    }
    const _nfts = await fetchCardsOf(myAddress);
    setNfts(_nfts);
  }

  // 3. onClickMyCard
  const onClickMyCard = (tokenId) => {
    KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  }

  // 4. onClickMarketCard
  const onClickMarketCard = (tokenId) => {
    KlipAPI.buyCard(tokenId, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  }

  const onClickCard = (id, uri) => {

    if (tab === 'WALLET') {
      // 판매 하시겠습니까 모달
      setModalProps({
        title: "판매하시겠습니까 장착하시겠습니까?",
        onConfirm: () => {
          onClickMyCard(id);
        },
        elseConfirm: () => {
          setTool(uri);
        }
      })
    }
    if (tab === 'MARKET') {
      // 구매 하시겠습니까 모달
      setModalProps({
        title: "NFT를 구매하시겠어요?",
        onConfirm: () => {
          onClickMarketCard(id);
        }
      })
    }
    setShowModal(true);
  }


  //game start
  const game_start = () => {
    setModalProps({
      title: "게임을 시작하시겠습니까?",
      onConfirm: () => {
        window.location.replace('../../game')
      }
    });
    setShowModal(true);
  };



  // getUserData
  const getUserData = () => {
    // 지갑을 연동하시겠습니까 모달
    setModalProps({
      title: "Klip 지갑을 연동하시겠습니까?",
      onConfirm: () => {
        KlipAPI.getAddress(setQrvalue, async (address) => {
          setMyAddress(address);
          const _balance = await getBalance(address);
          setMyBalance(_balance);
        });
      }
    })
    setShowModal(true);
  };


  //로그아웃
  const logout = () => {
    setMyAddress(DEFAULT_ADDRESS);
    setMyBalance("0");
    getUserData();
  };

  // 처음 실행했을 때 나오는 화면 -> useEffect
  useEffect(() => {
    if (myAddress == DEFAULT_ADDRESS) {
      getUserData();
    }
  }, [])


  
  return (
    <div className="App">
      {/* top: 주소 잔고 */}
      <div style={{ backgroundColor: "black", padding: 10 }}>
        <div id="titleouter" style={{textAlign:"center"}}>
          <img src={logo} id="logo" width={450} />
        </div>
        <span id="mywallet" style={{ fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>MY Wallet</span>
        <span id="address">{myAddress}</span>
        {(myAddress !== DEFAULT_ADDRESS )? ( <button id = "logoutbtn" onClick={logout}>LOGOUT</button> ) : null}
        <br />
        <Alert id="connect" onClick={getUserData} variant={"balance"} style={{ backgroundColor: "#2f007c", fontSize: 25 }}>
          {myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "지갑 연동하기"}
        </Alert>
        {(qrvalue == 'DEFAULT' ) && (myAddress !== DEFAULT_ADDRESS )? ( <button id = "gamestartbtn" onClick={game_start}>START Space Bar</button> ) : null}
        <div>
          현재 무기
        </div>
        <div>
          <img src={tool} alt={tool} width={50}/>
        </div>
        {/* DEFAULT 아닌 경우에만 QR 코드 */}
        {qrvalue !== 'DEFAULT' ? (
          <Container style={{ backgroundColor: "white", width: 300, height: 300, padding: 20 }}>
            <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
          </Container>) : null}
        
        <br />
        
        {/* middle: 갤러리 (마켓, 내 지갑) */}
        {tab === 'MARKET' || tab === 'WALLET' ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            {rows.map((o, rowIndex) => (
              <Row key={`rowkey${rowIndex}`}>
                <Col style={{marginRight: 0, paddingRight: 0}}>
                  <Card onClick={() => {
                    onClickCard(nfts[rowIndex*2].id, nfts[rowIndex*2].uri);
                  }}>
                    <Card.Img src={nfts[rowIndex*2].uri} />
                  </Card>
                  [{nfts[rowIndex*2].id}] NFT
                </Col>
                <Col style={{marginRight: 0, paddingRight: 0}}>
                  {nfts.length > rowIndex * 2 + 1 ? (
                    <Card onClick={() => {
                      onClickCard(nfts[rowIndex*2+1].id, nfts[rowIndex*2+1].uri);
                    }}>
                      <Card.Img src={nfts[rowIndex*2+1].uri} />
                    </Card>
                  ): null}

                  {nfts.length > rowIndex * 2 + 1 ? (
                    <>[{nfts[rowIndex*2+1].id}] NFT</>
                  ): null}
                  
                </Col>
              </Row>
            ))}
          </div>
        ) : null}

      </div>

      {/* 모달 */}
      <Modal
        centered
        size="sm"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Modal.Title>
            {modalProps.title}
          </Modal.Title>
        </Modal.Header>
        {modalProps.title === "판매하시겠습니까 장착하시겠습니까?" ? (
          <Modal.Footer style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}>
            <Button variant="secondary" onClick={() => { setShowModal(false); }}>닫기</Button>
            <Button variant="primary" onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
              style={{ backgroundColor: "#2f007c", borderColor: "#2f007c" }}
            >판매</Button>
            <Button variant="success" onClick={() => {
              modalProps.elseConfirm();
              setShowModal(false);
            }}
            >장착</Button>
          </Modal.Footer>
        ) : (
          <Modal.Footer style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}>
            <Button variant="secondary" onClick={() => { setShowModal(false); }}>닫기</Button>
            <Button variant="primary" onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
              style={{ backgroundColor: "#2f007c", borderColor: "#2f007c" }}
            >진행</Button>
          </Modal.Footer>
        )}
        
      </Modal>

      {/* bottom: 탭 메뉴 */}
      <nav style={{ backgroundColor: "#1b1717", height: 45 }} className="navbar fixed-bottom navbar-light" role="navigation">
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">

            <div onClick={() => {
              setTab("WALLET");
              fetchMyNFTs();
            }} className="row d-flex flex-column justify-content-center align-items-center">
              <div><FontAwesomeIcon color="white" size="lg" icon={faWallet}/></div>
            </div>

            <div onClick={() => {
              setTab("MARKET");
              fetchMarketNFTs();
            }} className="row d-flex flex-column justify-content-center align-items-center">
              <div><FontAwesomeIcon color="white" size="lg" icon={faStore}/></div>
            </div>

          </div>
        </Nav>
      </nav>     
    </div>
  );
}

export default App;
