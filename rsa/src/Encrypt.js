import {Button, Card, CardBody, CardHeader, Col, Input, Label, Row} from "reactstrap";
import {useEffect, useState} from "react";

function Encrypt(props) {

  const [modulus, setModulus] = useState('');
  const [factor, setFactor] = useState('');
  const [message, setMessage] = useState('');
  const [numerized, setNumerized] = useState('');
  const [encrypted, setEncrypted] = useState('');

  useEffect(() => {
    const jsonKey = localStorage.getItem('encrypt-key');
    if (!jsonKey) return;
    const key = JSON.parse(jsonKey);
    setModulus(key.modulus);
    setFactor(key.factor);
  }, [])

  useEffect(() => {
    setNumerized(props.keys.numerize(message));
  }, [message, modulus, factor, props.keys]);

  useEffect(() => {
    if (numerized.length === 0) {
      setEncrypted('');
      return;
    }
    const key = [modulus, factor];
    setEncrypted(props.keys.use_key(key, numerized, 5));
  }, [numerized, modulus, factor, props.keys]);

  useEffect(() => {
    localStorage.setItem('encrypt-key', JSON.stringify({modulus, factor}))
  }, [modulus, factor])

  const onChange = fcn => evt => {
    fcn(evt.currentTarget.value);
  }

  return (
    <Card>
      <CardHeader>
        <h2>Encrypt a message</h2>
      </CardHeader>
      <CardBody>
        <Row className="text-left">
          <Col md={12}><h5>Enter your encryption key modulus and factor below</h5></Col>
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
                <h5>Enter your message in the box below.  The message will be numerized, then encrypted using the key you provided.</h5>
              </Col>
              <Col md={12}>
                <Input type="textarea" value={message} onChange={onChange(setMessage)} />
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
              <h6>The final encrypted message:</h6>
            </Col>
            <Col md={12}>
              <Input type="textarea" className="readonly" value={encrypted} readOnly />
            </Col>
            </Row>
            </> : null
        }
      </CardBody>
    </Card>
  );
}

export default Encrypt;
