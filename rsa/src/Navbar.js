import {Button, Card, CardBody, CardHeader, Col, Row} from "reactstrap";

function Navbar(props) {

  return (
    <Card>
      <CardHeader>
        <h2>Action</h2>
      </CardHeader>
      <CardBody>
        <Row className="ext-center button-bar">
          <Col md={12} className="separator">
            <Button className="w-100" color={props.activePage === 'keys' ? 'primary' : 'secondary'} onClick={props.onKeyClick('keys')}>Key pair</Button>{' '}
          </Col>
          <Col md={12} className="separator">
            <Button className="w-100" color={props.activePage === 'encrypt' ? 'primary' : 'secondary'} onClick={props.onKeyClick('encrypt')}>Encrypt</Button>{' '}
          </Col>
          <Col md={12} className="separator">
            <Button className="w-100" color={props.activePage === 'decrypt' ? 'primary' : 'secondary'} onClick={props.onKeyClick('decrypt')}>Decrypt</Button>{' '}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default Navbar;
