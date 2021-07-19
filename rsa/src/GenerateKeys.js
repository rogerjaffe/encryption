import {Button, Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {useState} from "react";

function GenerateKeys(props) {

  const [keyPair, setKeyPair] = useState(props.keys.make_keys());

  const generateNewKeyPair = () => {
    setKeyPair(props.keys.make_keys());
  }

  return (
    <Card>
      <CardHeader>
        <h2>RSA Key pair</h2>
      </CardHeader>
      <CardBody>
        <Row className="button-bar text-left">
          <Col md={6}>
            <h6>This page generates an RSA key-pair. For example, you would want to receive encrypted data from your bank or credit card company since you don't want that information stolen by a bad guy. Provide the bank with your public key.</h6>
            <h6>The first number is called the "modulus" and it will always be the same for both keys. The modulus for this key pair is <span className="key-pair-values">{keyPair[0][0]}</span></h6>
            <h6>The second number is called the "factor" and it must be different for both keys. The factors for this key pair are <span className="key-pair-values">{keyPair[0][1]}</span> and <span className="key-pair-values">{keyPair[1][1]}</span></h6>
            <h6>Write these keys down and label one <span style={{fontStyle: 'italic'}}>PUBLIC</span> and the other <span style={{fontStyle: 'italic'}}>PRIVATE</span>.  It doesn't matter which is which.</h6>
            <h6>Click the Generate New Key Pair button if you want to generate a new key pair</h6>
          </Col>
          <Col md={{offset: 1, size: 5}}>
            <h5 className="key-pair">Key 1: ({keyPair[0][0]}, {keyPair[0][1]})</h5>
            <h5 className="key-pair">Key 2: ({keyPair[1][0]}, {keyPair[1][1]})</h5>
            <Button color="success" onClick={generateNewKeyPair}>Generate New Key Pair</Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default GenerateKeys;
