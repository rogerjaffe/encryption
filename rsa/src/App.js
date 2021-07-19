import {Button, Card, CardHeader, Col, Row} from "reactstrap";
import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import GenerateKeys from './GenerateKeys';
import Keys from './Keys';
import './App.css';
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";

function App() {

  const [activePage, setActivePage] = useState(null);
  const keys = Keys();

  const onKeyClick = btn => evt => {
    setActivePage(btn);
  }

  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get("page");
    page ? setActivePage(page) : setActivePage('keys');
  }, [])

  return (
    <div className="App">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h1>RSA Encryption Demonstration</h1>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Navbar activePage={activePage} onKeyClick={onKeyClick} />
        </Col>
        <Col md={10}>
          {activePage === 'keys' ? <GenerateKeys keys={keys} /> : null}
          {activePage === 'encrypt' ? <Encrypt keys={keys} /> : null}
          {activePage === 'decrypt' ? <Decrypt keys={keys} /> : null}
        </Col>
      </Row>
    </div>
  );
}

export default App;
