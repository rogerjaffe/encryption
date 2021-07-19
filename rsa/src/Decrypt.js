import {Button, Card, CardBody, CardHeader, Col, Input, Label, Row} from "reactstrap";
import {useEffect, useState} from "react";

function Decrypt(props) {

  const [modulus, setModulus] = useState('');
  const [factor, setFactor] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [numerized, setNumerized] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const jsonKey = localStorage.getItem('decrypt-key');
    if (!jsonKey) return;
    const key = JSON.parse(jsonKey);
    setModulus(key.modulus);
    setFactor(key.factor);
  }, [])

  useEffect(() => {
    const key = [modulus, factor];
    setNumerized(props.keys.use_key(key, encrypted, 4));
  }, [encrypted, modulus, factor, props.keys]);

  useEffect(() => {
    setMessage(props.keys.denumerize(numerized));
  }, [numerized, modulus, factor, props.keys]);

  useEffect(() => {
    localStorage.setItem('decrypt-key', JSON.stringify({modulus, factor}))
  }, [modulus, factor])

  const onChange = fcn => evt => {
    fcn(evt.currentTarget.value);
  }

  return (
    <Card>
      <CardHeader>
        <h2>Decrypt a message</h2>
      </CardHeader>
      <CardBody>
        <Row className="text-left">
          <Col md={12}><h5>Enter your decryption key modulus and factor below</h5></Col>
          <Col md={6}>
            <Label>Modulus:</Label>
            <Input type="number" value={modulus} onChange={onChange(setModulus)} />
          </Col>
          <Col md={6}>
            <Label>Factor:</Label>
            <Input type="number" value={factor} onChange={onChange(setFactor)} />
          </Col>
        </Row>
        {
          modulus.length > 0 && factor.length > 0 ?
            <>
            <Row>
              <Col md={12} className="text-left">
                <h5>Enter your encrypted in the box below.  The message will be decrypted using the key you provided, then denumerized and the message will appear below.</h5>
              </Col>
              <Col md={12}>
                <Input type="textarea" value={encrypted} onChange={onChange(setEncrypted)} />
              </Col>
            </Row>
            <Row>
              <Col md={12} className="text-left">
                <h6>The numerized message:</h6>
              </Col>
              <Col md={12}>
                <Input type="textarea" className="readonly" value={numerized} readOnly />
              </Col>
            </Row>
            <Row>
            <Col md={12} className="text-left">
              <h6>Your decrypted message:</h6>
            </Col>
            <Col md={12}>
              <Input type="textarea" className="readonly" value={message} readOnly />
            </Col>
            </Row>
            </> : null
        }
      </CardBody>
    </Card>
  );
}

export default Decrypt;
